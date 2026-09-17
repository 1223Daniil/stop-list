"use client";

import { useState } from "react";
import { Controller, useForm, useWatch, type Resolver } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  MENU_ITEM_STATUS,
  stopItemPayloadSchema,
  type MenuItem,
  type MenuItemListFilters,
} from "@/entities/menu-item";
import {
  DATETIME_LOCAL_STEP_SECONDS,
  datetimeLocalToIso,
  getDatetimeLocalMax,
  getDatetimeLocalMin,
  isoToDatetimeLocal,
  SHIFT_END_LABEL,
} from "@/shared/lib";
import { BUTTON_VARIANTS, Button } from "@/shared/ui/button";
import { FieldError } from "@/shared/ui/field-error";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";

import {
  STOP_REASON_OPTIONS,
  UNTIL_MODES,
  getStopFormValues,
  getUntilMode,
  isStopFormComplete,
  type StopFormValues,
} from "../model/form";
import { useStopPanelStore } from "../model/ui-store";
import { useStopItem } from "../model/use-stop-item";

type StopReasonFormProps = {
  item: MenuItem;
  filters: MenuItemListFilters;
};

export const StopReasonForm = ({ item, filters }: StopReasonFormProps) => {
  const closePanel = useStopPanelStore((state) => state.closePanel);
  const stopItem = useStopItem(filters);
  const isEdit = item.status.kind === MENU_ITEM_STATUS.STOPPED;
  const [untilMode, setUntilMode] = useState(() =>
    getUntilMode(getStopFormValues(item).until),
  );

  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isSubmitted, isValid },
  } = useForm<StopFormValues>({
    resolver: zodResolver(stopItemPayloadSchema) as Resolver<StopFormValues>,
    mode: "onBlur",
    defaultValues: getStopFormValues(item),
  });

  const until = useWatch({ control, name: "until" });
  const reason = useWatch({ control, name: "reason" });

  const onSubmit = (payload: StopFormValues) => {
    if (payload.reason === "") {
      return;
    }

    stopItem.mutate(
      {
        id: item.id,
        payload: { reason: payload.reason, until: payload.until },
      },
      { onSuccess: () => closePanel() },
    );
  };

  const isSubmitDisabled =
    stopItem.isPending ||
    !isStopFormComplete({ reason, until }) ||
    (untilMode === UNTIL_MODES.DATETIME && !until) ||
    (isSubmitted && !isValid);

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="reason"
        control={control}
        render={({ field, fieldState }) => (
          <Select
            label="Причина"
            placeholder="Выберите причину"
            options={STOP_REASON_OPTIONS}
            name={field.name}
            value={field.value}
            error={fieldState.error?.message}
            onBlur={field.onBlur}
            onChange={(event) => field.onChange(event.target.value)}
            ref={field.ref}
          />
        )}
      />

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium text-foreground">
          Срок стопа
        </legend>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="until-mode"
            checked={untilMode === UNTIL_MODES.SHIFT}
            onChange={() => {
              setUntilMode(UNTIL_MODES.SHIFT);
              setValue("until", null, { shouldValidate: isSubmitted });
            }}
          />
          До конца смены
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="until-mode"
            checked={untilMode === UNTIL_MODES.DATETIME}
            onChange={() => {
              setUntilMode(UNTIL_MODES.DATETIME);
              setValue("until", "", { shouldValidate: isSubmitted });
            }}
          />
          Конкретное время
        </label>
        {untilMode === UNTIL_MODES.DATETIME ? (
          <Input
            label="До какого времени"
            type="datetime-local"
            step={DATETIME_LOCAL_STEP_SECONDS}
            min={getDatetimeLocalMin()}
            max={getDatetimeLocalMax()}
            value={until ? isoToDatetimeLocal(until) : ""}
            error={errors.until?.message}
            onBlur={() => {
              void trigger("until");
            }}
            onChange={(event) => {
              const value = event.target.value;
              setValue("until", value ? datetimeLocalToIso(value) : "", {
                shouldValidate: isSubmitted,
                shouldTouch: true,
              });
            }}
          />
        ) : (
          <p className="text-sm text-muted">
            Позиция будет в стопе {SHIFT_END_LABEL}.
          </p>
        )}
        {untilMode === UNTIL_MODES.SHIFT && errors.until ? (
          <FieldError>{errors.until.message ?? ""}</FieldError>
        ) : null}
      </fieldset>

      <div className="flex gap-2">
        <Button
          type="submit"
          isLoading={stopItem.isPending}
          disabled={isSubmitDisabled}
        >
          {isEdit ? "Сохранить" : "Поставить в стоп"}
        </Button>
        <Button
          variant={BUTTON_VARIANTS.SECONDARY}
          disabled={stopItem.isPending}
          onClick={closePanel}
        >
          Отмена
        </Button>
      </div>
    </form>
  );
};

"use client";

import {
  MENU_ITEM_STATUS,
  type MenuItemListFilters,
} from "@/entities/menu-item";
import { BUTTON_VARIANTS, Button } from "@/shared/ui/button";

import { useStopPanelStore } from "../model/ui-store";

import { StopReasonForm } from "./StopReasonForm";

type StopReasonPanelProps = {
  filters: MenuItemListFilters;
};

export const StopReasonPanel = ({ filters }: StopReasonPanelProps) => {
  const isPanelOpen = useStopPanelStore((state) => state.isPanelOpen);
  const item = useStopPanelStore((state) => state.selectedItem);
  const closePanel = useStopPanelStore((state) => state.closePanel);

  if (!isPanelOpen || !item) {
    return null;
  }

  const isEdit = item.status.kind === MENU_ITEM_STATUS.STOPPED;

  return (
    <aside
      className="sticky top-8 w-full max-w-sm shrink-0 self-start rounded-xl border border-border bg-surface p-5"
      aria-label="Панель стоп-листа"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            {isEdit ? "Изменить стоп" : "Поставить в стоп-лист"}
          </h2>
          <p className="mt-1 text-sm text-muted">{item.title}</p>
        </div>
        <Button
          variant={BUTTON_VARIANTS.GHOST}
          className="h-8 px-2 text-lg leading-none"
          aria-label="Закрыть панель"
          onClick={closePanel}
        >
          ×
        </Button>
      </div>
      <StopReasonForm key={item.id} item={item} filters={filters} />
    </aside>
  );
};

import { useId } from "react";

import { cn } from "@/shared/lib";
import { FieldError } from "@/shared/ui/field-error";

import type { SelectProps } from "../types";

/**
 * Селект с лейблом и ошибкой. `ref` нужен RHF.
 * Ошибка вешается на поле через `aria-describedby`.
 */
export const Select = ({
  id,
  label,
  options,
  error,
  placeholder,
  className,
  ref,
  ...props
}: SelectProps) => {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const errorId = `${fieldId}-error`;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={fieldId} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <select
        id={fieldId}
        ref={ref}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "h-10 rounded-lg border bg-surface px-3 text-sm text-foreground",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          "disabled:cursor-not-allowed disabled:opacity-60",
          error ? "border-error" : "border-border",
          className,
        )}
        {...props}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
    </div>
  );
};

import { useId } from "react";

import { cn } from "@/shared/lib";
import { FieldError } from "@/shared/ui/field-error";

import type { InputProps } from "../types";

/**
 * Инпут с лейблом и ошибкой. Тот же контракт a11y, что у `Select`.
 */
export const Input = ({
  id,
  label,
  error,
  className,
  ...props
}: InputProps) => {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const errorId = `${fieldId}-error`;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={fieldId} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={fieldId}
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
      />
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
    </div>
  );
};

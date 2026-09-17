import { cn } from "@/shared/lib";

import { BUTTON_VARIANTS, type ButtonProps } from "../types";

const VARIANT_CLASSNAME = {
  [BUTTON_VARIANTS.PRIMARY]:
    "bg-accent text-white hover:bg-accent/90 disabled:hover:bg-accent",
  [BUTTON_VARIANTS.SECONDARY]:
    "border border-border bg-surface text-foreground hover:bg-background disabled:hover:bg-surface",
  [BUTTON_VARIANTS.GHOST]:
    "text-foreground hover:bg-foreground/5 disabled:hover:bg-transparent",
} as const;

const Spinner = () => {
  return (
    <svg className="size-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
};

/**
 * Кнопка UI-кита. На время запроса передайте `isLoading`,
 * чтобы не ловить двойной submit.
 */
export const Button = ({
  variant = BUTTON_VARIANTS.PRIMARY,
  isLoading = false,
  loadingText = "Сохранение…",
  disabled,
  className,
  type = "button",
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        "disabled:cursor-not-allowed disabled:opacity-60",
        VARIANT_CLASSNAME[variant],
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
};

import { cn } from "@/shared/lib";

import { BADGE_VARIANTS, type BadgeProps } from "../types";

const VARIANT_CLASSNAME = {
  [BADGE_VARIANTS.NEUTRAL]: "border-border bg-surface text-foreground",
  [BADGE_VARIANTS.ACCENT]: "border-accent/20 bg-accent/10 text-accent",
  [BADGE_VARIANTS.MUTED]: "border-transparent bg-foreground/8 text-muted",
} as const;

/** Статус или причина. Текст короткий, без интерактива. */
export const Badge = ({
  variant = BADGE_VARIANTS.NEUTRAL,
  className,
  children,
  ...props
}: BadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        VARIANT_CLASSNAME[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};

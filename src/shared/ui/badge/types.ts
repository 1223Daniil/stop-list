import type { HTMLAttributes, ReactNode } from "react";

export const BADGE_VARIANTS = {
  NEUTRAL: "neutral",
  ACCENT: "accent",
  MUTED: "muted",
} as const;

export type BadgeVariant = (typeof BADGE_VARIANTS)[keyof typeof BADGE_VARIANTS];

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  children: ReactNode;
};

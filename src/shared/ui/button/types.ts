import type { ButtonHTMLAttributes, ReactNode } from "react";

export const BUTTON_VARIANTS = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  GHOST: "ghost",
} as const;

export type ButtonVariant =
  (typeof BUTTON_VARIANTS)[keyof typeof BUTTON_VARIANTS];

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  isLoading?: boolean;
  loadingText?: string;
  children: ReactNode;
};

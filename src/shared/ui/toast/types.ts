export const TOAST_VARIANTS = {
  ERROR: "error",
} as const;

export type ToastVariant = (typeof TOAST_VARIANTS)[keyof typeof TOAST_VARIANTS];

export type ToastItem = {
  id: string;
  message: string;
  variant: ToastVariant;
};

export const TOAST_DISMISS_MS = 5000;

import { create } from "zustand";

import { TOAST_VARIANTS, type ToastItem, type ToastVariant } from "../types";

type ToastState = {
  toasts: ToastItem[];
  showToast: (message: string, variant?: ToastVariant) => void;
  dismissToast: (id: string) => void;
};

/**
 * Zustand только для тостов. Список меню сюда не кладём.
 * `showErrorToast` удобен вне React (onError мутации).
 */
export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  showToast: (message, variant = TOAST_VARIANTS.ERROR) => {
    const toast: ToastItem = {
      id: crypto.randomUUID(),
      message,
      variant,
    };

    set((state) => ({ toasts: [...state.toasts, toast] }));
  },
  dismissToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));

/** Показать ошибку из мутации, не подключая стор в компоненте. */
export const showErrorToast = (message: string) => {
  useToastStore.getState().showToast(message, TOAST_VARIANTS.ERROR);
};

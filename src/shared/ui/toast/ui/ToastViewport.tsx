"use client";

import { useEffect } from "react";

import { cn } from "@/shared/lib";

import { useToastStore } from "../model/store";
import { TOAST_DISMISS_MS, TOAST_VARIANTS } from "../types";
import type { ToastItem } from "../types";

type ToastCardProps = {
  toast: ToastItem;
};

const ToastCard = ({ toast }: ToastCardProps) => {
  const dismissToast = useToastStore((state) => state.dismissToast);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      dismissToast(toast.id);
    }, TOAST_DISMISS_MS);

    return () => window.clearTimeout(timeoutId);
  }, [dismissToast, toast.id]);

  return (
    <div
      role="alert"
      className={cn(
        "flex w-80 items-start justify-between gap-3 rounded-lg px-4 py-3 text-sm shadow-lg",
        toast.variant === TOAST_VARIANTS.ERROR
          ? "bg-error text-white"
          : "bg-foreground text-background",
      )}
    >
      <p>{toast.message}</p>
      <button
        type="button"
        onClick={() => dismissToast(toast.id)}
        className="rounded text-current/80 hover:text-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        aria-label="Закрыть уведомление"
      >
        ×
      </button>
    </div>
  );
};

export const ToastViewport = () => {
  const toasts = useToastStore((state) => state.toasts);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed right-6 bottom-6 z-50 flex flex-col gap-2"
      aria-live="assertive"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastCard toast={toast} />
        </div>
      ))}
    </div>
  );
};

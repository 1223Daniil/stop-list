"use client";

import { useId, useRef } from "react";

import { AnimatePresence, motion } from "framer-motion";

import {
  MENU_ITEM_STATUS,
  type MenuItemListFilters,
} from "@/entities/menu-item";
import { useFocusTrap } from "@/shared/lib/use-focus-trap";
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
  const dialogRef = useRef<HTMLElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const isVisible = isPanelOpen && Boolean(item);

  useFocusTrap(dialogRef, isVisible, closePanel);

  const isEdit = item?.status.kind === MENU_ITEM_STATUS.STOPPED;

  return (
    <AnimatePresence>
      {isVisible && item ? (
        <motion.div
          key="stop-dialog"
          className="fixed inset-0 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
        >
          <div
            className="absolute inset-0 bg-foreground/25"
            aria-hidden="true"
            onClick={closePanel}
          />
          <motion.aside
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            tabIndex={-1}
            className="absolute top-0 right-0 flex h-full w-full max-w-sm flex-col overflow-y-auto border-l border-border bg-surface p-5 shadow-xl outline-none"
            initial={{ x: 32 }}
            animate={{ x: 0 }}
            exit={{ x: 32 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2
                  id={titleId}
                  className="text-lg font-semibold tracking-tight"
                >
                  {isEdit ? "Изменить стоп" : "Поставить в стоп-лист"}
                </h2>
                <p id={descriptionId} className="mt-1 text-sm text-muted">
                  {item.title}
                </p>
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
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

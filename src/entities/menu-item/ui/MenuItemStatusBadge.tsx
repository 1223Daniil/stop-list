"use client";

import { AnimatePresence, motion } from "framer-motion";

import { formatStopUntil } from "@/shared/lib";
import { BADGE_VARIANTS, Badge } from "@/shared/ui/badge";

import { STOP_REASON_LABELS } from "../model/labels";
import { MENU_ITEM_STATUS } from "../model/types";
import type { MenuItem } from "../model/types";

type MenuItemStatusBadgeProps = {
  item: MenuItem;
  isSaving?: boolean;
};

/** Статус с кроссфейдом. Пока мутация pending, вместо бейджа «Сохраняется». */
export const MenuItemStatusBadge = ({
  item,
  isSaving = false,
}: MenuItemStatusBadgeProps) => {
  const statusKey = isSaving
    ? "saving"
    : item.status.kind === MENU_ITEM_STATUS.AVAILABLE
      ? MENU_ITEM_STATUS.AVAILABLE
      : `${item.status.reason}-${item.status.until ?? "shift"}`;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={statusKey}
        className="inline-flex flex-wrap items-center gap-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      >
        {isSaving ? (
          <Badge variant={BADGE_VARIANTS.MUTED}>Сохраняется</Badge>
        ) : item.status.kind === MENU_ITEM_STATUS.AVAILABLE ? (
          <Badge variant={BADGE_VARIANTS.NEUTRAL}>В продаже</Badge>
        ) : (
          <>
            <Badge variant={BADGE_VARIANTS.ACCENT}>
              {STOP_REASON_LABELS[item.status.reason]}
            </Badge>
            <Badge variant={BADGE_VARIANTS.MUTED}>
              {formatStopUntil(item.status.until)}
            </Badge>
          </>
        )}
      </motion.span>
    </AnimatePresence>
  );
};

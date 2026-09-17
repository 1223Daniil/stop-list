import { formatStopUntil } from "@/shared/lib";
import { BADGE_VARIANTS, Badge } from "@/shared/ui/badge";

import { STOP_REASON_LABELS } from "../model/labels";
import { MENU_ITEM_STATUS } from "../model/types";
import type { MenuItem } from "../model/types";

type MenuItemStatusBadgeProps = {
  item: MenuItem;
  isSaving?: boolean;
};

export const MenuItemStatusBadge = ({
  item,
  isSaving = false,
}: MenuItemStatusBadgeProps) => {
  if (isSaving) {
    return <Badge variant={BADGE_VARIANTS.MUTED}>Сохраняется</Badge>;
  }

  if (item.status.kind === MENU_ITEM_STATUS.AVAILABLE) {
    return <Badge variant={BADGE_VARIANTS.NEUTRAL}>В продаже</Badge>;
  }

  return (
    <span className="flex flex-wrap items-center gap-1.5">
      <Badge variant={BADGE_VARIANTS.ACCENT}>
        {STOP_REASON_LABELS[item.status.reason]}
      </Badge>
      <Badge variant={BADGE_VARIANTS.MUTED}>
        {formatStopUntil(item.status.until)}
      </Badge>
    </span>
  );
};

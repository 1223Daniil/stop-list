import { cn } from "@/shared/lib";
import { BUTTON_VARIANTS, Button } from "@/shared/ui/button";

import { SHOP_LABELS, ZERO_STOCK_RESUME_HINT } from "../model/labels";
import { MENU_ITEM_STATUS } from "../model/types";
import type { MenuItem } from "../model/types";

import { MenuItemStatusBadge } from "./MenuItemStatusBadge";

type MenuItemRowProps = {
  item: MenuItem;
  isSaving?: boolean;
  onStop: (item: MenuItem) => void;
  onResume: (item: MenuItem) => void;
};

export const MenuItemRow = ({
  item,
  isSaving = false,
  onStop,
  onResume,
}: MenuItemRowProps) => {
  const isStopped = item.status.kind === MENU_ITEM_STATUS.STOPPED;
  const isResumeBlocked = item.stock === 0;

  return (
    <tr
      className={cn(
        "border-b border-border last:border-b-0",
        isStopped && "bg-foreground/5 text-muted",
      )}
    >
      <td className="px-4 py-3 text-sm font-medium text-foreground">
        {item.title}
      </td>
      <td className="px-4 py-3 text-sm">{SHOP_LABELS[item.shop]}</td>
      <td className="px-4 py-3 text-sm tabular-nums">{item.stock}</td>
      <td className="px-4 py-3">
        <MenuItemStatusBadge item={item} isSaving={isSaving} />
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex justify-end gap-2">
          {isStopped ? (
            <>
              <Button
                variant={BUTTON_VARIANTS.SECONDARY}
                className="h-8 px-3 text-xs"
                disabled={isSaving}
                aria-label={`Изменить стоп: ${item.title}`}
                onClick={() => onStop(item)}
              >
                Изменить
              </Button>
              <span
                className="inline-flex"
                title={isResumeBlocked ? ZERO_STOCK_RESUME_HINT : undefined}
              >
                <Button
                  variant={BUTTON_VARIANTS.SECONDARY}
                  className={cn(
                    "h-8 px-3 text-xs",
                    isResumeBlocked && "cursor-not-allowed opacity-60",
                  )}
                  disabled={isSaving}
                  aria-disabled={isResumeBlocked}
                  aria-describedby={
                    isResumeBlocked ? `resume-hint-${item.id}` : undefined
                  }
                  aria-label={`Вернуть в продажу: ${item.title}`}
                  onClick={() => {
                    if (isResumeBlocked || isSaving) {
                      return;
                    }

                    onResume(item);
                  }}
                >
                  Вернуть в продажу
                </Button>
                {isResumeBlocked ? (
                  <span id={`resume-hint-${item.id}`} className="sr-only">
                    {ZERO_STOCK_RESUME_HINT}
                  </span>
                ) : null}
              </span>
            </>
          ) : (
            <Button
              variant={BUTTON_VARIANTS.SECONDARY}
              className="h-8 px-3 text-xs"
              disabled={isSaving}
              aria-label={`Поставить в стоп-лист: ${item.title}`}
              onClick={() => onStop(item)}
            >
              В стоп-лист
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
};

import { MENU_ITEM_STATUS } from "./types";
import type { MenuItem, MenuItemListFilters, StopItemPayload } from "./types";

/** Проверяет, должна ли позиция остаться в текущем отфильтрованном списке. */
export const itemMatchesFilters = (
  item: MenuItem,
  filters: MenuItemListFilters,
) => {
  if (filters.shop && item.shop !== filters.shop) {
    return false;
  }

  if (filters.status && item.status.kind !== filters.status) {
    return false;
  }

  return true;
};

/**
 * Патчит позицию в кэше списка. Если после апдейта она не проходит фильтры,
 * строка выкидывается: так стоп при `status=available` сразу убирает блюдо.
 */
export const patchMenuItemInList = (
  items: MenuItem[],
  id: string,
  updater: (item: MenuItem) => MenuItem,
  filters: MenuItemListFilters,
) => {
  return items.flatMap((item) => {
    if (item.id !== id) {
      return [item];
    }

    const next = updater(item);

    return itemMatchesFilters(next, filters) ? [next] : [];
  });
};

/** Локальный снимок stopped-позиции до ответа сервера. */
export const toStoppedItem = (
  item: MenuItem,
  payload: StopItemPayload,
): MenuItem => ({
  ...item,
  status: {
    kind: MENU_ITEM_STATUS.STOPPED,
    reason: payload.reason,
    until: payload.until,
  },
  updatedAt: new Date().toISOString(),
});

/** Локальный снимок available-позиции до ответа сервера. */
export const toAvailableItem = (item: MenuItem): MenuItem => ({
  ...item,
  status: { kind: MENU_ITEM_STATUS.AVAILABLE },
  updatedAt: new Date().toISOString(),
});

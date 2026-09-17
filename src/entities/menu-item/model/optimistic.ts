import { MENU_ITEM_STATUS } from "./types";
import type { MenuItem, MenuItemListFilters, StopItemPayload } from "./types";

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

export const toAvailableItem = (item: MenuItem): MenuItem => ({
  ...item,
  status: { kind: MENU_ITEM_STATUS.AVAILABLE },
  updatedAt: new Date().toISOString(),
});

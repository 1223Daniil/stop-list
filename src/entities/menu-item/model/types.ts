export const SHOPS = {
  KITCHEN: "kitchen",
  BAR: "bar",
  PASTRY: "pastry",
} as const;

export type Shop = (typeof SHOPS)[keyof typeof SHOPS];

export const STOP_REASONS = {
  OUT_OF_STOCK: "out_of_stock",
  EQUIPMENT: "equipment",
  QUALITY: "quality",
  MENU_CHANGE: "menu_change",
} as const;

export type StopReason = (typeof STOP_REASONS)[keyof typeof STOP_REASONS];

export const MENU_ITEM_STATUS = {
  AVAILABLE: "available",
  STOPPED: "stopped",
} as const;

export type MenuItemStatusKind =
  (typeof MENU_ITEM_STATUS)[keyof typeof MENU_ITEM_STATUS];

/**
 * Статус позиции. У stopped `until: null` значит «до конца смены»,
 * иначе ISO-строка. На экране ISO форматируется в timezone браузера.
 */
export type MenuItemStatus =
  | { kind: typeof MENU_ITEM_STATUS.AVAILABLE }
  | {
      kind: typeof MENU_ITEM_STATUS.STOPPED;
      reason: StopReason;
      until: string | null;
    };

/** Позиция меню смены. `updatedAt` на проводе всегда ISO. */
export interface MenuItem {
  id: string;
  title: string;
  shop: Shop;
  stock: number;
  status: MenuItemStatus;
  updatedAt: string;
}

/**
 * Тело POST /stop. Та же форма уходит с клиента и проверяется
 * `stopItemPayloadSchema` в route handler.
 */
export interface StopItemPayload {
  reason: StopReason;
  until: string | null;
}

/** Фильтры списка. Пустое поле значит «все». */
export interface MenuItemListFilters {
  shop?: Shop;
  status?: MenuItemStatusKind;
}

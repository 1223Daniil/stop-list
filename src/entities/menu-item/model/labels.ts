import { MENU_ITEM_STATUS, SHOPS, STOP_REASONS } from "./types";
import type { Shop, StopReason } from "./types";

export const SHOP_LABELS = {
  [SHOPS.KITCHEN]: "Кухня",
  [SHOPS.BAR]: "Бар",
  [SHOPS.PASTRY]: "Кондитерская",
} as const satisfies Record<Shop, string>;

export const STOP_REASON_LABELS = {
  [STOP_REASONS.OUT_OF_STOCK]: "Закончились продукты",
  [STOP_REASONS.EQUIPMENT]: "Сломалось оборудование",
  [STOP_REASONS.QUALITY]: "Вопросы к качеству партии",
  [STOP_REASONS.MENU_CHANGE]: "Выведена из меню смены",
} as const satisfies Record<StopReason, string>;

export const ZERO_STOCK_RESUME_HINT =
  "Нельзя вернуть в продажу при нулевом остатке";

export const MENU_ITEM_STATUS_LABELS = {
  [MENU_ITEM_STATUS.AVAILABLE]: "В продаже",
  [MENU_ITEM_STATUS.STOPPED]: "В стоп-листе",
} as const;

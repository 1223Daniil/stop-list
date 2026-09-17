import { MENU_ITEM_STATUS } from "../model/types";
import type {
  MenuItem,
  MenuItemListFilters,
  StopItemPayload,
} from "../model/types";

import { createMenuSeed } from "./seed";

export type MenuStoreErrorCode = "not_found" | "conflict";

export class MenuStoreError extends Error {
  readonly code: MenuStoreErrorCode;

  constructor(code: MenuStoreErrorCode, message: string) {
    super(message);
    this.name = "MenuStoreError";
    this.code = code;
  }
}

/**
 * In-memory меню смены. Лежит на `globalThis`, чтобы пережить HMR.
 * На serverless холодный старт сбрасывает сид. Это ожидаемо.
 */
type GlobalMenuStore = typeof globalThis & {
  __stopListMenuItems?: MenuItem[];
};

const globalStore = globalThis as GlobalMenuStore;

const getItems = () => {
  globalStore.__stopListMenuItems ??= createMenuSeed();

  return globalStore.__stopListMenuItems;
};

const setItems = (next: MenuItem[]) => {
  globalStore.__stopListMenuItems = next;
};

const replaceItem = (id: string, next: MenuItem) => {
  setItems(getItems().map((item) => (item.id === id ? next : item)));

  return next;
};

export const isMenuStoreError = (error: unknown): error is MenuStoreError =>
  error instanceof MenuStoreError;

const cloneItem = (item: MenuItem): MenuItem => ({
  ...item,
  status: { ...item.status },
});

/** Список для GET. Отдаём клоны, чтобы handler не мутировал стор. */
export const listMenuItems = (
  filters: MenuItemListFilters = {},
): MenuItem[] => {
  return getItems()
    .filter((item) => {
      if (filters.shop && item.shop !== filters.shop) {
        return false;
      }

      if (filters.status && item.status.kind !== filters.status) {
        return false;
      }

      return true;
    })
    .map(cloneItem);
};

/** Ставит позицию в стоп. 404 если id нет. */
export const stopItem = (id: string, payload: StopItemPayload): MenuItem => {
  const item = getItems().find((candidate) => candidate.id === id);

  if (!item) {
    throw new MenuStoreError("not_found", "Позиция не найдена");
  }

  return replaceItem(id, {
    ...item,
    status: {
      kind: MENU_ITEM_STATUS.STOPPED,
      reason: payload.reason,
      until: payload.until,
    },
    updatedAt: new Date().toISOString(),
  });
};

/**
 * Возвращает в продажу. 409 если уже available или остаток 0.
 */
export const resumeItem = (id: string): MenuItem => {
  const item = getItems().find((candidate) => candidate.id === id);

  if (!item) {
    throw new MenuStoreError("not_found", "Позиция не найдена");
  }

  if (item.status.kind === MENU_ITEM_STATUS.AVAILABLE) {
    throw new MenuStoreError("conflict", "Позиция уже в продаже");
  }

  if (item.stock === 0) {
    throw new MenuStoreError(
      "conflict",
      "Нельзя вернуть в продажу при нулевом остатке",
    );
  }

  return replaceItem(id, {
    ...item,
    status: { kind: MENU_ITEM_STATUS.AVAILABLE },
    updatedAt: new Date().toISOString(),
  });
};

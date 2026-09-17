import { API_ROUTES } from "@/shared/config";

import type {
  MenuItem,
  MenuItemListFilters,
  StopItemPayload,
} from "../model/types";

type ApiErrorBody = {
  message?: string;
};

const readErrorMessage = async (response: Response, fallback: string) => {
  const body = (await response.json().catch(() => null)) as ApiErrorBody | null;

  return body?.message ?? fallback;
};

const withFilters = (filters: MenuItemListFilters) => {
  const params = new URLSearchParams();

  if (filters.shop) {
    params.set("shop", filters.shop);
  }

  if (filters.status) {
    params.set("status", filters.status);
  }

  const query = params.toString();

  return query ? `${API_ROUTES.MENU_ITEMS}?${query}` : API_ROUTES.MENU_ITEMS;
};

/** GET /api/menu-items. Фильтры те же, что в URL. */
export const fetchMenuItems = async (
  filters: MenuItemListFilters,
): Promise<MenuItem[]> => {
  const response = await fetch(withFilters(filters));

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, "Не удалось загрузить меню"),
    );
  }

  return response.json();
};

/** POST /stop. Ошибки сервера пробрасываются как `Error` с текстом для тоста. */
export const stopMenuItem = async (
  id: string,
  payload: StopItemPayload,
): Promise<MenuItem> => {
  const response = await fetch(API_ROUTES.MENU_ITEM_STOP(id), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, "Не удалось поставить в стоп-лист"),
    );
  }

  return response.json();
};

/** POST /resume. Нулевой остаток на сервере даёт 409. */
export const resumeMenuItem = async (id: string): Promise<MenuItem> => {
  const response = await fetch(API_ROUTES.MENU_ITEM_RESUME(id), {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, "Не удалось вернуть в продажу"),
    );
  }

  return response.json();
};

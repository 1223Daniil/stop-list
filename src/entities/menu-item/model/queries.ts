import { queryOptions } from "@tanstack/react-query";

import { fetchMenuItems } from "../api/menu-item-api";

import { MENU_ITEM_QUERY_ROOT } from "./keys";
import type { MenuItemListFilters } from "./types";

/** Ключи TanStack Query. Список зависит от текущих URL-фильтров. */
export const menuKeys = {
  all: [MENU_ITEM_QUERY_ROOT] as const,
  list: (filters: MenuItemListFilters) =>
    [...menuKeys.all, "list", filters] as const,
};

/** Опции `useQuery` для меню смены. */
export const menuItemsQueryOptions = (filters: MenuItemListFilters) =>
  queryOptions({
    queryKey: menuKeys.list(filters),
    queryFn: () => fetchMenuItems(filters),
  });

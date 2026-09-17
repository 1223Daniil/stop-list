import {
  MENU_ITEM_STATUS,
  MENU_ITEM_STATUS_LABELS,
  SHOP_LABELS,
  SHOPS,
  menuItemStatusKindSchema,
  shopSchema,
} from "@/entities/menu-item";
import type { MenuItemListFilters } from "@/entities/menu-item";

export const FILTER_ALL = "all" as const;

const toSingle = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

export const parseMenuFilters = (params: {
  shop?: string | string[];
  status?: string | string[];
}): MenuItemListFilters => {
  const shopValue = toSingle(params.shop);
  const statusValue = toSingle(params.status);
  const shop = shopValue ? shopSchema.safeParse(shopValue) : null;
  const status = statusValue
    ? menuItemStatusKindSchema.safeParse(statusValue)
    : null;

  return {
    ...(shop?.success ? { shop: shop.data } : {}),
    ...(status?.success ? { status: status.data } : {}),
  };
};

export const buildFiltersQuery = (filters: MenuItemListFilters) => {
  const params = new URLSearchParams();

  if (filters.shop) {
    params.set("shop", filters.shop);
  }

  if (filters.status) {
    params.set("status", filters.status);
  }

  return params.toString();
};

export const patchMenuFilters = (
  current: MenuItemListFilters,
  key: "shop" | "status",
  value: string,
): MenuItemListFilters => {
  if (key === "shop") {
    if (value === FILTER_ALL) {
      return { ...current, shop: undefined };
    }

    const parsed = shopSchema.safeParse(value);

    return { ...current, shop: parsed.success ? parsed.data : current.shop };
  }

  if (value === FILTER_ALL) {
    return { ...current, status: undefined };
  }

  const parsed = menuItemStatusKindSchema.safeParse(value);

  return { ...current, status: parsed.success ? parsed.data : current.status };
};

export const SHOP_FILTER_OPTIONS = [
  { value: FILTER_ALL, label: "Все цеха" },
  { value: SHOPS.KITCHEN, label: SHOP_LABELS[SHOPS.KITCHEN] },
  { value: SHOPS.BAR, label: SHOP_LABELS[SHOPS.BAR] },
  { value: SHOPS.PASTRY, label: SHOP_LABELS[SHOPS.PASTRY] },
];

export const STATUS_FILTER_OPTIONS = [
  { value: FILTER_ALL, label: "Все статусы" },
  {
    value: MENU_ITEM_STATUS.AVAILABLE,
    label: MENU_ITEM_STATUS_LABELS[MENU_ITEM_STATUS.AVAILABLE],
  },
  {
    value: MENU_ITEM_STATUS.STOPPED,
    label: MENU_ITEM_STATUS_LABELS[MENU_ITEM_STATUS.STOPPED],
  },
];

export const APP_NAME = "Стоп-лист кухни";

export const APP_DESCRIPTION = "Панель стоп-листа смены для менеджера зала";

export const APP_MAX_WIDTH_PX = 1280;

export const API_ROUTES = {
  MENU_ITEMS: "/api/menu-items",
  MENU_ITEM_STOP: (id: string) => `/api/menu-items/${id}/stop`,
  MENU_ITEM_RESUME: (id: string) => `/api/menu-items/${id}/resume`,
} as const;

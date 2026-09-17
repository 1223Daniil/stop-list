import { STEP_MS } from "@/shared/lib";

import { MENU_ITEM_STATUS, SHOPS, STOP_REASONS } from "../model/types";
import type { MenuItem } from "../model/types";

const hoursFromNowIso = (hours: number, now: number) => {
  const aligned = Math.ceil((now + hours * 60 * 60 * 1000) / STEP_MS) * STEP_MS;

  return new Date(aligned).toISOString();
};

export const createMenuSeed = (now = Date.now()): MenuItem[] => {
  const updatedAt = new Date(now).toISOString();

  return [
    {
      id: "borscht",
      title: "Борщ украинский",
      shop: SHOPS.KITCHEN,
      stock: 18,
      status: { kind: MENU_ITEM_STATUS.AVAILABLE },
      updatedAt,
    },
    {
      id: "ribeye",
      title: "Стейк рибай",
      shop: SHOPS.KITCHEN,
      stock: 5,
      status: {
        kind: MENU_ITEM_STATUS.STOPPED,
        reason: STOP_REASONS.EQUIPMENT,
        until: hoursFromNowIso(3, now),
      },
      updatedAt,
    },
    {
      id: "caesar",
      title: "Цезарь с курицей",
      shop: SHOPS.KITCHEN,
      stock: 9,
      status: { kind: MENU_ITEM_STATUS.AVAILABLE },
      updatedAt,
    },
    {
      id: "carbonara",
      title: "Паста карбонара",
      shop: SHOPS.KITCHEN,
      stock: 3,
      status: {
        kind: MENU_ITEM_STATUS.STOPPED,
        reason: STOP_REASONS.QUALITY,
        until: null,
      },
      updatedAt,
    },
    {
      id: "tartare",
      title: "Тартар из говядины",
      shop: SHOPS.KITCHEN,
      stock: 0,
      status: {
        kind: MENU_ITEM_STATUS.STOPPED,
        reason: STOP_REASONS.OUT_OF_STOCK,
        until: null,
      },
      updatedAt,
    },
    {
      id: "espresso",
      title: "Эспрессо",
      shop: SHOPS.BAR,
      stock: 40,
      status: { kind: MENU_ITEM_STATUS.AVAILABLE },
      updatedAt,
    },
    {
      id: "lemonade",
      title: "Авторский лимонад",
      shop: SHOPS.BAR,
      stock: 0,
      status: {
        kind: MENU_ITEM_STATUS.STOPPED,
        reason: STOP_REASONS.OUT_OF_STOCK,
        until: hoursFromNowIso(6, now),
      },
      updatedAt,
    },
    {
      id: "negroni",
      title: "Негрони",
      shop: SHOPS.BAR,
      stock: 7,
      status: { kind: MENU_ITEM_STATUS.AVAILABLE },
      updatedAt,
    },
    {
      id: "ipa",
      title: "IPA разливное",
      shop: SHOPS.BAR,
      stock: 12,
      status: {
        kind: MENU_ITEM_STATUS.STOPPED,
        reason: STOP_REASONS.EQUIPMENT,
        until: null,
      },
      updatedAt,
    },
    {
      id: "cappuccino",
      title: "Капучино",
      shop: SHOPS.BAR,
      stock: 25,
      status: { kind: MENU_ITEM_STATUS.AVAILABLE },
      updatedAt,
    },
    {
      id: "napoleon",
      title: "Наполеон",
      shop: SHOPS.PASTRY,
      stock: 4,
      status: { kind: MENU_ITEM_STATUS.AVAILABLE },
      updatedAt,
    },
    {
      id: "croissant",
      title: "Круассан миндальный",
      shop: SHOPS.PASTRY,
      stock: 8,
      status: {
        kind: MENU_ITEM_STATUS.STOPPED,
        reason: STOP_REASONS.MENU_CHANGE,
        until: null,
      },
      updatedAt,
    },
    {
      id: "cheesecake",
      title: "Чизкейк нью-йорк",
      shop: SHOPS.PASTRY,
      stock: 6,
      status: { kind: MENU_ITEM_STATUS.AVAILABLE },
      updatedAt,
    },
    {
      id: "macaron",
      title: "Макарон фисташка",
      shop: SHOPS.PASTRY,
      stock: 2,
      status: {
        kind: MENU_ITEM_STATUS.STOPPED,
        reason: STOP_REASONS.QUALITY,
        until: hoursFromNowIso(12, now),
      },
      updatedAt,
    },
    {
      id: "honey-cake",
      title: "Медовик",
      shop: SHOPS.PASTRY,
      stock: 11,
      status: { kind: MENU_ITEM_STATUS.AVAILABLE },
      updatedAt,
    },
  ];
};

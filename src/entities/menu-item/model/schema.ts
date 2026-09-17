import { z } from "zod";

import { validateUntil } from "@/shared/lib";

import { MENU_ITEM_STATUS, SHOPS, STOP_REASONS } from "./types";

export const shopSchema = z.enum([SHOPS.KITCHEN, SHOPS.BAR, SHOPS.PASTRY], {
  errorMap: () => ({ message: "Некорректный цех" }),
});

export const stopReasonSchema = z.enum(
  [
    STOP_REASONS.OUT_OF_STOCK,
    STOP_REASONS.EQUIPMENT,
    STOP_REASONS.QUALITY,
    STOP_REASONS.MENU_CHANGE,
  ],
  { errorMap: () => ({ message: "Укажите причину стопа" }) },
);

export const menuItemStatusKindSchema = z.enum(
  [MENU_ITEM_STATUS.AVAILABLE, MENU_ITEM_STATUS.STOPPED],
  { errorMap: () => ({ message: "Некорректный статус" }) },
);

export const menuItemListQuerySchema = z.object({
  shop: shopSchema.optional(),
  status: menuItemStatusKindSchema.optional(),
});

export const stopItemPayloadSchema = z
  .object({
    reason: stopReasonSchema,
    until: z.union([z.string(), z.null()], {
      required_error: "Укажите срок стопа",
      invalid_type_error: "Укажите срок стопа",
    }),
  })
  .superRefine((data, ctx) => {
    const error = validateUntil(data.until);

    if (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: error,
        path: ["until"],
      });
    }
  });

import { menuItemListQuerySchema } from "@/entities/menu-item";
import { listMenuItems, MENU_API_DELAY_MS } from "@/entities/menu-item/server";
import { jsonError, jsonOk } from "@/shared/api";
import { delay } from "@/shared/lib";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  await delay(MENU_API_DELAY_MS.GET);

  const { searchParams } = new URL(request.url);
  const parsed = menuItemListQuerySchema.safeParse({
    shop: searchParams.get("shop") || undefined,
    status: searchParams.get("status") || undefined,
  });

  if (!parsed.success) {
    return jsonError(
      parsed.error.issues[0]?.message ?? "Некорректные фильтры",
      400,
    );
  }

  return jsonOk(listMenuItems(parsed.data));
}

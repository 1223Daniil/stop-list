import { stopItemPayloadSchema } from "@/entities/menu-item";
import {
  isMenuStoreError,
  MENU_API_DELAY_MS,
  MENU_API_MUTATION_FAILURE_RATE,
  MUTATION_FAILURE_MESSAGE,
  stopItem,
} from "@/entities/menu-item/server";
import { jsonError, jsonOk } from "@/shared/api";
import { delay } from "@/shared/lib";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const parseJsonBody = async (request: Request) => {
  try {
    return { ok: true as const, data: await request.json() };
  } catch {
    return { ok: false as const };
  }
};

/**
 * POST /stop. Тело проверяет та же схема, что форма.
 * Примерно в 20% отвечает 500, чтобы клиент показал откат оптимистики.
 */
export async function POST(request: Request, { params }: RouteContext) {
  await delay(MENU_API_DELAY_MS.MUTATION);

  const body = await parseJsonBody(request);

  if (!body.ok) {
    return jsonError("Некорректное тело запроса", 400);
  }

  const parsed = stopItemPayloadSchema.safeParse(body.data);

  if (!parsed.success) {
    return jsonError(
      parsed.error.issues[0]?.message ?? "Некорректные данные",
      400,
    );
  }

  if (Math.random() < MENU_API_MUTATION_FAILURE_RATE) {
    return jsonError(MUTATION_FAILURE_MESSAGE, 500);
  }

  const { id } = await params;

  try {
    return jsonOk(stopItem(id, parsed.data));
  } catch (error) {
    if (isMenuStoreError(error)) {
      return jsonError(error.message, error.code === "not_found" ? 404 : 409);
    }

    return jsonError(MUTATION_FAILURE_MESSAGE, 500);
  }
}

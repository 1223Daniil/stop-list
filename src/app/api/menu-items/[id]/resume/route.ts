import {
  isMenuStoreError,
  MENU_API_DELAY_MS,
  MENU_API_MUTATION_FAILURE_RATE,
  MUTATION_FAILURE_MESSAGE,
  resumeItem,
} from "@/entities/menu-item/server";
import { jsonError, jsonOk } from "@/shared/api";
import { delay } from "@/shared/lib";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/** POST /resume. Та же задержка и шанс 500, что у /stop. */
export async function POST(_request: Request, { params }: RouteContext) {
  await delay(MENU_API_DELAY_MS.MUTATION);

  if (Math.random() < MENU_API_MUTATION_FAILURE_RATE) {
    return jsonError(MUTATION_FAILURE_MESSAGE, 500);
  }

  const { id } = await params;

  try {
    return jsonOk(resumeItem(id));
  } catch (error) {
    if (isMenuStoreError(error)) {
      return jsonError(error.message, error.code === "not_found" ? 404 : 409);
    }

    return jsonError(MUTATION_FAILURE_MESSAGE, 500);
  }
}

export const MENU_API_DELAY_MS = {
  GET: 500,
  MUTATION: 600,
} as const;

export const MENU_API_MUTATION_FAILURE_RATE = 0.2;

export const MUTATION_FAILURE_MESSAGE =
  "Не удалось сохранить изменения. Попробуйте ещё раз.";

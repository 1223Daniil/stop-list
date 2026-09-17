/** Текст тоста из `Error.message`, иначе запасная фраза. */
export const getMutationErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

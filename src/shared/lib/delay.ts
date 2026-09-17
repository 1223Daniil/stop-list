/** Пауза для мок-API. GET 500 мс, мутации 600 мс. */
export const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

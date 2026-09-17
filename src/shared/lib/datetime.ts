import { MAX_AHEAD_MS, STEP_MS } from "./validate-until";

/** Шаг `datetime-local` в секундах. Совпадает с правилом `validateUntil`. */
export const DATETIME_LOCAL_STEP_SECONDS = STEP_MS / 1000;

export const SHIFT_END_LABEL = "до конца смены";

const pad = (value: number, size = 2) => String(value).padStart(size, "0");

const localDateTimeFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

/**
 * ISO -> значение `datetime-local` в timezone браузера.
 * Геттеры `Date` локальные, UTC на экране не показываем.
 */
export const isoToDatetimeLocal = (iso: string): string => {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

/**
 * Значение `datetime-local` из браузера -> ISO для сервера.
 * Собирает `Date` через локальные компоненты, не через `Date.parse`.
 */
export const datetimeLocalToIso = (value: string): string => {
  const [datePart, timePart] = value.split("T");

  if (!datePart || !timePart) {
    return "";
  }

  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);
  const date = new Date(year, month - 1, day, hours, minutes);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString();
};

/** Человекочитаемая дата в timezone браузера. */
export const formatDateTime = (iso: string): string => {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return iso;
  }

  return localDateTimeFormatter.format(date);
};

/** Подпись срока стопа. `null` -> «до конца смены». */
export const formatStopUntil = (until: string | null): string => {
  if (until === null) {
    return SHIFT_END_LABEL;
  }

  return formatDateTime(until);
};

/** Нижняя граница инпута: ближайший шаг 15 минут в будущем. */
export const getDatetimeLocalMin = (now = new Date()): string => {
  const aligned = new Date(Math.ceil(now.getTime() / STEP_MS) * STEP_MS);

  return isoToDatetimeLocal(aligned.toISOString());
};

/** Верхняя граница инпута: сейчас + 24 часа. */
export const getDatetimeLocalMax = (now = new Date()): string => {
  return isoToDatetimeLocal(
    new Date(now.getTime() + MAX_AHEAD_MS).toISOString(),
  );
};

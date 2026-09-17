import { NextResponse } from "next/server";

/** JSON `{ message }` для ошибок route handler. */
export const jsonError = (message: string, status: number) =>
  NextResponse.json({ message }, { status });

/** Успешный JSON-ответ route handler. */
export const jsonOk = <T>(data: T, status = 200) =>
  NextResponse.json(data, { status });

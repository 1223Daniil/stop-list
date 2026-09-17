import { NextResponse } from "next/server";

export const jsonError = (message: string, status: number) =>
  NextResponse.json({ message }, { status });

export const jsonOk = <T>(data: T, status = 200) =>
  NextResponse.json(data, { status });

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Склейка className: `clsx` + merge конфликтующих Tailwind-классов. */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

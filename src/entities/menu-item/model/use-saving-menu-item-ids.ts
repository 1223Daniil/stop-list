"use client";

import { useMutationState } from "@tanstack/react-query";

import { MENU_ITEM_QUERY_ROOT } from "./keys";

const readPendingId = (variables: unknown) => {
  if (typeof variables === "string") {
    return variables;
  }

  if (
    typeof variables === "object" &&
    variables !== null &&
    "id" in variables &&
    typeof variables.id === "string"
  ) {
    return variables.id;
  }

  return "";
};

/**
 * Id позиций с pending stop/resume. Строка таблицы показывает «Сохраняется».
 */
export const useSavingMenuItemIds = () => {
  const ids = useMutationState({
    filters: {
      status: "pending",
      predicate: (mutation) =>
        mutation.options.mutationKey?.[0] === MENU_ITEM_QUERY_ROOT,
    },
    select: (mutation) => readPendingId(mutation.state.variables),
  });

  return ids.filter(Boolean);
};

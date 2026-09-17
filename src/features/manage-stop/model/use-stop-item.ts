"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  menuKeys,
  patchMenuItemInList,
  stopMenuItem,
  toStoppedItem,
} from "@/entities/menu-item";
import type {
  MenuItem,
  MenuItemListFilters,
  StopItemPayload,
} from "@/entities/menu-item";
import { getMutationErrorMessage } from "@/shared/lib";
import { showErrorToast } from "@/shared/ui/toast";

type StopItemVariables = {
  id: string;
  payload: StopItemPayload;
};

type StopItemContext = {
  prev: MenuItem[] | undefined;
};

export const useStopItem = (filters: MenuItemListFilters) => {
  const queryClient = useQueryClient();
  const listKey = menuKeys.list(filters);

  return useMutation<MenuItem, Error, StopItemVariables, StopItemContext>({
    mutationKey: [...menuKeys.all, "stop"],
    mutationFn: ({ id, payload }) => stopMenuItem(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: listKey });
      const prev = queryClient.getQueryData<MenuItem[]>(listKey);

      queryClient.setQueryData<MenuItem[]>(listKey, (items = []) =>
        patchMenuItemInList(
          items,
          id,
          (item) => toStoppedItem(item, payload),
          filters,
        ),
      );

      return { prev };
    },
    onError: (error, _variables, context) => {
      if (context?.prev) {
        queryClient.setQueryData(listKey, context.prev);
      }

      showErrorToast(
        getMutationErrorMessage(error, "Не удалось поставить в стоп-лист"),
      );
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: listKey });
    },
  });
};

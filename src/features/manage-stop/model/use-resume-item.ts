"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  menuKeys,
  patchMenuItemInList,
  resumeMenuItem,
  toAvailableItem,
} from "@/entities/menu-item";
import type { MenuItem, MenuItemListFilters } from "@/entities/menu-item";
import { getMutationErrorMessage } from "@/shared/lib";
import { showErrorToast } from "@/shared/ui/toast";

type ResumeItemContext = {
  prev: MenuItem[] | undefined;
};

/**
 * Снятие со стопа. Та же схема, что у `useStopItem`: оптимистика, откат, тост.
 */
export const useResumeItem = (filters: MenuItemListFilters) => {
  const queryClient = useQueryClient();
  const listKey = menuKeys.list(filters);

  return useMutation<MenuItem, Error, string, ResumeItemContext>({
    mutationKey: [...menuKeys.all, "resume"],
    mutationFn: resumeMenuItem,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: listKey });
      const prev = queryClient.getQueryData<MenuItem[]>(listKey);

      queryClient.setQueryData<MenuItem[]>(listKey, (items = []) =>
        patchMenuItemInList(items, id, toAvailableItem, filters),
      );

      return { prev };
    },
    onError: (error, _id, context) => {
      if (context?.prev) {
        queryClient.setQueryData(listKey, context.prev);
      }

      showErrorToast(
        getMutationErrorMessage(error, "Не удалось вернуть в продажу"),
      );
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: listKey });
    },
  });
};

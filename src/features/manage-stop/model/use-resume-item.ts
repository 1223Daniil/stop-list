"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { menuKeys, resumeMenuItem } from "@/entities/menu-item";
import type { MenuItemListFilters } from "@/entities/menu-item";
import { showErrorToast } from "@/shared/ui/toast";

export const useResumeItem = (filters: MenuItemListFilters) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...menuKeys.all, "resume"],
    mutationFn: resumeMenuItem,
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: menuKeys.list(filters) });
    },
    onError: (error) => {
      showErrorToast(
        error instanceof Error ? error.message : "Не удалось вернуть в продажу",
      );
    },
  });
};

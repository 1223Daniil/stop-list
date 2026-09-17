"use client";

import { useQuery } from "@tanstack/react-query";

import {
  menuItemsQueryOptions,
  type MenuItem,
  type MenuItemListFilters,
} from "@/entities/menu-item";
import { useSavingMenuItemIds } from "@/entities/menu-item/client";
import { Filters } from "@/features/filter-menu-items";
import {
  StopReasonPanel,
  useResumeItem,
  useStopPanelStore,
} from "@/features/manage-stop";
import { APP_MAX_WIDTH_PX, APP_NAME } from "@/shared/config";

import {
  StopListEmpty,
  StopListError,
  StopListTable,
  StopListTableSkeleton,
} from "./StopListTable";

type StopListProps = {
  filters: MenuItemListFilters;
};

/**
 * Экран стоп-листа. Данные из Query, панель из Zustand.
 * Фильтры приходят с RSC, чтобы совпасть с URL.
 */
export const StopList = ({ filters }: StopListProps) => {
  const { data, isPending, isError, error, refetch } = useQuery(
    menuItemsQueryOptions(filters),
  );
  const savingItemIds = useSavingMenuItemIds();
  const resumeItem = useResumeItem(filters);
  const openPanel = useStopPanelStore((state) => state.openPanel);

  const handleStop = (item: MenuItem) => {
    openPanel(item);
  };

  const handleResume = (item: MenuItem) => {
    resumeItem.mutate(item.id);
  };

  return (
    <section
      className="mx-auto flex w-full flex-1 flex-col gap-6 px-8 py-10"
      style={{ maxWidth: APP_MAX_WIDTH_PX }}
    >
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {APP_NAME}
        </h1>
        <p className="text-sm text-muted">
          Меню смены: постановка и снятие позиций со стопа
        </p>
      </header>
      <Filters filters={filters} />
      {isPending ? <StopListTableSkeleton /> : null}
      {isError ? (
        <StopListError
          message={
            error instanceof Error ? error.message : "Попробуйте ещё раз"
          }
          onRetry={() => {
            void refetch();
          }}
        />
      ) : null}
      {data && data.length === 0 ? <StopListEmpty /> : null}
      {data && data.length > 0 ? (
        <StopListTable
          items={data}
          savingItemIds={savingItemIds}
          onStop={handleStop}
          onResume={handleResume}
        />
      ) : null}
      <StopReasonPanel filters={filters} />
    </section>
  );
};

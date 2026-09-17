"use client";

import { usePathname, useRouter } from "next/navigation";

import type { MenuItemListFilters } from "@/entities/menu-item";
import { Select } from "@/shared/ui/select";

import {
  FILTER_ALL,
  SHOP_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS,
  buildFiltersQuery,
  patchMenuFilters,
} from "../model/filters";

type FiltersProps = {
  filters: MenuItemListFilters;
};

/** Фильтры пишут URL через `router.push`, чтобы работала кнопка «назад». */
export const Filters = ({ filters }: FiltersProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const updateFilter = (key: "shop" | "status", value: string) => {
    const query = buildFiltersQuery(patchMenuFilters(filters, key, value));

    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <div role="group" aria-label="Фильтры" className="flex flex-wrap gap-4">
      <Select
        label="Цех"
        options={SHOP_FILTER_OPTIONS}
        value={filters.shop ?? FILTER_ALL}
        onChange={(event) => updateFilter("shop", event.target.value)}
      />
      <Select
        label="Статус"
        options={STATUS_FILTER_OPTIONS}
        value={filters.status ?? FILTER_ALL}
        onChange={(event) => updateFilter("status", event.target.value)}
      />
    </div>
  );
};

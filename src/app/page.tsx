import { parseMenuFilters } from "@/features/filter-menu-items/model/filters";
import { StopList } from "@/widgets/stop-list";

/** RSC: читает `?shop=&status=` и отдаёт клиентскому виджету уже валидные фильтры. */
export default async function Home({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const filters = parseMenuFilters(params);

  return <StopList filters={filters} />;
}

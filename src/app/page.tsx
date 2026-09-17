import { parseMenuFilters } from "@/features/filter-menu-items/model/filters";
import { StopList } from "@/widgets/stop-list";

export default async function Home({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const filters = parseMenuFilters(params);

  return <StopList filters={filters} />;
}

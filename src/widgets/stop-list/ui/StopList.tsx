import { Filters } from "@/features/filter-menu-items";
import { StopReasonPanel } from "@/features/manage-stop";
import { APP_MAX_WIDTH_PX, APP_NAME } from "@/shared/config";

export const StopList = () => {
  return (
    <section
      className="mx-auto flex w-full flex-1 flex-col gap-6 px-8 py-10"
      style={{ maxWidth: APP_MAX_WIDTH_PX }}
    >
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {APP_NAME}
        </h1>
        <p className="text-sm text-foreground/70">
          Меню смены: постановка и снятие позиций со стопа
        </p>
      </header>
      <Filters />
      <StopReasonPanel />
    </section>
  );
};

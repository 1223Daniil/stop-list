import { MenuItemRow } from "@/entities/menu-item";
import type { MenuItem } from "@/entities/menu-item";
import { BUTTON_VARIANTS, Button } from "@/shared/ui/button";

type StopListTableProps = {
  items: MenuItem[];
  savingItemIds: string[];
  onStop: (item: MenuItem) => void;
  onResume: (item: MenuItem) => void;
};

export const StopListTable = ({
  items,
  savingItemIds,
  onStop,
  onResume,
}: StopListTableProps) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      <table className="w-full min-w-[960px] border-collapse text-left">
        <caption className="sr-only">Меню смены</caption>
        <thead className="border-b border-border bg-background text-xs tracking-wide text-muted uppercase">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">
              Позиция
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Цех
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Остаток
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Статус
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              <span className="sr-only">Действия</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <MenuItemRow
              key={item.id}
              item={item}
              isSaving={savingItemIds.includes(item.id)}
              onStop={onStop}
              onResume={onResume}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const StopListTableSkeleton = () => {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      <div className="min-w-[960px] divide-y divide-border">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="flex gap-4 px-4 py-3">
            <div className="h-5 w-1/3 animate-pulse rounded bg-foreground/10" />
            <div className="h-5 w-24 animate-pulse rounded bg-foreground/10" />
            <div className="h-5 w-12 animate-pulse rounded bg-foreground/10" />
            <div className="h-5 w-40 animate-pulse rounded bg-foreground/10" />
            <div className="ml-auto h-5 w-32 animate-pulse rounded bg-foreground/10" />
          </div>
        ))}
      </div>
    </div>
  );
};

type StopListErrorProps = {
  message: string;
  onRetry: () => void;
};

export const StopListError = ({ message, onRetry }: StopListErrorProps) => {
  return (
    <div className="flex flex-col items-start gap-4 rounded-xl border border-error/20 bg-error/5 px-6 py-5">
      <div>
        <p className="font-medium text-foreground">Не удалось загрузить меню</p>
        <p className="mt-1 text-sm text-muted">{message}</p>
      </div>
      <Button variant={BUTTON_VARIANTS.SECONDARY} onClick={onRetry}>
        Повторить
      </Button>
    </div>
  );
};

export const StopListEmpty = () => {
  return (
    <div className="rounded-xl border border-border bg-surface px-6 py-12 text-center">
      <p className="font-medium text-foreground">Ничего не найдено</p>
      <p className="mt-1 text-sm text-muted">
        По выбранным фильтрам нет позиций. Сбросьте цех или статус.
      </p>
    </div>
  );
};

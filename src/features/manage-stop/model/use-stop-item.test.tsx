import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { ReactNode } from "react";

import {
  MENU_ITEM_STATUS,
  SHOPS,
  STOP_REASONS,
  menuKeys,
  stopMenuItem,
  type MenuItem,
} from "@/entities/menu-item";

import { useStopItem } from "./use-stop-item";

vi.mock("@/entities/menu-item", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/entities/menu-item")>();

  return {
    ...actual,
    stopMenuItem: vi.fn(),
  };
});

vi.mock("@/shared/ui/toast", () => ({
  showErrorToast: vi.fn(),
}));

const mockedStopMenuItem = vi.mocked(stopMenuItem);

const availableItem: MenuItem = {
  id: "borscht",
  title: "Борщ украинский",
  shop: SHOPS.KITCHEN,
  stock: 8,
  status: { kind: MENU_ITEM_STATUS.AVAILABLE },
  updatedAt: "2026-01-01T10:00:00.000Z",
};

const stopPayload = {
  reason: STOP_REASONS.OUT_OF_STOCK,
  until: null,
};

const createDeferred = <T,>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
};

const createWrapper = (queryClient: QueryClient) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return Wrapper;
};

describe("useStopItem", () => {
  beforeEach(() => {
    mockedStopMenuItem.mockReset();
  });

  it("updates the list cache before the request resolves", async () => {
    const deferred = createDeferred<MenuItem>();
    mockedStopMenuItem.mockReturnValue(deferred.promise);

    const filters = {};
    const listKey = menuKeys.list(filters);
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    queryClient.setQueryData<MenuItem[]>(listKey, [availableItem]);

    const { result } = renderHook(() => useStopItem(filters), {
      wrapper: createWrapper(queryClient),
    });

    let mutationPromise: Promise<MenuItem> | undefined;

    act(() => {
      mutationPromise = result.current.mutateAsync({
        id: availableItem.id,
        payload: stopPayload,
      });
    });

    await waitFor(() => {
      const cached = queryClient.getQueryData<MenuItem[]>(listKey);
      expect(cached).toHaveLength(1);
      expect(cached?.[0]?.status.kind).toBe(MENU_ITEM_STATUS.STOPPED);
    });

    const stoppedItem: MenuItem = {
      ...availableItem,
      status: {
        kind: MENU_ITEM_STATUS.STOPPED,
        reason: stopPayload.reason,
        until: stopPayload.until,
      },
    };

    await act(async () => {
      deferred.resolve(stoppedItem);
      await mutationPromise;
    });

    expect(
      queryClient.getQueryData<MenuItem[]>(listKey)?.[0]?.status.kind,
    ).toBe(MENU_ITEM_STATUS.STOPPED);
  });

  it("rolls the list cache back when the request fails", async () => {
    const deferred = createDeferred<MenuItem>();
    mockedStopMenuItem.mockReturnValue(deferred.promise);

    const filters = { status: MENU_ITEM_STATUS.AVAILABLE };
    const listKey = menuKeys.list(filters);
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    queryClient.setQueryData<MenuItem[]>(listKey, [availableItem]);

    const { result } = renderHook(() => useStopItem(filters), {
      wrapper: createWrapper(queryClient),
    });

    let mutationPromise: Promise<MenuItem> | undefined;

    act(() => {
      mutationPromise = result.current.mutateAsync({
        id: availableItem.id,
        payload: stopPayload,
      });
    });

    await waitFor(() => {
      expect(queryClient.getQueryData<MenuItem[]>(listKey)).toEqual([]);
    });

    await act(async () => {
      deferred.reject(new Error("Не удалось сохранить изменения"));
      await mutationPromise?.catch(() => undefined);
    });

    await waitFor(() => {
      const cached = queryClient.getQueryData<MenuItem[]>(listKey);
      expect(cached).toHaveLength(1);
      expect(cached?.[0]).toEqual(availableItem);
    });
  });
});

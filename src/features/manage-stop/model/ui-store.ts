import { create } from "zustand";

import type { MenuItem } from "@/entities/menu-item";

type StopPanelUiState = {
  selectedItem: MenuItem | null;
  isPanelOpen: boolean;
  openPanel: (item: MenuItem) => void;
  closePanel: () => void;
};

export const useStopPanelStore = create<StopPanelUiState>((set) => ({
  selectedItem: null,
  isPanelOpen: false,
  openPanel: (item) => set({ selectedItem: item, isPanelOpen: true }),
  closePanel: () => set({ selectedItem: null, isPanelOpen: false }),
}));

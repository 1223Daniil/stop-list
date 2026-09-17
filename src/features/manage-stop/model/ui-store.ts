import { create } from "zustand";

type StopPanelUiState = {
  selectedItemId: string | null;
  isPanelOpen: boolean;
  openPanel: (itemId: string) => void;
  closePanel: () => void;
};

export const useStopPanelStore = create<StopPanelUiState>((set) => ({
  selectedItemId: null,
  isPanelOpen: false,
  openPanel: (itemId) => set({ selectedItemId: itemId, isPanelOpen: true }),
  closePanel: () => set({ selectedItemId: null, isPanelOpen: false }),
}));

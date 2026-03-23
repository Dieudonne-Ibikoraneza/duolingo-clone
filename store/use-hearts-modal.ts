import { create } from "zustand"

type HeartsModalState = {
    isOpen: boolean;
    lastHeartAt: Date | null | undefined;
    open: (lastHeartAt?: Date | null | undefined) => void;
    close: () => void;
}

export const useHeartsModal = create<HeartsModalState>((set) => ({
    isOpen: false,
    lastHeartAt: undefined,
    open: (lastHeartAt) => set({ isOpen: true, lastHeartAt }),
    close: () => set({ isOpen: false, lastHeartAt: undefined }),
}))

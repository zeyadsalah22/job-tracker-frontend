import { create } from "zustand";
import { persist } from "zustand/middleware";

const useSideNavStore = create(
  persist(
    (set) => ({
      isClosed: false,
      toggle: () => set((state) => ({ isClosed: !state.isClosed })),
    }),
    {
      name: "sidenav",
    }
  )
);

export default useSideNavStore;

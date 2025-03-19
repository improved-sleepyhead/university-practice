import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface FiltersState {
  search: string;
  category: string;
  minPrice: number | null;
  maxPrice: number | null;
  setFilters: (filters: Partial<FiltersState>) => void;
}

export const useFiltersStore = create<FiltersState>()(
  immer((set) => ({
    search: "",
    category: "all",
    minPrice: null,
    maxPrice: null,
    setFilters: (filters) =>
      set((state) => {
        Object.assign(state, filters);
      }),
  }))
);
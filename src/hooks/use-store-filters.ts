import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { fetchFilterData } from "@/api/filters.service";

interface GalleryFiltersState {
  search: string;
  category: string;
  sortOrder: "price-asc" | "price-desc" | "year" | null;
  collections: string[];
  users: string[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
  setFilters: (filters: Partial<GalleryFiltersState>) => void;
  loadFilters: () => Promise<void>;
}

export const useGalleryStore = create<GalleryFiltersState>()(
  immer((set) => ({
    search: "",
    category: "all",
    sortOrder: null,
    collections: [],
    users: [],
    categories: [],
    isLoading: false,
    error: null,
    setFilters: (filters) => set((state) => Object.assign(state, filters)),
    loadFilters: async () => {
      set({ isLoading: true, error: null });
      try {
        const filters = await fetchFilterData();
        set((state) => {
          state.collections = filters.collections || [];
          state.users = filters.users || [];
          state.categories = filters.categories || [];
          state.isLoading = false;
        });
      } catch (error) {
        set({ 
          error: "Failed to load filters", 
          isLoading: false,
          collections: ["Default Collection"],
          users: ["Default Artist"],
          categories: ["Default Category"]
        });
      }
    },
  }))
);
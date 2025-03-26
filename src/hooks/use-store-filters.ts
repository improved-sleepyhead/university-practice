import { fetchFilterData } from "@/api/filters.service";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";


interface GalleryFiltersState {
  search: string;
  category: string;
  artCategory: string;
  sortOrder: "price-asc" | "price-desc" | "year" | null;
  collections: string[];
  users: string[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
  setFilters: (filters: Partial<GalleryFiltersState>) => void;
  resetFilters: () => void;
  loadFilters: () => Promise<void>;
}

export const useGalleryStore = create<GalleryFiltersState>()(
  immer((set) => ({
    search: "",
    category: "all",
    artCategory: "",
    sortOrder: null,
    collections: [],
    users: [],
    categories: [],
    isLoading: false,
    error: null,
    setFilters: (filters) => set((state) => Object.assign(state, filters)),
    resetFilters: () => {
      set((state) => {
        state.search = "";
        state.category = "all";
        state.artCategory = "";
        state.sortOrder = null;
      });
    },
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
        console.error("Failed to load filters:", error);
        set({ error: "Failed to load filters", isLoading: false });
      }
    },
  }))
);

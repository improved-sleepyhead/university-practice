// hooks/use-gallery-store.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface GalleryFiltersState {
  search: string;
  category: string; // 'all', 'painting', 'sculpture', 'photography'
  sortOrder: "price-asc" | "price-desc" | "year" | null;
  likedItems: number[]; // Для избранного
  setFilters: (filters: Partial<GalleryFiltersState>) => void;
  toggleLike: (id: number) => void;
}

export const useGalleryStore = create<GalleryFiltersState>()(
  immer((set) => ({
    search: "",
    category: "all",
    sortOrder: null,
    likedItems: [],
    setFilters: (filters) => set((state) => Object.assign(state, filters)),
    toggleLike: (id) =>
      set((state) => {
        state.likedItems.includes(id)
          ? (state.likedItems = state.likedItems.filter(item => item !== id))
          : state.likedItems.push(id);
      }),
  }))
);
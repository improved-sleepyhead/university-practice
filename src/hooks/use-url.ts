// hooks/use-gallery-filters-with-url.ts
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useStorage } from "./use-storage";
import { useGalleryStore } from "./use-store-filters";

export const useGalleryFiltersWithUrl = () => {
  const searchParams = useSearchParams();
  const { search, category, sortOrder, setFilters } = useGalleryStore();
  const [savedFilters, saveFilters] = useStorage("gallery-filters", { 
    search, 
    category, 
    sortOrder 
  });

  useEffect(() => {
    setFilters({
      search: searchParams.get("search") || "",
      category: searchParams.get("category") || "all",
      sortOrder: searchParams.get("sortOrder") as "price-asc" | "price-desc" | "year" | null || null,
    });
  }, [searchParams]);

  useEffect(() => {
    saveFilters({ search, category, sortOrder });
  }, [search, category, sortOrder, saveFilters]);

  useEffect(() => {
    const updateUrl = () => {
      const { search, category, sortOrder } = useGalleryStore.getState();
      const params = new URLSearchParams();

      if (search) params.set("search", search);
      if (category !== "all") params.set("category", category);
      if (sortOrder) params.set("sortOrder", sortOrder);

      window.history.replaceState({}, "", `?${params.toString()}`);
    };

    const unsubscribe = useGalleryStore.subscribe(updateUrl);
    return unsubscribe;
  }, []);
};
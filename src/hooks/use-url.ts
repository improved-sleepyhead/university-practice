import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useFiltersStore } from "./use-store-filters";
import { useStorage } from "./use-storage";

export const useFiltersWithUrl = () => {
  const searchParams = useSearchParams();
  const { search, category, minPrice, maxPrice, setFilters } = useFiltersStore();
  const [savedFilters, saveFilters] = useStorage("filters", { search, category, minPrice, maxPrice });

  useEffect(() => {
    setFilters({
      search: searchParams.get("search") || "",
      category: searchParams.get("category") || "all",
      minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : null,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : null,
    });
  }, [searchParams]);

  useEffect(() => {
    saveFilters({ search, category, minPrice, maxPrice });
  }, [search, category, minPrice, maxPrice, saveFilters]);

  useEffect(() => {
    const updateUrl = () => {
      const { search, category, minPrice, maxPrice } = useFiltersStore.getState();
      const params = new URLSearchParams();

      if (search) params.set("search", search);
      if (category !== "all") params.set("category", category);
      if (minPrice !== null) params.set("minPrice", String(minPrice));
      if (maxPrice !== null) params.set("maxPrice", String(maxPrice));

      window.history.replaceState({}, "", `?${params.toString()}`);
    };

    const unsubscribe = useFiltersStore.subscribe(updateUrl);
    return unsubscribe;
  }, []);
};
"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useStorage } from "./use-storage";
import { useGalleryStore } from "./use-store-filters";

export const useGalleryFiltersWithUrl = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { search, category, artCategory, sortOrder, setFilters } = useGalleryStore();
  const [savedFilters, saveFilters] = useStorage("gallery-filters", { 
    search, 
    category, 
    artCategory,
    sortOrder 
  });

  useEffect(() => {
    setFilters({
      search: searchParams.get("search") || savedFilters.search || "",
      category: searchParams.get("category") || savedFilters.category || "all",
      artCategory: searchParams.get("artCategory") || savedFilters.artCategory || "",
      sortOrder: searchParams.get("sortOrder") as "price-asc" | "price-desc" | "year" | null || savedFilters.sortOrder || null,
    });
  }, [searchParams]);

  useEffect(() => {
    saveFilters({ search, category, artCategory, sortOrder });
  }, [search, category, artCategory, sortOrder]);

  const params = useMemo(() => {
    const newParams = new URLSearchParams();
    if (search) newParams.set("search", search);
    if (category !== "all") newParams.set("category", category);
    if (artCategory) newParams.set("artCategory", artCategory);
    if (sortOrder) newParams.set("sortOrder", sortOrder);
    return newParams;
  }, [search, category, artCategory, sortOrder]);

  useEffect(() => {
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [params]);
};
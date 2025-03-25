"use client";

import { useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useStorage } from "./use-storage";
import { useGalleryStore } from "./use-store-filters";

export const useGalleryFiltersWithUrl = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { search, category, setFilters } = useGalleryStore();
  const [savedFilters, saveFilters] = useStorage("gallery-filters", { search, category });

  // Загружаем фильтры из URL при монтировании
  useEffect(() => {
    setFilters({
      search: searchParams.get("search") || savedFilters.search || "",
      category: searchParams.get("category") || savedFilters.category || "all",
    });
  }, []);

  // Сохраняем фильтры в localStorage
  useEffect(() => {
    saveFilters({ search, category });
  }, [search, category]);

  // Обновляем URL при изменении фильтров
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category !== "all") params.set("category", category);

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [search, category]);
};

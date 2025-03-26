import { useEffect, useMemo } from "react";
import debounce from "lodash.debounce";
import { useGalleryStore } from "./use-store-filters";

export const useDebouncedFilters = () => {
  const { search, category, artCategory, sortOrder } = useGalleryStore();

  const updateFilters = useMemo(
    () => debounce(() => {
      console.log("Фильтры обновлены:", { search, category, artCategory, sortOrder });
    }, 300),
    [search]
  );

  useEffect(() => {
    updateFilters();

    return () => updateFilters.cancel();
  }, [search]);
};

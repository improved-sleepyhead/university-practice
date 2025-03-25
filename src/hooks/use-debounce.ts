import { useEffect } from "react";
import debounce from "lodash.debounce";
import { useGalleryStore } from "./use-store-filters";


export const useDebouncedFilters = () => {
  const filters = useGalleryStore((state) => state);

  const updateFilters = debounce(() => {
    console.log("Фильтры обновлены:", filters);
  }, 300);

  useEffect(() => {
    updateFilters();
  }, [filters]);
};
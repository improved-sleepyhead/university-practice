import { useEffect } from "react";
import debounce from "lodash.debounce";
import { useFiltersStore } from "./use-store-filters";

export const useDebouncedFilters = () => {
  const filters = useFiltersStore((state) => state);

  const updateFilters = debounce(() => {
    console.log("Фильтры обновлены:", filters);
  }, 300);

  useEffect(() => {
    updateFilters();
  }, [filters]);
};
"use client";

import { Input } from "@/components/ui/input";
import { useFiltersStore } from "@/hooks/use-store-filters";

export const Header = () => {
  const { setFilters } = useFiltersStore();

  return (
    <header className="p-4 bg-blue-400 text-white flex justify-between">
      <h1 className="text-xl font-bold">Web Market</h1>
      <Input
        placeholder="Поиск..."
        className="w-64 bg-white"
        onChange={(e) => setFilters({ search: e.target.value })}
      />
    </header>
  );
};

"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFiltersStore } from "@/hooks/use-store-filters";

const categories = ["all", "electronics", "jewelery", "men's clothing", "women's clothing"];

export const Sidebar = () => {
  const { setFilters, minPrice, maxPrice, sortOrder } = useFiltersStore();

  return (
    <aside className="w-64 p-4 bg-gray-100 border-r">
      <h2 className="text-lg font-bold mb-2">Фильтры</h2>

      <div className="mb-4">
        <h3 className="font-semibold">Категория</h3>
        <Select onValueChange={(value) => setFilters({ category: value })}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Выберите категорию" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold">Цена</h3>
        <Input
          type="number"
          placeholder="Мин"
          className="mb-2"
          onChange={(e) => setFilters({ minPrice: Number(e.target.value) })}
          value={minPrice || ""}
        />
        <Input
          type="number"
          placeholder="Макс"
          className="mb-2"
          onChange={(e) => setFilters({ maxPrice: Number(e.target.value) })}
          value={maxPrice || ""}
        />
      </div>

      <div className="mb-4">
        <h3 className="font-semibold">Сортировка по цене</h3>
        <Button
          variant={sortOrder === "asc" ? "default" : "outline"}
          onClick={() => setFilters({ sortOrder: "asc" })}
          className="mr-2"
        >
          По возрастанию
        </Button>
        <Button
          variant={sortOrder === "desc" ? "default" : "outline"}
          onClick={() => setFilters({ sortOrder: "desc" })}
        >
          По убыванию
        </Button>
      </div>

      <Button variant="outline" onClick={() => setFilters({ search: "", category: "all", minPrice: null, maxPrice: null, sortOrder: null })}>
        Сбросить фильтры
      </Button>
    </aside>
  );
};
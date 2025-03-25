"use client";

import { fetchProducts } from "@/api/store.service";
import { ProductCard } from "@/components/product-card";
import { useDebouncedFilters } from "@/hooks/use-debounce";
import { useFiltersStore } from "@/hooks/use-store-filters";
import { useFiltersWithUrl } from "@/hooks/use-url";
import { useQuery } from "@tanstack/react-query";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export default function Page() {
  useFiltersWithUrl();
  useDebouncedFilters();

  const filters = useFiltersStore((state) => state);
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["products", filters.category], // Используем категорию как часть ключа
    queryFn: () => fetchProducts(filters.category), // Запрашиваем продукты по категории
  });

  // Фильтрация по цене и поиску на фронтенде
  const filteredProducts = products?.filter((product) => {
    // Поиск по названию
    const matchesSearch = product.title
      .toLowerCase()
      .includes(filters.search.toLowerCase());

    // Фильтр по цене
    const matchesPrice =
      (filters.minPrice === null || product.price >= filters.minPrice) &&
      (filters.maxPrice === null || product.price <= filters.maxPrice);

    return matchesSearch && matchesPrice;
  });

  // Сортировка по цене
  const sortedProducts = filteredProducts?.sort((a, b) => {
    if (filters.sortOrder === "asc") {
      return a.price - b.price;
    } else if (filters.sortOrder === "desc") {
      return b.price - a.price;
    }
    return 0; // Если сортировка отключена
  });

  return (
    <div>
      {isLoading ? (
        <p className="text-center text-lg">Загрузка...</p>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {sortedProducts?.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
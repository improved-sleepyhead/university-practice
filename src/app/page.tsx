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
    queryKey: ["products", filters],
    queryFn: () => fetchProducts(filters),
  });

  return (
    <div>
      {isLoading ? (
        <p className="text-center text-lg">Загрузка...</p>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {products?.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
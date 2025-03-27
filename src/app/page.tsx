"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { fetchArtworks } from "@/api/store.service";
import { ArtCard } from "@/components/item-card";
import { useGalleryStore } from "@/hooks/use-store-filters";
import { useGalleryFiltersWithUrl } from "@/hooks/use-url";
import { useInfiniteQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useDebouncedFilters } from "@/hooks/use-debounce";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

export default function GalleryPage() {
  useGalleryFiltersWithUrl();
  useDebouncedFilters();
  const { search, category, artCategory, sortOrder } = useGalleryStore();
  const [columnCount, setColumnCount] = useState(1);

  useEffect(() => {
    const updateColumnCount = () => {
      const width = window.innerWidth;
      setColumnCount(width >= 1024 ? 4 : width >= 768 ? 3 : width >= 640 ? 2 : 1);
    };

    updateColumnCount();
    window.addEventListener("resize", updateColumnCount);
    return () => window.removeEventListener("resize", updateColumnCount);
  }, []);

  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["artworks", category, artCategory, search, sortOrder],
    queryFn: async ({ pageParam = 1 }) => {
      return fetchArtworks(category, artCategory, search, sortOrder, pageParam);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length > 0 ? allPages.length + 1 : undefined,
    staleTime: 60 * 1000,
  });

  const allArtworks = data?.pages.flat() || [];
  const uniqueArtworks = useMemo(
    () => Array.from(new Map(allArtworks.map(item => [item.id, item])).values()),
    [allArtworks]
  );

  const columns = useMemo(() => {
    const newColumns = Array.from({ length: columnCount }, () => [] as typeof uniqueArtworks);
    const columnHeights = new Array(columnCount).fill(0);

    uniqueArtworks.forEach(artwork => {
      const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights));
      newColumns[shortestColumn].push(artwork);
      columnHeights[shortestColumn] += 1;
    });

    return newColumns;
  }, [uniqueArtworks, columnCount]);

  const lastElementRef = useIntersectionObserver(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  // 🔥 Новый обработчик: если верхняя карточка выходит из вьюпорта, подгружаем новую
  const firstElementRef = useIntersectionObserver(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const loadMoreRef = useIntersectionObserver(
    () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    { rootMargin: "200px" }
  );

  return (
    <div className="px-4 py-8">
      <div className="flex gap-4">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="flex-1">
            <AnimatePresence mode="popLayout">
              {column.map((artwork, index) => (
                <motion.div
                  key={artwork.id}
                  layout
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 80,
                    damping: 12,
                    mass: 0.5,
                  }}
                  className="mb-4"
                >
                  <ArtCard
                    artwork={{
                      ...artwork,
                      price: formatPrice(artwork.price),
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Элемент для триггера загрузки */}
      <div ref={loadMoreRef} className="h-10 flex justify-center items-center">
        {isFetchingNextPage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="animate-pulse"
          >
            Loading more artworks...
          </motion.div>
        )}
        {!hasNextPage && uniqueArtworks.length > 0 && (
          <div className="text-gray-500">No more artworks to load</div>
        )}
      </div>
    </div>
  );
}
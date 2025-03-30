"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchArtworks } from "@/api/store.service";
import { ArtCard } from "@/components/item-card";
import { motion, AnimatePresence } from "framer-motion";
import { useGalleryFiltersWithUrl } from "@/hooks/use-url";
import { useDebouncedFilters } from "@/hooks/use-debounce";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useGalleryStore } from "@/hooks/use-store-filters";

export default function GalleryPage() {
  useGalleryFiltersWithUrl();
  useDebouncedFilters();
  const { search, category, artCategory, sortOrder } = useGalleryStore();

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

  // Создаем массив рефов для каждой колонки
  const columnRefs = Array.from({ length: 4 }, () =>
    useIntersectionObserver(
      () => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "5px" }
    )
  );

  return (
    <div className="px-4 py-8">
      <div className="flex gap-4">
        {[...Array(4)].map((_, columnIndex) => (
          <div
            key={columnIndex}
            className="flex-1 flex flex-col gap-6"
            style={{ minWidth: "25%" }}
          >
            {allArtworks
              .filter((_, index) => index % 4 === columnIndex)
              .map((artwork) => (
                <motion.div
                  key={artwork.id}
                  layout
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 1.2,
                    type: "spring",
                    stiffness: 60,
                    damping: 15,
                    mass: 0.8,
                  }}
                  className="mb-6"
                >
                  <ArtCard
                    artwork={{
                      ...artwork,
                      price: new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      }).format(artwork.price),
                    }}
                  />
                </motion.div>
              ))}
            {allArtworks.length > 0 &&
              (
                <div ref={columnRefs[columnIndex]} className="h-52">
                  {isFetchingNextPage && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8 }}
                      className="animate-pulse"
                    >
                      Loading...
                    </motion.div>
                  )}
                </div>
              )}
          </div>
        ))}
      </div>

      {!hasNextPage && allArtworks.length > 0 && (
        <div className="text-gray-500">No more artworks to load</div>
      )}
    </div>
  );
}
у меня есть проект онлайн галереи, сейчас буду кидать весь его код для правок
// api/gallery.service.ts
import { Artwork } from "@/types/gallery";
import axios from "axios";


const UNSPLASH_ACCESS_KEY = "3dsHd9uGtS4cwLWqrgsizuyxaD6iPVoA26CGtHPazWQ";
const UNSPLASH_API_URL = "https://api.unsplash.com";

// api/gallery.service.ts
// api/gallery.service.ts
export const fetchArtworks = async (
  category: string = "all",
  page: number = 1
): Promise<Artwork[]> => {
  try {
    const count = page === 1 ? 8 : 4; // Первая загрузка - 8, затем по 4
    const orientation = "portrait"; // Фиксируем ориентацию
    
    const { data } = await axios.get(`${UNSPLASH_API_URL}/photos/random`, {
      params: {
        count,
        query: category === "all" ? "art" : category,
        orientation,
        client_id: UNSPLASH_ACCESS_KEY,
      },
      timeout: 5000, // Таймаут 5 секунд
    });

    return data.map((photo: any): Artwork => ({
      id: photo.id + Date.now(), // Уникальный ID
      title: photo.alt_description || `Artwork ${photo.id}`,
      artist: photo.user.name || "Unknown Artist",
      year: new Date().getFullYear().toString(), // Фиксированный год
      imageUrl: `${photo.urls.regular}&w=600`, // Оптимизированный размер
      gallery: "Unsplash Gallery",
      price: Math.floor(Math.random() * 5000) + 100,
      category,
    }));
  } catch (error) {
    console.error("Error fetching artworks:", error);
    return [];
  }
};
import { Header } from "@/components/header";
import { TanstackQueryProvider } from "@/providers/query-provider";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Footer } from "@/components/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TanstackQueryProvider>
          <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
          <div className="flex flex-col h-screen">
            <Header />
            <main className="flex-1 p-4 pt-52">
              {children}
            </main>
            <Footer/>
          </div>
          </ThemeProvider>
        </TanstackQueryProvider>
      </body>
    </html>
  );
}
"use client";

import { useCallback, useRef } from "react";
import { fetchArtworks } from "@/api/store.service";
import { ArtCard } from "@/components/item-card";
import { useGalleryStore } from "@/hooks/use-store-filters";
import { useInfiniteQuery } from "@tanstack/react-query";

export interface Artwork {
  id: string;
  artist: string;
  title: string;
  year: string;
  gallery: string;
  price: number;
  imageUrl: string;
  category?: string;
  aspectRatio?: number;
}

export function useIntersectionObserver(onIntersect: () => void) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  return useCallback((el: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (el) {
      observerRef.current = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            onIntersect();
          }
        });
      }, {
        rootMargin: '200px' // Загружаем заранее
      });
      observerRef.current.observe(el);
    }
  }, [onIntersect]);
}

export default function GalleryPage() {
  const { search, category, sortOrder } = useGalleryStore();

  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ["artworks", category, search, sortOrder],
    queryFn: async ({ pageParam = 1 }) => {
      const artworks = await fetchArtworks(category, pageParam);
      // Добавляем aspectRatio для каждого изображения
      return artworks.map(artwork => ({
        ...artwork,
        aspectRatio: Math.min(1.5, Math.max(0.8, Math.random() * 1.2 + 0.8)) // Случайное соотношение 0.8-2.0
      }));
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => allPages.length + 1,
    staleTime: 60 * 1000,
  });

  const loadMoreRef = useIntersectionObserver(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  const allArtworks = data?.pages.flat() || [];

  const processedArtworks = allArtworks
    .filter(artwork => {
      const matchesSearch = artwork.title.toLowerCase().includes(search.toLowerCase()) || 
                          artwork.artist.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "all" || artwork.category === category;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOrder === "price-asc") return a.price - b.price;
      if (sortOrder === "price-desc") return b.price - a.price;
      if (sortOrder === "year") return parseInt(b.year) - parseInt(a.year);
      return 0;
    });

  if (isLoading && !data) {
    return <div className="text-center py-8">Loading initial artworks...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">Error: {error.message}</div>;
  }

  return (
    <div className="px-4 py-8">
      {/* Masonry-раскладка через columns */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:balance]">
        {processedArtworks.map((artwork) => (
          <div 
            key={`${artwork.id}-${artwork.imageUrl}`}
            className="mb-4 break-inside-avoid" // Предотвращаем разрыв карточек
            style={{ aspectRatio: artwork.aspectRatio }}
          >
            <ArtCard 
              artwork={{
                ...artwork,
                price: formatPrice(artwork.price)
              }}
            />
          </div>
        ))}
      </div>

      <div ref={loadMoreRef} className="h-10 flex justify-center items-center">
        {isFetchingNextPage && (
          <div className="animate-pulse">Loading more artworks...</div>
        )}
        {!hasNextPage && processedArtworks.length > 0 && (
          <div className="text-gray-500">No more artworks to load</div>
        )}
      </div>
    </div>
  );
}
"use client";

import { Artwork } from "@/types/gallery";
import { useEffect, useRef, useState } from "react";

interface ArtCardProps {
  artwork: Omit<Artwork, "category"> & { price: string };
}

export const ArtCard = ({ artwork }: ArtCardProps) => {
  return (
    <div className="w-[300px] mx-auto text-left">
      {/* Изображение */}
      <div className="mb-3">
      <img
        src={artwork.imageUrl}
        alt={`${artwork.title} by ${artwork.artist}`}
        className="w-full max-h-screen h-auto object-contain"
        loading="lazy"
      />
      </div>

      {/* Текстовый блок */}
      <div className="max-w-full space-y-1">
        <p className="font-medium text-base">{artwork.artist}</p>
        <p className="text-sm italic">{artwork.title}, {artwork.year}</p>
        <p className="text-sm text-gray-600">{artwork.gallery}</p>
        <p className="font-medium text-base mt-1">{artwork.price}</p>
      </div>
    </div>
  );
};
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
import { useEffect, useState } from "react";

export const useScrollTop = (threshold = 10) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() =>{
        const handleScroll = () => {
            if (window.scrollY > threshold) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [threshold]);

    return scrolled;
}
"use client"; // Делаем хук клиентским

import { useState, useEffect } from "react";

export function useStorage<T>(key: string, initialValue: T, storage: "local" | "session" = "local") {
  const isBrowser = typeof window !== "undefined"; // Проверяем, в браузере ли мы
  const getStorage = () => (isBrowser ? (storage === "local" ? localStorage : sessionStorage) : null);

  const [value, setValue] = useState<T>(() => {
    if (!isBrowser) return initialValue; // SSR-защита

    try {
      const storedValue = getStorage()?.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    if (!isBrowser) return;

    try {
      getStorage()?.setItem(key, JSON.stringify(value));
    } catch {
      console.error("Ошибка при сохранении в storage");
    }
  }, [key, value]);

  return [value, setValue] as const;
}
// hooks/use-gallery-store.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface GalleryFiltersState {
  search: string;
  category: string; // 'all', 'painting', 'sculpture', 'photography'
  sortOrder: "price-asc" | "price-desc" | "year" | null;
  likedItems: number[]; // Для избранного
  setFilters: (filters: Partial<GalleryFiltersState>) => void;
  toggleLike: (id: number) => void;
}

export const useGalleryStore = create<GalleryFiltersState>()(
  immer((set) => ({
    search: "",
    category: "all",
    sortOrder: null,
    likedItems: [],
    setFilters: (filters) => set((state) => Object.assign(state, filters)),
    toggleLike: (id) =>
      set((state) => {
        state.likedItems.includes(id)
          ? (state.likedItems = state.likedItems.filter(item => item !== id))
          : state.likedItems.push(id);
      }),
  }))
);
// hooks/use-gallery-filters-with-url.ts
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useStorage } from "./use-storage";
import { useGalleryStore } from "./use-store-filters";

export const useGalleryFiltersWithUrl = () => {
  const searchParams = useSearchParams();
  const { search, category, sortOrder, setFilters } = useGalleryStore();
  const [savedFilters, saveFilters] = useStorage("gallery-filters", { 
    search, 
    category, 
    sortOrder 
  });

  useEffect(() => {
    setFilters({
      search: searchParams.get("search") || "",
      category: searchParams.get("category") || "all",
      sortOrder: searchParams.get("sortOrder") as "price-asc" | "price-desc" | "year" | null || null,
    });
  }, [searchParams]);

  useEffect(() => {
    saveFilters({ search, category, sortOrder });
  }, [search, category, sortOrder, saveFilters]);

  useEffect(() => {
    const updateUrl = () => {
      const { search, category, sortOrder } = useGalleryStore.getState();
      const params = new URLSearchParams();

      if (search) params.set("search", search);
      if (category !== "all") params.set("category", category);
      if (sortOrder) params.set("sortOrder", sortOrder);

      window.history.replaceState({}, "", `?${params.toString()}`);
    };

    const unsubscribe = useGalleryStore.subscribe(updateUrl);
    return unsubscribe;
  }, []);
}; из проблем у меня медленно подгружаются картинки, последовательность подгружаемых карточек нарушена (в прцессе инфинит скролла новые карточки мешаются со старыми, а не добавляются в конец). При этом есть код с дропдаун меню для фильтров, есть сторэджы для фильтров, но сами эти фильтры и квери параметры не реализованы, поправь все это
"use client";
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronUp} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="z-50 fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-xs">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
        <Button
            variant="outline"
            className={`w-80 h-12 flex justify-between shadow-none border-none items-center transition-all ease-on-out duration-200
            ${open ? "hover:text-black dark:hover:bg-black hover:bg-white bg-white text-black dark:bg-black dark:text-white dark:hover:text-white" : "hover:text-white dark:hover:bg-white hover:bg-black bg-black text-white dark:bg-white dark:text-black dark:hover:text-black"}`}
        >
            Filter
        <ChevronDown
            className={`w-4 h-4 ml-2 transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`}
        />
        </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
            align="center"
            className="w-80 p-5 bg-white border shadow-md rounded-lg max-h-[46rem] overflow-auto"
        >
          <Accordion type="multiple" className="w-full">
            {[
              { title: "Artists", items: ["Javer Best", "John Hoyland", "Tuba Auerbac", "Gagyi Botond", "Bastan Tamil", "Jason Skull", "Mejid Khalid"] },
              { title: "Price" },
              { title: "Color" },
              { title: "Size" },
              { title: "Category" }
            ].map(({ title, items }) => (
              <AccordionItem key={title} value={title} className="p-1">
                <AccordionTrigger className="flex justify-between items-center">
                  {title}
                </AccordionTrigger>
                <AccordionContent>
                  {items ? (
                    <ul className="pl-4 space-y-1">
                      {items.map((item) => (
                        <li key={item} className="py-1">{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="pl-4 text-gray-500">Filters go here</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};


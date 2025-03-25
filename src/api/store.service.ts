// api/gallery.service.ts
import { Artwork } from "@/types/gallery";
import axios from "axios";


const UNSPLASH_ACCESS_KEY = "VyEMJIbfEOfmGfrWXjHWqUJlG6vSTu0gN6EK6JK_OGM";
const UNSPLASH_API_URL = "https://api.unsplash.com";

// api/gallery.service.ts
export const fetchArtworks = async (
  category: string = "all",
  page: number = 1
): Promise<Artwork[]> => {
  try {
    const count = 8; // Фиксированное число картинок на страницу
    const orientation = "portrait";

    const { data } = await axios.get(`${UNSPLASH_API_URL}/search/photos`, {
      params: {
        query: category === "all" ? "art" : category,
        per_page: count,
        page,
        orientation,
        client_id: UNSPLASH_ACCESS_KEY,
      },
      timeout: 5000,
    });

    return data.results.map((photo: any): Artwork => ({
      id: photo.id, // Теперь ID будет стабильным
      title: photo.alt_description || `Artwork ${photo.id}`,
      artist: photo.user.name || "Unknown Artist",
      year: new Date().getFullYear().toString(),
      imageUrl: `${photo.urls.regular}&w=600`,
      gallery: "Unsplash Gallery",
      price: Math.floor(Math.random() * 5000) + 100,
      category,
    }));
  } catch (error) {
    console.error("Error fetching artworks:", error);
    return [];
  }
};


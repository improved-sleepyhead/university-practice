import axios from "axios";

const API_URL = "https://api.unsplash.com";
const ACCESS_KEY = "VyEMJIbfEOfmGfrWXjHWqUJlG6vSTu0gN6EK6JK_OGM";

export const fetchArtworks = async (
  category: string = "all",
  artCategory: string = "",
  search: string = "",
  sortOrder: "price-asc" | "price-desc" | "year" | null = null,
  page: number = 1
) => {
  try {
    const query = [category !== "all" ? category : "art", artCategory, search]
      .filter(Boolean)
      .join(" ");

    const { data } = await axios.get(`${API_URL}/search/photos`, {
      params: {
        query,
        per_page: 10,
        page,
        client_id: ACCESS_KEY,
      },
      timeout: 5000,
    });

    return data.results.map((photo: any) => ({
      id: photo.id,
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

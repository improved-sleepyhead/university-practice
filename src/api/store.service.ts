import axios from "axios";

const API_URL = "https://api.unsplash.com";

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
      console.log("Fetching artworks with params:", {
        category,
        artCategory,
        search,
        sortOrder,
        page,
      });
    const { data } = await axios.get(`${API_URL}/search/photos`, {
      params: {
        query,
        per_page: 2,
        page,
        client_id: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
      },
      timeout: 5000,
    });

    return data.results.map((photo: any) => ({
      id: photo.id,
      title: photo.alt_description || `Artwork ${photo.id}`,
      artist: photo.user.name || "Unknown Artist",
      year: new Date().getFullYear().toString(),
      imageUrl: `${photo.urls.regular}&w=500&q=80`,
      previewUrl: photo.urls.thumb,
      gallery: "Unsplash Gallery",
      price: Math.floor(Math.random() * 5000) + 100,
      category,
    }));
    
  } catch (error) {
    console.error("Error fetching artworks:", error);
    return [];
  }
};

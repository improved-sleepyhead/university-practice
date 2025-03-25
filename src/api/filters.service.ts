import axios from "axios";

const API_URL = "https://api.unsplash.com";
const ACCESS_KEY = "VyEMJIbfEOfmGfrWXjHWqUJlG6vSTu0gN6EK6JK_OGM";

export const fetchFilterData = async () => {
  try {
    const [collectionsRes, usersRes, categoriesRes] = await Promise.all([
      axios.get(`${API_URL}/search/collections`, {
        params: { query: "art", per_page: 10, client_id: ACCESS_KEY },
      }),
      axios.get(`${API_URL}/search/users`, {
        params: { query: "artist", per_page: 10, client_id: ACCESS_KEY },
      }),
      axios.get(`${API_URL}/collections`, {
        params: { per_page: 10, client_id: ACCESS_KEY },
      }),
    ]);

    return {
      collections: collectionsRes.data.results.map((c: any) => c.title),
      users: usersRes.data.results.map((u: any) => u.username),
      categories: categoriesRes.data.map((c: any) => c.title),
    };
  } catch (error) {
    console.error("Error fetching filter data:", error);
    return { collections: [], users: [], categories: [] };
  }
};

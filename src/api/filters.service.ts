import axios from "axios";

const API_URL = "https://api.unsplash.com";
const ACCESS_KEY = "r0jhb9wjQbcF3hqcVbw0L7FzRRxVXXJxDIF_u3xFsac";

export const fetchFilterData = async () => {
  try {
    const [collectionsRes, usersRes, topicsRes] = await Promise.all([
      axios.get(`${API_URL}/collections`, {
        params: { per_page: 10, client_id: ACCESS_KEY },
      }),
      axios.get(`${API_URL}/search/users`, {
        params: { query: "photographer", per_page: 10, client_id: ACCESS_KEY },
      }),
      axios.get(`${API_URL}/topics`, {
        params: { per_page: 20, client_id: ACCESS_KEY },
      }),
    ]);

    return {
      collections: collectionsRes.data.map((c: any) => c.title),
      users: usersRes.data.results.map((u: any) => u.username),
      categories: topicsRes.data.map((t: any) => t.title),
    };
  } catch (error) {
    console.error("Error fetching filter data:", error);
    return { collections: [], users: [], categories: [] };
  }
};
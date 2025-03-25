import axios from "axios";

const API_URL = "https://fakestoreapi.com/products";

export const fetchProducts = async (category: string) => {
  const url = category === "all" ? API_URL : `${API_URL}/category/${category}`;
  const { data } = await axios.get(url);
  return data;
};
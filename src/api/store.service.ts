import axios from "axios";

const API_URL = "https://fakestoreapi.com/products";

export const fetchProducts = async (filters: Record<string, any>) => {
  const { data } = await axios.get(API_URL, { params: filters });
  return data;
};
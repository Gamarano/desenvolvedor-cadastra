import { Product } from "../Product";

const serverUrl = "http://localhost:5000";

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(`${serverUrl}/products`);
  return await response.json();
}

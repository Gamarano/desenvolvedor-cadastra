import { Product } from '../types/Product';
import { CONFIG } from '../config/constants';

export class ApiService {
  static async fetchProducts(): Promise<Product[]> {
    const response = await fetch(`${CONFIG.serverUrl}/products`);
    if (!response.ok) {
      throw new Error(`Erro ao buscar produtos: ${response.status}`);
    }
    return await response.json();
  }
}
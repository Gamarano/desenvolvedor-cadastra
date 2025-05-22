import { Product } from '../types/Product';

export interface FilterOptions {
  colors: string[];
  sizes: string[];
  prices: string[];
}

export class FilterManager {
  private allProducts: Product[] = [];
  private filteredProducts: Product[] = [];

  constructor(products: Product[]) {
    this.allProducts = products;
    this.filteredProducts = [...products];
  }

  getFilteredProducts(): Product[] {
    return [...this.filteredProducts];
  }

  applyFilters(): Product[] {
    const selectedColors = this.getSelectedValues('input[name="color"]:checked');
    const selectedSizes = this.getSelectedValues('input[name="size"]:checked');
    const selectedPrices = this.getSelectedValues('input[name="price"]:checked');

    this.filteredProducts = this.allProducts.filter((product) => {
      const colorMatch = selectedColors.length === 0 || selectedColors.includes(product.color);
      const sizeMatch = selectedSizes.length === 0 || selectedSizes.some((size) => product.size.includes(size));
      const priceMatch = selectedPrices.length === 0 || selectedPrices.some((priceRange) => this.checkPriceRange(product.price, priceRange));

      return colorMatch && sizeMatch && priceMatch;
    });

    return this.getFilteredProducts();
  }

  clearFilters(): void {
    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox: HTMLInputElement) => {
      checkbox.checked = false;
    });
    this.filteredProducts = [...this.allProducts];
  }

  private getSelectedValues(selector: string): string[] {
    return Array.from(document.querySelectorAll(selector)).map((input: HTMLInputElement) => input.value);
  }

  private checkPriceRange(price: number, priceRange: string): boolean {
    if (priceRange === "500") return price >= 500;
    if (priceRange === "1000") return price >= 1000;
    if (priceRange === "2000") return price >= 2000;
    
    const [min, max] = priceRange.split("-").map(Number);
    return price >= min && price <= max;
  }
}
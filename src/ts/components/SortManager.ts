import { Product } from '../types/Product';

export type SortOption = 'recent' | 'price-low' | 'price-high';

export class SortManager {
  static sortProducts(products: Product[], sortOption?: SortOption): Product[] {
    if (!sortOption) {
      const checkedInput = document.querySelector('input[name="sort"]:checked') as HTMLInputElement;
      sortOption = checkedInput?.value as SortOption;
    }

    return [...products].sort((a, b) => {
      switch (sortOption) {
        case 'recent':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        default:
          return 0;
      }
    });
  }

  static toggleSortOptions(): void {
    const sortOptions = document.getElementById("sort-options") as HTMLElement;
    if (sortOptions) {
      sortOptions.style.display = sortOptions.style.display === "block" ? "none" : "block";
    }
  }
}
import { Product } from "../Product";

export function applyColorFilter(
  products: Product[],
  color: string[]
): Product[] {
  return products.filter((product) => color.includes(product.color));
}

export function applySizeFilter(
  products: Product[],
  sizes: string[]
): Product[] {
  return products.filter((product) =>
    sizes.some((size) => product.size.includes(size))
  );
}

export function applyPriceFilter(
  products: Product[],
  priceRange: string[]
): Product[] {
  return products.filter((product) => {
    return priceRange.some((range) => {
      const [min, max] = range.split("-").map(Number);
      return product.price >= min && (!max || product.price <= max);
    });
  });
}

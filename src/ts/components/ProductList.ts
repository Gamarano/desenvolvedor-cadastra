import { Product } from "../Product";
import { renderProductCard } from "./ProductCard";

export function renderProductList(products: Product[], container: HTMLElement) {
  container.innerHTML = "";
  products.forEach((product) => {
    container.appendChild(renderProductCard(product));
  });
}

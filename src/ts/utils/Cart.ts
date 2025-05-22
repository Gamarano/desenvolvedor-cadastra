import { Product } from "../Product";

let cart: Product[] = [];

export function addToCart(product: Product) {
  cart.push(product);
  updateCartButton();
}

function updateCartButton() {
  const cartButton = document.querySelector(".botao-sacola");
  cartButton.innerHTML = `<img src="img/sacola.svg" alt="Sacola"> (${cart.length})`;
}

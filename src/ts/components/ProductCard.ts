import { Product } from "../Product";
import { addToCart } from "../utils/Cart";

export function renderProductCard(product: Product): HTMLElement {
  const card = document.createElement("div");
  card.classList.add("cardProduct");

  const img = document.createElement("img");
  img.src = product.image;
  img.alt = product.name;

  const name = document.createElement("h2");
  name.textContent = product.name;

  const price = document.createElement("p");
  price.textContent = `${product.price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })}`;

  const installment = document.createElement("span");
  installment.textContent = `até ${
    product.parcelamento[0]
  }x de ${product.parcelamento[1].toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })}`;

  const buyButton = document.createElement("button");
  buyButton.textContent = "Comprar";
  buyButton.addEventListener("click", () => addToCart(product));

  card.appendChild(img);
  card.appendChild(name);
  card.appendChild(price);
  card.appendChild(installment);
  card.appendChild(buyButton);

  return card;
}

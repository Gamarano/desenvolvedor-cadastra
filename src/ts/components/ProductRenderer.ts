import { Product } from '../types/Product';
import { CONFIG } from '../config/constants';
import { CartManager } from './CartManager';

export class ProductRenderer {
  private cartManager: CartManager;

  constructor(cartManager: CartManager) {
    this.cartManager = cartManager;
  }

  renderProducts(products: Product[], totalProducts: number): void {
    const renderProducts = document.querySelector(".listProducts__list ul") as HTMLElement;
    if (!renderProducts) return;

    renderProducts.innerHTML = "";

    products.forEach((product) => {
      const cardProduct = this.createProductCard(product);
      renderProducts.appendChild(cardProduct);
    });

    this.updateShowMoreButton(products.length, totalProducts);
  }

  private createProductCard(product: Product): HTMLLIElement {
    const cardProduct = document.createElement("li");
    cardProduct.classList.add("cardProduct");

    const productImage = this.createProductImage(product);
    const productName = this.createProductName(product);
    const priceContainer = this.createPriceContainer(product);
    const buyButton = this.createBuyButton(product);

    cardProduct.appendChild(productImage);
    cardProduct.appendChild(productName);
    cardProduct.appendChild(priceContainer);
    cardProduct.appendChild(buyButton);

    return cardProduct;
  }

  private createProductImage(product: Product): HTMLImageElement {
    const productImage = document.createElement("img");
    productImage.alt = product.name;
    productImage.src = product.image;
    return productImage;
  }

  private createProductName(product: Product): HTMLHeadingElement {
    const productName = document.createElement("h2");
    productName.textContent = product.name.toUpperCase();
    return productName;
  }

  private createPriceContainer(product: Product): HTMLDivElement {
    const priceContainer = document.createElement("div");

    const productPrice = document.createElement("p");
    productPrice.textContent = product.price.toLocaleString("pt-BR", CONFIG.moneyFormat);

    const productInstallment = document.createElement("span");
    productInstallment.textContent = `até ${product.parcelamento[0]}x de ${product.parcelamento[1].toLocaleString("pt-BR", CONFIG.moneyFormat)}`;

    priceContainer.appendChild(productPrice);
    priceContainer.appendChild(productInstallment);

    return priceContainer;
  }

  private createBuyButton(product: Product): HTMLButtonElement {
    const buyButton = document.createElement("button");
    buyButton.textContent = "COMPRAR";
    buyButton.onclick = (e) => {
      e.preventDefault();
      this.cartManager.addToCart(product);
    };
    return buyButton;
  }

  private updateShowMoreButton(currentCount: number, totalCount: number): void {
    const showMoreButton = document.querySelector(".showmore-button") as HTMLElement;
    if (showMoreButton) {
      showMoreButton.style.display = currentCount < totalCount ? "block" : "none";
    }
  }
}
import { Product } from '../types/Product';

export class CartManager {
  private cart: Product[] = [];

  addToCart(product: Product): void {
    this.cart.push(product);
    this.updateCartButton();
  }

  getCartCount(): number {
    return this.cart.length;
  }

  getCart(): Product[] {
    return [...this.cart];
  }

  updateCartButton(): void {
    const contador = document.querySelector(".contador") as HTMLElement;
    if (contador) {
      contador.textContent = this.cart.length.toString();
      contador.style.display = this.cart.length > 0 ? "flex" : "none";
    }
  }
}
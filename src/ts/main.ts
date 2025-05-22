import { Product } from './types/Product';
import { CONFIG } from './config/constants';
import { ApiService } from './services/ApiService';
import { CartManager } from './components/CartManager';
import { FilterManager } from './components/FilterManager';
import { SortManager } from './components/SortManager';
import { ProductRenderer } from './components/ProductRenderer';
import { UIManager } from './components/UIManager';

export class ProductApp {
  private cartManager: CartManager;
  private filterManager: FilterManager;
  private productRenderer: ProductRenderer;
  private uiManager: UIManager;
  private allProducts: Product[] = [];
  private currentDisplayCount = CONFIG.initialProductsToShow;

  constructor() {
    this.cartManager = new CartManager();
    this.productRenderer = new ProductRenderer(this.cartManager);
    this.uiManager = new UIManager();
  }

  async init(): Promise<void> {
    try {
      this.allProducts = await ApiService.fetchProducts();
      this.filterManager = new FilterManager(this.allProducts);
      
      this.setupEventListeners();
      this.renderProducts();
      this.cartManager.updateCartButton();
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
  }

  private setupEventListeners(): void {
    this.uiManager.setupMobileMenus();
    this.setupFilterEvents();
    this.setupSortEvents();
    this.setupShowMoreEvent();
    this.setupMobileFilterButtons();
  }

  private setupFilterEvents(): void {
    document.querySelectorAll('input[name="color"], input[name="size"], input[name="price"]')
      .forEach((input) => {
        input.addEventListener("change", () => this.applyFilters());
      });
  }

  private setupSortEvents(): void {
    const sortOptions = document.querySelectorAll('input[name="sort"]');
    const sortButton = document.getElementById("sort-button");

    sortOptions.forEach((option) => {
      option.addEventListener("change", () => {
        this.applySorting();
        if (window.innerWidth <= 800) {
          const mobileSortMenu = document.getElementById("mobile-sort-menu") as HTMLElement;
          mobileSortMenu.style.display = "none";
        }
      });
    });

    if (sortButton) {
      sortButton.addEventListener("click", SortManager.toggleSortOptions);
    }
  }

  private setupShowMoreEvent(): void {
    const showMoreButton = document.querySelector(".showmore-button") as HTMLElement;
    if (showMoreButton) {
      showMoreButton.addEventListener("click", () => {
        this.currentDisplayCount += CONFIG.productsPerLoad;
        this.renderProducts();
      });
    }
  }

  private setupMobileFilterButtons(): void {
    const applyButtonMobile = document.querySelector(".apply-button-mobile") as HTMLElement;
    const cleanButtonMobile = document.querySelector(".clean-button-mobile") as HTMLElement;

    if (applyButtonMobile) {
      applyButtonMobile.addEventListener("click", () => {
        const mobileFilterMenu = document.getElementById("mobile-filter-menu") as HTMLElement;
        mobileFilterMenu.style.display = "none";
        this.applyFilters();
      });
    }

    if (cleanButtonMobile) {
      cleanButtonMobile.addEventListener("click", () => {
        this.filterManager.clearFilters();
        this.currentDisplayCount = CONFIG.initialProductsToShow;
        this.renderProducts();
        this.uiManager.resetShowMoreButtons();
      });
    }
  }

  private applyFilters(): void {
    const filteredProducts = this.filterManager.applyFilters();
    this.applySorting(filteredProducts);
    this.currentDisplayCount = CONFIG.initialProductsToShow;
  }

  private applySorting(products?: Product[]): void {
    const productsToSort = products || this.filterManager.getFilteredProducts();
    const sortedProducts = SortManager.sortProducts(productsToSort);
    this.renderProducts(sortedProducts);
  }

  private renderProducts(products?: Product[]): void {
    const productsToRender = products || this.filterManager.getFilteredProducts();
    const displayProducts = productsToRender.slice(0, this.currentDisplayCount);
    
    this.productRenderer.renderProducts(displayProducts, productsToRender.length);
    
    if (this.currentDisplayCount >= productsToRender.length) {
      const showMoreButton = document.querySelector(".showmore-button") as HTMLElement;
      if (showMoreButton) {
        showMoreButton.style.display = "none";
      }
    }
  }
}


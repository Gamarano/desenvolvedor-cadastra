import { Product } from "./Product";

const serverUrl = "http://localhost:5000";
const moneyFormat = { style: "currency", currency: "BRL" };

let cart: Product[] = [];
let productsToShow: Product[] = [];
let allProducts: Product[] = [];

document.addEventListener("DOMContentLoaded", async function () {
  try {
    allProducts = await fetchProducts();
    productsToShow = [...allProducts];
    renderFilteredProducts(productsToShow.slice(0, 9));

    setupEventListeners();
    updateCartButton();
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
  }
});

function setupEventListeners() {
  const filterToggle = document.getElementById("filter-toggle") as HTMLElement;
  const sortToggle = document.getElementById("sort-toggle") as HTMLElement;
  const mobileFilterMenu = document.getElementById(
    "mobile-filter-menu"
  ) as HTMLElement;
  const mobileSortMenu = document.getElementById(
    "mobile-sort-menu"
  ) as HTMLElement;
  const closeFilterMenu = document.getElementById(
    "close-filter-menu"
  ) as HTMLElement;
  const closeSortMenu = document.getElementById(
    "close-sort-menu"
  ) as HTMLElement;
  const applyButtonMobile = document.querySelector(
    ".apply-button-mobile"
  ) as HTMLElement;
  const cleanButtonMobile = document.querySelector(
    ".clean-button-mobile"
  ) as HTMLElement;
  const sortOptions = document.querySelectorAll('input[name="sort"]');
  const sortButton = document.getElementById("sort-button") as HTMLElement;

  setupShowMoreButtons();
  setupMobileFilterAccordions();

  if (sortToggle) {
    sortToggle.addEventListener("click", function () {
      mobileSortMenu.style.display =
        mobileSortMenu.style.display === "block" ? "none" : "block";
    });
  }

  if (filterToggle) {
    filterToggle.addEventListener("click", function () {
      mobileFilterMenu.style.display =
        mobileFilterMenu.style.display === "block" ? "none" : "block";
    });
  }

  if (closeSortMenu) {
    closeSortMenu.addEventListener("click", function () {
      mobileSortMenu.style.display = "none";
    });
  }

  if (closeFilterMenu) {
    closeFilterMenu.addEventListener("click", function () {
      mobileFilterMenu.style.display = "none";
    });
  }

  if (applyButtonMobile) {
    applyButtonMobile.addEventListener("click", function () {
      mobileFilterMenu.style.display = "none";
      applyFilters();
    });
  }

  if (cleanButtonMobile) {
    cleanButtonMobile.addEventListener("click", function () {
      document
        .querySelectorAll('input[type="checkbox"]')
        .forEach((checkbox: HTMLInputElement) => {
          checkbox.checked = false;
        });
      productsToShow = [...allProducts];
      renderFilteredProducts(productsToShow.slice(0, 9));
      showLoadMoreButton();

      resetShowMoreButtons();
    });
  }

  sortOptions.forEach((option) => {
    option.addEventListener("change", function () {
      applySorting();
      if (window.innerWidth <= 800) {
        mobileSortMenu.style.display = "none";
      }
    });
  });

  document
    .querySelectorAll(
      'input[name="color"], input[name="size"], input[name="price"]'
    )
    .forEach((input) => {
      input.addEventListener("change", applyFilters);
    });

  if (sortButton) {
    sortButton.addEventListener("click", toggleSortOptions);
  }

  const showMoreButton = document.querySelector(
    ".showmore-button"
  ) as HTMLElement;
  if (showMoreButton) {
    showMoreButton.addEventListener("click", () => {
      let currentDisplayCount =
        document.querySelectorAll(".cardProduct").length;
      renderFilteredProducts(productsToShow.slice(0, currentDisplayCount + 5));
      if (currentDisplayCount + 5 >= productsToShow.length) {
        showMoreButton.style.display = "none";
      }
    });
  }
}

function setupMobileFilterAccordions() {
  const filterTitles = document.querySelectorAll(
    ".title-cor-mobile, .title-size-mobile, .title-price-mobile"
  );

  filterTitles.forEach((title) => {
    title.addEventListener("click", function () {
      const filterType = this.getAttribute("data-filter");
      const section = this.closest(`.filter-${filterType}-section`);

      const isExpanded = section.classList.contains("expanded");
      section.classList.toggle("expanded");
      this.classList.toggle("expanded");

      if (filterType === "size") {
        const sizesContainer = section.querySelector(".sizes-container");
        if (sizesContainer) {
          sizesContainer.classList.toggle("expanded");
        }
      }
    });
  });
}

function setupShowMoreButtons() {
  const showMoreColorsBtn = document.getElementById(
    "show-more-colors"
  ) as HTMLElement;
  const showMorePricesBtn = document.getElementById(
    "show-more-prices"
  ) as HTMLElement;

  const mobileShowMoreColorsBtn = document.getElementById(
    "mobile-show-more-colors"
  ) as HTMLElement;
  const mobileShowMorePricesBtn = document.getElementById(
    "mobile-show-more-prices"
  ) as HTMLElement;

  if (showMoreColorsBtn) {
    showMoreColorsBtn.addEventListener("click", function () {
      toggleShowMore("color", false);
    });
  }

  if (showMorePricesBtn) {
    showMorePricesBtn.addEventListener("click", function () {
      toggleShowMore("price", false);
    });
  }

  if (mobileShowMoreColorsBtn) {
    mobileShowMoreColorsBtn.addEventListener("click", function () {
      toggleShowMore("color", true);
    });
  }

  if (mobileShowMorePricesBtn) {
    mobileShowMorePricesBtn.addEventListener("click", function () {
      toggleShowMore("price", true);
    });
  }
}

function toggleShowMore(type: "color" | "price", isMobile: boolean) {
  const prefix = isMobile ? "mobile-" : "";
  const containerSelector = isMobile
    ? `.filter-${type}-section .${type}-options-container`
    : `.filter-${type} .${type}-options-container`;

  const container = document.querySelector(containerSelector) as HTMLElement;
  const buttonId = `${prefix}show-more-${type}s`;
  const button = document.getElementById(buttonId) as HTMLElement;

  if (container && button) {
    const isExpanded = container.classList.contains("expanded");

    if (isExpanded) {
      container.classList.remove("expanded");
      button.textContent =
        type === "color" ? "Ver todas as cores" : "Ver todas as faixas";
      button.classList.remove("expanded");
    } else {
      container.classList.add("expanded");
      button.textContent =
        type === "color" ? "Ver menos cores" : "Ver menos faixas";
      button.classList.add("expanded");
    }
  }
}

function resetShowMoreButtons() {
  document
    .querySelectorAll(".color-options-container, .price-options-container")
    .forEach((container) => {
      container.classList.remove("expanded");
    });

  const showMoreColorsBtn = document.getElementById(
    "show-more-colors"
  ) as HTMLElement;
  const showMorePricesBtn = document.getElementById(
    "show-more-prices"
  ) as HTMLElement;

  if (showMoreColorsBtn) {
    showMoreColorsBtn.textContent = "Ver todas as cores";
    showMoreColorsBtn.classList.remove("expanded");
  }

  if (showMorePricesBtn) {
    showMorePricesBtn.textContent = "Ver todas as faixas";
    showMorePricesBtn.classList.remove("expanded");
  }

  const mobileShowMoreColorsBtn = document.getElementById(
    "mobile-show-more-colors"
  ) as HTMLElement;
  const mobileShowMorePricesBtn = document.getElementById(
    "mobile-show-more-prices"
  ) as HTMLElement;

  if (mobileShowMoreColorsBtn) {
    mobileShowMoreColorsBtn.textContent = "Ver todas as cores";
    mobileShowMoreColorsBtn.classList.remove("expanded");
  }

  if (mobileShowMorePricesBtn) {
    mobileShowMorePricesBtn.textContent = "Ver todas as faixas";
    mobileShowMorePricesBtn.classList.remove("expanded");
  }
}

async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(`${serverUrl}/products`);
  if (!response.ok) {
    throw new Error(`Erro ao buscar produtos: ${response.status}`);
  }
  return await response.json();
}

function addToCart(product: Product) {
  cart.push(product);
  updateCartButton();
}

function updateCartButton() {
  const contador = document.querySelector(".contador") as HTMLElement;
  if (contador) {
    contador.textContent = cart.length.toString();
    contador.style.display = cart.length > 0 ? "flex" : "none";
  }
}

function renderFilteredProducts(products: Product[]) {
  const renderProducts = document.querySelector(
    ".listProducts__list ul"
  ) as HTMLElement;
  if (!renderProducts) {
    return;
  }

  renderProducts.innerHTML = "";

  products.forEach((product) => {
    const cardProduct = document.createElement("li");
    cardProduct.classList.add("cardProduct");

    const productImage = document.createElement("img");   

    productImage.alt = product.name; 
    productImage.src = product.image;

    const productName = document.createElement("h2");
    productName.textContent = product.name.toUpperCase();

    const priceContainer = document.createElement("div");

    const productPrice = document.createElement("p");
    productPrice.textContent = product.price.toLocaleString(
      "pt-BR",
      moneyFormat
    );

    const productInstallment = document.createElement("span");
    productInstallment.textContent = `até ${
      product.parcelamento[0]
    }x de ${product.parcelamento[1].toLocaleString("pt-BR", moneyFormat)}`;

    priceContainer.appendChild(productPrice);
    priceContainer.appendChild(productInstallment);

    const buyButton = document.createElement("button");
    buyButton.textContent = "COMPRAR";
    buyButton.onclick = (e) => {
      e.preventDefault();
      addToCart(product);
    };

    cardProduct.appendChild(productImage);
    cardProduct.appendChild(productName);
    cardProduct.appendChild(priceContainer);
    cardProduct.appendChild(buyButton);

    renderProducts.appendChild(cardProduct);
  });

  const showMoreButton = document.querySelector(
    ".showmore-button"
  ) as HTMLElement;
  if (showMoreButton) {
    showMoreButton.style.display =
      products.length < productsToShow.length ? "block" : "none";
  }
}

function applyFilters() {
  const selectedColors = Array.from(
    document.querySelectorAll('input[name="color"]:checked')
  ).map((input: HTMLInputElement) => input.value);
  const selectedSizes = Array.from(
    document.querySelectorAll('input[name="size"]:checked')
  ).map((input: HTMLInputElement) => input.value);
  const selectedPrices = Array.from(
    document.querySelectorAll('input[name="price"]:checked')
  ).map((input: HTMLInputElement) => input.value);

  let filteredProducts = allProducts.filter((product) => {
    const colorMatch =
      selectedColors.length === 0 || selectedColors.includes(product.color);

    const sizeMatch =
      selectedSizes.length === 0 ||
      selectedSizes.some((size) => product.size.includes(size));

    const priceMatch =
      selectedPrices.length === 0 ||
      selectedPrices.some((priceRange) => {
        if (priceRange === "500") {
          return product.price >= 500;
        }
        if (priceRange === "1000") {
          return product.price >= 1000;
        }
        if (priceRange === "2000") {
          return product.price >= 2000;
        }
        const [min, max] = priceRange.split("-").map(Number);
        return product.price >= min && product.price <= max;
      });

    return colorMatch && sizeMatch && priceMatch;
  });

  productsToShow = filteredProducts;
  applySorting(filteredProducts);
  showLoadMoreButton();
}

function applySorting(products: Product[] = productsToShow) {
  const sortOption = (
    document.querySelector('input[name="sort"]:checked') as HTMLInputElement
  )?.value;

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortOption) {
      case "recent":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      default:
        return 0;
    }
  });

  productsToShow = sortedProducts;
  renderFilteredProducts(sortedProducts.slice(0, 9));
}

function toggleSortOptions() {
  const sortOptions = document.getElementById("sort-options") as HTMLElement;
  if (sortOptions) {
    sortOptions.style.display =
      sortOptions.style.display === "block" ? "none" : "block";
  }
}

function showLoadMoreButton() {
  const showMoreButton = document.querySelector(
    ".showmore-button"
  ) as HTMLElement;
  if (showMoreButton) {
    showMoreButton.style.display = productsToShow.length > 9 ? "block" : "none";
  }
}
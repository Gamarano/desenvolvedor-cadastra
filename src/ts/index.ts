import { Product } from "./Product";

const serverUrl = "http://localhost:5000";
const moneyFormat = { style: "currency", currency: "BRL" };

let cart: Product[] = [];
let productsToShow: Product[] = [];

document.addEventListener("DOMContentLoaded", async function () {
  productsToShow = await fetchProducts();
  renderFilteredProducts(productsToShow.slice(0, 9)); 

  const filterToggle = document.getElementById('filter-toggle') as HTMLElement;
  const sortToggle = document.getElementById('sort-toggle') as HTMLElement;
  const mobileFilterMenu = document.getElementById('mobile-filter-menu') as HTMLElement;
  const mobileSortMenu = document.getElementById('mobile-sort-menu') as HTMLElement;
  const closeFilterMenu = document.getElementById('close-filter-menu') as HTMLElement;
  const closeSortMenu = document.getElementById('close-sort-menu') as HTMLElement;
  const applyButtonMobile = document.querySelector('.apply-button-mobile') as HTMLElement;
  const cleanButtonMobile = document.querySelector('.clean-button-mobile') as HTMLElement;
  const sortOptions = document.querySelectorAll('input[name="sort"]');

  sortToggle.addEventListener('click', function () {
    mobileSortMenu.style.display = mobileSortMenu.style.display === 'block' ? 'none' : 'block';
  });

  filterToggle.addEventListener('click', function () {
    mobileFilterMenu.style.display = mobileFilterMenu.style.display === 'block' ? 'none' : 'block';
  });

  closeSortMenu.addEventListener('click', function () {
    mobileSortMenu.style.display = 'none';
  });

  closeFilterMenu.addEventListener('click', function () {
    mobileFilterMenu.style.display = 'none';
  });

  applyButtonMobile.addEventListener('click', function () {
    mobileFilterMenu.style.display = 'none'; 
    applyFilters();
  });

  cleanButtonMobile.addEventListener('click', function () {
    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox: HTMLInputElement) => {
      checkbox.checked = false;
    });
    applyFilters(); 
  });

  sortOptions.forEach(option => {
    option.addEventListener('change', function () {
      applySorting(); 
      if (window.innerWidth <= 800) {
        mobileSortMenu.style.display = 'none'; 
      }
    });
  });

  document.querySelectorAll('input[name="color"], input[name="size"], input[name="price"]').forEach(input => {
    input.addEventListener('change', applyFilters);
  });

  document.querySelector(".showmore-button").addEventListener("click", () => {
    let currentDisplayCount = document.querySelectorAll('.cardProduct').length;
    renderFilteredProducts(productsToShow.slice(0, currentDisplayCount + 5));
    if (currentDisplayCount + 5 >= productsToShow.length) {
      document.querySelector(".showmore-button").style.display = "none";
    }
  });
});

async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(`${serverUrl}/products`);
  return await response.json();
}

function addToCart(product: Product) {
  cart.push(product);
  updateCartButton();
}

function updateCartButton() {
  const cartButton = document.querySelector('.botao-sacola') as HTMLElement;
  let contador = cartButton.querySelector('.contador') as HTMLElement;

  if (!contador) {
    contador = document.createElement('span');
    contador.classList.add('contador');
    cartButton.appendChild(contador); 
  }

  contador.textContent = cart.length.toString(); 
}

function renderFilteredProducts(products: Product[]) {
  const renderProducts = document.querySelector(".listProducts__list ul") as HTMLElement;
  renderProducts.innerHTML = "";
  products.forEach(product => {
    const cardProduct = document.createElement("div");
    cardProduct.classList.add("cardProduct");

    const productImage = document.createElement("img");
    productImage.src = product.image;
    productImage.alt = product.name;

    const productName = document.createElement("h2");
    productName.textContent = product.name;

    const productPrice = document.createElement("p");
    productPrice.textContent = product.price.toLocaleString("pt-BR", moneyFormat);

    const productInstallment = document.createElement("span");
    productInstallment.textContent = `até ${product.parcelamento[0]}x de ${product.parcelamento[1].toLocaleString("pt-BR", moneyFormat)}`;

    const buyButton = document.createElement("button");
    buyButton.textContent = "comprar";
    buyButton.onclick = () => addToCart(product);

    cardProduct.appendChild(productImage);
    cardProduct.appendChild(productName);
    cardProduct.appendChild(productPrice);
    cardProduct.appendChild(productInstallment);
    cardProduct.appendChild(buyButton);

    renderProducts.appendChild(cardProduct);
  });
}

function applyFilters() {
  let filteredProducts = productsToShow.filter(product => {
    const selectedColors = Array.from(document.querySelectorAll('input[name="color"]:checked')).map(input => input.value);
    const selectedSizes = Array.from(document.querySelectorAll('input[name="size"]:checked')).map(input => input.value);
    const selectedPrices = Array.from(document.querySelectorAll('input[name="price"]:checked')).map(input => input.value);

    return (selectedColors.length === 0 || selectedColors.includes(product.color)) &&
      (selectedSizes.length === 0 || selectedSizes.some(size => product.size.includes(size))) &&
      (selectedPrices.length === 0 || selectedPrices.some(price => {
        const [min, max] = price.split("-").map(Number);
        return product.price >= min && (max === undefined || product.price <= max);
      }));
  });
  applySorting(filteredProducts);
}

function applySorting(products: Product[] = productsToShow) {
  const sortOption = document.querySelector('input[name="sort"]:checked')?.value;
  products.sort((a, b) => {
    if (sortOption === "recent") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortOption === "price-low") {
      return a.price - b.price;
    } else if (sortOption === "price-high") {
      return b.price - a.price;
    }
    return 0;
  });
  renderFilteredProducts(products);
}

function toggleSortOptions() {
  const sortOptions = document.getElementById("sort-options");
  sortOptions.style.display = sortOptions.style.display === 'none' ? 'block' : 'none';
}

function toggleFilterOptions() {
  const filterOptions = document.getElementById("filter-options");
  filterOptions.style.display = filterOptions.style.display === 'none' ? 'block' : 'none';
}

async function main() {
  productsToShow = await fetchProducts();
  renderFilteredProducts(productsToShow.slice(0, 9)); 

  document.querySelectorAll('input[name="color"], input[name="size"], input[name="price"]').forEach(input => {
    input.addEventListener('change', applyFilters);
  });

  document.getElementById("sort-button").addEventListener("click", toggleSortOptions);
  document.getElementById("filter-button").addEventListener("click", toggleFilterOptions);

  function closeSortMenu() {
    const sortMenu = document.getElementById('mobile-sort-menu');
    if (sortMenu) {
      sortMenu.style.display = 'none';  
    }
  }

  function closeFilterMenu() {
    const filterMenu = document.getElementById('mobile-filter-menu');
    if (filterMenu) {
      filterMenu.style.display = 'none';  
    }
  }

  document.querySelectorAll('input[name="sort"]').forEach(radio => {
    radio.addEventListener('change', () => applyFilters());
    if (window.innerWidth <= 800) {  
      applyFilters();             
      closeSortMenu();            
      closeFilterMenu();
    }
  });

  document.querySelector(".showmore-button").addEventListener("click", () => {
    let currentDisplayCount = document.querySelectorAll('.cardProduct').length;
    renderFilteredProducts(productsToShow.slice(0, currentDisplayCount + 5));
    if (currentDisplayCount + 5 >= productsToShow.length) {
      document.querySelector(".showmore-button").style.display = "none";
    }
  });
}

document.addEventListener("DOMContentLoaded", main);
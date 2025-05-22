import { Product } from "./Product";

const serverUrl = "http://localhost:5000";
const moneyFormat = { style: "currency", currency: "BRL" };

let cart: Product[] = [];
let productsToShow: Product[] = [];
let allProducts: Product[] = [];

document.addEventListener("DOMContentLoaded", async function () {
  try {
    allProducts = await fetchProducts();
    productsToShow = [...allProducts]; // Cópia do array original
    renderFilteredProducts(productsToShow.slice(0, 9)); 
    
    setupEventListeners();
    updateCartButton(); // Inicializa o contador da sacola
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
  }
});

function setupEventListeners() {
  const filterToggle = document.getElementById('filter-toggle') as HTMLElement;
  const sortToggle = document.getElementById('sort-toggle') as HTMLElement;
  const mobileFilterMenu = document.getElementById('mobile-filter-menu') as HTMLElement;
  const mobileSortMenu = document.getElementById('mobile-sort-menu') as HTMLElement;
  const closeFilterMenu = document.getElementById('close-filter-menu') as HTMLElement;
  const closeSortMenu = document.getElementById('close-sort-menu') as HTMLElement;
  const applyButtonMobile = document.querySelector('.apply-button-mobile') as HTMLElement;
  const cleanButtonMobile = document.querySelector('.clean-button-mobile') as HTMLElement;
  const sortOptions = document.querySelectorAll('input[name="sort"]');
  const sortButton = document.getElementById("sort-button") as HTMLElement;

  // Event listeners para mobile
  if (sortToggle) {
    sortToggle.addEventListener('click', function () {
      mobileSortMenu.style.display = mobileSortMenu.style.display === 'block' ? 'none' : 'block';
    });
  }

  if (filterToggle) {
    filterToggle.addEventListener('click', function () {
      mobileFilterMenu.style.display = mobileFilterMenu.style.display === 'block' ? 'none' : 'block';
    });
  }

  if (closeSortMenu) {
    closeSortMenu.addEventListener('click', function () {
      mobileSortMenu.style.display = 'none';
    });
  }

  if (closeFilterMenu) {
    closeFilterMenu.addEventListener('click', function () {
      mobileFilterMenu.style.display = 'none';
    });
  }

  if (applyButtonMobile) {
    applyButtonMobile.addEventListener('click', function () {
      mobileFilterMenu.style.display = 'none'; 
      applyFilters();
    });
  }

  if (cleanButtonMobile) {
    cleanButtonMobile.addEventListener('click', function () {
      document.querySelectorAll('input[type="checkbox"]').forEach((checkbox: HTMLInputElement) => {
        checkbox.checked = false;
      });
      productsToShow = [...allProducts]; // Reset para todos os produtos
      renderFilteredProducts(productsToShow.slice(0, 9));
      showLoadMoreButton();
    });
  }

  // Event listeners para ordenação
  sortOptions.forEach(option => {
    option.addEventListener('change', function () {
      applySorting(); 
      if (window.innerWidth <= 800) {
        mobileSortMenu.style.display = 'none'; 
      }
    });
  });

  // Event listeners para filtros
  document.querySelectorAll('input[name="color"], input[name="size"], input[name="price"]').forEach(input => {
    input.addEventListener('change', applyFilters);
  });

  // Event listener para dropdown de ordenação desktop
  if (sortButton) {
    sortButton.addEventListener("click", toggleSortOptions);
  }

  // Event listener para botão "Carregar mais"
  const showMoreButton = document.querySelector(".showmore-button") as HTMLElement;
  if (showMoreButton) {
    showMoreButton.addEventListener("click", () => {
      let currentDisplayCount = document.querySelectorAll('.cardProduct').length;
      renderFilteredProducts(productsToShow.slice(0, currentDisplayCount + 5));
      if (currentDisplayCount + 5 >= productsToShow.length) {
        showMoreButton.style.display = "none";
      }
    });
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
  console.log("Produto adicionado ao carrinho:", product.name);
}

function updateCartButton() {
  const contador = document.querySelector('.contador') as HTMLElement;
  if (contador) {
    contador.textContent = cart.length.toString();
    contador.style.display = cart.length > 0 ? 'flex' : 'none';
  }
}

function renderFilteredProducts(products: Product[]) {
  const renderProducts = document.querySelector(".listProducts__list ul") as HTMLElement;
  if (!renderProducts) {
    console.error("Container de produtos não encontrado");
    return;
  }

  renderProducts.innerHTML = "";
  
  products.forEach(product => {
    const cardProduct = document.createElement("li"); // Usar li dentro de ul
    cardProduct.classList.add("cardProduct");

    const productImage = document.createElement("img");
    productImage.classList.add('loading');
    
    // Construir o caminho correto da imagem
    let imagePath = product.image;
    
    // Verificar diferentes possibilidades de caminho
    if (!imagePath.startsWith('img/') && !imagePath.startsWith('./img/') && !imagePath.startsWith('/img/')) {
      imagePath = `img/${imagePath}`;
    }
    
    productImage.alt = product.name;
    
    // Log para debug - verificar o que está vindo da API
    console.log(`Produto: ${product.name}`);
    console.log(`Caminho original da imagem: "${product.image}"`);
    console.log(`Caminho final da imagem: "${imagePath}"`);
    
    productImage.onload = function() {
      console.log(`✅ Imagem carregada com sucesso: ${imagePath}`);
      productImage.classList.remove('loading');
      productImage.classList.add('loaded');
    };
    
    productImage.onerror = function() {
      console.error(`❌ Erro ao carregar imagem: ${imagePath}`);
      console.log(`Verifique se o arquivo existe em: ${window.location.origin}/${imagePath}`);
      productImage.classList.remove('loading');
      productImage.classList.add('error');
      productImage.style.height = '200px';
      productImage.style.backgroundColor = '#f8f8f8';
      productImage.style.border = '1px dashed #ccc';
    };
    
    // Definir o src por último para evitar piscar
    productImage.src = imagePath;

    const productName = document.createElement("h2");
    productName.textContent = product.name.toUpperCase();

    const priceContainer = document.createElement("div");
    
    const productPrice = document.createElement("p");
    productPrice.textContent = product.price.toLocaleString("pt-BR", moneyFormat);

    const productInstallment = document.createElement("span");
    productInstallment.textContent = `até ${product.parcelamento[0]}x de ${product.parcelamento[1].toLocaleString("pt-BR", moneyFormat)}`;

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

  // Mostrar/esconder botão "Carregar mais"
  const showMoreButton = document.querySelector(".showmore-button") as HTMLElement;
  if (showMoreButton) {
    showMoreButton.style.display = products.length < productsToShow.length ? "block" : "none";
  }
}

function applyFilters() {
  const selectedColors = Array.from(document.querySelectorAll('input[name="color"]:checked'))
    .map((input: HTMLInputElement) => input.value);
  const selectedSizes = Array.from(document.querySelectorAll('input[name="size"]:checked'))
    .map((input: HTMLInputElement) => input.value);
  const selectedPrices = Array.from(document.querySelectorAll('input[name="price"]:checked'))
    .map((input: HTMLInputElement) => input.value);

  let filteredProducts = allProducts.filter(product => {
    // Filtro por cor
    const colorMatch = selectedColors.length === 0 || selectedColors.includes(product.color);
    
    // Filtro por tamanho
    const sizeMatch = selectedSizes.length === 0 || selectedSizes.some(size => product.size.includes(size));
    
    // Filtro por preço
    const priceMatch = selectedPrices.length === 0 || selectedPrices.some(priceRange => {
      if (priceRange === "500") {
        return product.price >= 500;
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
  const sortOption = (document.querySelector('input[name="sort"]:checked') as HTMLInputElement)?.value;
  
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
    sortOptions.style.display = sortOptions.style.display === 'block' ? 'none' : 'block';
  }
}

function showLoadMoreButton() {
  const showMoreButton = document.querySelector(".showmore-button") as HTMLElement;
  if (showMoreButton) {
    showMoreButton.style.display = productsToShow.length > 9 ? "block" : "none";
  }
}
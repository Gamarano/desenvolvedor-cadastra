const isMobile = window.innerWidth <= 768;

export const CONFIG = {
  serverUrl: "http://localhost:5000",
  moneyFormat: { style: "currency", currency: "BRL" } as const,
  initialProductsToShow: isMobile ? 4 : 9,
  productsPerLoad: isMobile ? 4 : 6
};
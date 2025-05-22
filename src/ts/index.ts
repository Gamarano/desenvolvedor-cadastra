import { ProductApp } from './main';

document.addEventListener("DOMContentLoaded", async () => {
  const app = new ProductApp();
  await app.init();
});
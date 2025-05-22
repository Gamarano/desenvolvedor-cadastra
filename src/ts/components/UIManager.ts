export class UIManager {
  setupMobileMenus(): void {
    this.setupFilterToggle();
    this.setupSortToggle();
    this.setupMobileFilterAccordions();
    this.setupShowMoreButtons();
  }

  private setupFilterToggle(): void {
    const filterToggle = document.getElementById("filter-toggle") as HTMLElement;
    const mobileFilterMenu = document.getElementById("mobile-filter-menu") as HTMLElement;
    const closeFilterMenu = document.getElementById("close-filter-menu") as HTMLElement;

    if (filterToggle) {
      filterToggle.addEventListener("click", () => {
        mobileFilterMenu.style.display = mobileFilterMenu.style.display === "block" ? "none" : "block";
      });
    }

    if (closeFilterMenu) {
      closeFilterMenu.addEventListener("click", () => {
        mobileFilterMenu.style.display = "none";
      });
    }
  }

  private setupSortToggle(): void {
    const sortToggle = document.getElementById("sort-toggle") as HTMLElement;
    const mobileSortMenu = document.getElementById("mobile-sort-menu") as HTMLElement;
    const closeSortMenu = document.getElementById("close-sort-menu") as HTMLElement;

    if (sortToggle) {
      sortToggle.addEventListener("click", () => {
        mobileSortMenu.style.display = mobileSortMenu.style.display === "block" ? "none" : "block";
      });
    }

    if (closeSortMenu) {
      closeSortMenu.addEventListener("click", () => {
        mobileSortMenu.style.display = "none";
      });
    }
  }

  setupMobileFilterAccordions(): void {
    const filterTitles = document.querySelectorAll(".title-cor-mobile, .title-size-mobile, .title-price-mobile");

    filterTitles.forEach((title) => {
      title.addEventListener("click", function () {
        const filterType = this.getAttribute("data-filter");
        const section = this.closest(`.filter-${filterType}-section`);

        section?.classList.toggle("expanded");
        this.classList.toggle("expanded");

        if (filterType === "size") {
          const sizesContainer = section?.querySelector(".sizes-container");
          sizesContainer?.classList.toggle("expanded");
        }
      });
    });
  }

  setupShowMoreButtons(): void {
    const buttons = [
      { id: "show-more-colors", type: "color" as const, mobile: false },
      { id: "show-more-prices", type: "price" as const, mobile: false },
      { id: "mobile-show-more-colors", type: "color" as const, mobile: true },
      { id: "mobile-show-more-prices", type: "price" as const, mobile: true }
    ];

    buttons.forEach(({ id, type, mobile }) => {
      const button = document.getElementById(id);
      if (button) {
        button.addEventListener("click", () => this.toggleShowMore(type, mobile));
      }
    });
  }

  private toggleShowMore(type: "color" | "price", isMobile: boolean): void {
    const prefix = isMobile ? "mobile-" : "";
    const containerSelector = isMobile
      ? `.filter-${type}-section .${type}-options-container`
      : `.filter-${type} .${type}-options-container`;

    const container = document.querySelector(containerSelector) as HTMLElement;
    const buttonId = `${prefix}show-more-${type}s`;
    const button = document.getElementById(buttonId) as HTMLElement;

    if (container && button) {
      const isExpanded = container.classList.contains("expanded");
      const texts = {
        color: { show: "Ver todas as cores", hide: "Ver menos cores" },
        price: { show: "Ver todas as faixas", hide: "Ver menos faixas" }
      };

      if (isExpanded) {
        container.classList.remove("expanded");
        button.textContent = texts[type].show;
        button.classList.remove("expanded");
      } else {
        container.classList.add("expanded");
        button.textContent = texts[type].hide;
        button.classList.add("expanded");
      }
    }
  }

  resetShowMoreButtons(): void {
    document.querySelectorAll(".color-options-container, .price-options-container").forEach((container) => {
      container.classList.remove("expanded");
    });

    const buttons = [
      { id: "show-more-colors", text: "Ver todas as cores" },
      { id: "show-more-prices", text: "Ver todas as faixas" },
      { id: "mobile-show-more-colors", text: "Ver todas as cores" },
      { id: "mobile-show-more-prices", text: "Ver todas as faixas" }
    ];

    buttons.forEach(({ id, text }) => {
      const button = document.getElementById(id) as HTMLElement;
      if (button) {
        button.textContent = text;
        button.classList.remove("expanded");
      }
    });
  }
}
(function () {
  const app = window.SMAJStore;
  if (!app) return;

  function setSessionState() {
    const chip = document.getElementById("storeSessionChip");
    const banner = document.getElementById("storeSessionMessage");
    const session = app.getSession();

    if (chip) {
      chip.textContent = session.connected
        ? `Connected: ${app.shortenWallet(session.walletAddress)}`
        : "Not Connected";
    }

    if (banner) {
      banner.textContent = session.connected
        ? `Connected through SMAJ PI HUB as ${session.username}. No second login is required to use SMAJ STORE.`
        : "No active SMAJ PI HUB wallet session detected. The frontend still works, but checkout should be connected through the hub.";
    }
  }

  function productCard(product) {
    return `
      <article class="product-card">
        <img src="${product.image}" alt="${product.name}">
        <div class="product-card-body">
          <div class="product-badges">
            <span class="badge category">${product.category}</span>
            ${product.verified ? "<span class='badge verified'><i class='bx bx-check-shield'></i>Verified Seller</span>" : ""}
          </div>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="product-price">${app.formatPi(product.pricePi)}</div>
          <div class="product-actions">
            <a class="store-btn secondary" href="./product.html?id=${product.id}">View Product</a>
            <button class="store-btn primary" type="button" data-add-to-cart="${product.id}">Add To Cart</button>
          </div>
        </div>
      </article>
    `;
  }

  function renderCategories() {
    const grid = document.getElementById("featuredCategoryGrid");
    if (!grid) return;
    grid.innerHTML = app.categories.map((category) => `
      <article>
        <h3>${category}</h3>
        <p>Browse ${category.toLowerCase()} listings connected to SMAJ STORE.</p>
        <a class="store-btn secondary" href="./category.html?category=${encodeURIComponent(category)}">Open Category</a>
      </article>
    `).join("");
  }

  function renderFeaturedProducts() {
    const grid = document.getElementById("featuredProductsGrid");
    if (!grid) return;
    grid.innerHTML = app.products.slice(0, 4).map(productCard).join("");
  }

  function renderCategoryPage() {
    const grid = document.getElementById("categoryProductsGrid");
    if (!grid) return;
    const url = new URL(window.location.href);
    const activeCategory = url.searchParams.get("category") || "All";
    const filterWrap = document.getElementById("storeCategoryFilters");

    if (filterWrap) {
      filterWrap.innerHTML = ["All"].concat(app.categories).map((category) => `
        <button type="button" class="filter-chip ${category === activeCategory ? "active" : ""}" data-category-filter="${category}">${category}</button>
      `).join("");

      filterWrap.querySelectorAll("[data-category-filter]").forEach((button) => {
        button.addEventListener("click", () => {
          const nextUrl = new URL(window.location.href);
          const target = button.dataset.categoryFilter;
          if (target === "All") nextUrl.searchParams.delete("category");
          else nextUrl.searchParams.set("category", target);
          window.location.href = nextUrl.toString();
        });
      });
    }

    const render = (searchText = "") => {
      const query = String(searchText).trim().toLowerCase();
      const products = app.products.filter((product) => {
        const categoryOk = activeCategory === "All" || product.category === activeCategory;
        const searchOk = !query || `${product.name} ${product.description}`.toLowerCase().includes(query);
        return categoryOk && searchOk;
      });

      grid.innerHTML = products.length
        ? products.map(productCard).join("")
        : `<article class="empty-card"><h3>No products found</h3><p>Try another search term or category.</p></article>`;
    };

    const searchInput = document.getElementById("storeSearchInput");
    if (searchInput) searchInput.addEventListener("input", () => render(searchInput.value));
    render();
  }

  function renderProductPage() {
    const wrap = document.getElementById("productDetailWrap");
    if (!wrap) return;
    const product = app.getCurrentProduct();

    wrap.innerHTML = `
      <article class="product-detail-card">
        <img class="product-gallery" src="${product.image}" alt="${product.name}">
      </article>
      <div class="product-copy">
        <div class="product-badges">
          <span class="badge category">${product.category}</span>
          ${product.verified ? "<span class='badge verified'><i class='bx bx-check-shield'></i>Verified Seller</span>" : ""}
        </div>
        <h1>${product.name}</h1>
        <div class="product-price">${app.formatPi(product.pricePi)}</div>
        <p>${product.description}</p>
        <div class="product-meta">
          <span class="badge category">Stock: ${product.stock}</span>
          <span class="badge category">Seller: ${product.seller}</span>
        </div>
        <div class="product-actions">
          <button class="store-btn primary" type="button" data-add-to-cart="${product.id}">Add To Cart</button>
          <a class="store-btn secondary" href="./cart.html">Go To Cart</a>
        </div>
        <article class="seller-card">
          <h3>Seller</h3>
          <p>${product.seller} is listed as a verified ecosystem seller with trust-first marketplace standards.</p>
        </article>
      </div>
    `;
  }

  function renderOrdersPage() {
    const wrap = document.getElementById("ordersList");
    if (!wrap) return;
    const orders = app.getOrders();
    wrap.innerHTML = orders.length
      ? orders.map((order) => `
          <article class="order-card">
            <div class="status-row">
              <span class="status-pill ${order.statusClass}">${order.status}</span>
              <span class="status-pill processing">${order.id}</span>
            </div>
            <h3>${order.items.length} item(s) ordered</h3>
            <p>Placed on ${order.date}. Total: ${app.formatPi(order.totalPi)}</p>
          </article>
        `).join("")
      : `<article class="empty-card"><h3>No orders yet</h3><p>Orders placed through SMAJ STORE will appear here.</p></article>`;
  }

  function bindAddToCartButtons() {
    document.querySelectorAll("[data-add-to-cart]").forEach((button) => {
      button.addEventListener("click", () => {
        app.addToCart(button.dataset.addToCart, 1);
        app.updateCartCount();
      });
    });
  }

  setSessionState();
  renderCategories();
  renderFeaturedProducts();
  renderCategoryPage();
  renderProductPage();
  renderOrdersPage();
  bindAddToCartButtons();
  app.updateCartCount();
})();

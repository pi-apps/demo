(function () {
  const STORE_PRODUCTS = [
    { id: "store-1", name: "SMAJ Smart Watch", category: "Electronics", pricePi: 42, stock: 18, seller: "Verified Hub Gadgets", verified: true, description: "Compact smartwatch with health tracking, notifications, and battery-efficient design.", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80" },
    { id: "store-2", name: "Pi Traveler Backpack", category: "Fashion", pricePi: 18, stock: 34, seller: "Urban Carry Co.", verified: true, description: "Water-resistant backpack built for daily commuting, travel, and lightweight storage.", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80" },
    { id: "store-3", name: "Organic Honey Pack", category: "Agro", pricePi: 12, stock: 44, seller: "SMAJ Agro Supply", verified: true, description: "Farm-sourced honey pack prepared for direct-to-buyer ecosystem delivery.", image: "https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=900&q=80" },
    { id: "store-4", name: "Home Light Kit", category: "Home", pricePi: 23, stock: 12, seller: "Bright Living", verified: false, description: "Energy-saving smart light kit with a simple setup for living spaces.", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80" },
    { id: "store-5", name: "Wireless Earbuds", category: "Electronics", pricePi: 27, stock: 29, seller: "Verified Hub Gadgets", verified: true, description: "Noise-reduced wireless earbuds for work, study, and mobile use.", image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?auto=format&fit=crop&w=900&q=80" },
    { id: "store-6", name: "Desk Organizer Set", category: "Office", pricePi: 9, stock: 51, seller: "Focus Workspace", verified: false, description: "Minimal organizer kit for a cleaner desk setup and better daily workflow.", image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80" }
  ];

  const STORE_CATEGORIES = ["Electronics", "Fashion", "Agro", "Home", "Office"];
  const CART_KEY = "smaj_store_cart";
  const ORDERS_KEY = "smaj_store_orders";

  function getSession() {
    let username = "Pioneer";
    let walletAddress = localStorage.getItem("pi_wallet_address") || "";
    let connected = false;
    try {
      const raw = localStorage.getItem("pi_user");
      if (raw) {
        const user = JSON.parse(raw);
        username = user.username || username;
        walletAddress = walletAddress || user.walletAddress || user.wallet_address || user.address || "";
        connected = true;
      }
    } catch (_) {
      connected = !!walletAddress;
    }
    return { username, walletAddress, connected };
  }

  function shortenWallet(value) {
    const wallet = String(value || "");
    if (!wallet) return "Not Connected";
    if (wallet.length <= 12) return wallet;
    return `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;
  }

  function formatPi(value) {
    return `${Number(value).toFixed(2)} Pi`;
  }

  function getProductById(productId) {
    return STORE_PRODUCTS.find((product) => product.id === productId);
  }

  function getCurrentProduct() {
    const url = new URL(window.location.href);
    return getProductById(url.searchParams.get("id")) || STORE_PRODUCTS[0];
  }

  function getCartRaw() {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); } catch (_) { return []; }
  }

  function saveCartRaw(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }

  function addToCart(productId, quantity) {
    const items = getCartRaw();
    const existing = items.find((item) => item.productId === productId);
    if (existing) existing.quantity += quantity;
    else items.push({ productId, quantity });
    saveCartRaw(items);
    window.alert("Added to cart.");
  }

  function getCartItems() {
    return getCartRaw().map((entry) => {
      const product = getProductById(entry.productId);
      return product ? { ...product, quantity: entry.quantity } : null;
    }).filter(Boolean);
  }

  function updateCartCount() {
    const count = getCartItems().reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll("#storeCartCount").forEach((el) => { el.textContent = String(count); });
  }

  function changeCartQty(productId, delta) {
    const items = getCartRaw();
    const target = items.find((item) => item.productId === productId);
    if (!target) return;
    target.quantity += delta;
    if (target.quantity <= 0) {
      saveCartRaw(items.filter((item) => item.productId !== productId));
      return;
    }
    saveCartRaw(items);
  }

  function removeFromCart(productId) {
    saveCartRaw(getCartRaw().filter((item) => item.productId !== productId));
  }

  function clearCart() {
    localStorage.removeItem(CART_KEY);
  }

  function getCartTotals() {
    const items = getCartItems();
    const subtotal = items.reduce((sum, item) => sum + item.pricePi * item.quantity, 0);
    const delivery = items.length ? 4 : 0;
    return { subtotal, delivery, total: subtotal + delivery };
  }

  function getOrders() {
    try { return JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]"); } catch (_) { return []; }
  }

  function saveOrder(order) {
    const orders = getOrders();
    orders.unshift(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }

  window.SMAJStore = {
    products: STORE_PRODUCTS,
    categories: STORE_CATEGORIES,
    getSession,
    shortenWallet,
    formatPi,
    getProductById,
    getCurrentProduct,
    addToCart,
    getCartItems,
    updateCartCount,
    changeCartQty,
    removeFromCart,
    clearCart,
    getCartTotals,
    getOrders,
    saveOrder
  };
})();

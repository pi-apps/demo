const products = [
  {
    id: 1,
    name: "Smartphone Pro X",
    description: "Flagship smartphone for productivity and content creation.",
    category: "electronics",
    image: "../../assets/images/website.png",
    priceUSD: 799.0,
    pricePi: 0.00254362,
    rating: 5,
  },
  {
    id: 2,
    name: "Ultrabook Air",
    description: "Lightweight performance laptop for freelancers and founders.",
    category: "electronics",
    image: "../../assets/images/website-hero.png",
    priceUSD: 1199.0,
    pricePi: 0.00381691,
    rating: 4,
  },
  {
    id: 3,
    name: "Premium Hoodie",
    description: "Comfort fit hoodie with modern urban style.",
    category: "fashion",
    image: "../../assets/images/community.jpg",
    priceUSD: 49.0,
    pricePi: 0.00015597,
    rating: 4,
  },
  {
    id: 4,
    name: "Designer Watch",
    description: "Minimal watch design suitable for business and casual wear.",
    category: "fashion",
    image: "../../assets/images/business.jpg",
    priceUSD: 199.0,
    pricePi: 0.00063345,
    rating: 5,
  },
  {
    id: 5,
    name: "City Electric Car",
    description: "Compact EV with strong range and smart connectivity.",
    category: "cars",
    image: "../../assets/images/marketplace.jpg",
    priceUSD: 24999.0,
    pricePi: 0.07957453,
    rating: 5,
  },
  {
    id: 6,
    name: "SUV Hybrid",
    description: "Family SUV hybrid for long-range everyday driving.",
    category: "cars",
    image: "../../assets/images/market-banner.png",
    priceUSD: 31999.0,
    pricePi: 0.10185653,
    rating: 4,
  },
  {
    id: 7,
    name: "Apartment Unit",
    description: "Ready-to-move apartment in a growing business district.",
    category: "homes",
    image: "../../assets/images/hero.png",
    priceUSD: 85000.0,
    pricePi: 0.27056368,
    rating: 4,
  },
  {
    id: 8,
    name: "Family House",
    description: "Spacious home with modern amenities and parking.",
    category: "homes",
    image: "../../assets/images/home.jpg",
    priceUSD: 120000.0,
    pricePi: 0.38197226,
    rating: 5,
  },
  {
    id: 9,
    name: "Residential Land Plot",
    description: "High-potential plot for personal or investment use.",
    category: "land",
    image: "../../assets/images/affiliate.png",
    priceUSD: 45000.0,
    pricePi: 0.1432396,
    rating: 4,
  },
  {
    id: 10,
    name: "Commercial Land",
    description: "Commercial zone land ready for business construction.",
    category: "land",
    image: "../../assets/images/pricing.png",
    priceUSD: 98000.0,
    pricePi: 0.31195035,
    rating: 5,
  },
  {
    id: 11,
    name: "Noise-Cancel Headphones",
    description: "Immersive audio with long battery life.",
    category: "electronics",
    image: "../../assets/images/marketplace.jpg",
    priceUSD: 189.0,
    pricePi: 0.00060161,
    rating: 4,
  },
  {
    id: 12,
    name: "Classic Sneakers",
    description: "Clean design sneakers for everyday wear.",
    category: "fashion",
    image: "../../assets/images/community.jpg",
    priceUSD: 89.0,
    pricePi: 0.00028329,
    rating: 4,
  },
];

const productGrid = document.getElementById("productGrid");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const categoryButtons = document.querySelectorAll("#categoryFilters .filter-btn");
const summaryTotal = document.getElementById("summaryTotal");
const summaryCategories = document.getElementById("summaryCategories");

const cartSidebar = document.getElementById("cartSidebar");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const openCartBtn = document.getElementById("openCartBtn");
const openCartBtnTop = document.getElementById("openCartBtnTop");
const closeCartBtn = document.getElementById("closeCart");
const checkoutBtn = document.getElementById("checkoutBtn");

const buyModal = document.getElementById("buyModal");
const closeModalBtn = document.getElementById("closeModal");
const modalImage = document.getElementById("modalImage");
const modalName = document.getElementById("modalName");
const modalDescription = document.getElementById("modalDescription");
const modalPricePi = document.getElementById("modalPricePi");
const modalPriceUSD = document.getElementById("modalPriceUSD");
const modalQuantity = document.getElementById("modalQuantity");
const modalAddCart = document.getElementById("modalAddCart");
const modalBuyNow = document.getElementById("modalBuyNow");

let activeCategory = "all";
let currentModalProduct = null;
let cart = [];

function formatCategory(category) {
  const map = {
    electronics: "Electronics",
    fashion: "Fashion",
    cars: "Cars",
    homes: "Homes",
    land: "Land",
  };
  return map[category] || category;
}

function renderProducts() {
  const q = (searchInput.value || "").trim().toLowerCase();

  const filtered = products.filter((p) => {
    const inCategory = activeCategory === "all" || p.category === activeCategory;
    const inSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);

    return inCategory && inSearch;
  });

  productGrid.innerHTML = "";

  filtered.forEach((p) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <div class="product-body">
        <div class="product-meta">
          <span class="product-category">${formatCategory(p.category)}</span>
          <span class="product-rating">${"?".repeat(p.rating)}${"?".repeat(5 - p.rating)}</span>
        </div>
        <h4>${p.name}</h4>
        <p>${p.description}</p>
        <div class="product-price">${p.pricePi.toFixed(8)} Pi / $${p.priceUSD.toFixed(2)}</div>
        <div class="product-actions">
          <button class="btn-buy" data-action="buy" data-id="${p.id}">Buy Now</button>
          <button class="btn-cart" data-action="cart" data-id="${p.id}">Add Cart</button>
        </div>
      </div>
    `;
    productGrid.appendChild(card);
  });

  emptyState.style.display = filtered.length ? "none" : "block";
}

function updateSummary() {
  const categories = new Set(products.map((p) => p.category));
  summaryTotal.textContent = String(products.length);
  summaryCategories.textContent = String(categories.size);
}

function openCart() {
  cartSidebar.classList.add("active");
}

function closeCart() {
  cartSidebar.classList.remove("active");
}

function addToCart(productId, qty = 1) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const existing = cart.find((x) => x.id === product.id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ ...product, qty });
  }

  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  renderCart();
}

function renderCart() {
  cartItems.innerHTML = "";

  let totalPi = 0;
  let totalUSD = 0;

  cart.forEach((item) => {
    totalPi += item.pricePi * item.qty;
    totalUSD += item.priceUSD * item.qty;

    const li = document.createElement("li");
    li.innerHTML = `
      <div class="cart-item-title">${item.name}</div>
      <div class="cart-item-meta">${item.qty} x ${item.pricePi.toFixed(8)} Pi</div>
      <button class="cart-item-remove" data-remove-id="${item.id}">Remove</button>
    `;
    cartItems.appendChild(li);
  });

  cartTotal.textContent = `${totalPi.toFixed(8)} Pi / $${totalUSD.toFixed(2)}`;
}

function openModal(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  currentModalProduct = product;
  modalImage.src = product.image;
  modalName.textContent = product.name;
  modalDescription.textContent = product.description;
  modalPricePi.textContent = product.pricePi.toFixed(8);
  modalPriceUSD.textContent = product.priceUSD.toFixed(2);
  modalQuantity.value = 1;
  buyModal.classList.add("show");
}

function closeModal() {
  buyModal.classList.remove("show");
  currentModalProduct = null;
}

categoryButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    categoryButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeCategory = btn.dataset.category;
    renderProducts();
  });
});

searchInput.addEventListener("input", renderProducts);

productGrid.addEventListener("click", (e) => {
  const button = e.target.closest("button[data-action]");
  if (!button) return;

  const productId = Number(button.dataset.id);
  if (button.dataset.action === "buy") {
    openModal(productId);
  } else {
    addToCart(productId, 1);
    openCart();
  }
});

cartItems.addEventListener("click", (e) => {
  const removeBtn = e.target.closest("button[data-remove-id]");
  if (!removeBtn) return;
  removeFromCart(Number(removeBtn.dataset.removeId));
});

openCartBtn.addEventListener("click", openCart);
openCartBtnTop.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);

checkoutBtn.addEventListener("click", () => {
  if (!cart.length) {
    alert("Your cart is empty.");
    return;
  }

  alert("Checkout placeholder: backend payment integration goes here.");
});

closeModalBtn.addEventListener("click", closeModal);
buyModal.addEventListener("click", (e) => {
  if (e.target === buyModal) closeModal();
});

modalAddCart.addEventListener("click", () => {
  if (!currentModalProduct) return;

  const qty = Math.max(1, Number(modalQuantity.value || 1));
  addToCart(currentModalProduct.id, qty);
  closeModal();
  openCart();
});

modalBuyNow.addEventListener("click", () => {
  if (!currentModalProduct) return;

  const qty = Math.max(1, Number(modalQuantity.value || 1));
  const totalPi = (currentModalProduct.pricePi * qty).toFixed(8);
  const totalUSD = (currentModalProduct.priceUSD * qty).toFixed(2);

  alert(`Order placeholder: ${currentModalProduct.name} x ${qty}\nTotal: ${totalPi} Pi / $${totalUSD}`);
  closeModal();
});

updateSummary();
renderProducts();
renderCart();
(function () {
  const app = window.SMAJStore;

  if (!app) {
    return;
  }

  const cartWrap = document.getElementById("cartItemsWrap");
  const summaryWrap = document.getElementById("cartSummary");

  function cartItemMarkup(item) {
    return `
      <article class="cart-item">
        <div class="cart-item-copy">
          <span class="product-tag">${item.category}</span>
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <div class="product-meta-row">
            <span><i class="bx bx-store"></i> ${item.vendor}</span>
            <span><i class="bx bx-shield-quarter"></i> Verified seller</span>
          </div>
        </div>
        <div class="cart-item-side">
          <strong>${app.formatPi(item.pricePi)}</strong>
          <div class="qty-box">
            <button type="button" data-qty-change="${item.id}" data-direction="-1">-</button>
            <span>${item.quantity}</span>
            <button type="button" data-qty-change="${item.id}" data-direction="1">+</button>
          </div>
          <button class="inline-link danger-link" type="button" data-remove-item="${item.id}">Remove</button>
        </div>
      </article>
    `;
  }

  function emptyCartMarkup() {
    return `
      <article class="empty-state">
        <i class="bx bx-cart-alt"></i>
        <h2>Your cart is empty.</h2>
        <p>Browse products and add items to start the SMAJ STORE checkout flow.</p>
        <a class="btn-primary" href="category.html">Browse Products</a>
      </article>
    `;
  }

  function renderSummary(totals) {
    if (!summaryWrap) {
      return;
    }

    summaryWrap.innerHTML = `
      <h2>Order Summary</h2>
      <div class="summary-row">
        <span>Items</span>
        <strong>${totals.itemCount}</strong>
      </div>
      <div class="summary-row">
        <span>Subtotal</span>
        <strong>${app.formatPi(totals.subtotal)}</strong>
      </div>
      <div class="summary-row">
        <span>Delivery</span>
        <strong>${app.formatPi(totals.delivery)}</strong>
      </div>
      <div class="summary-row total-row">
        <span>Total</span>
        <strong>${app.formatPi(totals.total)}</strong>
      </div>
      <p class="summary-note">Your connected SMAJ PI HUB session will continue into checkout.</p>
      <a class="btn-primary wide-btn" href="checkout.html">Proceed to Checkout</a>
      <a class="btn-secondary wide-btn" href="category.html">Continue Shopping</a>
    `;
  }

  function bindCartActions() {
    document.querySelectorAll("[data-qty-change]").forEach((button) => {
      button.addEventListener("click", () => {
        app.changeCartQty(button.dataset.qtyChange, Number(button.dataset.direction));
        renderCartPage();
      });
    });

    document.querySelectorAll("[data-remove-item]").forEach((button) => {
      button.addEventListener("click", () => {
        app.removeFromCart(button.dataset.removeItem);
        renderCartPage();
      });
    });
  }

  function renderCartPage() {
    if (!cartWrap) {
      return;
    }

    const items = app.getCartItems();
    const totals = app.getCartTotals();

    cartWrap.innerHTML = items.length ? items.map(cartItemMarkup).join("") : emptyCartMarkup();
    renderSummary(totals);
    bindCartActions();
    app.updateCartCount();
  }

  renderCartPage();
})();

(function () {
  const app = window.SMAJStore;

  if (!app) {
    return;
  }

  const checkoutForm = document.getElementById("checkoutForm");
  const checkoutSummary = document.getElementById("checkoutSummary");
  const successCard = document.getElementById("orderSuccessCard");

  function getStatusClass(status) {
    if (status === "Delivered") {
      return "status-green";
    }
    if (status === "Processing") {
      return "status-gold";
    }
    return "status-blue";
  }

  function renderCheckoutSummary() {
    if (!checkoutSummary) {
      return;
    }

    const totals = app.getCartTotals();
    const items = app.getCartItems();

    if (!items.length) {
      checkoutSummary.innerHTML = `
        <article class="empty-state compact-empty">
          <i class="bx bx-cart"></i>
          <h2>No items to check out.</h2>
          <p>Add products to your cart before opening checkout.</p>
          <a class="btn-primary" href="category.html">Browse Products</a>
        </article>
      `;
      return;
    }

    checkoutSummary.innerHTML = `
      <h2>Payment Summary</h2>
      <div class="summary-stack">
        ${items.map((item) => `
          <div class="summary-row">
            <span>${item.title} x${item.quantity}</span>
            <strong>${app.formatPi(item.pricePi * item.quantity)}</strong>
          </div>
        `).join("")}
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
      <p class="summary-note">Payment remains connected to the wallet session already active in SMAJ PI HUB.</p>
    `;
  }

  function seedCheckoutForm() {
    if (!checkoutForm) {
      return;
    }

    const session = app.getSession();
    const nameField = document.getElementById("checkoutName");
    const emailField = document.getElementById("checkoutEmail");
    const phoneField = document.getElementById("checkoutPhone");
    const countryField = document.getElementById("checkoutCountry");

    if (nameField && session.name) {
      nameField.value = session.name;
    }
    if (emailField && session.email) {
      emailField.value = session.email;
    }
    if (phoneField) {
      phoneField.value = "+971";
    }
    if (countryField) {
      countryField.value = "United Arab Emirates";
    }
  }

  function bindCheckoutForm() {
    if (!checkoutForm) {
      return;
    }

    checkoutForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const items = app.getCartItems();
      if (!items.length) {
        return;
      }

      const totals = app.getCartTotals();
      const order = {
        id: "SMAJ-" + Date.now(),
        date: new Date().toLocaleDateString(),
        totalPi: totals.total,
        status: "Processing",
        statusClass: getStatusClass("Processing"),
        items: items.map((item) => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          pricePi: item.pricePi
        })),
        delivery: {
          name: document.getElementById("checkoutName").value.trim(),
          email: document.getElementById("checkoutEmail").value.trim(),
          phone: document.getElementById("checkoutPhone").value.trim(),
          country: document.getElementById("checkoutCountry").value.trim(),
          address: document.getElementById("checkoutAddress").value.trim(),
          notes: document.getElementById("checkoutNotes").value.trim()
        }
      };

      app.saveOrder(order);
      app.clearCart();
      window.location.href = "order-success.html?order=" + encodeURIComponent(order.id);
    });
  }

  function renderSuccessPage() {
    if (!successCard) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("order");
    const order = app.getOrders().find((entry) => entry.id === orderId);

    if (!order) {
      successCard.innerHTML = `
        <article class="empty-state">
          <i class="bx bx-error-circle"></i>
          <h1>Order not found.</h1>
          <p>The success page needs a valid order reference from checkout.</p>
          <a class="btn-primary" href="orders.html">Open My Orders</a>
        </article>
      `;
      return;
    }

    successCard.innerHTML = `
      <i class="bx bx-check-circle success-icon"></i>
      <span class="eyebrow">Order Confirmed</span>
      <h1>Your order has been submitted.</h1>
      <p>Order <strong>${order.id}</strong> is now in the SMAJ STORE pipeline and attached to your shared ecosystem activity.</p>
      <div class="success-meta">
        <div>
          <span>Status</span>
          <strong class="status-pill ${order.statusClass}">${order.status}</strong>
        </div>
        <div>
          <span>Total</span>
          <strong>${app.formatPi(order.totalPi)}</strong>
        </div>
        <div>
          <span>Date</span>
          <strong>${order.date}</strong>
        </div>
      </div>
      <div class="hero-actions centered-actions">
        <a class="btn-primary" href="orders.html">View My Orders</a>
        <a class="btn-secondary" href="category.html">Keep Shopping</a>
      </div>
    `;
  }

  renderCheckoutSummary();
  seedCheckoutForm();
  bindCheckoutForm();
  renderSuccessPage();
})();

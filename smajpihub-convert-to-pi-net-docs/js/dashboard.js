// Sidebar toggle for mobile
const sidebarArrow = document.getElementById('sidebarArrow');
const dashboardSidebar = document.getElementById('dashboardSidebar');

if (sidebarArrow) {
  sidebarArrow.addEventListener('click', () => {
    dashboardSidebar.classList.toggle('active');
  });
}

// Get token from localStorage
const token = localStorage.getItem('smaj_token');

// Helper function to make API calls
async function apiCall(endpoint, options = {}) {
  const defaultOptions = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
  const response = await fetch(`http://localhost:3000${endpoint}`, { ...defaultOptions, ...options });
  if (!response.ok) {
    throw new Error(`API call failed: ${response.status}`);
  }
  return response.json();
}

// Load dashboard data
async function loadDashboardData() {
  try {
    // Load stats
    const stats = await apiCall('/api/dashboard/stats');
    document.getElementById('pi-balance').textContent = `${stats.piBalance} π`;
    document.getElementById('pending-orders').textContent = stats.pendingOrders;
    document.getElementById('completed-orders').textContent = stats.completedOrders;

    // Load orders
    const orders = await apiCall('/api/dashboard/orders');
    const ordersTable = document.getElementById('orders-table');
    ordersTable.innerHTML = '';
    orders.forEach(order => {
      const row = ordersTable.insertRow();
      row.insertCell(0).textContent = order.date;
      row.insertCell(1).textContent = order.service;
      row.insertCell(2).textContent = `${order.amount} π`;
      row.insertCell(3).textContent = `$${order.usdAmount}`;
      row.insertCell(4).textContent = order.status;
      const actionsCell = row.insertCell(5);
      actionsCell.innerHTML = `
        <button class="btn small view-btn">View Details</button>
        ${order.status === 'pending' ? '<button class="btn small cancel-btn">Cancel</button>' : ''}
      `;
    });

    // Load notifications
    const notifications = await apiCall('/api/dashboard/notifications');
    const notificationsList = document.getElementById('notifications-list');
    notificationsList.innerHTML = '';
    notifications.forEach(notification => {
      const li = document.createElement('li');
      li.innerHTML = `<i class='bx bx-bell'></i> ${notification.message}`;
      notificationsList.appendChild(li);
    });

    // Load recommended services
    loadRecommendedServices();

  } catch (error) {
    console.error('Error loading dashboard data:', error);
    alert('Failed to load dashboard data. Please try again.');
  }
}

// Load recommended services
async function loadRecommendedServices() {
  try {
    const services = await apiCall('/api/dashboard/recommended-services');
    const servicesGrid = document.querySelector('.services-grid');
    if (!servicesGrid) return;

    servicesGrid.innerHTML = '';
    services.forEach(service => {
      const serviceCard = document.createElement('div');
      serviceCard.className = 'service-card';
      serviceCard.innerHTML = `
        <img src="${service.image}" alt="${service.name}">
        <h4>${service.name}</h4>
        <p>${service.category}</p>
        <p class="price">${service.price} π — $${service.usdPrice}</p>
        <button class="btn primary" onclick="placeOrder(${service.id})">Buy Again</button>
        <button class="btn secondary"><i class='bx bx-cart'></i> Add to Cart</button>
      `;
      servicesGrid.appendChild(serviceCard);
    });
  } catch (error) {
    console.error('Error loading recommended services:', error);
  }
}

// Place new order
async function placeOrder(serviceId) {
  try {
    await apiCall('/api/dashboard/orders', {
      method: 'POST',
      body: JSON.stringify({ serviceId })
    });
    alert('Order placed successfully!');
    loadDashboardData();
  } catch (error) {
    console.error('Error placing order:', error);
    alert('Failed to place order. Please try again.');
  }
}

// Cancel order
async function cancelOrder(orderId) {
  if (!confirm('Are you sure you want to cancel this order?')) return;
  try {
    await apiCall(`/api/dashboard/orders/${orderId}/cancel`, { method: 'PUT' });
    alert('Order canceled successfully!');
    loadDashboardData();
  } catch (error) {
    console.error('Error canceling order:', error);
    alert('Failed to cancel order. Please try again.');
  }
}

// Place new order prompt
async function placeOrderPrompt() {
  const serviceId = prompt('Enter service ID to order (1-4):');
  if (!serviceId) return;
  placeOrder(parseInt(serviceId));
}

// Filter orders
const filterButtons = document.querySelectorAll('.filter-btn');
const ordersTable = document.getElementById('orders-table');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        for (let row of ordersTable.rows) {
            if (filter === 'all') {
                row.style.display = '';
            } else {
                row.style.display = row.cells[4].textContent.toLowerCase() === filter ? '' : 'none';
            }
        }
    });
});

// Simulated wallet connect
document.querySelector('.wallet-btn')?.addEventListener('click', () => {
    alert('Wallet connected successfully!');
});

// Settings page js

// Theme toggle
const toggleTheme = document.getElementById('toggleTheme');
toggleTheme?.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
});

// Currency toggle
const currencyToggle = document.getElementById('currencyToggle');
const currencyLabel = document.getElementById('currencyLabel');
currencyToggle?.addEventListener('change', () => {
    currencyLabel.textContent = currencyToggle.checked ? 'USD' : 'π';
});

// Connect/Disconnect Wallet
document.querySelector('.connect-wallet')?.addEventListener('click', () => {
    alert('Wallet connected! (API integration required)');
});

document.querySelector('.disconnect-wallet')?.addEventListener('click', () => {
    alert('Wallet disconnected!');
});

// Save buttons (demo only)
document.querySelectorAll('.save-profile, .save-security, .save-preferences').forEach(btn => {
    btn.addEventListener('click', () => alert('Settings saved! (API integration required)'));
});

// Logout modal
const logoutBtn = document.getElementById('logoutBtn');
const logoutModal = document.getElementById('logoutModal');
const closeModal = document.querySelector('.modal .close');
const cancelLogout = document.getElementById('cancelLogout');
const confirmLogout = document.getElementById('confirmLogout');

if (logoutBtn) {
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    logoutModal.style.display = 'block';
  });
}

if (closeModal) {
  closeModal.addEventListener('click', () => {
    logoutModal.style.display = 'none';
  });
}

if (cancelLogout) {
  cancelLogout.addEventListener('click', () => {
    logoutModal.style.display = 'none';
  });
}

if (confirmLogout) {
  confirmLogout.addEventListener('click', () => {
    localStorage.removeItem('smaj_token');
    localStorage.removeItem('smaj_user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('pi_user');
    window.location.href = '../../index.html';
  });
}

// Close modal if clicked outside
window.addEventListener('click', (e) => {
    if (e.target == logoutModal) {
        logoutModal.style.display = 'none';
    }
});

// Load provider data
async function loadProviderData() {
  try {
    // Load stats
    const stats = await apiCall('/api/provider/stats');
    document.querySelector('.card:nth-child(1) p').textContent = stats.totalServices;
    document.querySelector('.card:nth-child(2) p').textContent = stats.pendingOrders;
    document.querySelector('.card:nth-child(3) p').textContent = stats.completedOrders;
    document.querySelector('.card:nth-child(4) p').textContent = `${stats.totalEarnings} π`;

    // Load services
    const services = await apiCall('/api/provider/services');
    const servicesTable = document.querySelector('.dashboard-table');
    if (servicesTable) {
      const tbody = servicesTable.querySelector('tbody');
      tbody.innerHTML = '';
      services.forEach(service => {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = service.name;
        row.insertCell(1).textContent = service.category;
        row.insertCell(2).textContent = `${service.price} π`;
        row.insertCell(3).textContent = service.status;
        const actionsCell = row.insertCell(4);
        actionsCell.innerHTML = `
          <button class="btn small" onclick="editService(${service.id})"><i class='bx bx-edit'></i> Edit</button>
          <button class="btn small danger" onclick="deleteService(${service.id})"><i class='bx bx-trash'></i> Delete</button>
        `;
      });
    }

    // Load orders
    const orders = await apiCall('/api/provider/orders');
    const ordersTable = document.querySelectorAll('.dashboard-table')[1];
    if (ordersTable) {
      const tbody = ordersTable.querySelector('tbody');
      tbody.innerHTML = '';
      orders.forEach(order => {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = order.date;
        row.insertCell(1).textContent = 'Client'; // Mock client name
        row.insertCell(2).textContent = order.service;
        row.insertCell(3).textContent = `${order.amount} π`;
        row.insertCell(4).textContent = order.status;
        const actionsCell = row.insertCell(5);
        actionsCell.innerHTML = `
          <button class="btn small primary">View</button>
          ${order.status === 'pending' ? `<button class="btn small success" onclick="completeOrder(${order.id})">Mark Completed</button>` : ''}
        `;
      });
    }
  } catch (error) {
    console.error('Error loading provider data:', error);
    alert('Failed to load provider data. Please try again.');
  }
}

// Add new service
async function addServicePrompt() {
  const name = prompt('Enter service name:');
  if (!name) return;
  const category = prompt('Enter category:');
  if (!category) return;
  const price = prompt('Enter price (π):');
  if (!price) return;

  try {
    await apiCall('/api/provider/services', {
      method: 'POST',
      body: JSON.stringify({ name, category, price })
    });
    alert('Service added successfully!');
    loadProviderData();
  } catch (error) {
    console.error('Error adding service:', error);
    alert('Failed to add service. Please try again.');
  }
}

// Edit service
async function editService(serviceId) {
  const name = prompt('Enter new service name:');
  if (!name) return;
  const category = prompt('Enter new category:');
  if (!category) return;
  const price = prompt('Enter new price (π):');
  if (!price) return;

  try {
    await apiCall(`/api/provider/services/${serviceId}`, {
      method: 'PUT',
      body: JSON.stringify({ name, category, price })
    });
    alert('Service updated successfully!');
    loadProviderData();
  } catch (error) {
    console.error('Error updating service:', error);
    alert('Failed to update service. Please try again.');
  }
}

// Delete service
async function deleteService(serviceId) {
  if (!confirm('Are you sure you want to delete this service?')) return;
  try {
    await apiCall(`/api/provider/services/${serviceId}`, { method: 'DELETE' });
    alert('Service deleted successfully!');
    loadProviderData();
  } catch (error) {
    console.error('Error deleting service:', error);
    alert('Failed to delete service. Please try again.');
  }
}

// Complete order
async function completeOrder(orderId) {
  try {
    await apiCall(`/api/provider/orders/${orderId}/complete`, { method: 'PUT' });
    alert('Order marked as completed!');
    loadProviderData();
  } catch (error) {
    console.error('Error completing order:', error);
    alert('Failed to complete order. Please try again.');
  }
}

// Load settings data
async function loadSettingsData() {
  try {
    const profile = await apiCall('/api/settings/profile');
    document.querySelector('input[placeholder="Enter your name"]').value = profile.name || '';
    document.querySelector('input[placeholder="Enter your username"]').value = profile.username || '';
    document.querySelector('input[placeholder="Enter your email"]').value = profile.email || '';

    const settings = await apiCall('/api/settings');
    document.getElementById('toggle2FA').checked = settings.twoFA || false;
    document.getElementById('toggleAlerts').checked = settings.securityAlerts || false;
    document.querySelector('input[checked]').checked = settings.emailNotif || true;
    document.querySelectorAll('input[type="checkbox"]')[3].checked = settings.smsNotif || false;
    document.querySelectorAll('input[type="checkbox"]')[4].checked = settings.inAppNotif || true;
    document.querySelector('select').value = settings.language || 'English';
    document.getElementById('toggleTheme').checked = settings.darkMode || false;
    document.querySelectorAll('select')[1].value = settings.timezone || 'UTC+0';
    document.getElementById('currencyToggle').checked = settings.currency === 'USD';

    const balance = await apiCall('/api/wallet/balance');
    document.querySelector('.wallet-settings p strong').textContent = `${balance.balance} π`;

    const transactions = await apiCall('/api/wallet/transactions');
    const tbody = document.querySelector('.transactions-table tbody');
    tbody.innerHTML = '';
    transactions.forEach(tx => {
      const row = tbody.insertRow();
      row.insertCell(0).textContent = tx.date;
      row.insertCell(1).textContent = tx.type;
      row.insertCell(2).textContent = `${tx.amount} π`;
      row.insertCell(3).textContent = tx.status;
    });
  } catch (error) {
    console.error('Error loading settings data:', error);
    alert('Failed to load settings data. Please try again.');
  }
}

// Save profile
async function saveProfile() {
  const name = document.querySelector('input[placeholder="Enter your name"]').value;
  const username = document.querySelector('input[placeholder="Enter your username"]').value;
  const email = document.querySelector('input[placeholder="Enter your email"]').value;
  const socialMedia = {
    facebook: '',
    twitter: '',
    instagram: '',
    telegram: '',
    linkedin: ''
  };

  try {
    await apiCall('/api/settings/profile', {
      method: 'PUT',
      body: JSON.stringify({ name, username, email, socialMedia })
    });
    alert('Profile saved successfully!');
  } catch (error) {
    console.error('Error saving profile:', error);
    alert('Failed to save profile. Please try again.');
  }
}

// Change password
async function changePassword() {
  const currentPassword = document.querySelector('input[placeholder="Enter current password"]').value;
  const newPassword = document.querySelector('input[placeholder="Enter new password"]').value;
  const confirmPassword = document.querySelector('input[placeholder="Confirm new password"]').value;

  if (newPassword !== confirmPassword) {
    alert('New passwords do not match!');
    return;
  }

  try {
    await apiCall('/api/settings/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword })
    });
    alert('Password changed successfully!');
    document.querySelectorAll('input[type="password"]').forEach(input => input.value = '');
  } catch (error) {
    console.error('Error changing password:', error);
    alert('Failed to change password. Please try again.');
  }
}

// Save settings
async function saveSettings() {
  const settings = {
    twoFA: document.getElementById('toggle2FA').checked,
    securityAlerts: document.getElementById('toggleAlerts').checked,
    emailNotif: document.querySelectorAll('input[type="checkbox"]')[2].checked,
    smsNotif: document.querySelectorAll('input[type="checkbox"]')[3].checked,
    inAppNotif: document.querySelectorAll('input[type="checkbox"]')[4].checked,
    language: document.querySelector('select').value,
    darkMode: document.getElementById('toggleTheme').checked,
    timezone: document.querySelectorAll('select')[1].value,
    currency: document.getElementById('currencyToggle').checked ? 'USD' : 'π'
  };

  try {
    await apiCall('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
    alert('Settings saved successfully!');
  } catch (error) {
    console.error('Error saving settings:', error);
    alert('Failed to save settings. Please try again.');
  }
}

// Connect wallet
async function connectWallet() {
  try {
    await apiCall('/api/wallet/connect', { method: 'POST' });
    alert('Wallet connected successfully!');
    loadSettingsData();
  } catch (error) {
    console.error('Error connecting wallet:', error);
    alert('Failed to connect wallet. Please try again.');
  }
}

// Disconnect wallet
async function disconnectWallet() {
  try {
    await apiCall('/api/wallet/disconnect', { method: 'POST' });
    alert('Wallet disconnected successfully!');
    loadSettingsData();
  } catch (error) {
    console.error('Error disconnecting wallet:', error);
    alert('Failed to disconnect wallet. Please try again.');
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Client dashboard
  if (document.getElementById('pi-balance')) {
    loadDashboardData();
  }

  // Provider dashboard
  if (window.location.pathname.includes('provider.html')) {
    loadProviderData();
  }

  // Settings page
  if (document.querySelector('.settings-section')) {
    loadSettingsData();
  }

  // Add event listeners for buttons
  document.querySelector('.btn.primary')?.addEventListener('click', () => {
    if (document.querySelector('.btn.primary').textContent === 'Place New Order') {
      placeOrderPrompt();
    } else if (document.querySelector('.btn.primary').textContent === 'Add New Service') {
      addServicePrompt();
    }
  });

  document.querySelector('.save-profile')?.addEventListener('click', saveProfile);
  document.querySelector('.save-security')?.addEventListener('click', changePassword);
  document.querySelector('.save-preferences')?.addEventListener('click', saveSettings);
  document.querySelector('.connect-wallet')?.addEventListener('click', connectWallet);
  document.querySelector('.disconnect-wallet')?.addEventListener('click', disconnectWallet);

  // Attach cancel order listeners
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('cancel-btn')) {
      const row = e.target.closest('tr');
      const orderId = row.cells[0].textContent; // Assuming date is unique or use proper ID
      cancelOrder(orderId);
    }
  });
});

// Load data on page load if on client dashboard
if (document.getElementById('pi-balance')) {
  loadDashboardData();
}


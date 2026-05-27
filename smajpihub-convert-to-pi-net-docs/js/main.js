// ===============================
// PI SDK – SANDBOX MODE
// ===============================
if (window.Pi) {
  Pi.init({
    version: "2.0",
    sandbox: true
  });
  console.log("Pi SDK initialized in SANDBOX mode");
} else {
  console.warn("Pi SDK not found. Open in Pi Browser.");
}

function getApiBase() {
  const origin = window.location.origin || "";
  if (origin && origin !== "null" && !origin.startsWith("file:")) {
    return origin.replace(/\/$/, "");
  }

  return "http://localhost:3000";
}

const API_BASE = getApiBase();
const DASHBOARD_URL = window.SmajDashboardUrl || "pages/dashboard/client.html";
const DASHBOARD_SSO_ENDPOINT = `${API_BASE}/api/dashboard/sso-token`;
const DASHBOARD_LINK_SELECTOR = 'a[href*="dashboard/client.html"], a[href*="smaj-ecosystem-dashboard"]';
const TOKEN_KEY = "smaj_token";
const USER_KEY = "smaj_user";

function getToken() {
  return localStorage.getItem(TOKEN_KEY) || localStorage.getItem("token");
}

window.SmajApiEndpoint = API_BASE;

function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (_) {
    return null;
  }
}

function storeAuth(token, user) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  notifyAuthStateChange();
}

function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("pi_user");
  localStorage.removeItem("pi_wallet_address");
  localStorage.removeItem("dashboard_profile_data");
  localStorage.removeItem("dashboard_profile_photo");
  notifyAuthStateChange();
}

function isUserAuthenticated() {
  const token = getToken();
  const user = getStoredUser() || getStoredPiUser();
  return Boolean(token && user);
}

function notifyAuthStateChange() {
  const state = getWalletStateForNav();
  window.dispatchEvent(new CustomEvent("smaj:wallet-changed", { detail: state }));
}

function ensureAppUiPrimitives() {
  if (!document.body) return;

  // Inject Styles if missing (handles all pages automatically)
  if (!document.getElementById("smajLoaderStyles")) {
    const style = document.createElement("style");
    style.id = "smajLoaderStyles";
    style.textContent = `
      .app-loader-overlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: #ffffff; display: flex; flex-direction: column;
        justify-content: center; align-items: center; z-index: 10000;
        opacity: 0; visibility: hidden; transition: opacity 0.5s ease, visibility 0.5s;
      }
      .app-loader-overlay.show { opacity: 1; visibility: visible; }
      .app-loader-spinner {
        width: 80px; height: 80px;
        background-image: url('${appPath('assets/images/logo.png')}');
        background-size: contain; background-repeat: no-repeat; background-position: center;
        animation: smaj-pulse 1.5s ease-in-out infinite alternate; margin-bottom: 15px;
        border: none; border-radius: 0;
      }
      @keyframes smaj-pulse { 0% { transform: scale(0.85); filter: drop-shadow(0 0 5px rgba(125, 60, 255, 0.3)); } 100% { transform: scale(1.1); filter: drop-shadow(0 0 15px rgba(125, 60, 255, 0.7)); } }
    `;
    document.head.appendChild(style);
  }

  if (document.getElementById("appLoaderOverlay")) return;

  const loader = document.createElement("div");
  loader.id = "appLoaderOverlay";
  loader.className = "app-loader-overlay show";
  loader.innerHTML = "<div class='app-loader-spinner'></div><p style='font-family: sans-serif; color: #555; font-size: 14px;'>Loading SMAJ PI HUB...</p>";
  document.body.appendChild(loader);
}

function setAppLoading(isLoading, message) {
  ensureAppUiPrimitives();
  const overlay = document.getElementById("appLoaderOverlay");
  if (!overlay) return;
  const text = overlay.querySelector("p");
  if (text && message) text.textContent = message;
  overlay.classList.toggle("show", !!isLoading);
}

function appNotify(message, type = "info") {
  ensureAppUiPrimitives();
  const toast = document.createElement("div");
  toast.className = `app-toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 220);
  }, 2300);
}

window.appNotify = appNotify;

// Theme mode removed globally: keep one consistent light color system.
const SITE_THEME_KEY = "site_theme";
function isDashboardPage() {
  return window.location.pathname.replace(/\\/g, "/").toLowerCase().includes("/pages/dashboard/");
}
function enforceSingleTheme() {
  if (isDashboardPage()) return;
  document.body.classList.remove("dark");
  localStorage.removeItem(SITE_THEME_KEY);
}
window.toggleSiteTheme = () => {};
enforceSingleTheme();
document.addEventListener("DOMContentLoaded", enforceSingleTheme);
// Required callback (even if unused now)
function onIncompletePayment(payment) {
  console.log("Incomplete payment found:", payment);
}

// Mobile Menu Toggle
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
let menuOverlay = document.getElementById("menuOverlay");
let menuClose = document.getElementById("menuClose");

if (menuToggle && navMenu) {
  if (!menuOverlay) {
    menuOverlay = document.createElement("div");
    menuOverlay.id = "menuOverlay";
    menuOverlay.className = "menu-overlay";
    document.body.appendChild(menuOverlay);
  }

  if (!menuClose) {
    menuClose = document.createElement("div");
    menuClose.id = "menuClose";
    menuClose.className = "menu-close";
    menuClose.innerHTML = "<i class='bx bx-x'></i>";
    navMenu.prepend(menuClose);
  }

  const isMobileMenu = () => window.matchMedia("(max-width: 768px)").matches;

  const openMenu = () => {
    if (!isMobileMenu()) return;
    navMenu.classList.add("active");
    menuOverlay.classList.add("active");
    document.body.classList.add("menu-open");
  };

  const closeMenu = () => {
    navMenu.classList.remove("active");
    menuOverlay.classList.remove("active");
    document.body.classList.remove("menu-open");
  };

  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    if (navMenu.classList.contains("active")) {
      closeMenu();
      return;
    }
    openMenu();
  });

  menuClose.addEventListener("click", closeMenu);
  menuOverlay.addEventListener("click", closeMenu);

  window.addEventListener("resize", () => {
    if (!isMobileMenu()) {
      closeMenu();
    }
  });

  // Close menu when clicking a link
  document.querySelectorAll('#navMenu a').forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });
}

// ===============================
// AUTH GUARD – PROTECT PAGES
// ===============================
function requireAuth() {
  const token = getToken();
  const user = getStoredUser();

  if (!token || !user) {
    console.warn("Unauthorized access. Redirecting to connect wallet.");
    window.location.href = getAuthEntryPath();
  }
}

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    disconnectWallet();
    window.location.href = getAuthEntryPath();
  });
}
// Service CTA routing helpers
function getAppPrefix() {
  const path = window.location.pathname.replace(/\\/g, '/');
  const host = window.location.hostname.toLowerCase();

  if (host.endsWith('github.io')) {
    const parts = path.split('/').filter(Boolean);
    if (parts.length > 0) return `/${parts[0]}/`;
  }

  return '/';
}

function appPath(target) {
  if (!target || /^https?:\/\//i.test(target)) {
    return target;
  }

  const normalized = target.replace(/^\/+/, '');
  return `${getAppPrefix()}${normalized}`;
}

function ensureLogoHomeLink() {
  const logoContainer = document.querySelector(".logo");
  if (!logoContainer || logoContainer.querySelector(".logo-link")) return;
  const image = logoContainer.querySelector("img");
  if (!image) return;

  const link = document.createElement("a");
  link.className = "logo-link";
  link.href = appPath("index.html");
  link.setAttribute("aria-label", "Go to SMAJ PI HUB homepage");

  logoContainer.removeChild(image);
  link.appendChild(image);
  logoContainer.appendChild(link);
}

function getDashboardAuthHeaders() {
  const token = getToken();
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`
  };
}

async function fetchDashboardSSORedirect(target) {
  const normalizedTarget = appPath(target || "pages/dashboard/client.html");
  const token = getToken();
  if (!token) {
    return normalizedTarget;
  }

  const params = new URLSearchParams();
  if (normalizedTarget) {
    params.set("redirect", normalizedTarget);
  }

  const url = `${DASHBOARD_SSO_ENDPOINT}${params.toString() ? `?${params.toString()}` : ""}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: getDashboardAuthHeaders(),
      cache: "no-store"
    });
    if (!response.ok) {
      return normalizedTarget;
    }
    const data = await response.json().catch(() => ({}));
    return data.redirectUrl || normalizedTarget;
  } catch (error) {
    console.warn("Dashboard SSO fetch failed:", error);
    return normalizedTarget;
  }
}

function redirectDashboardWithSSO(target) {
  const normalizedTarget = appPath(target || "pages/dashboard/client.html");
  (async function () {
    const redirectUrl = await fetchDashboardSSORedirect(normalizedTarget);
    window.location.href = redirectUrl || normalizedTarget;
  })();
}

function requestProtectedAccess(target) {
  const fallbackTarget = target || DASHBOARD_URL;
  if (window.SmajWallet && typeof window.SmajWallet.requestProtectedAccess === "function") {
    return window.SmajWallet.requestProtectedAccess(appPath(fallbackTarget));
  }

  const connectedUser = getWalletUser();
  if (connectedUser) {
    redirectDashboardWithSSO(fallbackTarget);
    return true;
  }

  appNotify("Please connect your wallet first to access this feature.", "info");
  return false;
}

function routeButton(button, target) {
  if (!button || !target) return;

  button.dataset.routeBound = "true";
  button.addEventListener('click', (e) => {
    e.preventDefault();
    if (/dashboard\/client\.html/i.test(target)) {
      requestProtectedAccess(target);
      return;
    }
    window.location.href = appPath(target);
  });
}

// Service main CTA
Array.from(document.querySelectorAll('.cta-btn')).forEach((btn) => {
  if (btn.type && btn.type.toLowerCase() === 'submit') return;
  routeButton(btn, DASHBOARD_URL);
});

function setupGlobalButtonRouting() {
  const path = window.location.pathname.replace(/\\/g, '/');
  if (path.includes('/pages/dashboard/')) return;

  const skipClasses = [
    'wallet-btn', 'menu-toggle', 'sidebar-open', 'sidebar-close', 'filter-btn',
    'category', 'faq-question', 'hub-open-btn', 'mark-read', 'nav-link',
    'icon-btn', 'cart-toggle', 'close'
  ];

  const skipIds = new Set([
    'piLoginBtn', 'piRegisterBtn', 'menuToggle', 'menuClose', 'sidebarOpen',
    'sidebarClose', 'openCartBtnTop', 'openCartBtn', 'closeCart', 'checkoutBtn',
    'closeModal', 'modalAddCart', 'modalBuyNow', 'connectWalletAction',
    'buyNow', 'addToCart', 'send-btn', 'receive-btn', 'deposit-btn', 'withdraw-btn'
  ]);

  const normalizeText = (text) => text.replace(/\s+/g, ' ').trim().toLowerCase();

  const resolveTarget = (label) => {
    if (label.includes('view project')) return 'pages/service-detail.html';
    if (label.includes('hire service')) return 'pages/contact.html';
    if (label.includes('subscribe')) return DASHBOARD_URL;
    if (label.includes('start a project')) return 'pages/contact.html';
    if (label.includes('view pricing')) return 'pages/pricing.html';
    if (label.includes('contact support')) return 'pages/contact.html';
    return '';
  };

  Array.from(document.querySelectorAll('button')).forEach((btn) => {
    const type = (btn.getAttribute('type') || '').toLowerCase();
    const id = btn.id || '';

    if (type === 'submit' || type === 'reset') return;
    if (btn.disabled) return;
    if (skipIds.has(id)) return;
    if (btn.hasAttribute('onclick')) return;
    if (btn.closest('.dashboard-main')) return;
    if (skipClasses.some((cls) => btn.classList.contains(cls))) return;

    const label = normalizeText(btn.textContent || '');
    const target = resolveTarget(label);
    if (!target) return;

    routeButton(btn, target);
  });
}

setupGlobalButtonRouting();
function setupUniversalButtonFallback() {
  const path = window.location.pathname.replace(/\\/g, '/');
  if (path.includes('/pages/dashboard/')) return;

  const skipClasses = [
    'wallet-btn', 'menu-toggle', 'sidebar-open', 'sidebar-close', 'filter-btn',
    'category', 'faq-question', 'hub-open-btn', 'mark-read', 'nav-link',
    'icon-btn', 'cart-toggle', 'close'
  ];

  const skipIds = new Set([
    'piLoginBtn', 'piRegisterBtn', 'menuToggle', 'menuClose', 'sidebarOpen',
    'sidebarClose', 'openCartBtnTop', 'openCartBtn', 'closeCart', 'checkoutBtn',
    'closeModal', 'modalAddCart', 'modalBuyNow', 'connectWalletAction',
    'buyNow', 'addToCart', 'send-btn', 'receive-btn', 'deposit-btn', 'withdraw-btn'
  ]);

  const normalizeText = (text) => text.replace(/\s+/g, ' ').trim().toLowerCase();

  const resolveTarget = (label) => {
    if (label.includes('view project')) return 'pages/service-detail.html';
    if (label.includes('hire service')) return 'pages/contact.html';
    if (label.includes('subscribe')) return DASHBOARD_URL;
    if (label.includes('join now')) return DASHBOARD_URL;
    if (label.includes('continue with pi')) return DASHBOARD_URL;
    if (label.includes('open dashboard')) return DASHBOARD_URL;
    if (label.includes('unified dashboard')) return DASHBOARD_URL;
    if (label.includes('start now')) return 'pages/service.html';
    if (label.includes('view pricing')) return 'pages/pricing.html';
    if (label.includes('contact support')) return 'pages/contact.html';
    if (label.includes('join community')) return 'pages/contact.html';
    if (label.includes('read updates')) return 'pages/blog.html';
    if (label.includes('become a partner')) return 'pages/collaborate.html';
    if (label.includes('request integration')) return 'pages/contact.html';
    if (label.includes('visit developers')) return 'pages/developers.html';
    if (label.includes('post your idea')) return 'pages/contact.html';
    if (label.includes('read featured story')) return 'pages/blog-post.html';
    return '';
  };

  Array.from(document.querySelectorAll('button')).forEach((btn) => {
    const type = (btn.getAttribute('type') || '').toLowerCase();
    const id = btn.id || '';

    if (type === 'submit' || type === 'reset') return;
    if (btn.disabled) return;
    if (btn.dataset.routeBound === 'true') return;
    if (skipIds.has(id)) return;
    if (btn.hasAttribute('onclick')) return;
    if (skipClasses.some((cls) => btn.classList.contains(cls))) return;

    btn.dataset.routeBound = 'true';
    btn.addEventListener('click', (e) => {
      if (e.defaultPrevented) return;

      const label = normalizeText(btn.textContent || '');
      const target = resolveTarget(label);

      e.preventDefault();
      if (target) {
        if (/dashboard\/client\.html/i.test(target) || target.includes('smaj-ecosystem-dashboard')) {
          requestProtectedAccess(target);
          return;
        }
        window.location.href = appPath(target);
        return;
      }

      requestProtectedAccess(DASHBOARD_URL);
    });
  });
}
setupUniversalButtonFallback();
function setupPlaceholderLinks() {
  const socialMap = {
    twitter: 'https://x.com',
    telegram: 'https://t.me',
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
    tiktok: 'https://tiktok.com'
  };

  Array.from(document.querySelectorAll('a[href="#"]')).forEach((link) => {
    const label = ((link.getAttribute('aria-label') || '') + ' ' + (link.textContent || '')).toLowerCase();
    const key = Object.keys(socialMap).find((name) => label.includes(name));

    if (key) {
      link.setAttribute('href', socialMap[key]);
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      return;
    }

    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = appPath('pages/contact.html');
    });
  });
}
setupPlaceholderLinks();
function getAuthEntryPath() {
  return appPath('index.html');
}

function removeEmailAuthEntrypoints() {
  const authSelectors = [
    'a[href*="auth/login"]',
    'a[href*="auth/register"]',
    'a[href*="auth/forget-password"]',
    'a[href*="auth/reset-password"]'
  ];

  authSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.setAttribute('href', '#');
      el.dataset.walletConnect = 'true';
      if (el.textContent && el.textContent.trim()) {
        el.textContent = 'Login with Pi';
      }
    });
  });

  const path = window.location.pathname.replace(/\\/g, '/').toLowerCase();
  if (path.includes('/pages/auth/')) {
    window.location.replace(getAuthEntryPath());
  }
}

function setupDashboardGateLinks() {
  document.querySelectorAll(DASHBOARD_LINK_SELECTOR).forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute("href") || DASHBOARD_URL;
      requestProtectedAccess(href);
    });
  });
}
removeEmailAuthEntrypoints();
setupDashboardGateLinks();

function setupDashboardGateButtons() {
  const path = window.location.pathname.replace(/\\/g, '/');
  if (path.includes('/pages/dashboard/')) return;

  const matchDashboard = (text) => /dashboard/i.test(text || "");

  document.querySelectorAll('button, a').forEach((el) => {
    const href = el.getAttribute('href');
    if (el.tagName.toLowerCase() === 'a' && href && (href.includes('dashboard/client.html') || href.includes('smaj-ecosystem-dashboard'))) {
      return;
    }
    if (el.dataset.dashboardGate === "true") return;
    const label = (el.textContent || "").trim();
    if (!matchDashboard(label)) return;

    el.dataset.dashboardGate = "true";
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const explicitHref = el.tagName.toLowerCase() === "a" ? el.getAttribute("href") : "";
      requestProtectedAccess(explicitHref || DASHBOARD_URL);
    });
  });
}
setupDashboardGateButtons();

function getWalletStateForNav() {
  const baseState = window.SmajWallet && typeof window.SmajWallet.getState === "function"
    ? window.SmajWallet.getState()
    : {};
  const connected = Boolean(baseState && baseState.connected) || isUserAuthenticated();
  return { ...baseState, connected };
}

function getNavDashboardLinks() {
  const links = Array.from(document.querySelectorAll(DASHBOARD_LINK_SELECTOR));
  links.forEach((link) => link.classList.add("nav-dashboard-link"));
  return links;
}

function updateDashboardLinksForState(state) {
  const connected = !!(state && state.connected);
  const links = getNavDashboardLinks();
  if (!links.length) return;

  links.forEach((link) => {
    link.classList.toggle("dashboard-hidden", !connected);
    link.setAttribute("aria-hidden", (!connected).toString());
    link.tabIndex = connected ? 0 : -1;
  });
}

function initNavigationWalletSync() {
  const refresh = () => updateDashboardLinksForState(getWalletStateForNav());
  window.addEventListener("smaj:wallet-changed", (event) => {
    updateDashboardLinksForState(event.detail || getWalletStateForNav());
  });
  document.addEventListener("DOMContentLoaded", refresh);
  refresh();
}

initNavigationWalletSync();

function syncSmalaNameVisibility(state) {
  const usernameEl = document.getElementById("smalaajimi36");
  const piUserEl = document.getElementById("piUsername");
  const statusIconEl = document.getElementById("walletConnectedIcon");
  const headerBadges = document.querySelectorAll("header .wallet-inline-address, nav .wallet-inline-address");

  const connected = !!(state && state.connected);
  if (usernameEl) usernameEl.style.display = connected ? "none" : "";
  if (piUserEl) piUserEl.style.display = connected ? "none" : "";
  if (statusIconEl) statusIconEl.style.display = connected ? "inline-block" : "none";

  headerBadges.forEach(badge => {
    badge.style.display = connected ? "none" : "";
  });
}

function initSmalaNameVisibility() {
  const refresh = () => syncSmalaNameVisibility(getWalletStateForNav());
  window.addEventListener("smaj:wallet-changed", (event) => {
    syncSmalaNameVisibility(event.detail || getWalletStateForNav());
  });
  document.addEventListener("DOMContentLoaded", refresh);
  refresh();
}

initSmalaNameVisibility();

function ensureDesktopWalletButton() {
  if (window.SmajWallet && typeof window.SmajWallet.init === "function") {
    window.SmajWallet.init();
    return;
  }

  const nav = document.getElementById("navMenu");
  if (!nav || nav.querySelector(".desktop-wallet-btn")) return;

  const desktopWalletBtn = document.createElement("button");
  desktopWalletBtn.type = "button";
  desktopWalletBtn.className = "wallet-btn desktop-wallet-btn";
  desktopWalletBtn.innerHTML = "<i class='bx bx-wallet'></i> Login with Pi";
  nav.appendChild(desktopWalletBtn);
}

function getStoredPiUser() {
  if (window.SmajWallet && typeof window.SmajWallet.getStoredPiUser === "function") {
    return window.SmajWallet.getStoredPiUser();
  }

  const raw = localStorage.getItem("pi_user");
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (_) {
    return null;
  }
}

function getWalletUser() {
  if (window.SmajWallet && typeof window.SmajWallet.getWalletUser === "function") {
    return window.SmajWallet.getWalletUser();
  }
  return getStoredUser() || getStoredPiUser();
}

function updateWalletButtonsUI() {
  if (window.SmajWallet && typeof window.SmajWallet.updateAllButtons === "function") {
    window.SmajWallet.updateAllButtons();
  }
}

function disconnectWallet() {
  if (window.SmajWallet && typeof window.SmajWallet.disconnectWallet === "function") {
    return window.SmajWallet.disconnectWallet();
  }

  clearAuth();
  updateWalletButtonsUI();
  return null;
}

async function connectWallet() {
  if (window.SmajWallet && typeof window.SmajWallet.connectWallet === "function") {
    return window.SmajWallet.connectWallet();
  }
  return null;
}

async function handleWalletButtonClick(btn) {
  if (!btn) return false;
  const state = window.SmajWallet && window.SmajWallet.getState ? window.SmajWallet.getState() : null;

  if (state && state.connected) {
    disconnectWallet();
    return true;
  }

  const result = await connectWallet();
  return !!result;
}

function bindWalletButtons() {
  if (window.SmajWallet && typeof window.SmajWallet.init === "function") {
    window.SmajWallet.init();
    return;
  }

  updateWalletButtonsUI();
  document.querySelectorAll(".wallet-btn").forEach((btn) => {
    if (btn.dataset.walletBound === "true") return;
    btn.dataset.walletBound = "true";
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      handleWalletButtonClick(btn);
    });
  });
}

ensureLogoHomeLink();
ensureDesktopWalletButton();
bindWalletButtons();

document.addEventListener("DOMContentLoaded", () => {
  ensureLogoHomeLink();
  ensureDesktopWalletButton();
  bindWalletButtons();
});


function setupSmajAiAssistant() {
  if (!document.body || document.getElementById("smajAiTrigger")) return;

  const AI_THINK_DELAY_MS = 10000;
  const ASSISTANT_API_URL = `${API_BASE}/api/assistant`;
  const chatHistory = [];

  const localKnowledgeBase = [
    {
      keywords: ['service', 'services', 'jobs', 'store', 'health', 'education', 'transport', 'charity', 'housing', 'ecosystem'],
      answer: 'SMAJ PI HUB services are listed on the Services page. You can access jobs, store, healthcare, education, transport, housing, charity, and more at pages/service.html.'
    },
    {
      keywords: ['pricing', 'price', 'plan', 'plans', 'cost', 'payment'],
      answer: 'You can check package details and platform pricing at pages/pricing.html.'
    },
    {
      keywords: ['wallet', 'connect', 'pi wallet', 'pi coin', 'balance'],
      answer: 'Use the Login with Pi button in the top navigation. After wallet connection, protected dashboard features become available.'
    },
    {
      keywords: ['dashboard', 'profile', 'finance', 'orders', 'analytics', 'notification', 'security'],
      answer: `Dashboard includes Overview, Profile, Wallet & Finance, Ecosystem, Orders, Jobs, Notifications, Analytics, and Security at ${DASHBOARD_URL}.`
    },
    {
      keywords: ['contact', 'support', 'help', 'team', 'email'],
      answer: 'Use the Contact page to submit support requests: pages/contact.html.'
    },
    {
      keywords: ['faq', 'question', 'questions', 'common issue'],
      answer: 'For common user questions, check pages/faq.html.'
    },
    {
      keywords: ['legal', 'privacy', 'terms', 'cookie', 'report abuse'],
      answer: 'Legal documents are available under pages/legal: Privacy, Terms, Cookie Policy, and Report Abuse.'
    }
  ];

  const trigger = document.createElement("button");
  trigger.id = "smajAiTrigger";
  trigger.className = "smaj-ai-trigger";
  trigger.type = "button";
  trigger.setAttribute("aria-label", "Open AI assistant");
  trigger.innerHTML = "?";

  const modal = document.createElement("div");
  modal.id = "smajAiModal";
  modal.className = "smaj-ai-modal";
  modal.innerHTML = `
    <div class="smaj-ai-overlay" data-ai-close="true"></div>
    <section class="smaj-ai-card" role="dialog" aria-modal="true" aria-label="SMAJ AI Assistant">
      <div class="smaj-ai-head">
        <button class="smaj-ai-close" id="smajAiClose" type="button" aria-label="Close assistant">&times;</button>
      </div>
      <div class="smaj-ai-body" id="smajAiBody">
        <div class="smaj-ai-content">
          <h3>Get <span>help</span> with anything SMAJ PI HUB</h3>
          <p>Fast answers. Powered by AI.</p>
        </div>
        <div class="smaj-ai-log" id="smajAiLog"></div>
      </div>
      <form class="smaj-ai-form" id="smajAiForm">
        <div class="smaj-ai-input-wrap">
          <input id="smajAiInput" type="text" placeholder="How can I help?" autocomplete="off">
          <button class="smaj-ai-send" type="submit" aria-label="Send message"><i class='bx bx-send'></i></button>
        </div>
      </form>
      <p class="smaj-ai-note">AI can make mistakes. Double-check for accuracy.</p>
    </section>
  `;

  document.body.appendChild(trigger);
  document.body.appendChild(modal);

  const closeBtn = modal.querySelector("#smajAiClose");
  const input = modal.querySelector("#smajAiInput");
  const form = modal.querySelector("#smajAiForm");
  const log = modal.querySelector("#smajAiLog");
  const sendBtn = modal.querySelector(".smaj-ai-send");

  const openModal = () => {
    modal.classList.add("open");
    document.body.classList.add("smaj-ai-open");
    setTimeout(() => input && input.focus(), 40);
  };

  const closeModal = () => {
    modal.classList.remove("open");
    document.body.classList.remove("smaj-ai-open");
  };

  const addMessage = (type, text) => {
    if (!log || !text) return null;
    const item = document.createElement("div");
    item.className = `smaj-ai-msg ${type}`;
    item.textContent = text;
    log.appendChild(item);
    log.scrollTop = log.scrollHeight;
    return item;
  };

  const normalize = (text) => (text || '').toLowerCase().replace(/\s+/g, ' ').trim();

  const getLocalReply = (prompt) => {
    const q = normalize(prompt);
    let best = null;
    let bestScore = 0;

    for (const item of localKnowledgeBase) {
      const score = item.keywords.reduce((acc, key) => acc + (q.includes(key) ? 1 : 0), 0);
      if (score > bestScore) {
        bestScore = score;
        best = item;
      }
    }

    if (best && bestScore > 0) return best.answer;
    if (q.includes('hello') || q.includes('hi')) {
      return 'Hello. Ask me about SMAJ PI HUB services, dashboard, wallet, pricing, support, or legal pages.';
    }
    return 'I can help with SMAJ PI HUB pages, services, wallet flow, dashboard access, pricing, and support. Please ask a specific SMAJ PI HUB question.';
  };

  const fetchAssistantReply = async (prompt) => {
    try {
      const response = await fetch(ASSISTANT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          history: chatHistory.slice(-8)
        })
      });

      if (!response.ok) throw new Error(`Assistant API HTTP ${response.status}`);

      const data = await response.json();
      if (data && data.success && typeof data.reply === 'string' && data.reply.trim()) {
        return data.reply.trim();
      }
    } catch (error) {
      console.warn('[SMAJ assistant] backend unavailable, using local fallback:', error.message);
    }

    return getLocalReply(prompt);
  };

  const setInputState = (disabled) => {
    if (input) input.disabled = disabled;
    if (sendBtn) sendBtn.disabled = disabled;
  };

  trigger.addEventListener("click", openModal);
  closeBtn && closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    const target = e.target;
    if (target && target.dataset && target.dataset.aiClose === "true") closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
  });

  form && form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!input) return;

    const value = input.value.trim();
    if (!value) return;

    addMessage('user', value);
    chatHistory.push({ role: 'user', content: value });
    input.value = '';
    setInputState(true);

    const thinkingBubble = addMessage('bot', 'Thinking...');

    window.setTimeout(async () => {
      const reply = await fetchAssistantReply(value);

      if (thinkingBubble && thinkingBubble.parentNode) {
        thinkingBubble.parentNode.removeChild(thinkingBubble);
      }

      addMessage('bot', reply);
      chatHistory.push({ role: 'assistant', content: reply });

      setInputState(false);
      if (input) input.focus();
    }, AI_THINK_DELAY_MS);
  });
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupSmajAiAssistant);
} else {
  setupSmajAiAssistant();
}

// Initialize loader for all pages immediately
ensureAppUiPrimitives();

// Global Page Load Handler to dismiss the preloader
window.addEventListener('load', () => {
  // Slight timeout for a smoother visual transition
  setTimeout(() => setAppLoading(false), 300);
});

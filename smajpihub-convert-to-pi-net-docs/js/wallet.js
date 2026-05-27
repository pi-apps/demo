(function () {
  const STORAGE_KEY = "smaj_wallet_state";
  const USER_KEY = "smaj_user";
  const TOKEN_KEY = "smaj_token";
  const PI_USER_KEY = "pi_user";
  const PI_ADDRESS_KEY = "pi_wallet_address";
  const DASHBOARD_EXTERNAL_URL = "https://officialsmaj.github.io/smaj-ecosystem-dashboard/";
  const DASHBOARD_HOSTNAME = "officialsmaj.github.io";
  window.SmajDashboardUrl = window.SmajDashboardUrl || DASHBOARD_EXTERNAL_URL;
  const USERNAME_DENYLIST = new Set(["smaj_user", "smaj pioneer", "pioneer"]);

  const CONNECT_TEXT = "Login with Pi";
  const DISCONNECT_TEXT = "Log Out";
  const CONNECTING_TEXT = "Connecting...";
  const PROTECTED_REDIRECT_KEY = "smaj_protected_redirect";
  const API_BASE = getApiBase();
  const DASHBOARD_SSO_ENDPOINT = `${API_BASE}/api/dashboard/sso-token`;

  let isConnecting = false;
  let environmentAlertShown = false;
  let isPiWalletReady = false;
  let hasDetectionRun = false;
  let detectionPromise = null;
  let piInitialized = false;

  const DETECTION_RETRIES = 3;
  const DETECTION_DELAY_MS = 350;

  function safeParse(raw) {
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (_) {
      return null;
    }
  }

  function shortenAddress(address) {
    const value = String(address || "").trim();
    if (value.length <= 10) return value;
    return `${value.slice(0, 6)}...${value.slice(-4)}`;
  }

  function getState() {
    return safeParse(localStorage.getItem(STORAGE_KEY)) || { connected: false, address: "" };
  }

  function persistState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function clearStoredSession() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PI_USER_KEY);
    localStorage.removeItem(PI_ADDRESS_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  function storeConnectedSession(address, accountPayload) {
    const walletAddress = String(address || "").trim();
    const profile = createPiUserRecord(accountPayload, walletAddress);
    const state = {
      connected: true,
      address: walletAddress,
      displayName: profile.displayName,
      updatedAt: Date.now()
    };
    const user = {
      username: profile.username || profile.displayName,
      uid: profile.uid,
      displayName: profile.displayName,
      walletAddress
    };

    persistState(state);
    localStorage.setItem(PI_USER_KEY, JSON.stringify(user));
    localStorage.setItem(PI_ADDRESS_KEY, walletAddress);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem(TOKEN_KEY, "wallet-session");
    localStorage.setItem("token", "wallet-session");
  }

  function getStoredPiUser() {
    return safeParse(localStorage.getItem(PI_USER_KEY));
  }

  function getStoredUser() {
    return safeParse(localStorage.getItem(USER_KEY));
  }

  function getWalletUser() {
    return getStoredUser() || getStoredPiUser();
  }

  function getAppPrefix() {
    const path = window.location.pathname.replace(/\\/g, "/");
    const host = window.location.hostname.toLowerCase();

    if (host.endsWith("github.io")) {
      const parts = path.split("/").filter(Boolean);
      if (parts.length > 0) return `/${parts[0]}/`;
    }

    return "/";
  }

  function getApiBase() {
    const origin = window.location.origin || "";
    if (origin && origin !== "null" && !origin.startsWith("file:")) {
      return origin.replace(/\/$/, "");
    }
    return "http://localhost:3000";
  }

  function appPath(target) {
    if (!target || /^https?:\/\//i.test(target)) return target;
    const normalized = target.replace(/^\/+/, "");
    return `${getAppPrefix()}${normalized}`;
  }

  function getDefaultDashboardTarget() {
    return window.SmajDashboardUrl || DASHBOARD_EXTERNAL_URL;
  }

  function isExternalDashboardTarget(target) {
    if (!target) return false;
    const text = String(target).trim();
    if (!text) return false;
    try {
      const url = new URL(text, window.location.origin);
      return url.host.toLowerCase().includes(DASHBOARD_HOSTNAME);
    } catch (_) {
      return text.toLowerCase().includes(DASHBOARD_HOSTNAME);
    }
  }

  function isDashboardPage() {
    const path = window.location.pathname.replace(/\\/g, "/").toLowerCase();
    if (isExternalDashboardTarget(window.location.href)) return true;
    return path.includes("/pages/dashboard/client.html");
  }

  function redirectToDashboard() {
    if (isDashboardPage()) return;
    redirectToDashboardWithSSO(getDefaultDashboardTarget());
  }

  function sanitizeInternalTarget(target) {
    const fallback = getDefaultDashboardTarget();
    if (!target) return fallback;

    if (isExternalDashboardTarget(target)) return target;

    try {
      const url = new URL(target, window.location.origin);
      if (url.origin !== window.location.origin) return fallback;
      return `${url.pathname}${url.search}${url.hash}`;
    } catch (_) {
      if (/^https?:\/\//i.test(target)) return fallback;
      return appPath(String(target).replace(/^\/+/, ""));
    }
  }

  function getSessionToken() {
    return localStorage.getItem(TOKEN_KEY) || localStorage.getItem("token");
  }

  function buildAuthHeaders() {
    const headers = {};
    const token = getSessionToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  }

  async function fetchDashboardRedirect(target) {
    const fallback = target || getDefaultDashboardTarget();
    const token = getSessionToken();
    if (!token) return fallback;
    const params = new URLSearchParams();
    if (target) {
      params.set("redirect", target);
    }
    const query = params.toString();
    const url = `${DASHBOARD_SSO_ENDPOINT}${query ? `?${query}` : ""}`;
    try {
      const response = await fetch(url, {
        headers: buildAuthHeaders(),
        cache: "no-store"
      });
      if (!response.ok) {
        return fallback;
      }
      const body = await response.json().catch(() => ({}));
      return body.redirectUrl || fallback;
    } catch (error) {
      console.warn("Dashboard SSO fetch failed:", error);
      return fallback;
    }
  }

  function redirectToDashboardWithSSO(target) {
    const safeTarget = sanitizeInternalTarget(target || getDefaultDashboardTarget());
    if (!safeTarget) return;
    const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (current === safeTarget) return;

    (async function () {
      const redirectUrl = await fetchDashboardRedirect(safeTarget);
      window.location.replace(redirectUrl || safeTarget);
    })();
  }

  function rememberProtectedTarget(target) {
    const safeTarget = sanitizeInternalTarget(target || getDefaultDashboardTarget());
    sessionStorage.setItem(PROTECTED_REDIRECT_KEY, safeTarget);
    return safeTarget;
  }

  function consumeProtectedTarget() {
    const value = sessionStorage.getItem(PROTECTED_REDIRECT_KEY);
    sessionStorage.removeItem(PROTECTED_REDIRECT_KEY);
    return value ? sanitizeInternalTarget(value) : "";
  }

  function redirectToTarget(target) {
    const safeTarget = sanitizeInternalTarget(target || getDefaultDashboardTarget());
    const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (current === safeTarget) return;
    redirectToDashboardWithSSO(safeTarget);
  }

  function updateAddressBadge(btn, state, opts) {
    if (!btn || !btn.parentElement) return;

    const previous = btn.parentElement.querySelector(`[data-wallet-address-for="${btn.dataset.walletId || ""}"]`);
    if (previous) previous.remove();
    if (!state.connected || !state.address) return;

    if (opts && opts.skipAddressBadge) return;

    if (!btn.dataset.walletId) {
      btn.dataset.walletId = `wallet-${Math.random().toString(36).slice(2, 10)}`;
    }

    const badge = document.createElement("span");
    badge.className = "wallet-inline-address";
    badge.dataset.walletAddressFor = btn.dataset.walletId;
    const label = state.displayName || shortenAddress(state.address);
    badge.textContent = label;
    badge.title = state.address || label;
    badge.style.marginLeft = "8px";
    badge.style.fontSize = "0.82rem";
    badge.style.opacity = "0.9";
    badge.style.whiteSpace = "nowrap";
    btn.insertAdjacentElement("afterend", badge);
  }

  function animateButton(btn) {
    if (!btn || typeof btn.animate !== "function") return;
    btn.animate(
      [
        { transform: "scale(1)", opacity: 1 },
        { transform: "scale(0.97)", opacity: 0.9 },
        { transform: "scale(1)", opacity: 1 }
      ],
      { duration: 180, easing: "ease-out" }
    );
  }

  function updateButton(btn, state, opts) {
    if (!btn) return;
    const isConnected = !!state.connected;
    const options = opts || {};
    const label = options.busyLabel || (isConnected ? DISCONNECT_TEXT : CONNECT_TEXT);

    btn.type = "button";
    btn.dataset.walletConnected = isConnected ? "true" : "false";
    btn.title = isPiWalletReady ? "" : "Open this site in Pi Browser to connect wallet";

    if (btn.classList.contains("wallet-btn")) {
      btn.innerHTML = `<i class='bx bx-wallet'></i> ${label}`;
    } else {
      btn.textContent = label;
    }

    btn.classList.toggle("connected", isConnected);
    btn.setAttribute("aria-pressed", isConnected ? "true" : "false");

    updateAddressBadge(btn, state, options);
    animateButton(btn);
  }

  function updateAllButtons(opts) {
    const state = getState();
    document.querySelectorAll(".wallet-btn").forEach(function (btn) {
      const buttonOpts = Object.assign({}, opts || {});
      if (btn.classList.contains("desktop-wallet-btn") || btn.closest("header") || btn.closest("nav")) {
        buttonOpts.skipAddressBadge = true;
      }
      updateButton(btn, state, buttonOpts);
    });

    const heroBtn = document.getElementById("connectWalletAction");
    if (heroBtn) {
      const heroOpts = Object.assign({}, opts, { skipAddressBadge: true });
      updateButton(heroBtn, state, heroOpts);
    }

    document.querySelectorAll('[data-wallet-connect="true"]').forEach(function (el) {
      el.dataset.walletConnected = state.connected ? "true" : "false";
    });

    window.dispatchEvent(new CustomEvent("smaj:wallet-changed", { detail: state }));
  }

  function ensureDesktopWalletButton() {
    const nav = document.getElementById("navMenu");
    if (!nav || nav.querySelector(".desktop-wallet-btn")) return;

    const btn = document.createElement("button");
    btn.className = "wallet-btn desktop-wallet-btn";
    btn.type = "button";
    nav.appendChild(btn);
  }

  function detectPiWalletEnvironment(showAlert) {
    if (typeof window.Pi === "undefined") {
      isPiWalletReady = false;
      if (showAlert && !environmentAlertShown) {
        environmentAlertShown = true;
        alert("Pi Wallet not detected. Please open this site in Pi Browser.");
      }
      return false;
    }

    const hasRequest = typeof window.Pi.request === "function";
    const hasAuthenticate = typeof window.Pi.authenticate === "function";
    isPiWalletReady = hasRequest || hasAuthenticate;

    if (!isPiWalletReady && showAlert && !environmentAlertShown) {
      environmentAlertShown = true;
      alert("Pi Wallet not detected. Please open this site in Pi Browser.");
    }

    return isPiWalletReady;
  }

  function wait(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  async function ensurePiWalletDetected(showAlert) {
    if (isPiWalletReady) return true;

    for (let attempt = 0; attempt < DETECTION_RETRIES; attempt += 1) {
      if (detectPiWalletEnvironment(false)) return true;
      await wait(DETECTION_DELAY_MS);
    }

    return detectPiWalletEnvironment(!!showAlert);
  }

  function runWalletDetection(showAlert) {
    if (detectionPromise) return detectionPromise;
    detectionPromise = ensurePiWalletDetected(showAlert)
      .finally(function () {
        detectionPromise = null;
      });
    return detectionPromise;
  }

  function resolveAddress(accountPayload) {
    if (!accountPayload) return "";
    const direct = accountPayload.address || accountPayload.walletAddress || accountPayload.wallet_address;
    if (direct) return String(direct || "").trim();

    if (accountPayload.result) {
      const fromResult = resolveAddress(accountPayload.result);
      if (fromResult) return fromResult;
    }

    if (accountPayload.data) {
      const fromData = resolveAddress(accountPayload.data);
      if (fromData) return fromData;
    }

    if (accountPayload.user) {
      const fromUser = resolveAddress(accountPayload.user);
      if (fromUser) return fromUser;
    }

    if (Array.isArray(accountPayload.wallets) && accountPayload.wallets.length > 0) {
      const primary = accountPayload.wallets.find(function (w) { return w && w.primary; }) || accountPayload.wallets[0];
      if (primary) {
        const fromWallet = resolveAddress(primary);
        if (fromWallet) return fromWallet;
      }
    }

    return "";
  }

  function resolvePiIdentityFallback(accountPayload) {
    if (!accountPayload || typeof accountPayload !== "object") return "";

    const user = accountPayload.user || (accountPayload.result && accountPayload.result.user) || null;
    const uid = user && user.uid ? String(user.uid).trim() : "";
    const username = user && user.username ? String(user.username).trim() : "";
    const existing = String(localStorage.getItem(PI_ADDRESS_KEY) || "").trim();

    if (existing) return existing;
    if (uid) return `pi-user-${uid}`;
    if (username) return `pi-user-${username}`;
    return "";
  }

  function parsePiUserSuffix(value) {
    if (!value) return "";
    const match = String(value).match(/^pi-user-(.+)$/i);
    return match ? match[1] : "";
  }

  function getValueByPath(source, path) {
    if (!source || typeof source !== "object") return undefined;
    return path.reduce((current, key) => {
      if (!current || typeof current !== "object") return undefined;
      return current[key];
    }, source);
  }

  function findPreferredUserName(accountPayload) {
    if (!accountPayload || typeof accountPayload !== "object") return "";

    const targets = [
      accountPayload,
      accountPayload.user,
      accountPayload.result,
      accountPayload.result && accountPayload.result.user,
      accountPayload.data,
      accountPayload.data && accountPayload.data.user,
      accountPayload.identity,
      accountPayload.profile
    ];

    const paths = [
      ["username"],
      ["name"],
      ["displayName"],
      ["handle"],
      ["identity", "username"],
      ["identity", "handle"],
      ["profile", "username"],
      ["profile", "name"]
    ];

    for (const target of targets) {
      if (!target || typeof target !== "object") continue;
      for (const path of paths) {
        const value = getValueByPath(target, path);
        if (!value || typeof value !== "string") continue;
        const normalized = value.toLowerCase().replace(/^@/, "").trim();
        if (!normalized) continue;
        if (USERNAME_DENYLIST.has(normalized)) continue;
        return value.trim();
      }
    }

    return "";
  }

  function findPiUserSegment(accountPayload) {
    if (!accountPayload || typeof accountPayload !== "object") return null;
    const candidates = [
      accountPayload.user,
      accountPayload.result && accountPayload.result.user,
      accountPayload.result,
      accountPayload.data && accountPayload.data.user,
      accountPayload.data,
      accountPayload
    ];

    for (const candidate of candidates) {
      if (!candidate) continue;
      if (candidate.username || candidate.uid || candidate.id || candidate.userId) {
        return candidate;
      }
    }

    return null;
  }

  function resolvePiDisplayInfo(accountPayload, fallbackAddress) {
    const username = findPreferredUserName(accountPayload);
    const candidate = findPiUserSegment(accountPayload);
    let uid = "";

    if (candidate) {
      if (candidate.uid) uid = String(candidate.uid).trim();
      if (!uid && candidate.id) uid = String(candidate.id).trim();
      if (!uid && candidate.userId) uid = String(candidate.userId).trim();
    }

    let displayName = username || uid;
    if (!displayName && fallbackAddress) {
      const suffix = parsePiUserSuffix(fallbackAddress);
      if (suffix) displayName = suffix;
    }
    if (!displayName && fallbackAddress) {
      displayName = fallbackAddress;
    }

    return { username, uid, displayName };
  }

  function createPiUserRecord(accountPayload, fallbackAddress) {
    const walletAddress = String(fallbackAddress || "").trim();
    const displayInfo = resolvePiDisplayInfo(accountPayload, walletAddress);
    const username = displayInfo.username || displayInfo.displayName || "";
    const uid = displayInfo.uid || "";
    const displayName = displayInfo.displayName || walletAddress;

    return {
      username,
      uid,
      displayName,
      walletAddress
    };
  }

  function ensurePiInit() {
    if (piInitialized || !window.Pi || typeof window.Pi.init !== "function") return;
    try {
      window.Pi.init({ version: "2.0", sandbox: true });
      piInitialized = true;
    } catch (error) {
      console.warn("Pi init warning:", error);
    }
  }

  async function requestPiAccount() {
    ensurePiInit();

    if (window.Pi && typeof window.Pi.request === "function") {
      return window.Pi.request({ method: "getAccount" });
    }

    if (window.Pi && typeof window.Pi.authenticate === "function") {
      return window.Pi.authenticate(["username", "payments"], function () {});
    }

    return null;
  }

  async function connectWallet(options) {
    if (isConnecting) return getState();
    const opts = options || {};
    const hasPiWallet = await runWalletDetection(true);
    if (!hasPiWallet) return getState();
    const requestedTarget = opts.redirectTo || consumeProtectedTarget() || getDefaultDashboardTarget();
    const safeTarget = sanitizeInternalTarget(requestedTarget);

    const current = getState();
    if (current.connected && current.address) {
      updateAllButtons();
      if (opts.redirect !== false) redirectToTarget(safeTarget);
      return current;
    }

    isConnecting = true;
    updateAllButtons({ busyLabel: CONNECTING_TEXT, skipAddressBadge: true });

    try {
      const account = await requestPiAccount();
      const address = resolveAddress(account) || resolvePiIdentityFallback(account);

      if (!address) {
        alert("Wallet connection failed: no wallet address received");
        updateAllButtons();
        return current;
      }

      storeConnectedSession(address, account);
      updateAllButtons();
      alert("Wallet connected successfully.");
      if (opts.redirect !== false) redirectToTarget(safeTarget);
      return getState();
    } catch (error) {
      console.error("Wallet connect failed:", error);
      alert("Wallet connection failed: no wallet address received");
      updateAllButtons();
      return current;
    } finally {
      isConnecting = false;
    }
  }

  function disconnectWallet() {
    clearStoredSession();
    persistState({ connected: false, address: "", updatedAt: Date.now() });
    updateAllButtons();
    alert("Wallet disconnected successfully.");
    return getState();
  }

  function toggleWallet() {
    const state = getState();
    if (state.connected) return disconnectWallet();
    return connectWallet();
  }

  function bindWalletButtons() {
    document.querySelectorAll(".wallet-btn, #connectWalletAction").forEach(function (btn) {
      if (btn.dataset.walletBound === "true") return;
      btn.dataset.walletBound = "true";
      btn.addEventListener("click", function (event) {
        event.preventDefault();
        toggleWallet();
      });
    });
  }

  function bindWalletConnectLinks() {
    document.querySelectorAll('[data-wallet-connect="true"]').forEach(function (el) {
      if (el.dataset.walletConnectBound === "true") return;
      el.dataset.walletConnectBound = "true";

      el.addEventListener("click", function (event) {
        const state = getState();
        if (state.connected) return;
        event.preventDefault();
        const href = el.getAttribute("href") || "pages/dashboard/client.html";
        requestProtectedAccess(href);
      });
    });
  }

  function ensureProtectedAccessModal() {
    let modal = document.getElementById("walletAccessModal");
    if (modal) return modal;

    modal = document.createElement("div");
    modal.id = "walletAccessModal";
    modal.className = "wallet-access-modal";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
      <div class="wallet-access-backdrop" data-wallet-modal-close="true"></div>
      <div class="wallet-access-dialog" role="dialog" aria-modal="true" aria-labelledby="walletAccessTitle">
        <h3 id="walletAccessTitle">Wallet Required</h3>
        <p>Please connect your wallet first to access this feature.</p>
        <div class="wallet-access-actions">
          <button type="button" class="wallet-access-btn connect" id="walletAccessConnectBtn">Login with Pi</button>
          <button type="button" class="wallet-access-btn cancel" id="walletAccessCancelBtn">Cancel</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const close = function () {
      modal.classList.remove("show");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("wallet-modal-open");
      sessionStorage.removeItem(PROTECTED_REDIRECT_KEY);
    };

    modal.addEventListener("click", function (event) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.hasAttribute("data-wallet-modal-close")) close();
    });

    const cancelBtn = modal.querySelector("#walletAccessCancelBtn");
    if (cancelBtn) cancelBtn.addEventListener("click", close);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && modal.classList.contains("show")) close();
    });

    return modal;
  }

  function openProtectedAccessModal(target) {
    const modal = ensureProtectedAccessModal();
    const connectBtn = modal.querySelector("#walletAccessConnectBtn");
    const safeTarget = rememberProtectedTarget(target || getDefaultDashboardTarget());

    if (connectBtn) {
      connectBtn.onclick = function () {
        sessionStorage.removeItem(PROTECTED_REDIRECT_KEY);
        modal.classList.remove("show");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("wallet-modal-open");
        connectWallet({ redirectTo: safeTarget });
      };
    }

    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("wallet-modal-open");
  }

  function requestProtectedAccess(target) {
    const state = getState();
    const safeTarget = sanitizeInternalTarget(target || getDefaultDashboardTarget());

    if (state.connected) {
      redirectToDashboardWithSSO(safeTarget);
      return true;
    }

    openProtectedAccessModal(safeTarget);
    return false;
  }

  async function initializeWalletState() {
    const hasPiEnv = await runWalletDetection(false);
    hasDetectionRun = true;
    const rawState = getState();
    const storedAddress = String(localStorage.getItem(PI_ADDRESS_KEY) || rawState.address || "").trim();
    const connected = !!storedAddress;
    const storedUser = getStoredPiUser();
    const displayName = (storedUser && storedUser.displayName) || rawState.displayName || "";
    const next = {
      connected,
      address: connected ? storedAddress : "",
      displayName,
      updatedAt: Date.now()
    };

    persistState(next);
    updateAllButtons();

    if (!hasPiEnv) return;
  }

  function init() {
    ensureDesktopWalletButton();
    bindWalletButtons();
    bindWalletConnectLinks();
    initializeWalletState();
  }

  window.SmajWallet = {
    init,
    getState,
    getWalletUser,
    getStoredPiUser,
    connectWallet,
    disconnectWallet,
    toggleWallet,
    updateAllButtons,
    shortenAddress,
    requestProtectedAccess
  };

  window.getStoredPiUser = getStoredPiUser;
  window.getWalletUser = getWalletUser;
  window.connectWallet = connectWallet;
  window.disconnectWallet = disconnectWallet;

  window.addEventListener("storage", function (event) {
    if (event.key === STORAGE_KEY || event.key === PI_USER_KEY || event.key === PI_ADDRESS_KEY || event.key === USER_KEY) {
      if (hasDetectionRun) {
        const rawState = getState();
        const storedAddress = String(localStorage.getItem(PI_ADDRESS_KEY) || rawState.address || "").trim();
        const storedUser = getStoredPiUser();
        const displayName = (storedUser && storedUser.displayName) || rawState.displayName || "";
        persistState({
          connected: !!storedAddress,
          address: storedAddress,
          displayName,
          updatedAt: Date.now()
        });
        updateAllButtons();
        return;
      }
      initializeWalletState();
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

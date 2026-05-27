(function () {
  const walletState = document.getElementById("walletState");
  const walletHint = document.getElementById("walletHint");
  const sessionLog = document.getElementById("sessionLog");
  const connectWalletAction = document.getElementById("connectWalletAction");
  const DASHBOARD_URL = window.SmajDashboardUrl || "pages/dashboard/client.html";

  if (!walletState || !walletHint || !sessionLog || !connectWalletAction) {
    return;
  }

  const getState = () => {
    if (window.SmajWallet && typeof window.SmajWallet.getState === "function") {
      return window.SmajWallet.getState();
    }

    return { connected: !!localStorage.getItem("pi_user"), address: localStorage.getItem("pi_wallet_address") || "" };
  };

  const setWalletUI = () => {
    const state = getState();

    if (state.connected) {
      const displayName = state.displayName || (window.SmajWallet && window.SmajWallet.shortenAddress
        ? window.SmajWallet.shortenAddress(state.address)
        : (state.address || "Connected"));

      walletState.textContent = `Connected: ${displayName}`;
      walletState.classList.remove("disconnected");
      walletState.classList.add("connected");
      walletHint.textContent = "One-click access is enabled for connected platforms.";
      connectWalletAction.textContent = "Disconnect Wallet";
      connectWalletAction.disabled = false;
      sessionLog.textContent = "Hub session ready for cross-platform access.";
      return;
    }

    walletState.textContent = "Not Connected";
    walletState.classList.remove("connected");
    walletState.classList.add("disconnected");
    walletHint.textContent = "Connect wallet in header to enable direct platform entry.";
    connectWalletAction.textContent = "Connect Wallet";
    connectWalletAction.disabled = false;
    sessionLog.textContent = "Waiting for wallet connection.";
  };

  // Wallet button clicks are handled globally by js/wallet.js.

  const redirectToSmajStore = async () => {
    const token = localStorage.getItem("smaj_token");
    const user = localStorage.getItem("smaj_user");

    if (token && user) {
      sessionLog.textContent = "SMAJ Store: Generating SSO token...";
      try {
        const response = await fetch("http://localhost:3000/api/sso-token?service=smajstore", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        const data = await response.json();

        if (data.success && data.redirectUrl) {
          sessionLog.textContent = "SMAJ Store: Redirecting with SSO...";
          window.location.href = data.redirectUrl;
          return true;
        }
      } catch (error) {
        console.error("SSO token error:", error);
      }
    }
    return false;
  };

  function setupServiceCardAccessGate() {
    const ecosystemGrid = document.querySelector(".ecosystem-grid");
    if (!ecosystemGrid) return;

    ecosystemGrid.addEventListener("click", async (event) => {
      const card = event.target.closest(".eco-card");
      if (!card) return;
      const clickedAction = event.target.closest("a, button");
      const cardLink = card.querySelector("a[href]");

      const state = getState();
      const title = (card.querySelector("h3") && card.querySelector("h3").textContent || "Service").trim();
      const isComingSoon = card.dataset.comingSoon === "true";
      const isStoreCard = /smaj\s*store/i.test(title);

      if (!state.connected) {
        event.preventDefault();
        event.stopPropagation();
        sessionLog.textContent = `${title}: blocked until wallet connection.`;
        const target = (clickedAction && clickedAction.tagName.toLowerCase() === "a" && clickedAction.getAttribute("href"))
          || (cardLink && cardLink.getAttribute("href"))
          || DASHBOARD_URL;

        if (window.SmajWallet && typeof window.SmajWallet.requestProtectedAccess === "function") {
          window.SmajWallet.requestProtectedAccess(target);
        } else {
          alert("Please connect your wallet first to access this feature.");
        }
        return;
      }

      sessionLog.textContent = `${title}: access granted.`;

      if (isComingSoon) {
        event.preventDefault();
        alert("This feature is coming soon.");
        return;
      }

      if (isStoreCard && clickedAction && clickedAction.tagName.toLowerCase() === "a") {
        const ssoSuccess = await redirectToSmajStore();
        if (ssoSuccess) {
          event.preventDefault();
        }
        return;
      }

      if (!clickedAction && cardLink) {
        window.location.href = cardLink.href;
      }
    });
  }

  window.addEventListener("storage", setWalletUI);
  window.addEventListener("smaj:wallet-changed", setWalletUI);
  setupServiceCardAccessGate();
  setWalletUI();
})();

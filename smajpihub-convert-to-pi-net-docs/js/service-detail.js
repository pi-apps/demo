console.log("Service Detail page loaded");

function isWalletConnected() {
  if (window.SmajWallet && typeof window.SmajWallet.getState === "function") {
    const state = window.SmajWallet.getState();
    return !!(state && state.connected);
  }
  return !!localStorage.getItem("pi_wallet_address");
}

function guardProtectedAction(target) {
  if (isWalletConnected()) return true;

  if (window.SmajWallet && typeof window.SmajWallet.requestProtectedAccess === "function") {
    window.SmajWallet.requestProtectedAccess(target || window.location.pathname);
  } else {
    alert("Please connect your wallet first to access this feature.");
  }

  return false;
}

document.getElementById("buyNow")?.addEventListener("click", (event) => {
  event.preventDefault();
  if (!guardProtectedAction(window.location.pathname + "#buyNow")) return;
  alert("Proceeding with wallet-protected purchase.");
});

document.getElementById("addToCart")?.addEventListener("click", (event) => {
  event.preventDefault();
  if (!guardProtectedAction(window.location.pathname + "#addToCart")) return;
  alert("Service added to cart successfully!");
});

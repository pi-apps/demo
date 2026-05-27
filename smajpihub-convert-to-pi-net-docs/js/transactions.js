(function () {
  const sendForm = document.getElementById("sendPiForm");
  const receiveForm = document.getElementById("receivePiForm");
  const historyList = document.getElementById("transactionList");
  const historyEmpty = document.getElementById("transactionHistoryEmpty");
  const historyCount = document.getElementById("transactionHistoryCount");
  const clearHistoryBtn = document.getElementById("clearTransactionHistory");

  if (!sendForm || !receiveForm || !historyList || !historyCount || !historyEmpty || !clearHistoryBtn) {
    return;
  }

  const API_BASE = window.SmajApiEndpoint || (() => {
    if (window.location.origin && window.location.origin !== "null" && !window.location.origin.startsWith("file:")) {
      return window.location.origin.replace(/\/$/, "");
    }
    return "http://localhost:3000";
  })();

  const API_URL = `${API_BASE}/api`;

  function getToken() {
    return localStorage.getItem("smaj_token") || localStorage.getItem("token");
  }

  function getHeaders() {
    const headers = {
      "Content-Type": "application/json"
    };
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  }

  function isWalletConnected() {
    const state = window.SmajWallet && typeof window.SmajWallet.getState === "function"
      ? window.SmajWallet.getState()
      : {};

    return Boolean(state.connected) && Boolean(getToken());
  }

  function notify(message, type = "info") {
    if (window.appNotify) {
      window.appNotify(message, type);
      return;
    }
    const prefix = type === "error" ? "Error:" : type === "warning" ? "Warning:" : "";
    alert(`${prefix} ${message}`);
  }

  function formatAmount(value) {
    const amount = Number(value);
    if (!Number.isFinite(amount)) return "0.00";
    return amount.toFixed(2);
  }

  function formatDate(value) {
    try {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return "–";
      return date.toLocaleString(undefined, { hour12: true });
    } catch (_) {
      return "–";
    }
  }

  function renderHistory(records, fallback = "Saved transactions will appear here.") {
    const list = Array.isArray(records) ? records : [];
    historyCount.textContent = list.length
      ? `${list.length} record${list.length === 1 ? "" : "s"}`
      : "No records yet";
    historyEmpty.textContent = list.length ? "" : fallback;
    historyEmpty.style.display = list.length ? "none" : "block";

    if (!list.length) {
      historyList.innerHTML = "";
      return;
    }

    const items = list.map((record) => {
      const typeLabel = record.type === "receive" ? "Received Pi" : "Sent Pi";
      const counterpartyLabel = record.counterparty || "Unknown counterparty";
      const noteMarkup = record.note ? `<span class="transaction-meta">${record.note}</span>` : "";
      const statusBadge = record.status ? `<span class="transaction-meta">${record.status}</span>` : "";
      return `
        <li class="transaction-item">
          <div class="transaction-detail">
            <span class="transaction-type">${typeLabel}</span>
            <span class="transaction-meta">${counterpartyLabel}</span>
            ${noteMarkup}
          </div>
          <div class="transaction-detail">
            <span class="transaction-type">${formatAmount(record.amount)} Pi</span>
            <span class="transaction-meta">${formatDate(record.createdAt)}</span>
            ${statusBadge}
          </div>
        </li>
      `;
    });

    historyList.innerHTML = items.join("");
  }

  async function fetchHistory() {
    if (!isWalletConnected()) {
      renderHistory([], "Connect your Pi wallet to load transaction history.");
      setFormState(false);
      return [];
    }

    try {
      const response = await fetch(`${API_URL}/pi/transactions`, {
        method: "GET",
        headers: getHeaders()
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Unable to load transaction history.");
      }

      const payload = await response.json();
      const records = Array.isArray(payload.transactions) ? payload.transactions : [];
      renderHistory(records);
      setFormState(true);
      return records;
    } catch (error) {
      console.error("Transaction history error", error);
      renderHistory([], "Unable to reach SMAJ PI HUB API. Try reconnecting.");
      setFormState(false);
      return [];
    }
  }

  function setFormState(enabled) {
    const state = Boolean(enabled && isWalletConnected());
    [sendForm, receiveForm].forEach((form) => {
      if (!form) return;
      const button = form.querySelector("button[type='submit']");
      if (button) button.disabled = !state;
    });

    clearHistoryBtn.disabled = !state;
  }

  async function capturePiSignature(payload) {
    if (!window.Pi) return null;
    try {
      const message = `Authorize ${payload.type} ${payload.amount} Pi to ${payload.counterparty} at ${new Date().toISOString()}`;
      if (typeof window.Pi.request === "function") {
        return await window.Pi.request({
          method: "signMessage",
          params: { message }
        });
      }
    } catch (error) {
      console.warn("Pi signing failed", error);
    }
    return null;
  }

  async function postTransaction(data) {
    const response = await fetch(`${API_URL}/pi/transactions`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data)
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.message || "Transaction request failed.");
    }

    return payload.transaction || {};
  }

  async function handleForm(event, type) {
    event.preventDefault();
    if (!isWalletConnected()) {
      notify("Connect your Pi wallet before submitting transactions.", "warning");
      return;
    }

    const form = event.currentTarget;
    const rawAmount = form.elements.amount?.value;
    const amount = Number(rawAmount);
    const counterpartyField = type === "send" ? form.elements.recipient : form.elements.sender;
    const counterparty = counterpartyField ? counterpartyField.value.trim() : "";
    const note = form.elements.note ? form.elements.note.value.trim() : "";

    if (!amount || Number.isNaN(amount) || amount <= 0) {
      notify("Enter a valid Pi amount.", "error");
      return;
    }

    if (!counterparty) {
      notify("Add a counterparty (Pi ID or wallet address).", "error");
      return;
    }

    setFormState(false);
    const payload = {
      type,
      amount,
      counterparty,
      note
    };

    try {
      const piPayload = await capturePiSignature(payload);
      if (piPayload) {
        payload.piPayload = piPayload;
      }

      await postTransaction(payload);
      notify(`Transaction submitted: ${type === "send" ? "Sent" : "Received"} ${formatAmount(amount)} Pi.`, "info");
      await fetchHistory();
      form.reset();
      form.elements.amount.focus();
    } catch (error) {
      console.error("Transaction submit error", error);
      notify(error.message || "Unable to process transaction.", "error");
      setFormState(isWalletConnected());
    }
  }

  clearHistoryBtn.addEventListener("click", async () => {
    if (!isWalletConnected()) {
      notify("Connect your wallet before clearing history.", "warning");
      return;
    }

    const confirmed = window.confirm("This will delete your transaction history. Continue?");
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/pi/transactions`, {
        method: "DELETE",
        headers: getHeaders()
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Unable to clear history.");
      }
      renderHistory([], "Transaction history cleared.");
      notify("Transaction history cleared.", "info");
    } catch (error) {
      console.error("Clear history error", error);
      notify(error.message || "Unable to clear history.", "error");
    }
  });

  sendForm.addEventListener("submit", (event) => handleForm(event, "send"));
  receiveForm.addEventListener("submit", (event) => handleForm(event, "receive"));

  window.addEventListener("smaj:wallet-changed", () => {
    fetchHistory();
  });

  fetchHistory();
})();

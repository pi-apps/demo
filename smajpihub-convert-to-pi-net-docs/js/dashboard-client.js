(function () {

  const sidebar = document.getElementById("dashboardSidebar");
  const sidebarOpen = document.getElementById("sidebarOpen");
  const sidebarClose = document.getElementById("sidebarClose");
  const sidebarOverlay = document.getElementById("sidebarOverlay");
  const navLinks = document.querySelectorAll(".nav-link[data-section]");
  const sections = document.querySelectorAll(".dashboard-section");
  const logoutBtn = document.getElementById("logoutBtn");
  const welcomeTitle = document.getElementById("welcomeTitle");
  const sidebarUsername = document.getElementById("sidebarUsername");
  const sidebarAvatar = document.getElementById("sidebarAvatar");
  const profileUsername = document.getElementById("profileUsername");
  const profileAvatar = document.getElementById("profileAvatar");
  const overviewPiBalanceValue = document.getElementById("overviewPiBalanceValue");
  const overviewBalanceToggle = document.getElementById("overviewBalanceToggle");
  const walletStatus = document.getElementById("walletStatus");
  const financeWalletStatus = document.getElementById("financeWalletStatus");
  const downloadReportBtn = document.getElementById("downloadReportBtn");
  const sendBtn = document.getElementById("sendBtn");
  const receiveBtn = document.getElementById("receiveBtn");
  const profileEditBtn = document.getElementById("profileEditBtn");
  const profilePhotoBtn = document.getElementById("profilePhotoBtn");
  const profilePhotoSaveBtn = document.getElementById("profilePhotoSaveBtn");
  const profilePhotoRemoveBtn = document.getElementById("profilePhotoRemoveBtn");
  const profilePhotoInput = document.getElementById("profilePhotoInput");
  const profileAvatarTrigger = document.getElementById("profileAvatarTrigger");
  const profileActionRow = document.querySelector(".profile-action-row");
  const themeToggle = document.getElementById("themeToggle");
  const kycOverallStatus = document.getElementById("kycOverallStatus");
  const kycCompletionValue = document.getElementById("kycCompletionValue");
  const kycReviewEta = document.getElementById("kycReviewEta");
  const kycNextAction = document.getElementById("kycNextAction");
  const kycStatusMessage = document.getElementById("kycStatusMessage");
  const kycSaveDraftBtn = document.getElementById("kycSaveDraftBtn");
  const kycResetBtn = document.getElementById("kycResetBtn");
  const kycSubmitBtn = document.getElementById("kycSubmitBtn");
  const kycConsent = document.getElementById("kycConsent");

  const handledButtons = new WeakSet();
  let isProfileEditing = false;
  let profileOriginal = {};
  let pendingPhotoDataUrl = "";

  const profileFieldIds = [
    "profileFullName",
    "profileUsername",
    "profileEmail",
    "profilePhone",
    "profileCountry",
    "profileWalletAddress",
    "profileMemberSince"
  ];

  const profileStorageKey = "dashboard_profile_data";
  const profilePhotoStorageKey = "dashboard_profile_photo";
  const kycFormStorageKey = "dashboard_kyc_form";
  const kycDocStorageKey = "dashboard_kyc_docs";
  const kycStateStorageKey = "dashboard_kyc_state";

  const kycFormIds = [
    "kycLegalName",
    "kycDob",
    "kycNationality",
    "kycDocumentType",
    "kycDocumentNumber",
    "kycResidenceCountry",
    "kycAddressLine",
    "kycRole"
  ];

  const kycDocConfig = [
    { id: "govId", inputId: "kycGovIdInput", buttonId: "kycGovIdBtn", statusId: "kycGovIdStatus", fileId: "kycGovIdFile", required: true },
    { id: "selfie", inputId: "kycSelfieInput", buttonId: "kycSelfieBtn", statusId: "kycSelfieStatus", fileId: "kycSelfieFile", required: true },
    { id: "address", inputId: "kycAddressInput", buttonId: "kycAddressBtn", statusId: "kycAddressStatus", fileId: "kycAddressFile", required: true },
    { id: "business", inputId: "kycBusinessInput", buttonId: "kycBusinessBtn", statusId: "kycBusinessStatus", fileId: "kycBusinessFile", required: false }
  ];

  const sectionMap = {
    "Pi Balance": "finance",
    "Active Orders": "orders",
    "Active Jobs": "jobs",
    "Enrolled Courses": "ecosystem",
    "Health Appointments": "ecosystem",
    "Energy Payments": "finance",
    "Housing Bookings": "orders",
    "Swap Trades": "ecosystem"
  };

  const DASHBOARD_THEME_KEY = "dashboard_theme";
  const DASHBOARD_BALANCE_VISIBILITY_KEY = "dashboard_balance_visible";
  const DEFAULT_OVERVIEW_BALANCE = "3,250.90 Pi";
  let kycState = { status: "not_started" };
  let kycDocs = {};

  function applyDashboardTheme(theme) {
    const isDark = theme === "dark";
    document.body.classList.toggle("dark", isDark);

    if (themeToggle) {
      themeToggle.innerHTML = isDark
        ? "<i class='bx bx-sun'></i>"
        : "<i class='bx bx-moon'></i>";
      themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    }
  }

  function loadDashboardTheme() {
    const stored = localStorage.getItem(DASHBOARD_THEME_KEY);
    applyDashboardTheme(stored === "dark" ? "dark" : "light");
  }

  function toggleDashboardTheme() {
    const next = document.body.classList.contains("dark") ? "light" : "dark";
    localStorage.setItem(DASHBOARD_THEME_KEY, next);
    applyDashboardTheme(next);
    toast(next === "dark" ? "Dashboard dark mode enabled" : "Dashboard light mode enabled", "info");
  }

  function setOverviewBalanceVisible(visible) {
    if (!overviewPiBalanceValue || !overviewBalanceToggle) return;

    overviewPiBalanceValue.textContent = visible ? DEFAULT_OVERVIEW_BALANCE : "****";
    overviewBalanceToggle.innerHTML = visible
      ? "<i class='bx bx-hide'></i>"
      : "<i class='bx bx-show'></i>";
    overviewBalanceToggle.setAttribute("aria-label", visible ? "Hide balance" : "Show balance");
    localStorage.setItem(DASHBOARD_BALANCE_VISIBILITY_KEY, visible ? "true" : "false");
  }

  function getKycInputs() {
    return kycFormIds.reduce((acc, id) => {
      acc[id] = document.getElementById(id);
      return acc;
    }, {});
  }

  function collectKycFormData() {
    const fields = getKycInputs();
    const data = {};
    Object.entries(fields).forEach(([id, el]) => {
      if (!el) return;
      data[id] = el.type === "checkbox" ? el.checked : el.value.trim();
    });
    data.kycConsent = !!(kycConsent && kycConsent.checked);
    return data;
  }

  function applyKycFormData(data) {
    if (!data) return;
    Object.entries(getKycInputs()).forEach(([id, el]) => {
      if (!el || !(id in data)) return;
      el.value = typeof data[id] === "string" ? data[id] : "";
    });
    if (kycConsent) kycConsent.checked = !!data.kycConsent;
  }

  function persistKycFormData() {
    localStorage.setItem(kycFormStorageKey, JSON.stringify(collectKycFormData()));
  }

  function loadPersistedKycForm() {
    const raw = localStorage.getItem(kycFormStorageKey);
    if (!raw) return;
    try {
      applyKycFormData(JSON.parse(raw));
    } catch (_) {
      localStorage.removeItem(kycFormStorageKey);
    }
  }

  function persistKycDocs() {
    localStorage.setItem(kycDocStorageKey, JSON.stringify(kycDocs));
  }

  function loadPersistedKycDocs() {
    const raw = localStorage.getItem(kycDocStorageKey);
    if (!raw) return;
    try {
      kycDocs = JSON.parse(raw) || {};
    } catch (_) {
      kycDocs = {};
      localStorage.removeItem(kycDocStorageKey);
    }
  }

  function persistKycState() {
    localStorage.setItem(kycStateStorageKey, JSON.stringify(kycState));
  }

  function loadPersistedKycState() {
    const raw = localStorage.getItem(kycStateStorageKey);
    if (!raw) return;
    try {
      kycState = JSON.parse(raw) || { status: "not_started" };
    } catch (_) {
      kycState = { status: "not_started" };
      localStorage.removeItem(kycStateStorageKey);
    }
  }

  function updateKycDocUI() {
    kycDocConfig.forEach((doc) => {
      const statusEl = document.getElementById(doc.statusId);
      const fileEl = document.getElementById(doc.fileId);
      const state = kycDocs[doc.id];
      if (!statusEl || !fileEl) return;

      if (state && state.fileName) {
        statusEl.textContent = "Uploaded";
        statusEl.classList.remove("pending", "optional");
        statusEl.classList.add("uploaded");
        fileEl.textContent = state.fileName;
      } else {
        statusEl.classList.remove("uploaded");
        statusEl.classList.add(doc.required ? "pending" : "optional");
        statusEl.textContent = doc.required ? "Required" : "Optional";
        fileEl.textContent = doc.required ? "No file uploaded" : "Not provided";
      }
    });
  }

  function getKycProgress() {
    const formData = collectKycFormData();
    const requiredFieldIds = kycFormIds;
    const completedFields = requiredFieldIds.filter((id) => formData[id]).length;
    const requiredDocs = kycDocConfig.filter((doc) => doc.required);
    const uploadedDocs = requiredDocs.filter((doc) => kycDocs[doc.id] && kycDocs[doc.id].fileName).length;
    const consentDone = formData.kycConsent ? 1 : 0;
    const totalItems = requiredFieldIds.length + requiredDocs.length + 1;
    const completeItems = completedFields + uploadedDocs + consentDone;
    return Math.round((completeItems / totalItems) * 100);
  }

  function applyKycSummary() {
    const progress = getKycProgress();
    if (kycCompletionValue) kycCompletionValue.textContent = `${progress}%`;

    let status = kycState.status || "not_started";
    if (status !== "in_review" && progress === 0) status = "not_started";
    if (status !== "in_review" && progress > 0) status = "in_progress";

    const statusMap = {
      not_started: {
        title: "Not Started",
        eta: "Pending Submission",
        next: "Start Verification",
        message: "Complete your profile details and upload the required documents to begin verification."
      },
      in_progress: {
        title: "In Progress",
        eta: "Not Submitted Yet",
        next: "Finish Missing Items",
        message: "Your KYC draft is saved locally. Complete all required fields, upload documents, and submit for review."
      },
      in_review: {
        title: "In Review",
        eta: "24-72 Hours",
        next: "Wait For Review",
        message: "Your KYC package has been submitted and is currently under review."
      }
    };

    const config = statusMap[status] || statusMap.not_started;
    if (kycOverallStatus) kycOverallStatus.textContent = config.title;
    if (kycReviewEta) kycReviewEta.textContent = config.eta;
    if (kycNextAction) kycNextAction.textContent = config.next;
    if (kycStatusMessage) kycStatusMessage.textContent = config.message;
  }

  function saveKycDraft() {
    persistKycFormData();
    kycState.status = getKycProgress() > 0 ? "in_progress" : "not_started";
    persistKycState();
    applyKycSummary();
    toast("KYC draft saved", "success");
  }

  function resetKyc() {
    Object.values(getKycInputs()).forEach((el) => {
      if (!el) return;
      el.value = "";
    });
    if (kycConsent) kycConsent.checked = false;
    kycDocs = {};
    kycState = { status: "not_started" };
    localStorage.removeItem(kycFormStorageKey);
    localStorage.removeItem(kycDocStorageKey);
    localStorage.removeItem(kycStateStorageKey);
    updateKycDocUI();
    applyKycSummary();
    toast("KYC form reset", "info");
  }

  function submitKyc() {
    const formData = collectKycFormData();
    const missingField = kycFormIds.find((id) => !formData[id]);
    const missingDoc = kycDocConfig.find((doc) => doc.required && !(kycDocs[doc.id] && kycDocs[doc.id].fileName));

    if (missingField) {
      toast("Please complete all required KYC fields", "warn");
      return;
    }
    if (missingDoc) {
      toast("Please upload all required KYC documents", "warn");
      return;
    }
    if (!formData.kycConsent) {
      toast("Please confirm the KYC consent statement", "warn");
      return;
    }

    persistKycFormData();
    persistKycDocs();
    kycState.status = "in_review";
    persistKycState();
    applyKycSummary();
    toast("KYC submitted for review", "success");
  }

  function loadOverviewBalanceVisibility() {
    const stored = localStorage.getItem(DASHBOARD_BALANCE_VISIBILITY_KEY);
    setOverviewBalanceVisible(stored !== "false");
  }

  function buttonLabel(el) {
    return (el.textContent || "Action").replace(/\s+/g, " ").trim();
  }

  function toast(message, type = "info") {
    const el = document.createElement("div");
    el.className = `dashboard-toast ${type}`;
    el.textContent = message;
    document.body.appendChild(el);

    requestAnimationFrame(() => el.classList.add("show"));

    setTimeout(() => {
      el.classList.remove("show");
      setTimeout(() => el.remove(), 220);
    }, 2400);
  }

  function bindClick(element, handler) {
    if (!element) return;
    handledButtons.add(element);
    element.addEventListener("click", handler);
  }

  function openSidebar() {
    if (!sidebar || !sidebarOverlay) return;
    sidebar.classList.add("open");
    sidebarOverlay.classList.add("show");
  }

  function closeSidebar() {
    if (!sidebar || !sidebarOverlay) return;
    sidebar.classList.remove("open");
    sidebarOverlay.classList.remove("show");
  }

  function activateSection(target) {
    navLinks.forEach((item) => {
      item.classList.toggle("active", item.dataset.section === target);
    });

    sections.forEach((section) => {
      section.classList.toggle("active", section.id === `section-${target}`);
    });

    closeSidebar();
  }

  loadDashboardTheme();
  loadOverviewBalanceVisibility();
  bindClick(sidebarOpen, openSidebar);
  bindClick(sidebarClose, closeSidebar);
  bindClick(sidebarOverlay, closeSidebar);

  navLinks.forEach((button) => {
    bindClick(button, () => {
      const target = button.dataset.section;
      activateSection(target);
    });
  });

  function setWalletConnected(isConnected) {
    const label = isConnected ? "Connected" : "Not Connected";
    [walletStatus, financeWalletStatus].forEach((el) => {
      if (!el) return;
      el.textContent = label;
      el.classList.toggle("connected", isConnected);
      el.classList.toggle("disconnected", !isConnected);
    });
  }

  function toUsername(value) {
    return (value || "").replace(/^@/, "").trim() || "smaj_user";
  }

  function resolveWalletAddress(piUser) {
    const stored = localStorage.getItem("pi_wallet_address");
    if (stored) return stored;

    if (!piUser) return "";
    const direct = piUser.wallet_address || piUser.walletAddress || piUser.address;
    if (direct) return String(direct);

    const uid = String(piUser.uid || piUser.username || "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    if (!uid) return "";
    const generated = `PI${uid.padEnd(24, "X").slice(0, 24)}`;
    localStorage.setItem("pi_wallet_address", generated);
    return generated;
  }

  function shortenWalletAddress(address) {
    const value = String(address || "").trim();
    if (!value) return "Not Connected";
    if (value.length <= 10) return value;
    return `${value.slice(0, 4)}...${value.slice(-4)}`;
  }

  function getInitials(username) {
    return username.slice(0, 1).toUpperCase() + "P";
  }

  function applyAvatarInitials(username) {
    if (profileAvatar && !profileAvatar.classList.contains("has-photo")) {
      profileAvatar.textContent = getInitials(username);
    }
    if (sidebarAvatar && !sidebarAvatar.classList.contains("has-photo")) {
      sidebarAvatar.textContent = getInitials(username);
    }
  }

  function setAvatarPhoto(photoDataUrl) {
    [profileAvatar, sidebarAvatar].forEach((avatarEl) => {
      if (!avatarEl) return;
      avatarEl.style.backgroundImage = `url("${photoDataUrl}")`;
      avatarEl.classList.add("has-photo");
      avatarEl.textContent = "";
    });
  }

  function clearAvatarPhoto(username) {
    const initials = getInitials(toUsername(username || getProfileText("profileUsername")));
    [profileAvatar, sidebarAvatar].forEach((avatarEl) => {
      if (!avatarEl) return;
      avatarEl.style.backgroundImage = "";
      avatarEl.classList.remove("has-photo");
      avatarEl.textContent = initials;
    });
  }

  function loadPersistedAvatarPhoto() {
    const photoDataUrl = localStorage.getItem(profilePhotoStorageKey);
    if (!photoDataUrl) return;
    setAvatarPhoto(photoDataUrl);
  }

  function setPhotoSaveVisible(show) {
    if (!profilePhotoSaveBtn) return;
    profilePhotoSaveBtn.classList.toggle("show", show);
  }

  function getProfileText(fieldId) {
    const el = document.getElementById(fieldId);
    return el ? el.textContent.trim() : "";
  }
  function collectProfileData() {
    return {
      profileFullName: getProfileText("profileFullName"),
      profileUsername: getProfileText("profileUsername"),
      profileEmail: getProfileText("profileEmail"),
      profilePhone: getProfileText("profilePhone"),
      profileCountry: getProfileText("profileCountry"),
      profileWalletAddress: getProfileText("profileWalletAddress"),
      profileMemberSince: getProfileText("profileMemberSince")
    };
  }

  function applyProfileData(data) {
    if (!data) return;

    Object.entries(data).forEach(([fieldId, value]) => {
      const field = document.getElementById(fieldId);
      if (!field || typeof value !== "string") return;
      field.textContent = value;
    });

    const username = toUsername(getProfileText("profileUsername"));
    if (sidebarUsername) sidebarUsername.textContent = username;
    if (welcomeTitle) welcomeTitle.textContent = `Welcome back, ${username}`;
    applyAvatarInitials(username);
  }

  function persistProfileData() {
    const data = collectProfileData();
    localStorage.setItem(profileStorageKey, JSON.stringify(data));
  }

  function loadPersistedProfile() {
    const raw = localStorage.getItem(profileStorageKey);
    if (!raw) return;

    try {
      const data = JSON.parse(raw);
      applyProfileData(data);
    } catch (_) {
      localStorage.removeItem(profileStorageKey);
    }
  }
  function enterProfileEdit() {
    if (isProfileEditing) return;

    profileOriginal = {};
    profileFieldIds.forEach((fieldId) => {
      const field = document.getElementById(fieldId);
      if (!field) return;

      const value = field.textContent.trim();
      profileOriginal[fieldId] = value;

      const input = document.createElement("input");
      input.className = "profile-edit-input";
      input.value = value;
      input.type = fieldId === "profileEmail" ? "email" : "text";
      input.setAttribute("data-field", fieldId);

      field.innerHTML = "";
      field.appendChild(input);
    });

    const cancelBtn = document.createElement("button");
    cancelBtn.className = "btn-soft";
    cancelBtn.id = "profileCancelBtn";
    cancelBtn.textContent = "Cancel";
    bindClick(cancelBtn, cancelProfileEdit);

    if (profileActionRow) {
      profileActionRow.appendChild(cancelBtn);
    }

    if (profileEditBtn) profileEditBtn.textContent = "Save Profile";
    isProfileEditing = true;
  }

  function saveProfileEdit() {
    profileFieldIds.forEach((fieldId) => {
      const field = document.getElementById(fieldId);
      if (!field) return;

      const input = field.querySelector(".profile-edit-input");
      if (!input) return;

      let value = input.value.trim();
      if (!value) value = profileOriginal[fieldId] || "";
      if (fieldId === "profileUsername") value = `@${toUsername(value)}`;

      field.textContent = value;
    });

    const usernameRaw = getProfileText("profileUsername");
    const username = toUsername(usernameRaw);
    if (sidebarUsername) sidebarUsername.textContent = username;
    if (welcomeTitle) welcomeTitle.textContent = `Welcome back, ${username}`;

    applyAvatarInitials(username);

    const cancelBtn = document.getElementById("profileCancelBtn");
    if (cancelBtn) cancelBtn.remove();
    if (profileEditBtn) profileEditBtn.textContent = "Edit Profile";

    isProfileEditing = false;
    persistProfileData();
    toast("Profile updated successfully", "success");
  }

  function cancelProfileEdit() {
    profileFieldIds.forEach((fieldId) => {
      const field = document.getElementById(fieldId);
      if (!field) return;
      field.textContent = profileOriginal[fieldId] || field.textContent.trim();
    });

    const cancelBtn = document.getElementById("profileCancelBtn");
    if (cancelBtn) cancelBtn.remove();
    if (profileEditBtn) profileEditBtn.textContent = "Edit Profile";

    isProfileEditing = false;
    toast("Profile edit canceled", "info");
  }

  bindClick(profileEditBtn, () => {
    if (!isProfileEditing) {
      enterProfileEdit();
      return;
    }
    saveProfileEdit();
  });

  const piUserRaw = localStorage.getItem("pi_user");
  if (piUserRaw) {
    try {
      const piUser = JSON.parse(piUserRaw);
      const username = piUser && piUser.username ? piUser.username : "smaj_user";
      if (welcomeTitle) welcomeTitle.textContent = `Welcome back, ${username}`;
      if (sidebarUsername) sidebarUsername.textContent = username;
      if (profileUsername) profileUsername.textContent = `@${username}`;
      applyAvatarInitials(username);
      const walletAddressEl = document.getElementById("profileWalletAddress");
      if (walletAddressEl) {
        walletAddressEl.textContent = shortenWalletAddress(resolveWalletAddress(piUser));
      }

      setWalletConnected(true);
    } catch (_) {
      setWalletConnected(false);
    }
  } else {
    setWalletConnected(false);
    const walletAddressEl = document.getElementById("profileWalletAddress");
    if (walletAddressEl) {
      walletAddressEl.textContent = "Not Connected";
    }
  }

  loadPersistedProfile();
  loadPersistedAvatarPhoto();
  loadPersistedKycForm();
  loadPersistedKycDocs();
  loadPersistedKycState();
  updateKycDocUI();
  applyKycSummary();

  kycDocConfig.forEach((doc) => {
    const input = document.getElementById(doc.inputId);
    const button = document.getElementById(doc.buttonId);
    if (button && input) {
      bindClick(button, () => input.click());
      input.addEventListener("change", () => {
        const file = input.files && input.files[0];
        if (!file) return;
        kycDocs[doc.id] = { fileName: file.name };
        persistKycDocs();
        updateKycDocUI();
        if (kycState.status !== "in_review") {
          kycState.status = "in_progress";
          persistKycState();
        }
        applyKycSummary();
        toast(`${file.name} uploaded`, "success");
        input.value = "";
      });
    }
  });

  kycFormIds.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", () => {
      if (kycState.status !== "in_review") {
        kycState.status = getKycProgress() > 0 ? "in_progress" : "not_started";
        persistKycState();
      }
      applyKycSummary();
    });
    el.addEventListener("change", () => {
      if (kycState.status !== "in_review") {
        kycState.status = getKycProgress() > 0 ? "in_progress" : "not_started";
        persistKycState();
      }
      applyKycSummary();
    });
  });

  if (kycConsent) {
    kycConsent.addEventListener("change", () => {
      if (kycState.status !== "in_review") {
        kycState.status = getKycProgress() > 0 ? "in_progress" : "not_started";
        persistKycState();
      }
      applyKycSummary();
    });
  }

  bindClick(kycSaveDraftBtn, saveKycDraft);
  bindClick(kycResetBtn, resetKyc);
  bindClick(kycSubmitBtn, submitKyc);

  bindClick(profileAvatarTrigger, () => {
    if (!profilePhotoInput) return;
    profilePhotoInput.click();
  });

  bindClick(profilePhotoBtn, () => {
    if (!profilePhotoInput) return;
    profilePhotoInput.click();
  });

  bindClick(profilePhotoSaveBtn, () => {
    if (!pendingPhotoDataUrl) {
      toast("No new photo selected", "info");
      return;
    }
    localStorage.setItem(profilePhotoStorageKey, pendingPhotoDataUrl);
    pendingPhotoDataUrl = "";
    setPhotoSaveVisible(false);
    toast("Profile photo saved", "success");
  });

  bindClick(profilePhotoRemoveBtn, () => {
    localStorage.removeItem(profilePhotoStorageKey);
    pendingPhotoDataUrl = "";
    setPhotoSaveVisible(false);
    clearAvatarPhoto(getProfileText("profileUsername"));
    toast("Profile photo removed", "info");
  });

  if (profilePhotoInput) {
    profilePhotoInput.addEventListener("change", () => {
      const file = profilePhotoInput.files && profilePhotoInput.files[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        toast("Please choose a valid image file", "warn");
        profilePhotoInput.value = "";
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast("Image is too large (max 2MB)", "warn");
        profilePhotoInput.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = String(reader.result || "");
        if (!dataUrl) return;
        pendingPhotoDataUrl = dataUrl;
        setAvatarPhoto(dataUrl);
        setPhotoSaveVisible(true);
        toast("Photo selected. Click Save Photo to confirm.", "info");
        profilePhotoInput.value = "";
      };
      reader.readAsDataURL(file);
    });
  }

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    bindClick(btn, () => {
      const group = btn.dataset.filterGroup;
      const filter = btn.dataset.filter;

      document
        .querySelectorAll(`.filter-btn[data-filter-group="${group}"]`)
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      if (group === "tx") {
        document.querySelectorAll("#transactionsTable tr").forEach((row) => {
          const type = row.dataset.type;
          row.style.display = filter === "all" || type === filter ? "" : "none";
        });
      }

      if (group === "notice") {
        document.querySelectorAll("#noticeList .notice-item").forEach((item) => {
          const project = item.dataset.project;
          item.style.display = filter === "all" || project === filter ? "" : "none";
        });
      }
    });
  });

  document.querySelectorAll(".mark-read").forEach((btn) => {
    bindClick(btn, () => {
      const card = btn.closest(".notice-item");
      if (!card) return;
      card.classList.add("read");
      btn.textContent = "Read";
      btn.disabled = true;
      toast("Notification marked as read", "success");
    });
  });

  bindClick(sendBtn, () => toast("Send flow is a frontend mock", "info"));
  bindClick(receiveBtn, () => toast("Receive flow is a frontend mock", "info"));

  if (downloadReportBtn) {
    bindClick(downloadReportBtn, () => {
      toast("Report export will be available after backend integration", "info");
    });
  }

  document.querySelectorAll("#section-overview .stat-card").forEach((card) => {
    const title = card.querySelector("h3") ? card.querySelector("h3").textContent.trim() : "";
    const action = card.querySelector(".btn-soft");
    if (!action) return;

    bindClick(action, () => {
      const target = sectionMap[title] || "analytics";
      activateSection(target);
      toast(`${title} opened in ${target.charAt(0).toUpperCase()}${target.slice(1)}`, "success");
    });
  });

  // SSO redirect function for SMAJ Store
  const redirectToSmajStore = async () => {
    const smajStoreUrl = "https://officialsmaj.github.io/smaj-store";
    
    // Check if user is logged in via our backend
    const token = localStorage.getItem("smaj_token");
    const user = localStorage.getItem("smaj_user");
    
    if (token && user) {
      // User has session, generate SSO token
      toast("SMAJ Store: Generating SSO token...", "info");
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
          toast("SMAJ Store: Redirecting with SSO...", "success");
          window.location.href = data.redirectUrl;
          return true;
        }
      } catch (error) {
        console.error("SSO token error:", error);
      }
    }
    return false;
  };

  document.querySelectorAll(".eco-card .btn-soft").forEach((btn) => {
    bindClick(btn, async () => {
      const card = btn.closest(".eco-card");
      if (!card) return;

      const project = card.querySelector("h3") ? card.querySelector("h3").textContent.trim() : "Module";
      const statusBadge = card.querySelector(".status-badge");
      const isReady = statusBadge && statusBadge.classList.contains("ready");
      const isSmajStore = project === "SMAJ STORE";

      if (isReady) {
        // Special handling for SMAJ Store - use SSO token
        if (isSmajStore) {
          const ssoSuccess = await redirectToSmajStore();
          if (ssoSuccess) return;
          
          // Fallback if SSO failed
          toast("SMAJ Store: Using fallback redirect...", "info");
        }
        
        toast(`${project} module opened`, "success");
        activateSection("orders");
      } else {
        toast(`${project} is coming soon`, "warn");
      }
    });
  });

  function hookButtonByLabel(sectionId, label, handler) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const button = Array.from(section.querySelectorAll("button")).find((el) =>
      buttonLabel(el).toLowerCase() === label.toLowerCase()
    );

    if (button) bindClick(button, handler);
  }

  hookButtonByLabel("section-jobs", "Manage Jobs", () => {
    activateSection("jobs");
    toast("Jobs workspace opened", "success");
  });

  hookButtonByLabel("section-jobs", "View Requests", () => {
    activateSection("orders");
    toast("Service requests redirected to Orders & Bookings", "info");
  });

  hookButtonByLabel("section-security", "Reconnect Wallet", () => {
    setWalletConnected(true);
    toast("Wallet reconnected successfully", "success");
  });

  hookButtonByLabel("section-security", "Update Security", () => {
    toast("Security settings are a frontend mock", "info");
  });

  hookButtonByLabel("section-security", "Delete Account", () => {
    const confirmed = window.confirm("This is a frontend mock. Simulate delete account action?");
    if (confirmed) {
      toast("Delete request submitted (mock)", "warn");
    }
  });

  bindClick(themeToggle, toggleDashboardTheme);
  bindClick(overviewBalanceToggle, () => {
    const currentlyVisible = overviewPiBalanceValue && overviewPiBalanceValue.textContent !== "****";
    setOverviewBalanceVisible(!currentlyVisible);
  });
document.querySelectorAll("button").forEach((btn) => {
    if (handledButtons.has(btn)) return;
    const label = buttonLabel(btn);
    bindClick(btn, () => {
      toast(`${label} clicked`, "info");
    });
  });
  if (logoutBtn) {
    bindClick(logoutBtn, () => {
      localStorage.removeItem("pi_user");
      localStorage.removeItem("smaj_token");
      localStorage.removeItem("smaj_user");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "../../index.html";
    });
  }})();









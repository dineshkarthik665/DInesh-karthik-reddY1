(function () {
  const page = document.body.dataset.page;
  const navMenu = document.querySelector(".nav-menu");
  const menu = document.querySelector(".menu-toggle");
  const authPages = new Set(["signin", "register"]);

  if (menu && navMenu) {
    menu.addEventListener("click", () => {
      const open = navMenu.classList.toggle("open");
      menu.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  document.querySelectorAll(".nav-links a, .nav-actions a").forEach((link) => {
    if (link.dataset.page === page) link.classList.add("active");
  });

  function getSession() {
    try {
      const storedSession = JSON.parse(localStorage.getItem("stacklySession") || "null");

      if (
        storedSession &&
        storedSession.loggedIn === true &&
        typeof storedSession.email === "string" &&
        typeof storedSession.role === "string" &&
        getDashboardUrl(storedSession.role)
      ) {
        return storedSession;
      }
    } catch (error) {
      localStorage.removeItem("stacklySession");
    }

    return null;
  }

  function getDashboardUrl(role) {
    const normalizedRole = String(role || "").toLowerCase();

    if (normalizedRole === "admin" || normalizedRole === "manager") {
      return "admin-dashboard.html";
    }

    if (normalizedRole === "client" || normalizedRole === "user") {
      return "client-dashboard.html";
    }

    return "";
  }

  function applyNavbarState() {
    if (authLink) authLink.classList.remove("hidden");
    if (registerLink) registerLink.classList.remove("hidden");
    if (dashLink) dashLink.classList.add("hidden");
  }

  const session = getSession();
  const authLink = document.querySelector(".auth-link");
  const registerLink = document.querySelector(".register-link");
  const dashLink = document.querySelector(".dashboard-link");

  applyNavbarState();

  if (session && authPages.has(page)) {
    location.href = getDashboardUrl(session.role);
    return;
  }

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
  }

  function validLowercaseEmail(value) {
    return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(value.trim());
  }

  function validName(value) {
    return /^[A-Za-z ]{2,}$/.test(value.trim());
  }

  function validAlpha(value) {
    return /^[A-Za-z]+$/.test(value.trim());
  }

  function validPhone(value) {
    return /^[0-9]{10}$/.test(value.trim());
  }

  function validContactPhone(value) {
    return /^[0-9]+$/.test(value.trim());
  }

  const registerForm = document.getElementById("registerForm");

  if (registerForm) {
    registerForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = regName.value;
      const email = regEmail.value;
      const phone = regPhone.value;
      const password = regPassword.value;
      const message = registerMsg;

      if (!validName(name)) {
        message.textContent = "Enter a valid full name.";
        return;
      }

      if (!validLowercaseEmail(email)) {
        message.textContent = "Enter a valid lowercase email ID.";
        return;
      }

      if (!validPhone(phone)) {
        message.textContent = "Enter a valid 10 digit phone number.";
        return;
      }

      if (password.length < 6) {
        message.textContent = "Password must be minimum 6 characters.";
        return;
      }

      localStorage.setItem(
        "stacklyUser",
        JSON.stringify({ name, email, phone, password })
      );

      message.style.color = "#027a48";
      message.textContent = "Account created successfully. Redirecting to Sign In...";

      setTimeout(() => {
        location.href = "signin.html";
      }, 900);
    });
  }

  const signinForm = document.getElementById("signinForm");
  const roleSelect = document.getElementById("roleSelect");
  const roleSelectButton = roleSelect?.querySelector(".role-select-button");
  const roleSelectText = document.getElementById("roleSelectText");
  const roleOptions = roleSelect ? roleSelect.querySelectorAll(".role-option") : [];

  function closeRoleSelect() {
    if (!roleSelect || !roleSelectButton) return;

    roleSelect.classList.remove("open");
    roleSelectButton.setAttribute("aria-expanded", "false");
  }

  if (roleSelect && roleSelectButton) {
    roleSelectButton.addEventListener("click", () => {
      const open = roleSelect.classList.toggle("open");
      roleSelectButton.setAttribute("aria-expanded", open ? "true" : "false");
    });

    roleOptions.forEach((option) => {
      option.addEventListener("click", () => {
        signinRole.value = option.dataset.value;

        if (roleSelectText) {
          roleSelectText.textContent = option.textContent;
        }

        roleOptions.forEach((item) => item.classList.remove("active"));
        option.classList.add("active");
        closeRoleSelect();
      });
    });

    document.addEventListener("click", (event) => {
      if (!roleSelect.contains(event.target)) closeRoleSelect();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeRoleSelect();
    });
  }

  if (signinForm) {
    signinForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const email = signinEmail.value;
      const password = signinPassword.value;
      const role = signinRole.value;
      const message = signinMsg;

      if (!validLowercaseEmail(email)) {
        message.textContent = "Enter a valid lowercase email ID.";
        return;
      }

      if (password.length < 6) {
        message.textContent = "Password must be minimum 6 characters.";
        return;
      }

      if (!role) {
        message.textContent = "Please select a role.";
        return;
      }

      localStorage.setItem(
        "stacklySession",
        JSON.stringify({ loggedIn: true, email, role })
      );

      location.href = getDashboardUrl(role);
    });
  }

  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    const contactFirstName = contactForm.querySelector("#firstName");
    const contactLastName = contactForm.querySelector("#lastName");
    const contactPhoneInput = contactForm.querySelector("#contactPhone");

    [contactFirstName, contactLastName].forEach((field) => {
      field.addEventListener("input", () => {
        field.value = field.value.replace(/[^A-Za-z]/g, "");
      });
    });

    contactPhoneInput.addEventListener("input", () => {
      contactPhoneInput.value = contactPhoneInput.value.replace(/[^0-9]/g, "");
    });

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const message = contactMsg;

      if (!validAlpha(contactFirstName.value)) {
        message.textContent = "First Name accepts alphabets only.";
        return;
      }

      if (!validAlpha(contactLastName.value)) {
        message.textContent = "Last Name accepts alphabets only.";
        return;
      }

      if (!validLowercaseEmail(contactEmail.value)) {
        message.textContent = "Enter a valid lowercase email ID.";
        return;
      }

      if (!validContactPhone(contactPhoneInput.value)) {
        message.textContent = "Phone accepts numbers only.";
        return;
      }

      if (!contactMessage.value.trim()) {
        message.textContent = "Message cannot be empty.";
        return;
      }

      location.href = "404.html";
    });
  }

  const dashboard = document.querySelector(".dashboard-shell");

  if (dashboard) {
    if (!session) {
      location.href = "signin.html";
      return;
    }

    const expectedDashboard = getDashboardUrl(session.role);

    if (page !== expectedDashboard.replace(".html", "")) {
      location.href = expectedDashboard;
      return;
    }

    const userLine = document.getElementById("userLine");

    if (userLine) {
      userLine.textContent =
        "Welcome, " + session.email + " - manage your retirement planning workspace.";
    }

    const dashboardMenu = document.querySelector(".dash-menu-toggle");
    const dashboardOverlay = document.querySelector(".dash-overlay");
    const mobileDashboard = window.matchMedia("(max-width: 1060px)");
    const dashboardHeader = document.querySelector(".dash-header");
    const dashboardCards = document.querySelector(".dash-cards");

    function setDashboardMenu(open) {
      dashboard.classList.toggle("sidebar-open", open);
      document.body.classList.toggle("dash-menu-lock", open);

      if (dashboardMenu) {
        dashboardMenu.setAttribute("aria-expanded", open ? "true" : "false");
      }
    }

    function updateDashboardSummary(panelId) {
      const overviewActive = panelId === "overview";

      dashboard.classList.toggle("overview-active", overviewActive);

      if (dashboardHeader) {
        dashboardHeader.setAttribute("aria-hidden", overviewActive ? "false" : "true");
      }

      if (dashboardCards) {
        dashboardCards.setAttribute("aria-hidden", overviewActive ? "false" : "true");
      }
    }

    if (dashboardMenu) {
      dashboardMenu.addEventListener("click", () => {
        setDashboardMenu(!dashboard.classList.contains("sidebar-open"));
      });
    }

    if (dashboardOverlay) {
      dashboardOverlay.addEventListener("click", () => setDashboardMenu(false));
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setDashboardMenu(false);
    });

    updateDashboardSummary(
      document.querySelector(".dash-panel.active")?.id || "overview"
    );

    document.querySelectorAll(".dash-sidebar button[data-panel]").forEach((button) => {
      button.addEventListener("click", () => {
        document
          .querySelectorAll(".dash-sidebar button[data-panel]")
          .forEach((item) => item.classList.remove("active"));

        document
          .querySelectorAll(".dash-panel")
          .forEach((panel) => panel.classList.remove("active"));

        button.classList.add("active");
        document.getElementById(button.dataset.panel).classList.add("active");
        updateDashboardSummary(button.dataset.panel);

        if (mobileDashboard.matches) {
          setDashboardMenu(false);
        }
      });
    });

    const logout = document.getElementById("logoutBtn");

    if (logout) {
      logout.addEventListener("click", () => {
        localStorage.removeItem("stacklySession");
        window.location.href = "signin.html";
      });
    }
  }
})(); 

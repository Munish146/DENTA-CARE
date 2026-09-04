/* =========================================================
   DentaCare - Centralized Main JavaScript
   - Single Event Handling (Prevents double toggling)
   - Dark / Light Theme Toggle & Persistence
   - RTL / LTR Toggle & Persistence
   - Mobile Menu & Dropdowns
   - Search Toggle & Focus
   - Active Navigation Highlighting
   - Smooth Scrolling & Intersection Scroll Reveal
   - Form Handling & Validation Helpers
   ========================================================= */

(function () {
  "use strict";

  // Prevent duplicate execution if script is loaded multiple times
  if (window.__DENTACARE_MAIN_INIT__) return;
  window.__DENTACARE_MAIN_INIT__ = true;

  /* =========================================================
     1. THEME MANAGEMENT (Dark / Light)
     ========================================================= */
  function getPreferredTheme() {
    const saved = localStorage.getItem("dentacare_theme");
    if (saved) return saved;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function applyTheme(theme) {
    const isDark = theme === "dark";
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("dentacare_theme", theme);
    updateThemeIcons(isDark);
  }

  function updateThemeIcons(isDark) {
    const icons = document.querySelectorAll(
      "#themeIcon, #mobileThemeIcon, .theme-icon, [data-theme-icon]"
    );
    icons.forEach((icon) => {
      if (isDark) {
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
      } else {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
      }
    });
  }

  function toggleTheme() {
    const currentlyDark = document.documentElement.classList.contains("dark");
    const nextTheme = currentlyDark ? "light" : "dark";
    applyTheme(nextTheme);
  }

  // Global window access if triggered via inline onclick fallback
  window.toggleTheme = function (e) {
    if (e && e.preventDefault) e.preventDefault();
    toggleTheme();
  };

  /* =========================================================
     2. RTL / LTR DIRECTION MANAGEMENT
     ========================================================= */
  function applyDirection(dir) {
    const isRTL = dir === "rtl";
    document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
    localStorage.setItem("dentacare_direction", isRTL ? "rtl" : "ltr");

    const rtlTexts = document.querySelectorAll("#dirText, #rtlText, .rtl-text, [data-rtl-text]");
    rtlTexts.forEach((el) => {
      el.textContent = isRTL ? "LTR" : "RTL";
    });
  }

  function toggleDirection() {
    const currentDir = document.documentElement.getAttribute("dir") || "ltr";
    const nextDir = currentDir === "rtl" ? "ltr" : "rtl";
    applyDirection(nextDir);
  }

  window.toggleDirection = function (e) {
    if (e && e.preventDefault) e.preventDefault();
    toggleDirection();
  };
  window.toggleRTL = window.toggleDirection;

  /* =========================================================
     3. MOBILE MENU & DROPDOWNS
     ========================================================= */
  function toggleMobileMenu() {
    const mobileMenu = document.getElementById("mobileMenu");
    const mobileMenuBtn = document.getElementById("mobileMenuBtn") || document.getElementById("mobileToggle");

    if (!mobileMenu) return;

    const isHidden = mobileMenu.classList.contains("hidden");
    if (isHidden) {
      mobileMenu.classList.remove("hidden");
    } else {
      mobileMenu.classList.add("hidden");
    }

    if (mobileMenuBtn) {
      const icon = mobileMenuBtn.querySelector("i");
      if (icon) {
        if (!isHidden) {
          icon.classList.add("fa-bars");
          icon.classList.remove("fa-xmark");
        } else {
          icon.classList.remove("fa-bars");
          icon.classList.add("fa-xmark");
        }
      }
    }
  }

  window.toggleMobileMenu = function (e) {
    if (e && e.preventDefault) e.preventDefault();
    toggleMobileMenu();
  };

  function toggleMobileHome() {
    const mobileHomeMenu =
      document.getElementById("mobileHomeMenu") ||
      document.getElementById("mobileHomeDropdown");
    const mobileHomeIcon = document.getElementById("mobileHomeIcon");
    if (mobileHomeMenu) {
      mobileHomeMenu.classList.toggle("hidden");
    }
    if (mobileHomeIcon) {
      mobileHomeIcon.classList.toggle("rotate-180");
    }
  }

  window.toggleMobileHome = function (e) {
    if (e && e.preventDefault) e.preventDefault();
    toggleMobileHome();
  };

  /* =========================================================
     4. SEARCH OVERLAY & POPUP
     ========================================================= */
  function focusSearch() {
    const hiddenSearch = document.getElementById("hiddenSearch");
    const searchBox = document.getElementById("searchBox");
    const searchInput = document.getElementById("searchInput");

    if (hiddenSearch) {
      const isClosed = hiddenSearch.classList.contains("-top-20") || hiddenSearch.classList.contains("hidden");
      if (isClosed) {
        hiddenSearch.classList.remove("-top-20", "hidden");
        hiddenSearch.classList.add("top-24");
        hiddenSearch.focus();
      } else {
        hiddenSearch.classList.add("-top-20");
        hiddenSearch.classList.remove("top-24");
      }
    } else if (searchBox) {
      searchBox.classList.toggle("hidden");
      if (!searchBox.classList.contains("hidden") && searchInput) {
        searchInput.focus();
      }
    }
  }

  window.focusSearch = function (e) {
    if (e && e.preventDefault) e.preventDefault();
    focusSearch();
  };

  /* =========================================================
     5. INITIALIZE ON DOM READY
     ========================================================= */
  document.addEventListener("DOMContentLoaded", function () {
    // 5.1 Initialize Theme
    const savedTheme = getPreferredTheme();
    applyTheme(savedTheme);

    // 5.2 Initialize Direction
    const savedDir = localStorage.getItem("dentacare_direction") || "ltr";
    applyDirection(savedDir);

    // 5.3 Bind Theme Toggles (Attach once with clean event listener)
    const themeButtons = document.querySelectorAll(
      "#themeToggle, #mobileThemeToggle, [data-theme-toggle], .theme-toggle"
    );
    themeButtons.forEach((btn) => {
      // Remove inline onclick to prevent double execution
      btn.removeAttribute("onclick");
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        toggleTheme();
      });
    });

    // 5.4 Bind RTL Toggles
    const rtlButtons = document.querySelectorAll(
      "#rtlToggle, #mobileRtlToggle, #dirToggle, [data-rtl-toggle]"
    );
    rtlButtons.forEach((btn) => {
      btn.removeAttribute("onclick");
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        toggleDirection();
      });
    });

    // 5.5 Bind Mobile Menu Button
    const mobileMenuBtns = document.querySelectorAll(
      "#mobileMenuBtn, #mobileToggle, [data-mobile-toggle]"
    );
    mobileMenuBtns.forEach((btn) => {
      btn.removeAttribute("onclick");
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        toggleMobileMenu();
      });
    });

    // 5.6 Auto-close mobile menu when clicking internal links
    const mobileMenu = document.getElementById("mobileMenu");
    if (mobileMenu) {
      mobileMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", function () {
          mobileMenu.classList.add("hidden");
          const menuBtn = document.getElementById("mobileMenuBtn") || document.getElementById("mobileToggle");
          if (menuBtn) {
            const icon = menuBtn.querySelector("i");
            if (icon) {
              icon.classList.add("fa-bars");
              icon.classList.remove("fa-xmark");
            }
          }
        });
      });
    }

    // 5.7 Bind Mobile Home Dropdown
    const mobileHomeBtn = document.getElementById("mobileHomeBtn");
    const mobileHomeDropdown = document.getElementById("mobileHomeDropdown");
    if (mobileHomeBtn && mobileHomeDropdown) {
      mobileHomeBtn.removeAttribute("onclick");
      mobileHomeBtn.addEventListener("click", function (e) {
        e.preventDefault();
        mobileHomeDropdown.classList.toggle("hidden");
        const arrow = mobileHomeBtn.querySelector(".home-arrow, i");
        if (arrow) {
          arrow.classList.toggle("rotate-180");
        }
      });
    }

    // 5.8 Bind Desktop Home Dropdown
    const desktopHomeBtn = document.getElementById("desktopHomeBtn");
    const desktopHomeDropdown = document.getElementById("desktopHomeDropdown");
    if (desktopHomeBtn && desktopHomeDropdown) {
      desktopHomeBtn.removeAttribute("onclick");
      desktopHomeBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        desktopHomeDropdown.classList.toggle("hidden");
      });

      document.addEventListener("click", function (e) {
        if (
          !desktopHomeBtn.contains(e.target) &&
          !desktopHomeDropdown.contains(e.target)
        ) {
          desktopHomeDropdown.classList.add("hidden");
        }
      });
    }

    // 5.9 Bind Search Buttons
    const searchBtns = document.querySelectorAll(
      "#searchBtn, #mobileSearchBtn, [data-search-btn], .search-btn"
    );
    searchBtns.forEach((btn) => {
      btn.removeAttribute("onclick");
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        focusSearch();
      });
    });

    // 5.10 Global Escape Key Listener
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
          toggleMobileMenu();
        }
        const hiddenSearch = document.getElementById("hiddenSearch");
        if (hiddenSearch && !hiddenSearch.classList.contains("-top-20")) {
          hiddenSearch.classList.add("-top-20");
          hiddenSearch.classList.remove("top-24");
        }
        const searchBox = document.getElementById("searchBox");
        if (searchBox && !searchBox.classList.contains("hidden")) {
          searchBox.classList.add("hidden");
        }
      }
    });

    // 5.11 Active Navigation Highlighting
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll("nav a[href], #mobileMenu a[href]");
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("javascript:")) return;
      const linkFile = href.split("/").pop().split("?")[0].split("#")[0];

      if (linkFile === currentPath || (currentPath === "" && linkFile === "index.html")) {
        link.classList.add("text-pink", "font-bold");
      }
    });

    // 5.12 Scroll Reveal Animations
    const revealElements = document.querySelectorAll(".reveal");
    if (revealElements.length && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("revealed");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      revealElements.forEach((el) => observer.observe(el));
    }

    // 5.13 Smooth Scrolling for Anchor links
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });

    // 5.14 Auto-update footer current year
    document.querySelectorAll("[data-year], .current-year").forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  });
})();
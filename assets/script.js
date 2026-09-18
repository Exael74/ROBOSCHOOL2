(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Theme toggle (dark/light) ---------------- */
  /* data-theme is already set on <html> by the inline head script to avoid a flash. */
  var root = document.documentElement;
  var themeToggles = document.querySelectorAll(".theme-toggle");
  function syncToggles() {
    var isDark = root.getAttribute("data-theme") === "dark";
    themeToggles.forEach(function (btn) {
      btn.setAttribute("aria-pressed", isDark ? "true" : "false");
      btn.setAttribute("aria-label", isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
    });
  }
  syncToggles();
  themeToggles.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("roboschool-theme", next); } catch (e) {}
      syncToggles();
    });
  });

  /* ---------------- Stat counters ---------------- */
  var targets = [
    { el: document.getElementById("stat-1"), value: 80, suffix: " kg" },
    { el: document.getElementById("stat-2"), value: 6, suffix: "" },
    { el: document.getElementById("stat-3"), value: 40, suffix: "+" },
    { el: document.getElementById("stat-4"), value: 12, suffix: "" }
  ];

  var ran = false;
  function runCounters() {
    if (ran) return;
    ran = true;
    if (reduceMotion) {
      targets.forEach(function (t) {
        if (t.el) t.el.textContent = t.value + t.suffix;
      });
      return;
    }
    var start = performance.now();
    var dur = 1400;
    function tick(now) {
      var p = Math.min(1, (now - start) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      targets.forEach(function (t) {
        if (!t.el) return;
        t.el.textContent = Math.round(t.value * e) + t.suffix;
      });
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  var statsEl = document.querySelector("[data-stats]");
  if (statsEl && "IntersectionObserver" in window) {
    var statsIO = new IntersectionObserver(
      function (entries) {
        if (entries.some(function (e) { return e.isIntersecting; })) {
          statsIO.disconnect();
          runCounters();
        }
      },
      { threshold: 0.25 }
    );
    statsIO.observe(statsEl);
    setTimeout(runCounters, 6000);
  } else {
    runCounters();
  }

  /* ---------------- Scroll reveal (progressive enhancement) ---------------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length && "IntersectionObserver" in window) {
    revealEls.forEach(function (el, i) {
      el.classList.add("reveal-init");
      if (!reduceMotion) {
        el.style.transitionDelay = Math.min(i % 4, 3) * 70 + "ms";
      }
    });
    var revealIO = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { revealIO.observe(el); });
  }

  /* ---------------- Nav: scrolled state + mobile menu + scrollspy ---------------- */
  var nav = document.querySelector(".nav");
  var menuBtn = document.querySelector(".nav-toggle");
  var mobilePanel = document.getElementById("mobile-menu");
  var navLinks = document.querySelectorAll(".nav-link, .mobile-link");
  var sections = Array.prototype.map.call(navLinks, function (a) {
    var id = a.getAttribute("href");
    return id && id.charAt(0) === "#" ? document.querySelector(id) : null;
  }).filter(Boolean);

  function onScroll() {
    if (nav) nav.classList.toggle("nav-scrolled", window.scrollY > 12);
    backToTop && backToTop.classList.toggle("is-visible", window.scrollY > 700);
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function closeMenu() {
    if (!mobilePanel) return;
    mobilePanel.classList.remove("is-open");
    menuBtn && menuBtn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }
  function openMenu() {
    if (!mobilePanel) return;
    mobilePanel.classList.add("is-open");
    menuBtn && menuBtn.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
  }
  if (menuBtn && mobilePanel) {
    menuBtn.addEventListener("click", function () {
      var open = mobilePanel.classList.contains("is-open");
      if (open) closeMenu(); else openMenu();
    });
    mobilePanel.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  if (sections.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = "#" + entry.target.id;
          navLinks.forEach(function (a) {
            a.classList.toggle("is-active", a.getAttribute("href") === id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------------- Back to top ---------------- */
  var backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }
})();

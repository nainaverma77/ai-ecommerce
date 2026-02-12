/* =========================
   MAIN APP CONTROLLER
========================= */

const CART_KEY = "ai_shop_cart";
const WISHLIST_KEY = "ai_shop_wishlist";

/* =========================
   GLOBAL SAFETY (🔥 IMPORTANT)
========================= */

// 🚫 Prevent ANY accidental form submission (stops page refresh)
document.addEventListener("submit", (e) => {
  e.preventDefault();
});

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {
  setupNavbar();
  setupHeroActions();
  updateBadges();
});

/* =========================
   NAVBAR ACTIONS
========================= */

function setupNavbar() {
  const account = document.querySelector(".account");
  const accountBtn = document.getElementById("accountBtn");

  /* -------- ACCOUNT DROPDOWN -------- */
  if (account && accountBtn) {
    accountBtn.addEventListener("click", e => {
      e.stopPropagation();
      account.classList.toggle("open");
    });

    document.addEventListener("click", e => {
      if (!account.contains(e.target)) {
        account.classList.remove("open");
      }
    });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        account.classList.remove("open");
      }
    });
  }

  /* -------- CART & WISHLIST NAVIGATION -------- */
  document.querySelectorAll(".nav-icon[data-action]").forEach(btn => {
    btn.addEventListener("click", () => {
      const { action } = btn.dataset;
      if (action === "cart") window.location.href = "cart.html";
      if (action === "wishlist") window.location.href = "wishlist.html";
    });
  });
}

/* =========================
   HERO ACTIONS
========================= */

function setupHeroActions() {
  const exploreBtn = document.getElementById("exploreBtn");
  const refreshAiBtn = document.getElementById("refreshAiBtn");

  if (exploreBtn) {
    exploreBtn.addEventListener("click", () => {
      document
        .getElementById("allProducts")
        ?.scrollIntoView({ behavior: "smooth" });
    });
  }

  if (refreshAiBtn) {
    refreshAiBtn.addEventListener("click", () => {
      window.refreshAIPicks?.();
    });
  }
}

/* =========================
   BADGE LOGIC (SOURCE OF TRUTH)
========================= */

function updateBadges() {
  const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
  const wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];

  const cartBadge = document.getElementById("cartCount");
  const wishlistBadge = document.getElementById("wishlistCount");

  if (cartBadge) {
    cartBadge.textContent = cart.length;
    cartBadge.style.display = cart.length ? "flex" : "none";
  }

  if (wishlistBadge) {
    wishlistBadge.textContent = wishlist.length;
    wishlistBadge.style.display = wishlist.length ? "flex" : "none";
  }
}

/* =========================
   GLOBAL SYNC
========================= */

window.updateBadges = updateBadges;
window.addEventListener("storage", updateBadges);
    
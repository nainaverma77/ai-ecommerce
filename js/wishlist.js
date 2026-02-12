/* =========================
   WISHLIST PAGE LOGIC
========================= */

const WISHLIST_KEY = "ai_shop_wishlist";
const CART_KEY = "ai_shop_cart";

document.addEventListener("DOMContentLoaded", initWishlist);

function initWishlist() {
  const wishlistEl = document.getElementById("wishlistItems");
  const backBtn = document.getElementById("backBtn");

  if (!wishlistEl) return;

  renderWishlist();

  /* =========================
     HELPERS
  ========================= */

  function getWishlist() {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
  }

  function saveWishlist(list) {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
    window.updateBadges?.();
  }

  function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.updateBadges?.();
  }

  /* =========================
     RENDER
  ========================= */

  function renderWishlist() {
    const list = getWishlist();
    const cart = getCart();
    wishlistEl.innerHTML = "";

    if (!list.length) {
      wishlistEl.innerHTML = `
        <p style="opacity:0.7; font-size:16px;">
          Your wishlist is empty.
        </p>
      `;
      return;
    }

    list.forEach(product => {
      const inCart = cart.some(p => p.id === product.id);

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <div class="image-wrap">
          <img src="${product.image}" alt="${product.title}">
        </div>

        <h3>${product.title}</h3>
        <p class="price">₹${Math.round(product.price)}</p>

        <div class="actions">
          <button class="primary">
            ${inCart ? "In Cart" : "Add to Cart"}
          </button>
          <button class="ghost remove-btn">Remove</button>
        </div>
      `;

      /* ADD TO CART */
      card.querySelector(".primary").onclick = () => {
        if (!inCart) {
          const updatedCart = [...cart, product];
          saveCart(updatedCart);
        }
        removeFromWishlist(product.id);
      };

      /* REMOVE */
      card.querySelector(".remove-btn").onclick = () => {
        removeFromWishlist(product.id);
      };

      wishlistEl.appendChild(card);
    });
  }

  /* =========================
     ACTIONS
  ========================= */

  function removeFromWishlist(id) {
    const updated = getWishlist().filter(p => p.id !== id);
    saveWishlist(updated);
    renderWishlist();
  }

  backBtn.onclick = () => {
    window.location.href = "index.html";
  };
}

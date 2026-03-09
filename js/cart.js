/* =========================
   CART PAGE LOGIC
========================= */

const CART_KEY = "ai_shop_cart";

document.addEventListener("DOMContentLoaded", initCart);

function initCart() {
  const cartEl = document.getElementById("cartItems");
  const totalEl = document.getElementById("totalPrice");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const footerEl = document.getElementById("cartFooter");
  const backBtn = document.getElementById("backBtn");

  if (!cartEl || !totalEl) return;

  normalizeCart();
  renderCart();

  /* =========================
     HELPERS
  ========================= */

  function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.updateBadges?.();
  }

  function normalizeCart() {
    const cart = getCart().map(p => ({
      ...p,
      qty: p.qty || 1
    }));
    saveCart(cart);
  }

  /* =========================
     RENDER
  ========================= */

  function renderCart() {
    const cart = getCart();
    cartEl.innerHTML = "";
    let total = 0;

    if (!cart.length) {
      cartEl.innerHTML = `
        <p style="opacity:0.7; font-size:16px;">
          Your cart is empty.
        </p>
      `;
      footerEl.style.display = "none";
      totalEl.textContent = "";
      return;
    }

    footerEl.style.display = "flex";

    cart.forEach(product => {
      total += product.price * product.qty;

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <div class="image-wrap">
          <img src="${product.image}" alt="${product.title}">
        </div>

        <h3>${product.title}</h3>
        <p class="price">₹${Math.round(product.price)}</p>

        <div class="actions qty-actions">
          <button class="qty-btn minus">−</button>
          <span class="qty">${product.qty}</span>
          <button class="qty-btn plus">+</button>
          <button class="ghost remove-btn">Remove</button>
        </div>
      `;

      /* ➕ */
      card.querySelector(".plus").onclick = () => {
        product.qty++;
        saveCart(cart);
        renderCart();
      };

      /* ➖ */
      card.querySelector(".minus").onclick = () => {
        if (product.qty > 1) {
          product.qty--;
        } else {
          removeFromCart(product.id);
          return;
        }
        saveCart(cart);
        renderCart();
      };

      /* REMOVE */
      card.querySelector(".remove-btn").onclick = () => {
        removeFromCart(product.id);
      };

      cartEl.appendChild(card);
    });

    totalEl.textContent = `Total: ₹${Math.round(total)}`;
  }

  /* =========================
     ACTIONS
  ========================= */

  function removeFromCart(id) {
    const updated = getCart().filter(p => p.id !== id);
    saveCart(updated);
    renderCart();
  }

  checkoutBtn.onclick = () => {
    alert("Checkout successful (demo)");
    localStorage.removeItem(CART_KEY);
    window.updateBadges?.();
    renderCart();
  };

  backBtn.onclick = () => {
    window.location.href = "index.html";
  };
}

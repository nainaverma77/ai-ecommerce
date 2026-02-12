import { getAllProducts } from "./api.js";

/* =========================
   CONSTANTS
========================= */
const CART_KEY = "ai_shop_cart";
const WISHLIST_KEY = "ai_shop_wishlist";
const MAX_PRICE_LIMIT = 200000;

/* =========================
   ELEMENTS
========================= */
const productsEl = document.getElementById("products");
const recommendedEl = document.getElementById("recommended");

const totalProductsEl = document.getElementById("totalProducts");
const totalCategoriesEl = document.getElementById("totalCategories");

const categoryFilter = document.getElementById("categoryFilter");
const sortFilter = document.getElementById("sortFilter");
const priceFilter = document.getElementById("priceFilter");
const priceValue = document.getElementById("priceValue");

const activeFiltersText = document.getElementById("activeFiltersText");

/* MODAL ELEMENTS */
const modal = document.getElementById("productModal");
const modalImg = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalPrice = document.getElementById("modalPrice");
const closeModal = document.getElementById("closeModal");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const modalCartBtn = document.getElementById("modalCartBtn");

/* =========================
   STATE
========================= */
let allProducts = [];
let filteredProducts = [];
let activeProduct = null;

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", init);

async function init() {
  allProducts = await getAllProducts();

  /* 🛑 SAFETY: API contract check */
  if (!Array.isArray(allProducts)) {
    console.error("API must return an array of products");
    allProducts = [];
  }

  filteredProducts = [...allProducts];

  setupFilters();
  updateHeroStats();
  renderRecommended();
  applyFilters();
}

/* =========================
   FILTER SETUP
========================= */
function setupFilters() {
  const categories = ["all", ...new Set(allProducts.map(p => p.category))];

  categoryFilter.innerHTML = categories
    .map(c => `<option value="${c}">${capitalize(c)}</option>`)
    .join("");

  const apiMax = allProducts.length
    ? Math.max(...allProducts.map(p => p.price))
    : MAX_PRICE_LIMIT;

  const finalMax = Math.min(apiMax, MAX_PRICE_LIMIT);

  priceFilter.max = finalMax;
  priceFilter.value = finalMax;
  priceValue.textContent = `₹${finalMax}`;

  categoryFilter.onchange = applyFilters;
  sortFilter.onchange = applyFilters;
  priceFilter.oninput = () => {
    priceValue.textContent = `₹${Math.round(priceFilter.value)}`;
    applyFilters();
  };
}

/* =========================
   APPLY FILTERS
========================= */
function applyFilters() {
  const category = categoryFilter.value;
  const sort = sortFilter.value;
  const maxPrice = Number(priceFilter.value);

  filteredProducts = allProducts.filter(p =>
    (category === "all" || p.category === category) &&
    p.price <= maxPrice
  );

  if (sort === "price-low") filteredProducts.sort((a, b) => a.price - b.price);
  if (sort === "price-high") filteredProducts.sort((a, b) => b.price - a.price);
  if (sort === "ai") filteredProducts.sort(() => 0.5 - Math.random());

  renderProducts(filteredProducts);
  updateFilterSummary();
}

/* =========================
   FILTER SUMMARY
========================= */
function updateFilterSummary() {
  if (!activeFiltersText) return;

  const category = categoryFilter.value;
  const count = filteredProducts.length;

  let text = `${count} products`;

  if (category !== "all") {
    text += ` in ${capitalize(category)}`;
  }

  activeFiltersText.textContent = text;
}

/* =========================
   RENDERING
========================= */
function renderProducts(products) {
  if (!productsEl) return;
  productsEl.innerHTML = "";
  products.forEach(p => productsEl.appendChild(createCard(p)));
}

function renderRecommended() {
  if (!recommendedEl) return;
  recommendedEl.innerHTML = "";

  [...allProducts]
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
    .forEach(p => recommendedEl.appendChild(createCard(p, true)));
}

window.refreshAIPicks = renderRecommended;

/* =========================
   PRODUCT CARD
========================= */
function createCard(p, isAI = false) {
  const card = document.createElement("div");
  card.className = "card";

  const inCart = getCart().some(i => i.id === p.id);
  const inWish = getWishlist().some(i => i.id === p.id);

  card.innerHTML = `
    ${isAI ? `<span class="tag">AI Pick</span>` : ""}

    <button type="button" class="wishlist-btn ${inWish ? "active" : ""}">
      ❤
    </button>

    <div class="image-wrap">
      <img src="${p.image}" alt="${p.title}">
    </div>

    <h3>${p.title}</h3>
    <p class="price">₹${Math.round(p.price)}</p>

    <div class="card-actions">
      <button type="button" class="ghost view-btn">View</button>
      <button type="button" class="primary cart-btn ${inCart ? "added" : ""}">
        ${inCart ? "Added" : "Add"}
      </button>
    </div>
  `;

  /* VIEW */
  card.querySelector(".view-btn").onclick = () => openModal(p);

  /* ❤️ WISHLIST */
  const wishBtn = card.querySelector(".wishlist-btn");
  wishBtn.onclick = e => {
    e.preventDefault();
    e.stopPropagation();

    const list = getWishlist();
    const exists = list.some(i => i.id === p.id);

    saveWishlist(
      exists ? list.filter(i => i.id !== p.id) : [...list, p]
    );

    wishBtn.classList.toggle("active", !exists);
    window.updateBadges?.();
  };

  /* 🛒 CART */
  const cartBtn = card.querySelector(".cart-btn");
  cartBtn.onclick = e => {
    e.preventDefault();

    const cart = getCart();
    const exists = cart.some(i => i.id === p.id);

    saveCart(
      exists ? cart.filter(i => i.id !== p.id) : [...cart, p]
    );

    cartBtn.classList.toggle("added", !exists);
    cartBtn.textContent = exists ? "Add" : "Added";
    window.updateBadges?.();
  };

  return card;
}

/* =========================
   MODAL LOGIC
========================= */
function openModal(p) {
  activeProduct = p;
  modalImg.src = p.image;
  modalTitle.textContent = p.title;
  modalPrice.textContent = `₹${Math.round(p.price)}`;
  modal.classList.add("show");
}

function closeProductModal() {
  modal.classList.remove("show");
  activeProduct = null;
}

closeModal.onclick = closeProductModal;
modalCloseBtn.onclick = closeProductModal;

modal.onclick = e => {
  if (e.target === modal) closeProductModal();
};

modalCartBtn.onclick = () => {
  if (!activeProduct) return;

  const cart = getCart();
  if (!cart.some(p => p.id === activeProduct.id)) {
    saveCart([...cart, activeProduct]);
    window.updateBadges?.();
  }

  closeProductModal();
};

/* =========================
   STORAGE HELPERS
========================= */
const getCart = () =>
  JSON.parse(localStorage.getItem(CART_KEY)) || [];

const getWishlist = () =>
  JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];

const saveCart = cart =>
  localStorage.setItem(CART_KEY, JSON.stringify(cart));

const saveWishlist = list =>
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));

/* =========================
   HERO STATS
========================= */
function updateHeroStats() {
  if (totalProductsEl) totalProductsEl.textContent = allProducts.length;
  if (totalCategoriesEl) {
    totalCategoriesEl.textContent =
      new Set(allProducts.map(p => p.category)).size;
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

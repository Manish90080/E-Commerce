import { categories, imageUrl, money, products } from "./products.js";
import { currentRoute, navigate } from "./router.js";

const app = document.querySelector("#app");
const cartKey = "form-and-field-cart";
let cart = loadCart();
let searchOpen = false;

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(cartKey) || "{}");
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) return {};
    const productIds = new Set(products.map((product) => product.id));
    return Object.fromEntries(
      Object.entries(saved).filter(([id, quantity]) =>
        productIds.has(id) && Number.isSafeInteger(quantity) && quantity > 0,
      ),
    );
  } catch (error) {
    console.error("Could not read the saved shopping bag.", error);
    return {};
  }
}

function saveCart() {
  try {
    localStorage.setItem(cartKey, JSON.stringify(cart));
  } catch (error) {
    console.error("Could not save the shopping bag.", error);
    showToast("Your bag could not be saved on this device.");
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function productCard(product, index) {
  return `
    <article class="product-card" style="--card-index:${index}">
      <div class="product-image-link">
        <a class="product-photo" href="#/product/${product.id}" aria-label="View ${escapeHtml(product.name)}"><img src="${imageUrl(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy" decoding="async" width="720" height="900"></a>
        ${product.label ? `<span class="product-label">${escapeHtml(product.label)}</span>` : ""}
        <button class="quick-add" type="button" data-add="${product.id}" aria-label="Add ${escapeHtml(product.name)} to bag">+</button>
      </div>
      <div class="product-meta">
        <div><a href="#/product/${product.id}" class="product-name">${escapeHtml(product.name)}</a><span>${escapeHtml(product.color)}</span></div>
        <strong>${money(product.price)}</strong>
      </div>
    </article>`;
}

function productGrid(list) {
  if (!list.length) return `<div class="empty-state"><p>No pieces found this time.</p><a class="text-link" href="#/shop">Explore everything <span>→</span></a></div>`;
  return `<div class="product-grid">${list.map(productCard).join("")}</div>`;
}

function categoryCards() {
  return categories.slice(1).map((category, index) => {
    const image = products.find((product) => product.category === category.id);
    return `<a class="category-card category-card-${index + 1}" href="#/category/${category.id}">
      <img src="${imageUrl(image.image, 850)}" alt="" loading="lazy" decoding="async" width="850" height="850">
      <span class="category-card-copy"><span>Explore</span><strong>${category.name}</strong><span class="category-arrow">↗</span></span>
    </a>`;
  }).join("");
}

function homePage() {
  const featured = products.slice(0, 4);
  return `
    <section class="hero">
      <img class="hero-image" src="${imageUrl("photo-1494438639946-1ebd1d20bf85", 1800)}" alt="Soft morning light falling across a calm, considered home" fetchpriority="high" width="1800" height="1100">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <span class="eyebrow">GOOD DESIGN, LIVED IN</span>
        <h1>Everyday,<br><em>considered.</em></h1>
        <p>Useful, beautiful things for the life you actually live.</p>
        <a class="button button-dark" href="#/shop">Explore the collection <span>↗</span></a>
      </div>
      <span class="hero-caption">01 / OBJECTS FOR SLOWER DAYS</span>
    </section>
    <section class="intro section-wrap">
      <span class="eyebrow">A LITTLE LESS, A LITTLE BETTER</span>
      <h2>Fewer things. <em>Better chosen.</em></h2>
      <p>We look for the pieces that make ordinary moments feel a bit more like your own. Made thoughtfully, used often, kept for a long time.</p>
    </section>
    <section class="category-section section-wrap">
      <div class="section-heading"><div><span class="eyebrow">FIND YOUR EVERYDAY</span><h2>Make yourself at home.</h2></div><a class="text-link" href="#/shop">See everything <span>→</span></a></div>
      <div class="category-grid">${categoryCards()}</div>
    </section>
    <section class="featured-section section-wrap">
      <div class="section-heading"><div><span class="eyebrow">GOOD THINGS, TO KEEP</span><h2>Our most-loved pieces.</h2></div><a class="text-link" href="#/shop">Shop all <span>→</span></a></div>
      ${productGrid(featured)}
    </section>
    <section class="promise">
      <span class="eyebrow">MADE FOR THE LONG RUN</span>
      <h2>Good things take<br><em>their time.</em></h2>
      <p>Small-batch makers. Honest materials. Pieces worth passing on.</p>
      <a class="text-link" href="#/shop">Find your next keeper <span>→</span></a>
    </section>
    <section class="newsletter section-wrap">
      <div><span class="eyebrow">A NOTE NOW AND THEN</span><h2>Slow mail, good things.</h2><p>Occasional notes on thoughtful living, and a first look at what's new.</p></div>
      <form class="newsletter-form"><label class="sr-only" for="email">Email address</label><input id="email" name="email" type="email" placeholder="Your email address" required><button type="submit" aria-label="Subscribe">Join us <span>→</span></button></form>
    </section>`;
}

function shopPage(route) {
  const category = route.name === "category" ? categories.find((item) => item.id === route.category) : categories[0];
  if (!category) return notFoundPage();
  const query = route.search || "";
  const list = products.filter((product) =>
    (category.id === "all" || product.category === category.id) &&
    `${product.name} ${product.color} ${product.category}`.toLowerCase().includes(query.toLowerCase()),
  );
  return `<section class="collection section-wrap">
    <span class="eyebrow">${category.id === "all" ? "THE COLLECTION" : `THE COLLECTION / ${category.name.toUpperCase()}`}</span>
    <h1>${category.name === "all" ? "Good things, thoughtfully chosen." : `${category.name}, considered.`}</h1>
    <p class="collection-description">${category.description}</p>
    <form class="collection-search" role="search"><label class="sr-only" for="catalog-search">Search the collection</label><input id="catalog-search" name="q" type="search" value="${escapeHtml(query)}" placeholder="Search the collection"><button type="submit" aria-label="Search">⌕</button></form>
    <div class="filter-row">${categories.map((item) => `<a class="filter-chip ${item.id === category.id ? "active" : ""}" href="${item.id === "all" ? "#/shop" : `#/category/${item.id}`}">${item.name}</a>`).join("")}<span class="result-count">${list.length} pieces</span></div>
    ${productGrid(list)}
  </section>`;
}

function detailPage(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return notFoundPage();
  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3);
  return `<section class="detail section-wrap">
    <a class="back-link" href="#/shop">← Back to the collection</a>
    <div class="detail-layout">
      <div class="detail-image"><img src="${imageUrl(product.image, 1100)}" alt="${escapeHtml(product.name)}" fetchpriority="high" width="1100" height="1300"></div>
      <div class="detail-copy"><span class="eyebrow">${product.category.toUpperCase()} / MADE TO KEEP</span>
        <h1>${escapeHtml(product.name)}</h1><p class="detail-color">${escapeHtml(product.color)}</p>
        <p class="detail-price">${money(product.price)}</p><p class="detail-description">${escapeHtml(product.description)}</p>
        <button class="button button-dark add-to-bag" type="button" data-add="${product.id}">Add to bag <span>${money(product.price)}</span></button>
        <div class="detail-notes"><p>Thoughtful materials, selected to last.</p><p>Complimentary shipping on orders over $100.</p><p>30 days to find your fit.</p></div>
      </div>
    </div>
    ${related.length ? `<div class="related section-wrap"><div class="section-heading"><div><span class="eyebrow">IN GOOD COMPANY</span><h2>You might also like.</h2></div></div>${productGrid(related)}</div>` : ""}
  </section>`;
}

function cartPage() {
  const items = Object.entries(cart).map(([id, quantity]) => ({ product: products.find((item) => item.id === id), quantity })).filter((item) => item.product && item.quantity > 0);
  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  if (!items.length) return `<section class="empty-cart section-wrap"><span class="eyebrow">YOUR BAG, FOR NOW</span><h1>A little room for something good.</h1><p>Your bag is taking a breather. Find something you'll reach for every day.</p><a class="button button-dark" href="#/shop">Explore the collection <span>→</span></a></section>`;
  return `<section class="cart-page section-wrap"><span class="eyebrow">YOUR BAG</span><h1>Good choices.</h1><div class="cart-layout"><div class="cart-items">${items.map(({ product, quantity }) => `
    <article class="cart-item"><a href="#/product/${product.id}"><img src="${imageUrl(product.image, 320)}" alt="${escapeHtml(product.name)}" width="320" height="380"></a>
      <div class="cart-item-copy"><a class="product-name" href="#/product/${product.id}">${escapeHtml(product.name)}</a><span>${escapeHtml(product.color)}</span><div class="quantity-control"><button type="button" data-quantity="${product.id}" data-change="-1" aria-label="Remove one ${escapeHtml(product.name)}">−</button><span>${quantity}</span><button type="button" data-quantity="${product.id}" data-change="1" aria-label="Add one ${escapeHtml(product.name)}">+</button></div></div>
      <strong>${money(product.price * quantity)}</strong><button class="remove-item" type="button" data-remove="${product.id}" aria-label="Remove ${escapeHtml(product.name)} from bag">×</button></article>`).join("")}</div>
    <aside class="order-summary"><h2>A little summary.</h2><div><span>Subtotal</span><strong>${money(subtotal)}</strong></div><p>Shipping and any applicable taxes are calculated at checkout.</p><button class="button button-dark checkout-button" type="button">Continue to checkout <span>→</span></button><a class="continue-link" href="#/shop">Keep looking around</a></aside></div></section>`;
}

function notFoundPage() {
  return `<section class="empty-cart section-wrap"><span class="eyebrow">A SMALL DETOUR</span><h1>Nothing here just yet.</h1><p>Let's find our way back to the good things.</p><a class="button button-dark" href="#/">Back to the beginning <span>→</span></a></section>`;
}

function render() {
  const route = currentRoute();
  if (route.name === "home") app.innerHTML = homePage();
  else if (route.name === "shop" || route.name === "category") app.innerHTML = shopPage(route);
  else if (route.name === "product") app.innerHTML = detailPage(route.id);
  else if (route.name === "cart") app.innerHTML = cartPage();
  else app.innerHTML = notFoundPage();
  document.querySelector(".bag-count").textContent = Object.values(cart).reduce((sum, count) => sum + count, 0);
  if (searchOpen) renderSearch();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showToast(message) {
  const toast = document.querySelector(".toast");
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("visible"), 2600);
}

function renderSearch() {
  const existing = document.querySelector(".search-panel");
  if (!searchOpen) {
    existing?.remove();
    return;
  }
  if (existing) return;
  document.body.insertAdjacentHTML("beforeend", `<div class="search-panel"><form class="site-search" role="search"><label class="sr-only" for="site-search-input">Search products</label><input id="site-search-input" type="search" placeholder="Looking for something?" autocomplete="off"><button type="submit" aria-label="Search">→</button><button type="button" class="close-search" aria-label="Close search">×</button></form></div>`);
  document.querySelector("#site-search-input").focus();
}

document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  if (addButton) {
    const { add: id } = addButton.dataset;
    cart[id] = (cart[id] || 0) + 1;
    saveCart();
    document.querySelector(".bag-count").textContent = Object.values(cart).reduce((sum, count) => sum + count, 0);
    showToast(`${products.find((item) => item.id === id).name} added to your bag.`);
    return;
  }
  const quantityButton = event.target.closest("[data-quantity]");
  if (quantityButton) {
    const { quantity: id, change } = quantityButton.dataset;
    cart[id] = Math.max(0, (cart[id] || 0) + Number(change));
    if (!cart[id]) delete cart[id];
    saveCart();
    render();
    return;
  }
  const removeButton = event.target.closest("[data-remove]");
  if (removeButton) {
    delete cart[removeButton.dataset.remove];
    saveCart();
    render();
    return;
  }
  if (event.target.closest(".search-toggle")) {
    searchOpen = !searchOpen;
    renderSearch();
    return;
  }
  if (event.target.closest(".close-search")) {
    searchOpen = false;
    renderSearch();
    return;
  }
  if (event.target.closest(".checkout-button")) showToast("Checkout is a demo—your bag is saved right here.");
});

document.addEventListener("submit", (event) => {
  if (event.target.matches(".collection-search")) {
    event.preventDefault();
    const query = new FormData(event.target).get("q").trim();
    navigate(query ? `/shop?q=${encodeURIComponent(query)}` : "/shop");
  }
  if (event.target.matches(".site-search")) {
    event.preventDefault();
    const query = new FormData(event.target).get("q") || document.querySelector("#site-search-input").value;
    searchOpen = false;
    navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
  }
  if (event.target.matches(".newsletter-form")) {
    event.preventDefault();
    showToast("Thanks for stopping by. Newsletter signup isn't connected in this demo yet.");
    event.target.reset();
  }
});

document.querySelector(".current-year").textContent = new Date().getFullYear();
window.addEventListener("hashchange", () => {
  searchOpen = false;
  render();
});
render();

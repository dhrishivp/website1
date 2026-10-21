// Villa Mangal — renders the menu from data/menu.json with a category jump-nav and vegetarian filter.

const TAG_LABELS = {
  v: { text: "V", title: "Vegetarian" },
  spicy: { text: "Spicy", title: "Spicy" },
  popular: { text: "Popular", title: "Customer favourite" },
  share: { text: "Share", title: "Made for sharing" },
};

const root = document.getElementById("menu-root");
const jump = document.getElementById("menu-jump");
const vegToggle = document.getElementById("veg-only");

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function formatPrice(currency, price) {
  return `${currency}${price.toFixed(2)}`;
}

function renderItem(item, currency) {
  const li = el("li", "menu-item");
  li.dataset.veg = item.tags.includes("v") ? "1" : "0";

  const top = el("div", "menu-item-top");
  const name = el("span", "menu-item-name", item.name);
  item.tags.forEach((t) => {
    const label = TAG_LABELS[t];
    if (!label) return;
    const tag = el("span", `tag tag-${t}`, label.text);
    tag.title = label.title;
    name.append(tag);
  });
  top.append(name, el("span", "menu-item-dots"), el("span", "menu-item-price", formatPrice(currency, item.price)));
  li.append(top);

  if (item.desc) li.append(el("p", "menu-item-desc", item.desc));
  return li;
}

function renderCategory(cat, currency) {
  const section = el("section", "menu-category");
  section.id = cat.id;
  section.setAttribute("aria-labelledby", `${cat.id}-title`);

  const head = el("div", "menu-category-head");
  const h2 = el("h2", null, cat.name);
  h2.id = `${cat.id}-title`;
  head.append(h2);
  if (cat.note) head.append(el("p", null, cat.note));

  const list = el("ul", "menu-items");
  cat.items.forEach((item) => list.append(renderItem(item, currency)));

  section.append(head, list);
  return section;
}

function renderJumpLink(cat) {
  const li = el("li");
  const a = el("a", null, cat.name);
  a.href = `#${cat.id}`;
  li.append(a);
  return li;
}

function applyVegFilter() {
  const vegOnly = vegToggle.checked;
  root.querySelectorAll(".menu-category").forEach((section) => {
    let visible = 0;
    section.querySelectorAll(".menu-item").forEach((item) => {
      const show = !vegOnly || item.dataset.veg === "1";
      item.hidden = !show;
      if (show) visible++;
    });
    section.hidden = visible === 0;
    const link = jump.querySelector(`a[href="#${section.id}"]`);
    if (link) link.parentElement.hidden = visible === 0;
  });
}

// Highlight the jump-nav pill for the category currently on screen.
function trackActiveCategory() {
  if (!("IntersectionObserver" in window)) return;
  const links = new Map([...jump.querySelectorAll("a")].map((a) => [a.getAttribute("href").slice(1), a]));
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a.classList.remove("is-active"));
        const active = links.get(entry.target.id);
        if (active) {
          active.classList.add("is-active");
          // Scroll only the pill strip; scrollIntoView would interrupt the page's own smooth scroll.
          const left = active.offsetLeft - (jump.clientWidth - active.offsetWidth) / 2;
          jump.scrollTo({ left, behavior: "smooth" });
        }
      });
    },
    { rootMargin: "-35% 0px -60% 0px" }
  );
  root.querySelectorAll(".menu-category").forEach((s) => observer.observe(s));
}

async function init() {
  try {
    const res = await fetch("data/menu.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const menu = await res.json();
    root.textContent = "";
    menu.categories.forEach((cat) => {
      root.append(renderCategory(cat, menu.currency));
      jump.append(renderJumpLink(cat));
    });
    vegToggle.addEventListener("change", applyVegFilter);
    applyVegFilter();
    trackActiveCategory();
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
  } catch (err) {
    root.textContent = "";
    const p = el("p", "menu-empty", "Sorry, the menu couldn't be loaded. Please call us on 01494 729055 or view our menu on Deliveroo.");
    root.append(p);
    console.error("Menu failed to load:", err);
  }
}

init();

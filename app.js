/* =========================================================
   AURIA · app
   ========================================================= */
(() => {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const fmt = n => "$" + n.toLocaleString("es-MX");
  const byId = id => PRODUCTS.find(p => p.id === id);
  const IG = (AURIA_CONFIG.instagram || "").trim().replace(/^@/, "");
  const HAS_IG = IG.length > 0;                       // false = cuenta pendiente
  const IG_DM = HAS_IG ? `https://ig.me/m/${IG}` : "#instagram";
  const IG_PROFILE = HAS_IG ? `https://www.instagram.com/${IG}/` : "#instagram";
  const IG_SOON = "Nuestro Instagram estará disponible muy pronto ✨";
  const CAN_HOVER = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const IS_PHONE = matchMedia("(max-width: 760px)").matches;
  const icon = (name, cls = "") => `<svg class="${cls}"><use href="#${name}"/></svg>`;

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };

  /* ---------- Instagram links ---------- */
  $$(".ig-link").forEach(a => { a.href = IG_DM; if (!HAS_IG) a.removeAttribute("target"); });
  $$(".ig-handle").forEach(el => { el.textContent = HAS_IG ? "@" + IG : "Instagram"; });
  if (!HAS_IG) document.body.classList.add("ig-pending");
  // Mientras no haya cuenta, cualquier enlace de Instagram solo muestra un aviso
  document.addEventListener("click", e => {
    if (HAS_IG) return;
    const a = e.target.closest('a[href="#instagram"]');
    if (!a) return;
    e.preventDefault();
    toast(IG_SOON);
  });
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Loader ---------- */
  const finishLoad = () => {
    $("#loader").classList.add("done");
    document.body.classList.add("loaded");
    setTimeout(() => $("#loader").remove(), 1400);
  };
  let loadedOnce = false;
  const onceLoad = () => { if (!loadedOnce) { loadedOnce = true; setTimeout(finishLoad, 700); } };
  window.addEventListener("load", onceLoad);
  setTimeout(onceLoad, 2200);

  /* ---------- Scroll: header, progress, to-top ---------- */
  const header = $("#header"), progress = $("#progress"), toTop = $("#toTop");
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    const h = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    header.classList.toggle("scrolled", y > 10);
    header.classList.toggle("hide", y > 500 && y > lastY && !document.body.classList.contains("lock"));
    toTop.classList.toggle("show", y > 900);
    lastY = y;
    parallax(y);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- Parallax hero ---------- */
  const pEls = $$(".parallax");
  let mx = 0, my = 0;
  function parallax(y = scrollY) {
    if (y > innerHeight * 1.2) return;
    pEls.forEach(el => {
      const s = parseFloat(el.dataset.speed || 0);
      el.style.transform = `translate3d(${mx * s * 120}px, ${y * s + my * s * 120}px, 0)`;
    });
  }
  if (matchMedia("(hover:hover)").matches) {
    $(".hero").addEventListener("mousemove", e => {
      mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; parallax();
    });
    // Magnetic buttons
    $$(".magnetic").forEach(b => {
      b.addEventListener("mousemove", e => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px, ${(e.clientY - r.top - r.height / 2) * .35}px)`;
      });
      b.addEventListener("mouseleave", () => { b.style.transform = ""; });
    });
  }

  /* ---------- Reveal ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: .12, rootMargin: "0px 0px -40px 0px" });
  const watchReveal = root => $$(".reveal", root).forEach((el, i) => {
    if (!el.style.transitionDelay) el.style.transitionDelay = ((i % 4) * 0.08) + "s";
    io.observe(el);
  });
  watchReveal(document);

  /* ---------- Counters ---------- */
  const cio = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, to = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), suf = el.dataset.suffix || "";
      const t0 = performance.now(), dur = 1800;
      const step = t => {
        const k = Math.min(1, (t - t0) / dur), v = to * (1 - Math.pow(1 - k, 3));
        el.textContent = (dec ? v.toFixed(dec) : Math.round(v).toLocaleString("es-MX")) + suf;
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      cio.unobserve(el);
    });
  }, { threshold: .6 });
  $$("[data-count]").forEach(el => cio.observe(el));

  /* ---------- Toast ---------- */
  let toastT;
  const toast = msg => {
    $("#toastTxt").textContent = msg;
    $("#toast").classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => $("#toast").classList.remove("show"), 2600);
  };

  /* ---------- Wishlist ---------- */
  let wish = store.get("auria_wish", []);
  const saveWish = () => {
    store.set("auria_wish", wish);
    const c = $("#wishCount"); c.textContent = wish.length; c.classList.toggle("show", wish.length > 0);
  };
  const toggleWish = id => {
    const on = !wish.includes(id);
    wish = on ? [...wish, id] : wish.filter(x => x !== id);
    saveWish();
    $$(`.wish[data-id="${id}"]`).forEach(b => {
      b.classList.toggle("on", on);
      b.innerHTML = icon(on ? "i-heart-f" : "i-heart");
    });
    if (qvId === id) setQvWish();
    toast(on ? "Guardado en favoritos" : "Eliminado de favoritos");
  };
  $("#wishBtn").addEventListener("click", () => {
    if (!wish.length) { toast("Aún no tienes favoritos ♡"); return; }
    filter = "fav"; renderTabs(); renderGrid();
    document.getElementById("tienda").scrollIntoView({ behavior: "smooth" });
  });

  /* ---------- Shop grid ---------- */
  let filter = "todo", sort = "featured";
  const tabsEl = $("#tabs"), grid = $("#grid");

  function renderTabs() {
    const tabs = Object.entries(CATEGORIES).map(([k, v]) => {
      const n = k === "todo" ? PRODUCTS.length : PRODUCTS.filter(p => p.cat === k).length;
      return `<button class="tab ${filter === k ? "active" : ""}" data-k="${k}">${v}<sup>${n}</sup></button>`;
    });
    if (wish.length) tabs.push(`<button class="tab ${filter === "fav" ? "active" : ""}" data-k="fav">♡ Favoritos<sup>${wish.length}</sup></button>`);
    tabsEl.innerHTML = tabs.join("");
  }
  tabsEl.addEventListener("click", e => {
    const t = e.target.closest(".tab"); if (!t) return;
    filter = t.dataset.k; renderTabs(); renderGrid();
  });
  $("#sortSel").addEventListener("change", e => { sort = e.target.value; renderGrid(); });

  const badgeCls = b => /vendido|tendencia/i.test(b) ? "hot" : /precio/i.test(b) ? "deal" : "";

  function cardHTML(p) {
    const on = wish.includes(p.id), multi = p.sizes.length > 1;
    return `
    <article class="card" data-id="${p.id}">
      <div class="card-media" data-open="${p.id}">
        ${p.badge ? `<span class="badge ${badgeCls(p.badge)}">${p.badge}</span>` : ""}
        <img class="img-a" src="${p.img[0]}" alt="${p.name}" loading="lazy">
        ${CAN_HOVER ? `<img class="img-b" src="${p.img[1] || p.img[0]}" alt="" loading="lazy" decoding="async">` : ""}
        <button class="wish ${on ? "on" : ""}" data-id="${p.id}" aria-label="Favorito">${icon(on ? "i-heart-f" : "i-heart")}</button>
        <div class="card-actions">
          ${multi
            ? `<div class="ca-sizes"><span>Agregar talla</span><div>${p.sizes.map(s => `<button class="ca-size" data-add="${p.id}" data-size="${s}">${s}</button>`).join("")}</div></div>`
            : `<button class="ca-add" data-add="${p.id}" data-size="${p.sizes[0]}">${icon("i-bag")}Agregar · ${p.sizes[0]}</button>`}
          <button class="ca-view" data-open="${p.id}" aria-label="Vista rápida">${icon("i-eye")}</button>
        </div>
      </div>
      <div class="card-body">
        <div class="card-top">
          <h3 class="card-name" data-open="${p.id}">${p.name}</h3>
          <span class="card-price">${fmt(p.price)}</span>
        </div>
        <div class="card-meta">
          <span class="swatch" style="background:${p.hex}"></span>${p.color}
        </div>
        <div class="card-sizes">${p.sizes.map(s => `<span class="size-tag">${s}</span>`).join("")}${multi ? `<small>${p.sizes.length} tallas</small>` : ""}</div>
        ${multi
          ? `<button class="card-mobile-add" data-open="${p.id}">${icon("i-ruler")}Elegir talla</button>`
          : `<button class="card-mobile-add" data-add="${p.id}" data-size="${p.sizes[0]}">${icon("i-bag")}Agregar</button>`}
      </div>
    </article>`;
  }

  const cardIO = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); cardIO.unobserve(e.target); } });
  }, { threshold: .1 });

  function renderGrid() {
    let list = filter === "todo" ? [...PRODUCTS]
      : filter === "fav" ? PRODUCTS.filter(p => wish.includes(p.id))
      : PRODUCTS.filter(p => p.cat === filter);
    if (sort === "low") list.sort((a, b) => a.price - b.price);
    if (sort === "high") list.sort((a, b) => b.price - a.price);
    if (sort === "az") list.sort((a, b) => a.name.localeCompare(b.name, "es"));
    grid.innerHTML = list.map(cardHTML).join("");
    $("#empty").hidden = list.length > 0;
    $$(".card", grid).forEach((c, i) => {
      c.style.transitionDelay = (i % 4) * 0.08 + "s";
      cardIO.observe(c);
    });
  }

  grid.addEventListener("click", e => {
    const w = e.target.closest(".wish");
    if (w) { e.stopPropagation(); toggleWish(w.dataset.id); return; }
    const a = e.target.closest("[data-add]");
    if (a) { e.stopPropagation(); addToCart(a.dataset.add, a.dataset.size, 1, a); return; }
    const o = e.target.closest("[data-open]");
    if (o) openQV(o.dataset.open);
  });

  // nav / category links that set a filter
  $$("[data-filter]").forEach(a => a.addEventListener("click", () => {
    filter = a.dataset.filter; renderTabs(); renderGrid(); closeMnav();
  }));

  /* ---------- Cart ---------- */
  // cada línea de la bolsa es pieza + talla
  let cart = store.get("auria_cart", []).filter(i => byId(i.id)).map(i => {
    const p = byId(i.id);
    return { ...i, size: p.sizes.includes(i.size) ? i.size : p.sizes[0] };
  });
  const sizeLabel = (p, s) => s === "Unitalla" && p.sizeNote ? `Unitalla (${p.sizeNote.replace(/^Queda (a una |de )?/i, "")})` : s;
  const cartCount = () => cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = items => items.reduce((s, i) => s + byId(i.id).price * i.qty, 0);

  function saveCart(bump) {
    store.set("auria_cart", cart);
    const c = $("#cartCount"), n = cartCount();
    c.textContent = n; c.classList.toggle("show", n > 0);
    if (bump) { c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump"); }
    renderCart();
  }

  function flyToCart(fromEl, imgSrc) {
    if (!fromEl) return;
    const r = fromEl.getBoundingClientRect(), t = $("#cartBtn").getBoundingClientRect();
    const f = document.createElement("img");
    f.src = imgSrc;
    Object.assign(f.style, {
      position: "fixed", zIndex: 600, left: r.left + r.width / 2 - 30 + "px", top: r.top + r.height / 2 - 36 + "px",
      width: "60px", height: "72px", objectFit: "cover", borderRadius: "12px", pointerEvents: "none",
      boxShadow: "0 10px 30px rgba(0,0,0,.25)", transition: "transform .9s cubic-bezier(.6,-.2,.3,1), opacity .9s"
    });
    document.body.appendChild(f);
    requestAnimationFrame(() => {
      f.style.transform = `translate(${t.left - r.left - r.width / 2 + 52}px, ${t.top - r.top - r.height / 2 + 36}px) scale(.2)`;
      f.style.opacity = ".3";
    });
    setTimeout(() => f.remove(), 950);
  }

  function addToCart(id, size, qty = 1, fromEl) {
    const p = byId(id);
    if (!p.sizes.includes(size)) { openQV(id); return; }
    const ex = cart.find(i => i.id === id && i.size === size);
    if (ex) ex.qty += qty; else cart.push({ id, size, qty });
    flyToCart(fromEl, p.img[0]);
    setTimeout(() => saveCart(true), fromEl ? 650 : 0);
    toast(`${p.name} · talla ${size} se agregó a tu bolsa`);
  }

  function renderCart() {
    const items = $("#cartItems"), foot = $("#cartFoot");
    const n = cartCount();
    $("#cartN").textContent = n ? `(${n})` : "";
    if (!cart.length) {
      items.innerHTML = `<div class="cart-empty">${icon("i-bag")}<h4>Tu bolsa está vacía</h4><p>Descubre piezas que te harán brillar.</p><button class="btn btn-primary" data-close-cart data-goshop>Ver colección</button></div>`;
      foot.style.display = "none";
      return;
    }
    foot.style.display = "";
    items.innerHTML = cart.map((i, idx) => {
      const p = byId(i.id);
      return `<div class="ci">
        <img src="${p.img[0]}" alt="${p.name}">
        <div class="ci-info">
          <span class="ci-name">${p.name}</span>
          <span class="ci-meta"><span class="ci-size">Talla ${sizeLabel(p, i.size)}</span> · ${p.color}</span>
          <button class="ci-rm" data-rm="${idx}">${icon("i-trash")}Quitar</button>
          <div class="ci-bottom">
            <div class="qty"><button data-cq="-1" data-idx="${idx}" aria-label="Menos">${icon("i-minus")}</button><span>${i.qty}</span><button data-cq="1" data-idx="${idx}" aria-label="Más">${icon("i-plus")}</button></div>
            <span class="ci-price">${fmt(p.price * i.qty)}</span>
          </div>
        </div>
      </div>`;
    }).join("");
    $("#cartSub").textContent = fmt(cartTotal(cart)) + " MXN";
  }

  $("#cartItems").addEventListener("click", e => {
    const q = e.target.closest("[data-cq]");
    if (q) {
      const it = cart[+q.dataset.idx]; if (!it) return;
      it.qty += +q.dataset.cq;
      if (it.qty < 1) cart = cart.filter(i => i !== it);
      saveCart(); return;
    }
    const r = e.target.closest("[data-rm]");
    if (r) { cart = cart.filter((_, idx) => idx !== +r.dataset.rm); saveCart(); }
    if (e.target.closest("[data-goshop]")) setTimeout(() => document.getElementById("tienda").scrollIntoView({ behavior: "smooth" }), 300);
  });

  /* ---------- Overlays (open/close helpers) ---------- */
  const openLayer = el => { el.classList.add("open"); el.setAttribute("aria-hidden", "false"); document.body.classList.add("lock"); };
  const closeLayer = el => {
    el.classList.remove("open"); el.setAttribute("aria-hidden", "true");
    if (!$$(".modal.open, .drawer.open, .search.open, .mnav.open").length) document.body.classList.remove("lock");
  };
  const cartEl = $("#cart"), qvEl = $("#qv"), orderEl = $("#order"), searchEl = $("#search"), mnav = $("#mnav");
  $("#cartBtn").addEventListener("click", () => openLayer(cartEl));
  document.addEventListener("click", e => {
    if (e.target.closest("[data-close-cart]")) closeLayer(cartEl);
    if (e.target.closest("[data-close-qv]")) closeLayer(qvEl);
    if (e.target.closest("[data-close-order]")) closeLayer(orderEl);
    if (e.target.closest("[data-close-search]") || e.target === searchEl) closeLayer(searchEl);
    if (e.target.closest("[data-close-mnav]") || e.target === mnav) closeMnav();
  });
  document.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    [orderEl, qvEl, cartEl, searchEl].forEach(closeLayer); closeMnav();
  });
  $("#menuBtn").addEventListener("click", () => openLayer(mnav));
  function closeMnav() { if (mnav.classList.contains("open")) closeLayer(mnav); }
  $$(".mnav-panel a").forEach(a => a.addEventListener("click", closeMnav));

  /* ---------- Quick view ---------- */
  let qvId = null, qvQty = 1, qvSize = null;
  const revCount = id => 40 + ([...id].reduce((s, c) => s + c.charCodeAt(0), 0) % 160);
  const setQvWish = () => {
    const on = wish.includes(qvId), b = $("#qvWish");
    b.classList.toggle("on", on); b.innerHTML = icon(on ? "i-heart-f" : "i-heart");
  };
  function setQvImg(src) {
    const img = $("#qvImg");
    img.style.animation = "none"; void img.offsetWidth; img.style.animation = "";
    img.src = src;
    $$("#qvThumbs button").forEach(b => b.classList.toggle("active", b.dataset.src === src));
  }
  function openQV(id) {
    const p = byId(id); if (!p) return;
    qvId = id; qvQty = 1;
    $("#qvName").textContent = p.name;
    $("#qvBadge").textContent = p.badge || "";
    $("#qvPrice").innerHTML = `${fmt(p.price)} <small>MXN</small>`;
    $("#qvDesc").textContent = p.desc;
    $("#qvColor").textContent = p.color;
    $("#qvSwatch").style.background = p.hex;
    qvSize = p.sizes.length === 1 ? p.sizes[0] : null;
    $("#qvSizes").innerHTML = p.sizes.map(s => `<button class="size-chip ${s === qvSize ? "active" : ""}" data-size="${s}">${s}</button>`).join("");
    $("#qvSizeNote").textContent = p.sizeNote || (p.sizes.length > 1 ? "Elige tu talla" : "");
    $("#qvSizeLbl").textContent = qvSize ? `Talla: ${qvSize}` : "Talla";
    $("#qvRev").textContent = `4.9 · ${revCount(id)} reseñas`;
    $("#qvFeat").innerHTML = p.features.map(f => `<li>${icon("i-check")}${f}</li>`).join("");
    $("#qvStock").textContent = p.sizes.length > 1 ? `¡Pocas piezas por talla! Disponible en ${p.sizes.join(" y ")}` : `¡Pocas piezas disponibles en talla ${p.sizes[0]}!`;
    $("#qvSizeRow").classList.remove("need");
    $("#qvQty").textContent = 1;
    $("#qvImg").alt = p.name;
    $("#qvThumbs").innerHTML = p.img.map(s => `<button data-src="${s}"><img src="${s}" alt=""></button>`).join("");
    setQvImg(p.img[0]);
    setQvWish();
    openLayer(qvEl);
  }
  $("#qvThumbs").addEventListener("click", e => { const b = e.target.closest("button"); if (b) setQvImg(b.dataset.src); });
  $$("#qv [data-q]").forEach(b => b.addEventListener("click", () => {
    qvQty = Math.max(1, Math.min(9, qvQty + +b.dataset.q)); $("#qvQty").textContent = qvQty;
  }));
  $("#qvSizes").addEventListener("click", e => {
    const b = e.target.closest("[data-size]"); if (!b) return;
    qvSize = b.dataset.size;
    $$("#qvSizes .size-chip").forEach(c => c.classList.toggle("active", c === b));
    $("#qvSizeLbl").textContent = `Talla: ${qvSize}`;
    $("#qvSizeRow").classList.remove("need");
  });
  const needSize = () => {
    if (qvSize) return false;
    const row = $("#qvSizeRow");
    row.classList.remove("need"); void row.offsetWidth; row.classList.add("need");
    toast("Elige tu talla primero");
    return true;
  };
  $("#qvAdd").addEventListener("click", e => { if (needSize()) return; addToCart(qvId, qvSize, qvQty, e.currentTarget); closeLayer(qvEl); });
  $("#qvWish").addEventListener("click", () => toggleWish(qvId));
  $("#qvBuy").addEventListener("click", () => { if (needSize()) return; closeLayer(qvEl); openOrder([{ id: qvId, size: qvSize, qty: qvQty }]); });

  /* ---------- Order via Instagram ---------- */
  let orderItems = [];
  function buildMsg() {
    const name = $("#orderName").value.trim(), city = $("#orderCity").value.trim();
    const lines = ["¡Hola AURIA! ✨ Quiero hacer este pedido:", ""];
    orderItems.forEach((i, n) => {
      const p = byId(i.id);
      lines.push(`${n + 1}. ${p.name}`);
      lines.push(`   Talla: ${sizeLabel(p, i.size)} · Color: ${p.color}`);
      lines.push(`   Cantidad: ${i.qty} · ${fmt(p.price * i.qty)}`);
    });
    lines.push("", `Total: ${fmt(cartTotal(orderItems))} MXN`);
    if (name) lines.push(`Nombre: ${name}`);
    if (city) lines.push(`Envío a: ${city}`);
    lines.push("", "¿Me confirman disponibilidad y forma de pago? 🙏");
    return lines.join("\n");
  }
  const refreshMsg = () => { $("#orderMsg").textContent = buildMsg(); };
  function openOrder(items) {
    orderItems = items;
    $("#orderName").value = store.get("auria_name", "");
    $("#orderCity").value = store.get("auria_city", "");
    refreshMsg();
    openLayer(orderEl);
  }
  $("#orderName").addEventListener("input", e => { store.set("auria_name", e.target.value); refreshMsg(); });
  $("#orderCity").addEventListener("input", e => { store.set("auria_city", e.target.value); refreshMsg(); });
  $("#checkoutBtn").addEventListener("click", () => { closeLayer(cartEl); openOrder(cart.map(i => ({ ...i }))); });

  function copyText(txt) {
    let ok = false;
    try {
      const ta = document.createElement("textarea");
      ta.value = txt; ta.setAttribute("readonly", "");
      Object.assign(ta.style, { position: "fixed", top: "0", left: "0", opacity: "0" });
      document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, txt.length);
      ok = document.execCommand("copy");
      ta.remove();
    } catch {}
    try { navigator.clipboard && navigator.clipboard.writeText(txt).catch(() => {}); ok = true; } catch {}
    return ok;
  }
  $("#orderGo").addEventListener("click", () => {
    copyText(buildMsg());
    if (HAS_IG) {
      toast("Pedido copiado ✓ Pégalo en el chat de Instagram");
      window.open(IG_DM, "_blank", "noopener");
    } else {
      toast("Pedido copiado ✓ · " + IG_SOON);
    }
  });
  $("#orderCopy").addEventListener("click", () => {
    toast(copyText(buildMsg()) ? "Mensaje copiado ✓" : "Selecciona y copia el mensaje");
  });

  /* ---------- Policies ---------- */
  const polEl = $("#policy"), polTabs = $("#polTabs"), polBody = $("#polBody");
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  polTabs.innerHTML = Object.entries(POLICIES).map(([k, p]) =>
    `<button class="pol-tab" role="tab" data-ptab="${k}">${icon(p.icon)}${esc(p.tab)}</button>`).join("");

  function showPolicy(key) {
    const p = POLICIES[key] || POLICIES.envios;
    key = POLICIES[key] ? key : "envios";
    $$(".pol-tab", polTabs).forEach(t => {
      const on = t.dataset.ptab === key;
      t.classList.toggle("active", on); t.setAttribute("aria-selected", on);
      if (on) t.scrollIntoView({ block: "nearest", inline: "center" });
    });
    polBody.style.animation = "none"; void polBody.offsetWidth; polBody.style.animation = "";
    polBody.innerHTML = `
      <h3 id="polTitle">${esc(p.title)}</h3>
      <span class="pol-upd">Última actualización: ${esc(POLICIES_UPDATED)}</span>
      <p class="pol-intro">${esc(p.intro)}</p>
      ${p.sections.map((s, i) => `
        <div class="pol-sec">
          <h4><span>${String(i + 1).padStart(2, "0")}</span>${esc(s.h)}</h4>
          ${s.p ? `<p>${esc(s.p)}</p>` : ""}
          ${s.list ? `<ul>${s.list.map(li => `<li>${icon("i-check")}<span>${esc(li)}</span></li>`).join("")}</ul>` : ""}
        </div>`).join("")}
      <div class="pol-help">
        <p><b>¿Tienes dudas?</b>Escríbenos y te respondemos al momento.</p>
        <a class="btn btn-light" href="${IG_DM}" ${HAS_IG ? 'target="_blank" rel="noopener"' : ""}>${icon("i-ig")}Mandar mensaje</a>
      </div>`;
    $(".pol-box").scrollTop = 0;
    try { history.replaceState(null, "", "#politica-" + key); } catch {}
  }
  function openPolicy(key) { showPolicy(key); openLayer(polEl); }
  function closePolicy() {
    if (!polEl.classList.contains("open")) return;
    closeLayer(polEl);
    try { history.replaceState(null, "", location.pathname + location.search); } catch {}
  }
  polTabs.addEventListener("click", e => { const t = e.target.closest("[data-ptab]"); if (t) showPolicy(t.dataset.ptab); });
  document.addEventListener("click", e => {
    const l = e.target.closest("[data-policy]");
    if (l) { e.preventDefault(); openPolicy(l.dataset.policy); return; }
    if (e.target.closest("[data-close-policy]")) closePolicy();
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closePolicy(); });
  const polFromHash = () => {
    const m = location.hash.match(/^#politica-(\w+)/);
    if (m && POLICIES[m[1]]) openPolicy(m[1]);
  };
  window.addEventListener("hashchange", polFromHash);
  setTimeout(polFromHash, 900);

  /* ---------- Search ---------- */
  const sIn = $("#searchIn"), sRes = $("#searchRes");
  const norm = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  function renderSearch() {
    const q = norm(sIn.value.trim());
    const list = PRODUCTS.filter(p => !q || norm(`${p.name} ${p.color} ${CATEGORIES[p.cat]} ${p.sizes.join(" ")}`).includes(q)).slice(0, 8);
    sRes.innerHTML = list.length ? list.map(p => `<div class="sr-item" data-open="${p.id}"><img src="${p.img[0]}" alt="${p.name}"><b>${p.name}</b><span>${fmt(p.price)} · ${p.sizes.length > 1 ? "Tallas" : "Talla"} ${p.sizes.join(", ")}</span></div>`).join("")
      : `<p class="sr-none">Sin resultados para “${sIn.value}”.</p>`;
  }
  $("#searchBtn").addEventListener("click", () => { openLayer(searchEl); renderSearch(); setTimeout(() => sIn.focus(), 300); });
  sIn.addEventListener("input", renderSearch);
  sRes.addEventListener("click", e => {
    const it = e.target.closest("[data-open]"); if (!it) return;
    closeLayer(searchEl); openQV(it.dataset.open);
  });

  /* ---------- Reviews ---------- */
  const REVIEWS = [
    ["Mariana F.", "Guadalajara, Jal.", "flare-elite", "La tela es gruesísima y no se transparenta nada. El flare me queda perfecto, ya quiero otro color."],
    ["Andrea R.", "CDMX", "contour", "El jumpsuit es una locura, los vivos blancos estilizan muchísimo. Me llegó súper rápido."],
    ["Valeria L.", "Monterrey, N.L.", "cacao-sculpt", "El color cacao es hermoso y la pretina en V sí levanta. Me encantó la atención por DM."],
    ["Daniela M.", "Puebla, Pue.", "golden-zip", "La chamarra blanca con cierres dorados se ve carísima. Recibí muchísimos cumplidos en el gym."],
    ["Fernanda G.", "Querétaro, Qro.", "scrunch", "El scrunch hace magia 😍 Seamless, cómodo y no se baja al hacer sentadillas."],
    ["Karla S.", "Tijuana, B.C.", "stardust", "El romper de estrellitas es precioso, la espalda abierta se ve increíble en fotos."],
    ["Paola V.", "Mérida, Yuc.", "flare-marfil", "Mido 1.70 y por fin un flare que me queda largo. La tela acanalada es suavecita."],
    ["Ximena T.", "León, Gto.", "elite-chocolate", "Las bolsas laterales son lo máximo, llevo el celular mientras corro. Calidad top."],
    ["Sofía A.", "Toluca, Edo. Méx.", "crossback", "Los tirantes cruzados se ven divinos y el short no se sube. Precio buenísimo."],
    ["Regina C.", "Culiacán, Sin.", "marino-open", "Las copas removibles son súper prácticas y el azul marino es elegantísimo."],
    ["Camila H.", "Aguascalientes, Ags.", "cargo", "El flare cargo es mi favorito para salir, combina con tenis y se ve muy urbano."],
    ["Lucía P.", "Hermosillo, Son.", "reflect", "La chamarra reflejante es perfecta para correr en la noche y entalla bonito."],
    ["Natalia O.", "Cancún, Q.R.", "blush", "El rosa blush está hermoso y la cintura efecto faja sí se nota. Súper recomendada."],
    ["Itzel B.", "Morelia, Mich.", "zip-romper", "Me pongo el romper y ya estoy lista. Cómodo, bonito y la talla fue exacta."],
    ["Renata D.", "Saltillo, Coah.", "dots-noir", "Los puntitos se ven muy finos en persona. Atención rapidísima por Instagram."],
    ["Alejandra N.", "Oaxaca, Oax.", "flare-split", "La abertura del flare se ve preciosa con tenis blancos. Ya pedí el grafito."]
  ];
  const avColors = ["#B4532F", "#8E3E22", "#C97B5A", "#5A3A2C", "#D9825E", "#7A4A36"];
  const revHTML = ([n, city, pid, txt], i) => {
    const p = byId(pid);
    const ini = n.split(" ").map(w => w[0]).join("").replace(".", "");
    return `<article class="rev">
      <div class="rev-top">
        <div class="stars">${icon("i-star").repeat(5)}</div>
        <span class="verified">${icon("i-check")}Compra verificada</span>
      </div>
      <p>“${txt}”</p>
      <div class="rev-prod"><img src="${p.img[0]}" alt="" loading="lazy"><div><b>${p.name}</b><span>Talla ${p.sizes[i % p.sizes.length]}</span></div></div>
      <div class="rev-user"><span class="rev-av" style="background:${avColors[i % avColors.length]}">${ini}</span><div><b>${n}</b><small>${icon("i-pin")}${city}</small></div></div>
    </article>`;
  };
  const half = Math.ceil(REVIEWS.length / 2);
  const r1 = REVIEWS.slice(0, half).map(revHTML).join(""), r2 = REVIEWS.slice(half).map((r, i) => revHTML(r, i + 3)).join("");
  $("#revRow1 .rev-track").innerHTML = r1 + r1;
  $("#revRow2 .rev-track").innerHTML = r2 + r2;

  /* ---------- Instagram grid ---------- */
  const igPics = ["stardust-1", "flare-elite-1", "crossback-1", "elite-chocolate-1", "marino-open-1", "golden-zip-1"];
  $("#instaGrid").innerHTML = igPics.map((s, i) =>
    `<a class="insta-item reveal" href="${IG_PROFILE}" ${HAS_IG ? 'target="_blank" rel="noopener"' : ""} style="transition-delay:${i * .06}s"><img src="img/${s}.jpg" alt="AURIA en Instagram" loading="lazy">${icon("i-ig")}</a>`
  ).join("");
  watchReveal($("#instaGrid"));

  /* ---------- Live viewers ---------- */
  const lv = $("#liveViewers");
  let viewers = 18 + Math.floor(Math.random() * 14);
  lv.textContent = viewers;
  setInterval(() => {
    viewers = Math.max(12, Math.min(48, viewers + Math.round((Math.random() - .45) * 4)));
    lv.textContent = viewers;
  }, 3500);

  /* ---------- Purchase notifications ---------- */
  const BUYERS = ["Mariana", "Andrea", "Valeria", "Daniela", "Fernanda", "Karla", "Paola", "Ximena", "Sofía", "Regina", "Camila", "Lucía", "Natalia", "Itzel", "Renata", "Alejandra", "Michelle", "Brenda", "Diana", "Gabriela", "Jimena", "Montserrat"];
  const CITIES = ["Guadalajara", "CDMX", "Monterrey", "Puebla", "Querétaro", "Tijuana", "Mérida", "León", "Toluca", "Culiacán", "Aguascalientes", "Hermosillo", "Cancún", "Morelia", "Saltillo", "Chihuahua", "Veracruz", "San Luis Potosí", "Mexicali", "Durango"];
  const rnd = a => a[Math.floor(Math.random() * a.length)];
  const pop = $("#salePop");
  let popOff = false, popT, lastPid;
  function showPop() {
    if (popOff || document.hidden || $$(".modal.open, .drawer.open").length) { schedulePop(); return; }
    let p; do { p = rnd(PRODUCTS); } while (p.id === lastPid);
    lastPid = p.id;
    $("#spImg").src = p.img[0];
    $("#spWho").textContent = `${rnd(BUYERS)} de ${rnd(CITIES)} pidió`;
    $("#spWhat").textContent = p.name;
    const m = 1 + Math.floor(Math.random() * 25);
    $("#spWhen").textContent = `Pedido por DM · hace ${m} min`;
    pop.classList.remove("show"); void pop.offsetWidth; pop.classList.add("show");
    popT = setTimeout(() => { pop.classList.remove("show"); schedulePop(); }, 6000);
  }
  function schedulePop() {
    clearTimeout(popT);
    popT = setTimeout(showPop, IS_PHONE ? 18000 + Math.random() * 14000 : 9000 + Math.random() * 9000);
  }
  $("#spClose").addEventListener("click", e => {
    e.stopPropagation(); pop.classList.remove("show"); clearTimeout(popT);
    setTimeout(schedulePop, 20000);
  });
  pop.addEventListener("click", () => {
    const p = PRODUCTS.find(x => x.name === $("#spWhat").textContent);
    if (p) { pop.classList.remove("show"); openQV(p.id); }
  });
  pop.style.cursor = "pointer";
  setTimeout(showPop, IS_PHONE ? 12000 : 7000);

  /* ---------- API para fx.js ---------- */
  window.AURIA = { openQV, addToCart, byId, fmt };

  /* ---------- Init ---------- */
  renderTabs();
  renderGrid();
  saveWish();
  saveCart();
  onScroll();
})();

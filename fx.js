/* =========================================================
   AURIA · Animaciones premium (fx)
   Se carga después de app.js. Usa window.AURIA (openQV, byId, fmt).
   ========================================================= */
(() => {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rand = (a, b) => a + Math.random() * (b - a);
  const SPARK = '<svg viewBox="0 0 24 24"><use href="#i-spark"/></svg>';
  const PHONE = matchMedia("(max-width: 760px)").matches || matchMedia("(pointer: coarse)").matches;
  const API = window.AURIA || {};

  /* ---------- Grano de película ---------- */
  // (en celular se omite: repintar toda la pantalla gasta batería)
  if (!reduce && !PHONE) document.body.insertAdjacentHTML("beforeend", '<div class="grain" aria-hidden="true"></div>');

  /* ---------- Loader: porcentaje ---------- */
  const pctEl = $("#loaderPct");
  if (pctEl) {
    let v = 0, loaded = document.readyState === "complete";
    window.addEventListener("load", () => { loaded = true; });
    const tick = () => {
      if (!pctEl.isConnected) return;
      v += loaded ? Math.max(2.5, (100 - v) * .18) : Math.max(.15, (88 - v) * .035);
      v = Math.min(v, loaded ? 100 : 88);
      pctEl.textContent = Math.floor(v);
      if (v < 100) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---------- Títulos palabra por palabra ---------- */
  function splitWords(el) {
    let i = 0;
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
            const w = document.createElement("span"), s = document.createElement("span");
            w.className = "w"; s.textContent = part; s.style.setProperty("--i", i++);
            w.appendChild(s); frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.namespaceURI !== "http://www.w3.org/2000/svg") walk(n);
      });
    };
    walk(el);
    el.classList.add("split");
  }
  if (!reduce) {
    const sio = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("split-in"); sio.unobserve(e.target); }
    }), { threshold: .3 });
    $$("h2").filter(h => !h.querySelector(".ig-handle")).forEach(h => { splitWords(h); sio.observe(h); });
    // respaldo: si un título ya está en pantalla al cargar, que no quede oculto
    addEventListener("load", () => setTimeout(() => $$("h2.split:not(.split-in)").forEach(h => {
      const r = h.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0) h.classList.add("split-in");
    }), 1200));
  }

  /* ---------- Revelados con máscara (se vigila el contenedor, no la pieza oculta) ---------- */
  const MASKED = ".cat-card.reveal, .insta-item.reveal, .story-img.reveal";
  const showGroup = g => $$(MASKED, g).forEach((el, i) => {
    el.style.transitionDelay = (i * 0.12).toFixed(2) + "s";
    el.classList.add("in");
  });
  const gio = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { showGroup(e.target); gio.unobserve(e.target); }
  }), { threshold: .1 });
  $$(".cats-grid, .insta-grid, .story-grid").forEach(g => gio.observe(g));
  // respaldo: nada enmascarado debe quedarse oculto si ya está en pantalla
  const unmaskVisible = () => $$(MASKED + ":not(.in)").forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) el.classList.add("in");
  });
  addEventListener("scroll", () => requestAnimationFrame(unmaskVisible), { passive: true });
  addEventListener("load", () => setTimeout(unmaskVisible, 900));

  /* ---------- Revelados extra (líneas de pasos) ---------- */
  const lio = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); lio.unobserve(e.target); }
  }), { threshold: .5 });
  $$(".step-line").forEach(el => lio.observe(el));

  /* ---------- Cursor personalizado ---------- */
  if (fine && !reduce) {
    document.body.classList.add("has-cursor", "cur-hidden");
    const dot = document.createElement("div"), ring = document.createElement("div");
    dot.className = "cur-dot"; ring.className = "cur-ring"; ring.innerHTML = "<span></span>";
    document.body.append(dot, ring);
    const label = ring.firstChild;
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
    const VIEW = [
      [".lb-item", "Ver pieza"], [".card-media", "Ver"], [".cat-card", "Explorar"],
      [".insta-item", "Abrir"], [".qv-main", "Zoom"]
    ];
    document.addEventListener("mousemove", e => {
      x = e.clientX; y = e.clientY;
      dot.style.transform = `translate(${x}px,${y}px)`;
      document.body.classList.remove("cur-hidden");
    }, { passive: true });
    document.addEventListener("mouseover", e => {
      const v = VIEW.find(([s]) => e.target.closest(s));
      ring.classList.toggle("view", !!v);
      if (v) label.textContent = v[1];
      ring.classList.toggle("link", !v && !!e.target.closest("a, button, summary, select, label, .tab, [data-open]"));
    });
    document.addEventListener("mousedown", () => ring.classList.add("down"));
    document.addEventListener("mouseup", () => ring.classList.remove("down"));
    document.documentElement.addEventListener("mouseleave", () => document.body.classList.add("cur-hidden"));
    const loop = () => {
      rx += (x - rx) * .18; ry += (y - ry) * .18;
      ring.style.transform = `translate(${rx}px,${ry}px)`;
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ---------- Destellos en el hero (canvas) + estela del mouse ---------- */
  const hero = $(".hero");
  if (hero && !reduce) {
    const cv = document.createElement("canvas");
    cv.className = "hero-sparks"; cv.setAttribute("aria-hidden", "true");
    hero.prepend(cv);
    const ctx = cv.getContext("2d");
    const COLORS = ["#B4532F", "#D9825E", "#E0A43A", "#C97B5A", "#F0C9A6"];
    let W = 0, H = 0, dpr = 1, stars = [], running = false, visible = true;
    const make = () => ({
      x: rand(0, W), y: rand(0, H), r: rand(2, 6), ph: rand(0, Math.PI * 2), sp: rand(.6, 1.6),
      vy: rand(-.18, -.05), vx: rand(-.05, .05), c: COLORS[Math.floor(rand(0, COLORS.length))]
    });
    const resize = () => {
      dpr = Math.min(PHONE ? 1.5 : 2, devicePixelRatio || 1);
      W = hero.offsetWidth; H = hero.offsetHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = PHONE ? 14 : Math.round(clamp(W / 28, 18, 52));
      stars = Array.from({ length: n }, make);
    };
    const star = (x, y, r) => {
      ctx.beginPath();
      ctx.moveTo(x, y - r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.quadraticCurveTo(x, y, x, y + r);
      ctx.quadraticCurveTo(x, y, x - r, y);
      ctx.quadraticCurveTo(x, y, x, y - r);
      ctx.fill();
    };
    const draw = t => {
      if (!visible || document.hidden) { running = false; return; }
      ctx.clearRect(0, 0, W, H);
      stars.forEach(s => {
        s.y += s.vy; s.x += s.vx;
        if (s.y < -10) { s.y = H + 10; s.x = rand(0, W); }
        const a = (Math.sin(t / 1000 * s.sp + s.ph) + 1) / 2;
        ctx.globalAlpha = a * .55;
        ctx.fillStyle = s.c;
        star(s.x, s.y, s.r * (.6 + a * .6));
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    };
    const start = () => { if (!running) { running = true; requestAnimationFrame(draw); } };
    resize(); start();
    // en celular la barra del navegador cambia la altura al hacer scroll: solo recalcular si cambia el ancho
    let lastW = innerWidth;
    addEventListener("resize", () => { if (!PHONE || innerWidth !== lastW) { lastW = innerWidth; resize(); } });
    new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible) start(); }).observe(hero);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) start(); });

    if (fine) {
      let lastT = 0;
      hero.addEventListener("mousemove", e => {
        const now = performance.now();
        if (now - lastT < 45) return;
        lastT = now;
        const t = document.createElement("div");
        t.className = "trail"; t.innerHTML = SPARK;
        t.style.left = e.clientX + rand(-6, 6) + "px"; t.style.top = e.clientY + rand(-6, 6) + "px";
        t.style.color = COLORS[Math.floor(rand(0, COLORS.length))];
        const sz = rand(7, 14); t.style.width = t.style.height = sz + "px";
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 1000);
      }, { passive: true });
    }
  }

  /* ---------- Explosión de destellos ---------- */
  function burst(x, y, n = 14, colors = ["#B4532F", "#D9825E", "#E0A43A", "#F0C9A6"], spread = 1) {
    if (reduce) return;
    const b = document.createElement("div");
    b.className = "burst"; b.style.left = x + "px"; b.style.top = y + "px";
    for (let k = 0; k < n; k++) {
      const i = document.createElement("i"), ang = (Math.PI * 2 * k) / n + rand(-.3, .3), d = rand(40, 110) * spread;
      i.innerHTML = SPARK;
      i.style.setProperty("--x", Math.cos(ang) * d + "px");
      i.style.setProperty("--y", Math.sin(ang) * d + "px");
      i.style.setProperty("--s", rand(.5, 1.3).toFixed(2));
      i.style.setProperty("--r", rand(90, 360).toFixed(0) + "deg");
      i.style.setProperty("--c", colors[k % colors.length]);
      const sz = rand(8, 16); i.style.width = i.style.height = sz + "px"; i.style.margin = `${-sz / 2}px 0 0 ${-sz / 2}px`;
      i.style.animationDelay = rand(0, 60) + "ms";
      b.appendChild(i);
    }
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 1200);
  }
  window.AURIA_burst = burst;
  document.addEventListener("click", e => {
    const t = e.target.closest("[data-add], #qvAdd, #orderGo, .wish, #qvWish");
    if (!t) return;
    const r = t.getBoundingClientRect();
    const cx = e.clientX || r.left + r.width / 2, cy = e.clientY || r.top + r.height / 2;
    if (t.id === "orderGo") burst(cx, cy, 36, ["#f9ce34", "#ee2a7b", "#6228d7", "#D9825E"], 1.8);
    else if (t.matches(".wish, #qvWish")) { if (!t.classList.contains("on")) burst(cx, cy, 10, ["#B4532F", "#ee2a7b", "#D9825E"], .7); }
    else burst(cx, cy, 14);
  }, true);

  /* ---------- Bolsa: sacudida cuando sube el contador ---------- */
  const cc = $("#cartCount"), cartBtn = $("#cartBtn");
  if (cc && cartBtn) {
    let prev = +cc.textContent || 0;
    new MutationObserver(() => {
      const n = +cc.textContent || 0;
      if (n > prev) { cartBtn.classList.remove("wiggle"); void cartBtn.offsetWidth; cartBtn.classList.add("wiggle"); }
      prev = n;
    }).observe(cc, { childList: true, characterData: true, subtree: true });
  }

  /* ---------- Tilt 3D con brillo ---------- */
  if (fine && !reduce) {
    const SEL = ".card-media, .cat-card, .lb-fig";
    let cur = null;
    const reset = el => { if (!el) return; el.classList.remove("tilting"); el.style.transform = ""; };
    document.addEventListener("mousemove", e => {
      const el = e.target.closest(SEL);
      if (el !== cur) { reset(cur); cur = el; }
      if (!el) return;
      if (!el.classList.contains("tilt")) { el.classList.add("tilt"); el.insertAdjacentHTML("beforeend", '<span class="glare"></span>'); }
      const r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      el.classList.add("tilting");
      el.style.transform = `perspective(900px) rotateX(${(.5 - py) * 8}deg) rotateY(${(px - .5) * 10}deg)`;
      el.style.setProperty("--gx", px * 100 + "%");
      el.style.setProperty("--gy", py * 100 + "%");
    }, { passive: true });
    document.addEventListener("mouseleave", () => { reset(cur); cur = null; });
  }

  /* ---------- Luz que sigue el mouse ---------- */
  $$(".value, .step, .pol-card, .rev, .perks > div").forEach(el => el.classList.add("spot"));
  if (fine) {
    document.addEventListener("mousemove", e => {
      const el = e.target.closest(".spot"); if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", e.clientX - r.left + "px");
      el.style.setProperty("--my", e.clientY - r.top + "px");
    }, { passive: true });
  }

  /* ---------- Botones magnéticos ---------- */
  if (fine && !reduce) {
    $$(".header-actions .icon-btn, .fab-ig, .to-top").forEach(b => {
      b.addEventListener("mousemove", e => {
        const r = b.getBoundingClientRect();
        b.style.translate = `${(e.clientX - r.left - r.width / 2) * .3}px ${(e.clientY - r.top - r.height / 2) * .3}px`;
      });
      b.addEventListener("mouseleave", () => { b.style.translate = ""; });
    });
  }

  /* ---------- Indicador deslizante en las pestañas ---------- */
  const tabs = $("#tabs");
  if (tabs) {
    const ind = document.createElement("span");
    ind.className = "tab-ind";
    tabs.classList.add("has-ind");
    const place = () => {
      const a = tabs.querySelector(".tab.active");
      if (!a) { ind.style.opacity = 0; return; }
      ind.style.opacity = 1;
      ind.style.width = a.offsetWidth + "px";
      ind.style.height = a.offsetHeight + "px";
      ind.style.transform = `translate(${a.offsetLeft}px, ${a.offsetTop}px)`;
    };
    new MutationObserver(() => {
      if (!ind.isConnected) tabs.prepend(ind);
      requestAnimationFrame(place);
    }).observe(tabs, { childList: true });
    tabs.prepend(ind);
    requestAnimationFrame(place);
    addEventListener("resize", place);
    document.fonts && document.fonts.ready.then(place);
  }

  /* ---------- Zoom de lupa en la foto del detalle ---------- */
  const qvMain = $("#qv .qv-main");
  if (qvMain && fine) {
    qvMain.insertAdjacentHTML("beforeend", '<span class="qv-zoom-hint"><svg><use href="#i-search"/></svg>Pasa el cursor para ampliar</span>');
    const img = $("#qvImg");
    qvMain.addEventListener("mousemove", e => {
      const r = qvMain.getBoundingClientRect();
      img.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
      qvMain.classList.add("zoom");
    });
    qvMain.addEventListener("mouseleave", () => qvMain.classList.remove("zoom"));
  }

  /* ---------- Marquesinas con inercia de scroll ---------- */
  const bm = $(".bm-track");
  let skewWrap = null;
  if (bm && !reduce) {
    skewWrap = document.createElement("div");
    skewWrap.className = "bm-skew";
    bm.parentNode.insertBefore(skewWrap, bm);
    skewWrap.appendChild(bm);
  }
  const marqAnims = () => [bm, $(".announce-track")].filter(Boolean).flatMap(el => el.getAnimations ? el.getAnimations() : []);

  /* ---------- Lookbook horizontal ---------- */
  const LB_IDS = ["contour", "stardust", "golden-zip", "marino-open", "cargo", "crossback", "flare-marfil", "zip-romper"];
  const lb = $("#lookbook"), track = $("#lbTrack");
  let lbItems = [], lbPinned = false;
  if (lb && track && API.byId) {
    const list = LB_IDS.map(API.byId).filter(Boolean);
    $("#lbTotal").textContent = String(list.length).padStart(2, "0");
    track.innerHTML =
      `<div class="lb-intro"><p>Piezas que <em>abrazan</em>, estilizan y se mueven contigo.</p><small>Toca cualquier look para ver detalles y tallas.</small></div>` +
      list.map((p, i) => `
        <article class="lb-item" data-lb="${p.id}">
          <div class="lb-fig">
            <span class="lb-num">${String(i + 1).padStart(2, "0")}</span>
            <img src="${p.img[0]}" alt="${p.name}" loading="lazy">
            <span class="lb-cta"><svg><use href="#i-arrow"/></svg></span>
          </div>
          <div class="lb-cap"><b>${p.name}</b><span>${API.fmt(p.price)}</span></div>
        </article>`).join("") +
      `<div class="lb-end"><h3>¿Cuál es <em>tu favorita</em>?</h3><a href="#tienda" class="btn btn-light">Ver toda la colección <svg><use href="#i-arrow"/></svg></a></div>`;
    lbItems = $$(".lb-item", track);
    track.addEventListener("click", e => {
      const it = e.target.closest("[data-lb]");
      if (it && API.openQV) API.openQV(it.dataset.lb);
    });

    const vp = $(".lb-viewport", lb);
    const setup = () => {
      lbPinned = !reduce && innerWidth >= 900;
      lb.classList.toggle("native", !lbPinned);
      if (lbPinned) {
        const dist = track.scrollWidth - innerWidth;
        lb.style.height = Math.max(innerHeight, dist + innerHeight) + "px";
      } else {
        lb.style.height = "";
        track.style.transform = "";
      }
      updateLB();
    };
    const imgPar = () => {
      const c = innerWidth / 2;
      lbItems.forEach(it => {
        const r = it.getBoundingClientRect();
        const lim = r.width * .12;
        const off = clamp(((r.left + r.width / 2 - c) / innerWidth) * -38, -lim, lim);
        it.querySelector("img").style.translate = `${off.toFixed(1)}px 0`;
      });
    };
    const setProgress = p => {
      $("#lbBar").style.width = p * 100 + "%";
      $("#lbIdx").textContent = String(clamp(Math.floor(p * lbItems.length) + 1, 1, lbItems.length)).padStart(2, "0");
    };
    function updateLB() {
      if (lbPinned) {
        const r = lb.getBoundingClientRect(), total = lb.offsetHeight - innerHeight;
        if (r.bottom < -50 || r.top > innerHeight + 50) return;
        const p = total > 0 ? clamp(-r.top / total, 0, 1) : 0;
        track.style.transform = `translate3d(${-p * (track.scrollWidth - innerWidth)}px,0,0)`;
        setProgress(p);
      } else {
        const max = vp.scrollWidth - vp.clientWidth;
        setProgress(max > 0 ? vp.scrollLeft / max : 0);
      }
      if (!reduce) imgPar();
    }
    window.AURIA_updateLB = updateLB;
    vp.addEventListener("scroll", () => { if (!lbPinned) updateLB(); }, { passive: true });
    addEventListener("resize", setup);
    addEventListener("load", setup);
    setup();
  }

  /* ---------- Bucle de scroll: progreso, inercia, lookbook ---------- */
  const toTop = $("#toTop");
  let lastY = scrollY, vel = 0, ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const h = document.documentElement.scrollHeight - innerHeight;
      if (toTop) toTop.style.setProperty("--p", h > 0 ? (scrollY / h) * 100 : 0);
      if (lb && track) window.AURIA_updateLB && window.AURIA_updateLB();
    });
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (!reduce) {
    const inertia = () => {
      const y = scrollY, dy = y - lastY;
      lastY = y;
      vel += (dy - vel) * .12;
      const v = clamp(vel, -60, 60);
      if (skewWrap) skewWrap.style.transform = `skewX(${(-v * .12).toFixed(2)}deg)`;
      const rate = 1 + Math.abs(v) * .09;
      marqAnims().forEach(a => { a.playbackRate = (v < -1 ? -1 : 1) * rate; });
      requestAnimationFrame(inertia);
    };
    requestAnimationFrame(inertia);
  }

  /* ---------- Animación de escritura ---------- */
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // 1) Frase rotativa del inicio
  const tw = $("#typeWord"), caret = $(".type-caret");
  const WORDS = ["brillar.", "entrenar.", "moverte.", "sentirte poderosa.", "el gym y la calle.", "ti."];
  if (tw) {
    if (reduce) {
      let k = 0;
      setInterval(() => { k = (k + 1) % WORDS.length; tw.textContent = WORDS[k]; }, 2600);
    } else {
      (async () => {
        await sleep(2600); // espera a que termine la pantalla de carga
        let k = 0;
        for (;;) {
          caret.classList.add("busy");
          for (let n = tw.textContent.length; n >= 0; n--) { tw.textContent = tw.textContent.slice(0, n); await sleep(38); }
          k = (k + 1) % WORDS.length;
          const w = WORDS[k];
          await sleep(240);
          for (let n = 1; n <= w.length; n++) { tw.textContent = w.slice(0, n); await sleep(rand(55, 110)); }
          caret.classList.remove("busy");
          await sleep(2100);
        }
      })();
    }
  }

  // 2) Sugerencias que se teclean en el buscador
  const sIn = $("#searchIn"), searchEl = $("#search");
  if (sIn && searchEl && !reduce) {
    const TIPS = ["leggings…", "flare acanalado…", "jumpsuit negro…", "chamarra…", "talla G…", "romper…"];
    const base = "Busca ";
    let run = 0;
    const cycle = async id => {
      let k = 0;
      while (id === run) {
        const t = TIPS[k++ % TIPS.length];
        for (let n = 0; n <= t.length && id === run; n++) { sIn.placeholder = base + t.slice(0, n); await sleep(70); }
        await sleep(1500);
        for (let n = t.length; n >= 0 && id === run; n--) { sIn.placeholder = base + t.slice(0, n); await sleep(30); }
        await sleep(250);
      }
    };
    new MutationObserver(() => {
      if (searchEl.classList.contains("open")) cycle(++run);
      else { run++; sIn.placeholder = "Busca leggings, flares, jumpsuits…"; }
    }).observe(searchEl, { attributes: true, attributeFilter: ["class"] });
  }

  // 3) El pedido se escribe solo al abrir la ventana de Instagram
  const orderEl = $("#order"), msgEl = $("#orderMsg");
  if (orderEl && msgEl && !reduce) {
    let typingId = 0;
    const stop = () => { typingId++; msgEl.classList.remove("typing"); };
    new MutationObserver(() => {
      if (!orderEl.classList.contains("open")) { stop(); return; }
      const full = msgEl.textContent, id = ++typingId;
      const step = Math.max(1, Math.ceil(full.length / 70)); // ~1.2 s en total
      msgEl.classList.add("typing");
      msgEl.textContent = "";
      (async () => {
        await sleep(350);
        for (let n = 0; n <= full.length; n += step) {
          if (id !== typingId) return;
          msgEl.textContent = full.slice(0, n);
          msgEl.scrollTop = msgEl.scrollHeight;
          await sleep(16);
        }
        if (id === typingId) { msgEl.textContent = full; msgEl.classList.remove("typing"); msgEl.scrollTop = 0; }
      })();
    }).observe(orderEl, { attributes: true, attributeFilter: ["class"] });
    // si la clienta escribe su nombre o ciudad, app.js reescribe el mensaje: cancelamos la animación
    $$("#orderName, #orderCity").forEach(i => i.addEventListener("input", stop, true));
    ["#orderGo", "#orderCopy"].forEach(s => { const b = $(s); b && b.addEventListener("pointerdown", stop, true); });
  }

  /* =========================================================
     CELULAR: barra inferior y gestos táctiles
     ========================================================= */

  // Barra inferior: buscar, bolsa, contador y sección activa
  const bnav = $("#bnav");
  if (bnav) {
    $("#bnSearch").addEventListener("click", () => $("#searchBtn").click());
    $("#bnCart").addEventListener("click", () => $("#cartBtn").click());
    const bnCount = $("#bnCount"), src = $("#cartCount");
    const syncCount = () => {
      const n = +src.textContent || 0;
      bnCount.textContent = n; bnCount.classList.toggle("show", n > 0);
    };
    new MutationObserver(syncCount).observe(src, { childList: true, characterData: true, subtree: true });
    syncCount();
    const shop = $("#tienda");
    const setActive = () => {
      const r = shop.getBoundingClientRect();
      const inShop = r.top < innerHeight * .5 && r.bottom > innerHeight * .3;
      $$("[data-bn]", bnav).forEach(a => a.classList.toggle("active", a.dataset.bn === (inShop ? "tienda" : "top")));
    };
    addEventListener("scroll", () => requestAnimationFrame(setActive), { passive: true });
    setActive();
  }

  // Deslizar con el dedo entre fotos en el detalle
  const qvM = $("#qv .qv-main");
  if (qvM) {
    let sx = 0, sy = 0, tracking = false;
    qvM.addEventListener("touchstart", e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; tracking = true; }, { passive: true });
    qvM.addEventListener("touchend", e => {
      if (!tracking) return; tracking = false;
      const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
      const thumbs = $$("#qvThumbs button"); if (thumbs.length < 2) return;
      const cur = thumbs.findIndex(b => b.classList.contains("active"));
      const next = (cur + (dx < 0 ? 1 : -1) + thumbs.length) % thumbs.length;
      thumbs[next].click();
    }, { passive: true });
  }

  // Deslizar hacia abajo para cerrar las hojas (detalle, pedido, políticas)
  if (PHONE) {
    $$(".modal").forEach(modal => {
      const box = $(".modal-box", modal), closer = $(".modal-x", modal);
      if (!box || !closer) return;
      let y0 = 0, dy = 0, drag = false;
      box.addEventListener("touchstart", e => {
        // solo si la hoja está hasta arriba y no se toca la galería/un campo
        if (box.scrollTop > 2 || e.target.closest("input, textarea, .qv-thumbs, .pol-tabs")) return;
        y0 = e.touches[0].clientY; dy = 0; drag = true;
      }, { passive: true });
      box.addEventListener("touchmove", e => {
        if (!drag) return;
        dy = e.touches[0].clientY - y0;
        if (dy <= 0) { box.style.transform = ""; box.classList.remove("dragging"); return; }
        box.classList.add("dragging");
        box.style.transform = `translateY(${dy * .9}px)`;
      }, { passive: true });
      box.addEventListener("touchend", () => {
        if (!drag) return; drag = false;
        box.classList.remove("dragging");
        box.style.transform = "";
        if (dy > 110) closer.click();
      });
    });

    // Carrito: deslizar a la derecha para cerrar
    const panel = $("#cart .drawer-panel");
    if (panel) {
      let x0 = 0, y0 = 0, dx = 0, drag = false;
      panel.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; dx = 0; drag = true; }, { passive: true });
      panel.addEventListener("touchmove", e => {
        if (!drag) return;
        dx = e.touches[0].clientX - x0;
        const dyy = Math.abs(e.touches[0].clientY - y0);
        if (dx > 0 && dx > dyy) { panel.style.transition = "none"; panel.style.transform = `translateX(${dx}px)`; }
      }, { passive: true });
      panel.addEventListener("touchend", () => {
        if (!drag) return; drag = false;
        panel.style.transition = ""; panel.style.transform = "";
        if (dx > 100) $("#cart [data-close-cart]").click();
      });
    }
  }

  /* ---------- Firma gigante en el pie ---------- */
  const fb = $(".foot-bottom");
  if (fb) {
    const g = document.createElement("div");
    g.className = "foot-giant"; g.setAttribute("aria-hidden", "true");
    g.innerHTML = "AURIA".split("").map((c, i) => `<span style="--i:${i}">${c}</span>`).join("");
    fb.parentNode.insertBefore(g, fb);
    new IntersectionObserver((es, o) => es.forEach(e => {
      if (e.isIntersecting) { g.classList.add("in"); o.disconnect(); }
    }), { threshold: .3 }).observe(g);
  }
})();

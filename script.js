(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (t = "") => String(t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Pixel texture for the cubes and banners ---------- */
  (function makeTexture() {
    const c = document.createElement("canvas");
    c.width = c.height = 16;
    const x = c.getContext("2d");
    const pal = ["#2c1b52", "#3a2468", "#4a2e85", "#5b3aa3", "#6d48c2", "#7f58de"];
    for (let i = 0; i < 16; i++) for (let j = 0; j < 16; j++) {
      const r = Math.random();
      x.fillStyle = r > .965 ? "#5ce1e6" : r > .93 ? "#c4a6ff" : pal[(Math.random() * pal.length) | 0];
      x.fillRect(i, j, 1, 1);
    }
    document.documentElement.style.setProperty("--tex", `url(${c.toDataURL()})`);
  })();

  /* ---------- Content from data.js ---------- */
  $("#brandName").textContent = SITE.name;
  $("#heroSub").textContent = SITE.subtitle;
  $("#githubLink").href = SITE.github;
  $("#footerText").textContent = `© ${new Date().getFullYear()} ${SITE.name} (${SITE.handle}). Wszystkie prawa zastrzeżone.`;
  $$("[data-label]").forEach(el => {
    el.textContent = el.closest("#copyDiscord") ? `Skopiuj Discord: ${SITE.discord}` : `Discord: ${SITE.discord}`;
  });

  /* Hero headline: every letter drops in like a placed block */
  (function splitTitle() {
    const h = $("#heroTitle");
    const text = h.textContent.trim();
    h.textContent = "";
    let i = 0;
    text.split(" ").forEach((word, wi, arr) => {
      const w = document.createElement("span");
      w.className = "w";
      w.setAttribute("aria-hidden", "true");
      [...word].forEach(ch => {
        const s = document.createElement("span");
        s.className = "ch";
        s.style.setProperty("--i", i++);
        s.textContent = ch;
        w.appendChild(s);
      });
      h.appendChild(w);
      if (wi < arr.length - 1) h.appendChild(document.createTextNode(" "));
      i++;
    });
  })();

  /* Stats with count-up */
  const statsEl = $("#stats");
  statsEl.innerHTML = SITE.stats.map((s, i) => `
    <div class="stat reveal" style="--delay:${i * .08}s">
      <b data-to="${s.value}" data-suffix="${esc(s.suffix)}">0${esc(s.suffix)}</b>
      <span>${esc(s.label)}</span>
    </div>`).join("");

  function countUp(el) {
    const to = +el.dataset.to, suf = el.dataset.suffix || "";
    if (reduceMotion) { el.textContent = to + suf; return; }
    const t0 = performance.now(), dur = 1400;
    const tick = t => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + suf;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* Plugin cards + filters */
  const grid = $("#pluginGrid");
  grid.innerHTML = PLUGINS.map((p, i) => {
    const glyph = esc((p.name.trim()[0] || "?").toUpperCase());
    const banner = p.image
      ? `<img src="${esc(p.image)}" alt="Podgląd projektu ${esc(p.name)}" loading="lazy">`
      : `<div class="glyph" aria-hidden="true">${glyph}</div>`;
    const status = p.status === "wip" ? ["wip", "W trakcie prac"] : ["live", "Działa"];
    return `
    <article class="card reveal" style="--hue:${p.hue ?? 270};--delay:${(i % 3) * .08}s" data-tags="${esc([p.type, ...p.tags].join("|"))}">
      <div class="card-banner">${banner}<span class="status ${status[0]}">${status[1]}</span></div>
      <div class="card-body">
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.desc)}</p>
        <div class="more">
          <ul class="features">${(p.features || []).map(f => `<li>${esc(f)}</li>`).join("")}</ul>
          ${p.link ? `<a class="card-link" href="${esc(p.link)}" target="_blank" rel="noopener">Zobacz projekt</a>` : ""}
        </div>
        <button class="toggle" type="button" aria-expanded="false">Pokaż szczegóły</button>
        <div class="tags">${[p.type, ...p.tags].map(t => `<span class="tag">${esc(t)}</span>`).join("")}</div>
      </div>
    </article>`;
  }).join("");

  $$(".toggle", grid).forEach(btn => btn.addEventListener("click", () => {
    const card = btn.closest(".card");
    const open = card.classList.toggle("open");
    btn.setAttribute("aria-expanded", open);
    btn.textContent = open ? "Ukryj szczegóły" : "Pokaż szczegóły";
  }));

  const filters = $("#filters");
  const allTags = ["Wszystkie", ...new Set(PLUGINS.flatMap(p => [p.type]))];
  filters.innerHTML = allTags.map((t, i) => `<button class="chip" type="button" aria-pressed="${i === 0}" data-f="${esc(t)}">${esc(t)}</button>`).join("");
  filters.addEventListener("click", e => {
    const b = e.target.closest(".chip");
    if (!b) return;
    $$(".chip", filters).forEach(c => c.setAttribute("aria-pressed", c === b));
    const f = b.dataset.f;
    $$(".card", grid).forEach(card => {
      const show = f === "Wszystkie" || card.dataset.tags.split("|").includes(f);
      card.classList.toggle("hide", !show);
      if (show) { card.classList.remove("in"); void card.offsetWidth; card.classList.add("in"); }
    });
  });

  /* Card tilt + spotlight */
  if (!reduceMotion && matchMedia("(hover: hover)").matches) {
    $$(".card", grid).forEach(card => {
      card.addEventListener("pointermove", e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", x * 100 + "%");
        card.style.setProperty("--my", y * 100 + "%");
        card.style.setProperty("--ry", (x - .5) * 9 + "deg");
        card.style.setProperty("--rx", (.5 - y) * 9 + "deg");
      });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      });
    });
  }

  /* Servers */
  $("#serverList").innerHTML = SERVERS.map((s, i) => {
    const icon = s.icon
      ? `<img src="${esc(s.icon)}" alt="Logo ${esc(s.name)}" loading="lazy">`
      : esc((s.name.trim()[0] || "?").toUpperCase());
    const inner = `
      <div class="server-head">
        <div class="server-icon">${icon}</div>
        <div><h3>${esc(s.name)}</h3><div class="role">${esc(s.role)}</div></div>
      </div>
      <p>${esc(s.desc)}</p>
      <div class="period">${esc(s.period)}</div>`;
    const attrs = `class="server reveal" style="--hue:${s.hue ?? 270};--delay:${(i % 4) * .08}s"`;
    return s.link
      ? `<a ${attrs} href="${esc(s.link)}" target="_blank" rel="noopener">${inner}</a>`
      : `<div ${attrs}>${inner}</div>`;
  }).join("");

  /* Tech marquee */
  const pills = [...TECH, ...TECH].map(t => `<span class="pill">${esc(t)}</span>`).join("");
  const shifted = [...TECH.slice(5), ...TECH.slice(0, 5)];
  const pills2 = [...shifted, ...shifted].map(t => `<span class="pill">${esc(t)}</span>`).join("");
  $("#marqueeA").innerHTML = pills;
  $("#marqueeB").innerHTML = pills2;
  $("#techSr").innerHTML = TECH.map(t => `<li>${esc(t)}</li>`).join("");

  /* ---------- Scroll reveal + count-up ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      const num = $("b[data-to]", en.target);
      if (num) countUp(num);
      io.unobserve(en.target);
    });
  }, { threshold: .15, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach(el => io.observe(el));

  /* ---------- Nav: scrolled state + active section ---------- */
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("scrolled", scrollY > 20);
  onScroll();
  addEventListener("scroll", onScroll, { passive: true });
  const links = $$('.nav nav a[href^="#"]');
  const spy = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach(s => spy.observe(s));

  /* ---------- Copy Discord ---------- */
  const toast = $("#toast");
  let toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
  }
  async function copyDiscord() {
    try {
      await navigator.clipboard.writeText(SITE.discord);
    } catch {
      const t = document.createElement("textarea");
      t.value = SITE.discord; document.body.appendChild(t); t.select();
      try { document.execCommand("copy"); } catch {}
      t.remove();
    }
    showToast(`Skopiowano: ${SITE.discord}`);
  }
  $("#copyDiscord").addEventListener("click", copyDiscord);
  $("#copyDiscordHero").addEventListener("click", copyDiscord);

  /* ---------- Hero 3D parallax ---------- */
  const scene = $("#scene");
  if (!reduceMotion && scene) {
    addEventListener("pointermove", e => {
      const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
      scene.style.setProperty("--px", x * 50 + "deg");
      scene.style.setProperty("--py", y * -26 + "deg");
    }, { passive: true });
  }
  // the variables live on .scene, so the .orbit child inherits them

  /* ---------- Cursor glow ---------- */
  const glow = $(".cursor-glow");
  addEventListener("pointermove", e => {
    glow.style.opacity = 1;
    glow.style.transform = `translate(${e.clientX - 230}px, ${e.clientY - 230}px)`;
  }, { passive: true });
  document.addEventListener("pointerleave", () => (glow.style.opacity = 0));

  /* ---------- Fake server console ---------- */
  const consoleEl = $("#console");
  const now = () => new Date().toTimeString().slice(0, 8);
  const script = [
    () => `<span class="tag">[${now()} INFO]</span>: Starting minecraft server version 1.20.4`,
    () => `<span class="tag">[${now()} INFO]</span>: [${SITE.name}] Enabling plugins...`,
    () => `<span class="tag">[${now()} INFO]</span>: [MetinB] <span class="ok">Załadowano konfigurację nagród</span>`,
    () => `<span class="tag">[${now()} INFO]</span>: [MetinB] <span class="ok">Event gotowy do startu</span>`,
    () => `<span class="tag">[${now()} WARN]</span>: <span class="warn">Brak błędów. Nic nie lagguje.</span>`,
    () => `<span class="tag">[${now()} INFO]</span>: Done (0.84s)! For help, type "help"`
  ].map(f => f());

  function plain(html) { const d = document.createElement("div"); d.innerHTML = html; return d.textContent; }

  async function runConsole() {
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    if (reduceMotion) { consoleEl.innerHTML = script.join("\n"); return; }
    await sleep(1600);
    while (true) {
      let out = "";
      for (const line of script) {
        // type the visible text, then swap in the colored markup
        const txt = plain(line);
        for (let i = 1; i <= txt.length; i += 3) {
          consoleEl.innerHTML = out + esc(txt.slice(0, i)) + '<span class="caret"></span>';
          await sleep(14);
        }
        out += line + "\n";
        consoleEl.innerHTML = out + '<span class="caret"></span>';
        await sleep(260);
      }
      await sleep(3800);
    }
  }
  runConsole();

  /* ---------- Rising spark particles ---------- */
  const cv = $("#sparks");
  if (cv && !reduceMotion) {
    const ctx = cv.getContext("2d");
    let W, H, dpr;
    const parts = [];
    const colors = ["155,109,255", "196,166,255", "92,225,230"];
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = cv.width = innerWidth * dpr; H = cv.height = innerHeight * dpr;
    };
    resize();
    addEventListener("resize", resize);
    const spawn = (anywhere) => ({
      x: Math.random() * W,
      y: anywhere ? Math.random() * H : H + 10,
      s: (2 + Math.random() * 4) * dpr,
      v: (.15 + Math.random() * .5) * dpr,
      drift: (Math.random() - .5) * .25 * dpr,
      a: .1 + Math.random() * .4,
      c: colors[(Math.random() * colors.length) | 0],
      tw: Math.random() * Math.PI * 2
    });
    const count = Math.min(70, Math.floor(innerWidth / 18));
    for (let i = 0; i < count; i++) parts.push(spawn(true));
    let running = true;
    document.addEventListener("visibilitychange", () => { running = !document.hidden; if (running) frame(); });
    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        p.y -= p.v; p.x += p.drift; p.tw += .03;
        if (p.y < -10) parts[i] = spawn(false);
        ctx.fillStyle = `rgba(${p.c},${p.a * (.6 + .4 * Math.sin(p.tw))})`;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.s, p.s);
      }
      requestAnimationFrame(frame);
    }
    frame();
  }
})();

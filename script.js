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
    <article class="card reveal" tabindex="0" role="button" aria-haspopup="dialog" aria-label="Otwórz szczegóły: ${esc(p.name)}" data-i="${i}" style="--hue:${p.hue ?? 270};--delay:${(i % 3) * .08}s" data-tags="${esc([p.type, ...p.tags].join("|"))}">
      <div class="card-banner">${banner}<span class="status ${status[0]}">${status[1]}</span></div>
      <div class="card-body">
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.desc)}</p>
        <span class="open-hint">Komendy i demo</span>
        <div class="tags">${[p.type, ...p.tags].map(t => `<span class="tag">${esc(t)}</span>`).join("")}</div>
      </div>
    </article>`;
  }).join("");

  /* ---------- Plugin detail modal ---------- */
  const modal = $("#modal"), modalBody = $("#modalBody"), modalPanel = $("#modalPanel");
  let lastFocus = null, runToken = 0, current = null;
  const fmt = t => esc(t).replace(/^\[([^\]]+)\]/, '<span class="tag">[$1]</span>');
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const ytId = u => { const m = String(u || "").match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/); return m ? m[1] : null; };

  function mediaHTML(p, glyph) {
    const yt = ytId(p.video);
    const file = !yt && /\.(mp4|webm|ogg)(\?.*)?$/i.test(p.video || "");
    const poster = p.image ? `<img class="m-poster" src="${esc(p.image)}" alt="">` : "";
    let inner;
    if (yt) inner = `<button class="yt" type="button" data-yt="${yt}" aria-label="Odtwórz film">${poster}<span class="play"></span></button>`;
    else if (file) inner = `<video controls preload="metadata" playsinline ${p.image ? `poster="${esc(p.image)}"` : ""} src="${esc(p.video)}"></video>`;
    else inner = `<div class="media-empty">${poster}
        <div class="empty-layers" aria-hidden="true">
          <i style="--sz:46px;--l:10%;--t:16%;--k:34px"></i>
          <i style="--sz:30px;--l:80%;--t:24%;--k:-26px"></i>
          <i style="--sz:38px;--l:70%;--t:68%;--k:22px"></i>
        </div>
        <div class="empty-glyph" aria-hidden="true">${glyph}</div>
        <p>Film pojawi się wkrótce</p><small>Na razie wypróbuj komendy obok</small></div>`;
    return `<div class="frame"><div class="terminal-bar"><span></span><span></span><span></span><b>demo: ${esc(p.name)}</b></div><div class="frame-screen">${inner}</div></div>`;
  }

  function cmdsHTML(p) {
    const cmds = p.commands || [];
    if (!cmds.length) return "";
    return `<div class="terminal m-term">
      <div class="terminal-bar"><span></span><span></span><span></span><b>komendy</b></div>
      <ul class="cmd-list">${cmds.map((c, i) => `
        <li>
          <button type="button" class="cmd" data-i="${i}"><code>${esc(c.cmd)}</code><span class="cmd-desc">${esc(c.desc || "")}</span>${c.perm ? `<span class="perm">${esc(c.perm)}</span>` : ""}</button>
          <button type="button" class="copy" data-copy="${esc(c.cmd)}" aria-label="Kopiuj komendę ${esc(c.cmd)}">Kopiuj</button>
        </li>`).join("")}
      </ul>
      <pre class="out" id="cmdOut" aria-live="polite"><span class="tag">Kliknij komendę</span>, aby zobaczyć przykładowy wynik w konsoli.</pre>
    </div>`;
  }

  function openModal(i) {
    const p = PLUGINS[i];
    if (!p) return;
    current = p;
    lastFocus = document.activeElement;
    const glyph = esc((p.name.trim()[0] || "?").toUpperCase());
    const status = p.status === "wip" ? ["wip", "W trakcie prac"] : ["live", "Działa"];
    modalPanel.style.setProperty("--hue", p.hue ?? 270);
    modalBody.innerHTML = `
      <div class="m-head">
        <div class="m-glyph" aria-hidden="true">${glyph}</div>
        <div><h3>${esc(p.name)}</h3><div class="tags">${[p.type, ...p.tags].map(t => `<span class="tag">${esc(t)}</span>`).join("")}</div></div>
        <span class="status ${status[0]}">${status[1]}</span>
      </div>
      <div class="m-cols">
        <div>
          ${mediaHTML(p, glyph)}
          <div class="m-info">
            <h4>Jak to działa</h4>
            <p>${esc(p.how || p.desc)}</p>
            ${(p.features || []).length ? `<ul class="features">${p.features.map(f => `<li>${esc(f)}</li>`).join("")}</ul>` : ""}
            ${p.link ? `<a class="card-link" href="${esc(p.link)}" target="_blank" rel="noopener">Zobacz projekt</a>` : ""}
          </div>
        </div>
        ${cmdsHTML(p)}
      </div>`;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("lock");
    modalPanel.scrollTop = 0;
    setTimeout(() => $(".modal-close", modal).focus(), 60);
  }

  function closeModal() {
    if (!modal.classList.contains("open")) return;
    runToken++;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lock");
    setTimeout(() => { if (!modal.classList.contains("open")) modalBody.innerHTML = ""; }, 350); // also stops any video
    if (lastFocus) lastFocus.focus();
  }

  async function runCmd(i) {
    const c = current.commands[i], out = $("#cmdOut"), token = ++runToken;
    $$(".cmd", modal).forEach(b => b.classList.toggle("active", +b.dataset.i === i));
    let html = `<span class="ok">&gt;</span> ${esc(c.cmd)}\n`;
    out.innerHTML = html;
    const lines = c.out && c.out.length ? c.out : [c.desc || "OK"];
    for (const line of lines) {
      await sleep(reduceMotion ? 0 : 240);
      if (token !== runToken) return;
      if (!reduceMotion) {
        for (let k = 3; k < line.length; k += 3) {
          out.innerHTML = html + fmt(line.slice(0, k)) + '<span class="caret"></span>';
          await sleep(12);
          if (token !== runToken) return;
        }
      }
      html += fmt(line) + "\n";
      out.innerHTML = html;
    }
  }

  async function copyText(text, msg) {
    try { await navigator.clipboard.writeText(text); }
    catch {
      const t = document.createElement("textarea");
      t.value = text; document.body.appendChild(t); t.select();
      try { document.execCommand("copy"); } catch {}
      t.remove();
    }
    showToast(msg);
  }

  grid.addEventListener("click", e => {
    const card = e.target.closest(".card");
    if (card) openModal(+card.dataset.i);
  });
  grid.addEventListener("keydown", e => {
    if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("card")) {
      e.preventDefault();
      openModal(+e.target.dataset.i);
    }
  });

  modal.addEventListener("click", e => {
    if (e.target.closest("[data-close]")) return closeModal();
    const cmd = e.target.closest(".cmd");
    if (cmd) return runCmd(+cmd.dataset.i);
    const cp = e.target.closest(".copy");
    if (cp) return copyText(cp.dataset.copy, `Skopiowano: ${cp.dataset.copy}`);
    const yt = e.target.closest(".yt");
    if (yt) {
      const f = document.createElement("iframe");
      f.src = `https://www.youtube-nocookie.com/embed/${yt.dataset.yt}?autoplay=1&rel=0`;
      f.title = "Film z projektu";
      f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      f.allowFullscreen = true;
      yt.replaceWith(f);
    }
  });
  modal.addEventListener("pointermove", e => {
    const el = e.target.closest(".media-empty");
    if (!el || reduceMotion) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--tx", ((e.clientX - r.left) / r.width - .5) * 2);
    el.style.setProperty("--ty", ((e.clientY - r.top) / r.height - .5) * 2);
  });
  document.addEventListener("keydown", e => {
    if (!modal.classList.contains("open")) return;
    if (e.key === "Escape") return closeModal();
    if (e.key === "Tab") { // keep focus inside the dialog
      const f = $$("button, a[href], [tabindex]:not([tabindex='-1'])", modalPanel).filter(n => !n.disabled && n.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

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

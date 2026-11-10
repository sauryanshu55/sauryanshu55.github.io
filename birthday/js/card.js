/* Card page logic: access checks, open animation, confetti */
(function () {
  const B = window.BDAY;
  const $ = (id) => document.getElementById(id);

  /* ---------- 1) Gatekeeping ---------- */
  function hasPassword() {
    try { return sessionStorage.getItem(B.SESSION_KEY) === B.PASSWORD_HASH; }
    catch (e) { return false; }
  }

  if (!hasPassword()) {
    return; // leave the default "Whoops, you didn't enter the password" screen showing
  }

  if (!B.isUnlocked()) {
    $("whoops").hidden = true;
    $("too-early").hidden = false;
    $("early-date").textContent = B.unlockLabel();
    const el = $("countdown");
    const tick = () => {
      el.textContent = B.countdownText();
      if (B.isUnlocked()) location.reload();
    };
    tick();
    setInterval(tick, 1000);
    return;
  }

  /* All good: show the card. */
  $("whoops").hidden = true;
  $("card-root").hidden = false;

  /* ---------- 2) Wavy title letters ---------- */
  document.querySelectorAll("[data-wave]").forEach((h) => {
    const text = h.textContent;
    h.setAttribute("aria-label", text);
    h.textContent = "";
    [...text].forEach((c, i) => {
      const s = document.createElement("span");
      s.className = "ch";
      s.setAttribute("aria-hidden", "true");
      s.style.setProperty("--i", i);
      s.textContent = c === " " ? "\u00A0" : c;
      h.appendChild(s);
    });
  });

  /* ---------- 3) Open the card ---------- */
  const cover = $("cover");
  const inside = $("inside");
  let opened = false;

  function openCard() {
    if (opened) return;
    opened = true;
    cover.classList.add("opening");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(() => {
      cover.hidden = true;
      inside.hidden = false;
      window.scrollTo({ top: 0 });
      $("inside-title").focus({ preventScroll: true });
      burst();
    }, reduce ? 0 : 700);
  }

  cover.addEventListener("click", openCard);
  cover.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openCard(); }
  });
  $("replay").addEventListener("click", burst);

  /* ---------- 4) Confetti ---------- */
  const canvas = $("confetti");
  const ctx = canvas.getContext("2d");
  const COLORS = ["#ffd23f", "#e63946", "#5ab5ec", "#ffffff", "#7bc96f", "#1d1d2b"];
  let parts = [];
  let raf = null;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  addEventListener("resize", resize);
  resize();

  function star(x, y, r) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const rad = i % 2 ? r * 0.45 : r;
      const a = (Math.PI / 5) * i - Math.PI / 2;
      ctx.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad);
    }
    ctx.closePath();
    ctx.fill();
  }

  function burst() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const n = innerWidth < 500 ? 110 : 190;
    for (let i = 0; i < n; i++) {
      const fromLeft = i % 2 === 0;
      const angle = (fromLeft ? -Math.PI / 3 : (-2 * Math.PI) / 3) + (Math.random() - 0.5) * 0.9;
      const speed = 9 + Math.random() * 11;
      parts.push({
        x: fromLeft ? innerWidth * 0.1 : innerWidth * 0.9,
        y: innerHeight * 0.85,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 6 + Math.random() * 8,
        rot: Math.random() * 6.28,
        vr: (Math.random() - 0.5) * 0.35,
        color: COLORS[(Math.random() * COLORS.length) | 0],
        shape: ["rect", "circle", "star"][(Math.random() * 3) | 0],
        life: 0
      });
    }
    if (!raf) raf = requestAnimationFrame(frame);
  }

  function frame() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    parts.forEach((p) => {
      p.vy += 0.28;           // gravity
      p.vx *= 0.992;          // air drag
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life++;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.shape === "rect") ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      else if (p.shape === "circle") { ctx.beginPath(); ctx.arc(0, 0, p.size / 2.2, 0, 6.28); ctx.fill(); }
      else star(0, 0, p.size / 1.5);
      ctx.restore();
    });
    parts = parts.filter((p) => p.y < innerHeight + 40 && p.life < 400);
    raf = parts.length ? requestAnimationFrame(frame) : null;
    if (!parts.length) ctx.clearRect(0, 0, innerWidth, innerHeight);
  }
})();

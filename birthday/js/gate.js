/* Password page logic */
(function () {
  const B = window.BDAY;
  const form = document.getElementById("gate-form");
  const input = document.getElementById("pw");
  const msg = document.getElementById("msg");
  const hint = document.getElementById("hint");
  const early = document.getElementById("early");
  const panel = document.getElementById("gate");

  if (B.HINT) { hint.textContent = B.HINT; hint.hidden = false; }

  function shake() {
    panel.classList.remove("shake");
    void panel.offsetWidth; // restart animation
    panel.classList.add("shake");
  }

  let timer = null;
  function startCountdown() {
    document.getElementById("early-date").textContent = B.unlockLabel();
    const el = document.getElementById("countdown");
    const tick = () => {
      el.textContent = B.countdownText();
      if (B.isUnlocked()) { clearInterval(timer); location.reload(); }
    };
    tick();
    clearInterval(timer);
    timer = setInterval(tick, 1000);
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    msg.className = "msg";
    msg.textContent = "";

    if (!window.crypto || !crypto.subtle) {
      msg.className = "msg error";
      msg.textContent = "Your browser can't check passwords here. Try Safari or Chrome over https! 🐶";
      return;
    }

    const attempt = input.value.trim().toLowerCase();
    const hash = await B.sha256(attempt);

    if (hash !== B.PASSWORD_HASH) {
      msg.className = "msg error";
      msg.textContent = "Whoops, not really correct :/ 🐾";
      shake();
      input.select();
      return;
    }

    /* Correct password. */
    if (!B.isUnlocked()) {
      // Too early: do NOT grant access, just show the countdown.
      msg.textContent = "";
      early.hidden = false;
      form.hidden = true;
      hint.hidden = true;
      startCountdown();
      return;
    }

    try { sessionStorage.setItem(B.SESSION_KEY, hash); } catch (err) { /* private mode etc. */ }
    msg.textContent = "Yay! Opening the doghouse... 🎉";
    window.location.href = "card.html";
  });
})();

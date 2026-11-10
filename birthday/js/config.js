/* ============================================================
   🎂 BIRTHDAY CONFIG  — the only file you need to edit to change
   the password, the unlock date, or the hint.
   ============================================================ */
window.BDAY = {
  /* SHA-256 hash of the password (lowercase, no spaces).
     The placeholder password is:  snoopy
     To make your own, run this in a terminal:
         echo -n "yourpassword" | shasum -a 256
     ...or paste this into your browser console (F12):
         crypto.subtle.digest("SHA-256", new TextEncoder().encode("yourpassword"))
           .then(b => console.log([...new Uint8Array(b)].map(x => x.toString(16).padStart(2,"0")).join("")))
     Then paste the long result below. */
  PASSWORD_HASH: "6d5ef1fdb68c5ab10b7c90f1796f711153c1134f75c778280bc67b1bf1d3e21c",

  /* The card opens on this date (her device's local time) and any day after.
     To test it before then, temporarily set the year to 2020, then change it back! */
  UNLOCK: { year: 2026, month: 11, day: 11 },

  /* Optional hint shown under the password box. Leave "" to hide it. */
  HINT: "Hint: the name of a cartoon character??",

  /* Internal: where the "I entered the password" flag is kept (this tab only). */
  SESSION_KEY: "bday-unlocked-v1"
};

/* ---------- helpers shared by both pages ---------- */
window.BDAY.unlockDate = function () {
  const u = window.BDAY.UNLOCK;
  return new Date(u.year, u.month - 1, u.day, 0, 0, 0, 0); // local midnight
};

window.BDAY.isUnlocked = function () {
  return new Date() >= window.BDAY.unlockDate();
};

window.BDAY.sha256 = async function (text) {
  const bytes = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
};

window.BDAY.countdownText = function () {
  let ms = window.BDAY.unlockDate() - new Date();
  if (ms <= 0) return "It's time! 🎉";
  const d = Math.floor(ms / 864e5); ms -= d * 864e5;
  const h = Math.floor(ms / 36e5);  ms -= h * 36e5;
  const m = Math.floor(ms / 6e4);   ms -= m * 6e4;
  const s = Math.floor(ms / 1e3);
  return `${d}d ${h}h ${m}m ${s}s`;
};

window.BDAY.unlockLabel = function () {
  return window.BDAY.unlockDate().toLocaleDateString(undefined, { month: "long", day: "numeric" });
};

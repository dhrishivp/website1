// Villa Mangal — shared page behaviour: mobile nav, open-now status, footer year.

// Opening hours in UK time, keyed by day (0 = Sunday). Edit here if hours change.
const HOURS = {
  0: ["12:00", "22:00"],
  1: ["12:00", "22:00"],
  2: ["12:00", "22:00"],
  3: ["12:00", "22:00"],
  4: ["12:00", "22:00"],
  5: ["12:00", "22:00"],
  6: ["12:00", "22:00"],
};

const DAY_INDEX = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

function toMinutes(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function formatTime(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h % 12 || 12;
  return m ? `${h12}:${String(m).padStart(2, "0")}${suffix}` : `${h12}${suffix}`;
}

// Current day and time in London, regardless of the visitor's own time zone.
function londonNow() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type) => parts.find((p) => p.type === type).value;
  return { day: DAY_INDEX[get("weekday")], minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

function openStatus() {
  const { day, minutes } = londonNow();
  const today = HOURS[day];
  if (today) {
    const [open, close] = today;
    if (minutes >= toMinutes(open) && minutes < toMinutes(close)) {
      return { open: true, text: `Open now · until ${formatTime(close)}` };
    }
    if (minutes < toMinutes(open)) {
      return { open: false, text: `Closed · opens today at ${formatTime(open)}` };
    }
  }
  for (let i = 1; i <= 7; i++) {
    const next = HOURS[(day + i) % 7];
    if (next) {
      const label = i === 1 ? "tomorrow" : new Intl.DateTimeFormat("en-GB", { weekday: "long" }).format(new Date(2024, 0, 7 + ((day + i) % 7)));
      return { open: false, text: `Closed · opens ${label} at ${formatTime(next[0])}` };
    }
  }
  return { open: false, text: "Closed" };
}

function initStatus() {
  const badges = document.querySelectorAll("[data-open-status]");
  if (!badges.length) return;
  const status = openStatus();
  badges.forEach((el) => {
    el.textContent = status.text;
    el.classList.add(status.open ? "is-open" : "is-closed");
  });
}

function initHoursTable() {
  const { day } = londonNow();
  document.querySelectorAll(`.hours tr[data-day="${day}"]`).forEach((row) => row.classList.add("is-today"));
}

function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.focus();
    }
  });
}

function initYear() {
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}

initNav();
initStatus();
initHoursTable();
initYear();

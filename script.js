// ====== НАСТРОЙКИ ======
const CONFIG = {
  brand: "Відеомонтаж",
  telegram: "grenochka99",
  phoneIntl: "380634275922",
  phoneShow: "+38 063 427 59 22",
  instagram: "grenkavideomontaz",  // ник Instagram без @
  facebook: "",                    // повне посилання на Facebook, напр. https://facebook.com/ваша.сторінка
  price3: 200,       // до 3 хв, грн
  price5: 450,       // до 5 хв, грн
  price10: 800,      // до 10 хв, грн
  extraMinute: 90,   // кожна додаткова хвилина понад 10 хв, грн
  rushPercent: 45    // терміново, %
};
// =======================

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const L = {
  tg: "https://t.me/" + CONFIG.telegram,
  viber: "viber://chat?number=%2B" + CONFIG.phoneIntl,
  tel: "tel:+" + CONFIG.phoneIntl,
  ig: "https://instagram.com/" + CONFIG.instagram,
  fb: CONFIG.facebook
};

// ---- Шапка и подвал (общие для всех страниц) ----
const pages = [
  ["index.html", "Головна"], ["services.html", "Послуги"], ["prices.html", "Ціни"],
  ["order.html", "Замовити"], ["contacts.html", "Контакти"]
];
const cur = location.pathname.split("/").pop() || "index.html";
$("#header").innerHTML = `
  <nav class="nav">
    <a class="logo" href="index.html">🎬 ${CONFIG.brand}</a>
    <button class="burger" id="burger" aria-label="Меню">☰</button>
    <div class="links" id="links">
      ${pages.map(([h, t]) => `<a href="${h}" class="${h === cur ? "active" : ""}">${t}</a>`).join("")}
    </div>
  </nav>`;
$("#footer").innerHTML = `
  <div class="foot">
    <div><b>${CONFIG.brand}</b><br>Відео з ваших фото та відео</div>
    <div>
      <a href="${L.tel}">📞 ${CONFIG.phoneShow}</a><br>
      <a href="${L.tg}" target="_blank" rel="noopener">✈️ Telegram @${CONFIG.telegram}</a><br>
      <a href="${L.viber}">💜 Viber</a><br>
      <a href="${L.ig}" target="_blank" rel="noopener">📸 Instagram @${CONFIG.instagram}</a>
      ${L.fb ? `<br><a href="${L.fb}" target="_blank" rel="noopener">👍 Facebook</a>` : ""}
    </div>
  </div>
  <p class="copy">© ${new Date().getFullYear()} ${CONFIG.brand}</p>
  <div class="float">
    <a href="${L.tg}" target="_blank" rel="noopener" class="f tg" title="Telegram">✈️</a>
    <a href="${L.viber}" class="f vb" title="Viber">💜</a>
    <a href="${L.ig}" target="_blank" rel="noopener" class="f ig" title="Instagram">📸</a>
    ${L.fb ? `<a href="${L.fb}" target="_blank" rel="noopener" class="f fb" title="Facebook">👍</a>` : ""}
    <a href="${L.tel}" class="f ph" title="Подзвонити">📞</a>
  </div>`;
$("#burger").addEventListener("click", () => $("#links").classList.toggle("open"));

// ---- Ссылки-кнопки по data-атрибутам ----
$$("[data-tg]").forEach(a => { a.href = L.tg; a.target = "_blank"; a.rel = "noopener"; });
$$("[data-viber]").forEach(a => a.href = L.viber);
$$("[data-tel]").forEach(a => a.href = L.tel);
$$("[data-ig]").forEach(a => { a.href = L.ig; a.target = "_blank"; a.rel = "noopener"; });
$$("[data-fb]").forEach(a => {
  if (!L.fb) { (a.closest("[data-fb-wrap]") || a).remove(); return; }
  a.href = L.fb; a.target = "_blank"; a.rel = "noopener";
});
$$("[data-ig-text]").forEach(e => e.textContent = "@" + CONFIG.instagram);
$$("[data-phone-text]").forEach(e => e.textContent = CONFIG.phoneShow);
$$("[data-price3]").forEach(e => e.textContent = CONFIG.price3 + " грн");
$$("[data-price5]").forEach(e => e.textContent = CONFIG.price5 + " грн");
$$("[data-price10]").forEach(e => e.textContent = CONFIG.price10 + " грн");
$$("[data-extra]").forEach(e => e.textContent = CONFIG.extraMinute + " грн");
$$("[data-rush]").forEach(e => e.textContent = CONFIG.rushPercent);

// ---- Калькулятор ----
function calc(m, rush) {
  let p = m <= 3 ? CONFIG.price3 : m <= 5 ? CONFIG.price5 : m <= 10 ? CONFIG.price10
        : CONFIG.price10 + (m - 10) * CONFIG.extraMinute;
  return rush ? Math.round(p * (1 + CONFIG.rushPercent / 100)) : p;
}
function priceText() {
  const m = +$("#minutes").value, r = $("#rush").checked;
  return `${m} хв${r ? ", терміново" : ""} — ${calc(m, r)} грн`;
}
if ($("#minutes")) {
  const upd = () => {
    const m = +$("#minutes").value, r = $("#rush").checked;
    $("#minVal").textContent = m;
    $("#total").textContent = calc(m, r) + " грн";
    $$("[data-calc-text]").forEach(e => e.textContent = priceText());
  };
  $("#minutes").addEventListener("input", upd);
  $("#rush").addEventListener("change", upd);
  upd();
}

// ---- Форма заказа ----
if ($("#form")) {
  const f = $("#form"), err = $("#error"), ok = $("#success");
  function build() {
    const bad = !f.name.value.trim() || !f.contact.value.trim();
    f.name.classList.toggle("bad", !f.name.value.trim());
    f.contact.classList.toggle("bad", !f.contact.value.trim());
    err.hidden = !bad;
    if (bad) { err.textContent = "Заповніть імʼя та контакт."; return null; }
    return `Заявка на відео
Імʼя: ${f.name.value.trim()}
Контакт: ${f.contact.value.trim()}
Привід: ${f.event.value}
Матеріали: ${f.link.value.trim() || "—"}
Побажання: ${f.comment.value.trim() || "—"}
Розрахунок: ${priceText()}`;
  }
  async function copy(t) {
    try { await navigator.clipboard.writeText(t); return true; } catch { return false; }
  }
  $("#sendTg").addEventListener("click", () => {
    const t = build(); if (!t) return;
    window.open(`${L.tg}?text=${encodeURIComponent(t)}`, "_blank");
    ok.hidden = false; ok.textContent = "Відкриваємо Telegram — натисніть «Надіслати» в чаті.";
  });
  $("#sendViber").addEventListener("click", async () => {
    const t = build(); if (!t) return;
    const c = await copy(t);
    ok.hidden = false;
    ok.textContent = c ? "Текст заявки скопійовано. Відкриваємо Viber — вставте його в чат і надішліть."
                       : "Відкриваємо Viber — напишіть нам у чат.";
    location.href = L.viber;
  });
  $("#copyBtn").addEventListener("click", async () => {
    const t = build(); if (!t) return;
    ok.hidden = false;
    ok.textContent = (await copy(t)) ? "Текст заявки скопійовано." : "Не вдалося скопіювати, виділіть текст вручну.";
  });
}

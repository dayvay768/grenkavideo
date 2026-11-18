// ====== НАСТРОЙКИ — меняйте здесь ======
const CONFIG = {
  brand: "Видеомонтаж",          // название
  telegram: "your_username",      // ник в Telegram без @
  formspreeId: "XXXXXXXX",        // ID формы из Formspree (см. README)
  phone: "+380000000000",         // телефон
  priceShort: 200,                // до 3 минут, грн
  priceLong: 500,                 // до 10 минут, грн
  rushPercent: 50                 // наценка за срочность, %
};
// =======================================

const $ = s => document.querySelector(s);

function calcPrice(minutes, rush) {
  let p = minutes <= 3 ? CONFIG.priceShort : CONFIG.priceLong;
  if (rush) p = Math.round(p * (1 + CONFIG.rushPercent / 100));
  return p;
}
function priceText() {
  const m = +$("#minutes").value, r = $("#rush").checked;
  return `${m} мин${r ? ", срочно" : ""} — ${calcPrice(m, r)} грн`;
}
function update() {
  const m = +$("#minutes").value, r = $("#rush").checked;
  $("#minVal").textContent = m;
  $("#total").textContent = calcPrice(m, r) + " грн";
  $("#formPrice").textContent = priceText();
}

// Заполнение настроек
document.querySelectorAll("[data-brand]").forEach(e => e.textContent = CONFIG.brand);
document.title = CONFIG.brand + " — видео из ваших фото и видео";
document.querySelector('[data-price="short"]').textContent = CONFIG.priceShort + " грн";
document.querySelector('[data-price="long"]').textContent = CONFIG.priceLong + " грн";
document.querySelector("[data-rush]").textContent = CONFIG.rushPercent;
$("#tgLink").href = "https://t.me/" + CONFIG.telegram;
$("#phoneLink").href = "tel:" + CONFIG.phone;
$("#phoneLink").textContent = CONFIG.phone;
$("#year").textContent = new Date().getFullYear();

$("#minutes").addEventListener("input", update);
$("#rush").addEventListener("change", update);
update();

// Мобильное меню
$("#burger").addEventListener("click", () => $("#links").classList.toggle("open"));
$("#links").addEventListener("click", () => $("#links").classList.remove("open"));

// Отправка заявки
let via = "formspree";
document.querySelectorAll("[data-via]").forEach(b =>
  b.addEventListener("click", () => via = b.dataset.via));

$("#form").addEventListener("submit", async e => {
  e.preventDefault();
  const f = e.target, err = $("#error"), okMsg = $("#success");
  okMsg.hidden = true;
  let ok = true;
  ["name", "contact"].forEach(n => {
    const bad = !f[n].value.trim();
    f[n].classList.toggle("bad", bad);
    if (bad) ok = false;
  });
  err.hidden = ok;
  if (!ok) { err.textContent = "Заполните имя и контакт."; return; }

  const text =
`Заявка на видео
Имя: ${f.name.value.trim()}
Контакт: ${f.contact.value.trim()}
Повод: ${f.event.value}
Материалы: ${f.link.value.trim() || "—"}
Пожелания: ${f.comment.value.trim() || "—"}
Расчёт: ${priceText()}`;

  if (via === "telegram") {
    window.open(`https://t.me/${CONFIG.telegram}?text=${encodeURIComponent(text)}`, "_blank");
    return;
  }

  // Formspree
  const btns = f.querySelectorAll("button");
  btns.forEach(b => b.disabled = true);
  try {
    const res = await fetch(`https://formspree.io/f/${CONFIG.formspreeId}`, {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        _subject: "Новая заявка на видео",
        name: f.name.value.trim(),
        contact: f.contact.value.trim(),
        event: f.event.value,
        materials: f.link.value.trim(),
        comment: f.comment.value.trim(),
        calculation: priceText(),
        _gotcha: f._gotcha.value
      })
    });
    if (!res.ok) throw new Error("bad response");
    f.reset();
    update();
    okMsg.hidden = false;
  } catch (x) {
    err.hidden = false;
    err.textContent = "Не удалось отправить. Попробуйте ещё раз или напишите в Telegram.";
  } finally {
    btns.forEach(b => b.disabled = false);
  }
});

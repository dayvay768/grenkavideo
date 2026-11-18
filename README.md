# Сайт видеомонтажа (с Formspree)

## 1. Formspree (приём заявок на почту)
1. Зарегистрируйтесь на https://formspree.io (бесплатно).
2. New Form → назовите форму → укажите почту, куда присылать заявки.
3. Скопируйте адрес формы вида https://formspree.io/f/abcdwxyz — последняя часть (abcdwxyz) и есть ID.
4. В script.js замените formspreeId: "XXXXXXXX" на ваш ID.
5. Первую заявку отправьте сами для проверки: Formspree попросит подтвердить почту.

## 2. Что менять в script.js (блок CONFIG)
- brand — название вашей студии
- telegram — ваш ник без @
- phone — телефон
- formspreeId — ID формы из Formspree
- priceShort / priceLong / rushPercent — цены и наценка за срочность

## 3. GitHub Pages
Залейте index.html, style.css, script.js в репозиторий → Settings → Pages → Deploy from a branch → main / root.

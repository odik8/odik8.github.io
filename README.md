# Web-Cosmos Landing

Лендинг «Web-Cosmos — маркетинг и аналитика в медицине», свёрстан по макету
из Claude Design (`Web-Cosmos Landing.html`).

## Стек

- **HTML** — семантическая разметка, ARIA-атрибуты, скрытые подписи полей формы.
- **CSS** — БЭМ (`block__element--modifier`), дизайн-токены в `:root`,
  шрифт Manrope (variable, локальные woff2-сабсеты).
- **JS** — ES-модули, ООП: каждый компонент — класс, привязанный к разметке
  через `[data-js]`-селекторы (стилевые классы и JS-хуки не пересекаются).

## Структура

```
index.html
css/
  fonts.css          @font-face (Manrope 400–800)
  main.css           БЭМ-стили
js/
  app.js             точка входа: data-js → класс
  modules/
    Component.js     базовый класс (root, find, destroy)
    CanvasEffect.js  общий каркас canvas-фонов (resize, rAF, reduced-motion)
    DotGrid.js       тёмный точечный фон страницы с подсветкой у курсора
    Constellation.js сеть частиц в хиро-секции
    CursorGlow.js    инвертирующий круг над текстом хиро (mix-blend-mode)
    AuditForm.js     форма заявки → состояние «отправлено»
assets/logo-mark.svg
fonts/manrope-*.woff2
```

## Запуск

Из-за ES-модулей нужен любой статический сервер:

```sh
python3 -m http.server 8000
# → http://localhost:8000
```

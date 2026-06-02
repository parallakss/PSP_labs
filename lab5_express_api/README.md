# ЛР 4/5. Express REST API

В папке находится Express API для карточек по теме производства кораблей.

Файлы:

- `src/` — сервер, роуты, контроллеры, сервисы и JSON-данные;
- `package.json` — команды запуска;
- `postman_shipbuilding_lab.json` — коллекция Postman;
- `index.html`, `site.css`, `script.js`, `ship3d.js` — статический сайт, который может отдавать сервер.

Запуск:

```bash
npm install
npm run start
```

Адрес:

```text
http://localhost:3000
```

API:

```text
GET    /stocks
GET    /stocks/:id
POST   /stocks
PATCH  /stocks/:id
DELETE /stocks/:id
```

Что показать при сдаче:

- работу API в Postman;
- получение списка карточек;
- создание, обновление и удаление карточки;
- хранение данных в `src/data/stocks.json`.

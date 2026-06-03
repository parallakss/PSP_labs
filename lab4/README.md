# Лабораторная работа 4: Express API и развернутый bundle

В данной ветке размещена серверная часть на Express.js и собранная клиентская часть из 6 лабораторной работы.

Предметная область: кораблестроительное производство.

## Что реализовано

- создан Express-сервер;
- реализован REST API для карточек кораблей по маршруту `/stocks`;
- данные хранятся в `src/data/stocks.json`;
- логика разделена на маршруты, контроллеры и сервисы;
- собранный frontend bundle размещен в папке `public`;
- сервер раздает `public/index.html` и одновременно обслуживает API;
- CORS-расширение не требуется, потому что страница и API открываются с одного origin: `http://localhost:3000`.

## Основные файлы

- `src/index.js` — точка входа Express-сервера;
- `src/routes/stocks.js` — маршруты API;
- `src/controllers/stocksController.js` — обработчики запросов;
- `src/services/stocksService.js` — бизнес-логика карточек кораблей;
- `src/services/fileService.js` — чтение и запись JSON;
- `src/data/stocks.json` — данные карточек;
- `public/index.html` — собранная HTML-страница;
- `public/assets/*.js` — собранный bundle клиентской части.

## Запуск

```bash
cd lab4
npm install
npm start
```

После запуска открыть:

```text
http://localhost:3000
```

API доступно по адресам:

```text
GET /stocks
GET /stocks?title=Фрегат
GET /stocks?text=дежурства
GET /stocks/1
POST /stocks
PATCH /stocks/1
DELETE /stocks/1
```

## Что показать в браузере

Во вкладке `Network` должны быть запросы `fetch` к `/stocks`.

Во вкладке `Sources` должны отображаться файлы из `public`: `index.html` и собранный файл из `assets`. Исходных файлов фронтенда (`modules`, `pages`, `components`) в этой ветке нет.

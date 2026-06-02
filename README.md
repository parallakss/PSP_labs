# PSPlabs structure

Проект разложен по папкам для сдачи лабораторных и домашних заданий.

- `lab1_calculator/` — калькулятор: `calculator.html`, `style.css`, `script.js`.
- `lab2_shipbuilding_site/` — основной сайт по теме производства кораблей: главная страница, стили, модальные карточки, встроенная 3D-модель.
- `lab3_component_app/` — компонентная лабораторная: `main.js`, `pages/`, `components/`.
- `lab4_3d_gallery/` — 3D gallery GLB: галерея, детальная страница, IndexedDB.
- `lab5_express_api/` — Express REST API по методичке: `src/`, `package.json`, Postman collection, статический сайт.
- `homework1_js/` — первое домашнее задание по задачам JS.

Для запуска Express API:

```bash
cd lab5_express_api
npm install
npm run start
```

API будет доступно по адресу `http://localhost:3000/stocks`.

const express = require('express');
const path = require('path');
const stocksRouter = require('./routes/stocks');
const stocksService = require('./services/stocksService');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE_PATH = path.join(__dirname, 'data/stocks.json');
const PUBLIC_DIR = path.join(__dirname, '..');
const BUILD_DIR = path.join(PUBLIC_DIR, 'public');

stocksService.init(DATA_FILE_PATH);

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use('/stocks', stocksRouter);
app.use(express.static(BUILD_DIR));

app.get('/', (req, res) => {
  res.sendFile(path.join(BUILD_DIR, 'index.html'));
});

app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(PORT, () => {
  console.log(`ЛР 4 запущена: http://localhost:${PORT}`);
});

const stocksService = require('../services/stocksService');

const getAllStocks = (req, res) => {
  const { title } = req.query;
  const stocks = stocksService.findAll(title);
  res.json(stocks);
};

const getStockById = (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const stock = stocksService.findOne(id);

  if (!stock) {
    return res.status(404).json({ error: 'Карточка не найдена' });
  }

  return res.json(stock);
};

const createStock = (req, res) => {
  const { src, title, text } = req.body;

  if (!src || !title || !text) {
    return res.status(400).json({ error: 'Не все поля заполнены' });
  }

  const newStock = stocksService.create({ src, title, text });
  return res.status(201).json(newStock);
};

const updateStock = (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const updatedStock = stocksService.update(id, req.body);

  if (!updatedStock) {
    return res.status(404).json({ error: 'Карточка не найдена' });
  }

  return res.json(updatedStock);
};

const deleteStock = (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const success = stocksService.remove(id);

  if (!success) {
    return res.status(404).json({ error: 'Карточка не найдена' });
  }

  return res.status(204).send();
};

module.exports = {
  getAllStocks,
  getStockById,
  createStock,
  updateStock,
  deleteStock,
};

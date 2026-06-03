class StockUrls {
  constructor() {
    this.baseUrl = window.location.port === '5173' ? 'http://localhost:3001' : '';
  }

  getStocks(title = '') {
    const query = title ? `?title=${encodeURIComponent(title)}` : '';
    return `${this.baseUrl}/stocks${query}`;
  }

  getStockById(id) {
    return `${this.baseUrl}/stocks/${id}`;
  }

  createStock() {
    return `${this.baseUrl}/stocks`;
  }

  removeStockById(id) {
    return `${this.baseUrl}/stocks/${id}`;
  }

  updateStockById(id) {
    return `${this.baseUrl}/stocks/${id}`;
  }
}

export const stockUrls = new StockUrls();

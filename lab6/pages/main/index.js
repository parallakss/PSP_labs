import { ProductCardComponent } from '../../components/product-card/index.js';
import { api } from '../../modules/api.js';
import { stockUrls } from '../../modules/stockUrls.js';
import { ProductPage } from '../product/index.js';

export class MainPage {
  constructor(parent) {
    this.parent = parent;
  }

  get pageRoot() {
    return document.getElementById('main-page');
  }

  getHTML() {
    return `
      <header class="mb-4">
        <span class="badge text-bg-primary mb-2">ЛР 6 fetch + Vite</span>
        <h1 class="display-6 fw-bold">Судостроительные карточки через fetch</h1>
        <p class="text-muted mb-0">Данные загружаются с Express API по адресу <code>/stocks</code>.</p>
      </header>

      <section class="row g-2 align-items-end mb-4">
        <div class="col-12 col-md-8">
          <label class="form-label" for="filter-title">Фильтр по названию корабля</label>
          <input id="filter-title" class="form-control" type="text" placeholder="Например: Фрегат">
        </div>
        <div class="col-12 col-md-4">
          <button id="filter-button" class="btn btn-primary w-100" type="button">Найти</button>
        </div>
      </section>

      <div id="status-message" class="alert alert-info">Загружаем карточки...</div>
      <section id="main-page" class="row row-cols-1 row-cols-md-3 g-4"></section>
    `;
  }

  async getData(title = '') {
    document.getElementById('status-message').textContent = 'Загружаем карточки...';
    this.pageRoot.innerHTML = '';

    try {
      const { data, status } = await api.get(stockUrls.getStocks(title));

      if (status !== 200 || !Array.isArray(data)) {
        this.renderError('Не удалось получить карточки с сервера.');
        return;
      }

      this.renderData(data);
    } catch (e) {
      console.error(e);
      this.renderError('Ошибка сети при получении карточек.');
    }
  }

  renderData(items) {
    const status = document.getElementById('status-message');

    if (!items.length) {
      status.className = 'alert alert-warning';
      status.textContent = 'Карточки не найдены.';
      return;
    }

    status.className = 'alert alert-success';
    status.textContent = `Получено карточек: ${items.length}`;

    items.forEach((item) => {
      const productCard = new ProductCardComponent(this.pageRoot);
      productCard.render(item, this.clickCard.bind(this));
    });
  }

  renderError(message) {
    const status = document.getElementById('status-message');
    status.className = 'alert alert-danger';
    status.textContent = message;
  }

  clickCard(e) {
    const cardId = Number(e.target.dataset.id);
    const productPage = new ProductPage(this.parent, cardId);
    productPage.render();
  }

  addListeners() {
    document.getElementById('filter-button').addEventListener('click', () => {
      const title = document.getElementById('filter-title').value.trim();
      this.getData(title);
    });
  }

  render() {
    this.parent.innerHTML = '';
    const html = this.getHTML();
    this.parent.insertAdjacentHTML('beforeend', html);

    this.addListeners();
    this.getData();
  }
}

import { BackButtonComponent } from '../../components/back-button/index.js';
import { ProductComponent } from '../../components/product/index.js';
import { api } from '../../modules/api.js';
import { stockUrls } from '../../modules/stockUrls.js';
import { MainPage } from '../main/index.js';

export class ProductPage {
  constructor(parent, id) {
    this.parent = parent;
    this.id = id;
  }

  get pageRoot() {
    return document.getElementById('product-page');
  }

  getHTML() {
    return `
      <div id="product-page" class="mx-auto" style="max-width: 900px;">
        <div id="product-actions" class="d-flex gap-2 mb-3"></div>
        <div id="product-status" class="alert alert-info">Загружаем карточку...</div>
      </div>
    `;
  }

  async getData() {
    try {
      const { data, status } = await api.get(stockUrls.getStockById(this.id));

      if (status !== 200 || !data) {
        this.renderError('Карточка не найдена.');
        return;
      }

      this.renderData(data);
    } catch (e) {
      console.error(e);
      this.renderError('Ошибка сети при получении карточки.');
    }
  }

  renderData(item) {
    document.getElementById('product-status').remove();

    const product = new ProductComponent(this.pageRoot);
    product.render(item);
  }

  renderError(message) {
    const status = document.getElementById('product-status');
    status.className = 'alert alert-danger';
    status.textContent = message;
  }

  clickBack() {
    const mainPage = new MainPage(this.parent);
    mainPage.render();
  }

  async clickDelete() {
    try {
      const { status } = await api.delete(stockUrls.removeStockById(this.id));

      if (status !== 204) {
        this.renderError('Не удалось удалить карточку.');
        return;
      }

      const mainPage = new MainPage(this.parent);
      mainPage.render();
    } catch (e) {
      console.error(e);
      this.renderError('Ошибка сети при удалении карточки.');
    }
  }

  render() {
    this.parent.innerHTML = '';
    const html = this.getHTML();
    this.parent.insertAdjacentHTML('beforeend', html);

    const actions = document.getElementById('product-actions');
    const backButton = new BackButtonComponent(actions);
    backButton.render(this.clickBack.bind(this));

    actions.insertAdjacentHTML(
      'beforeend',
      '<button id="delete-button" class="btn btn-danger" type="button">Удалить карточку</button>'
    );
    document.getElementById('delete-button').addEventListener('click', this.clickDelete.bind(this));

    this.getData();
  }
}

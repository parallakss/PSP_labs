import { BackButtonComponent } from '../../components/back-button/index.js';
import { ProductComponent } from '../../components/product/index.js';
import { ajax } from '../../modules/ajax.js';
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

  getData() {
    ajax.get(stockUrls.getStockById(this.id), (data, status) => {
      if (status !== 200 || !data) {
        this.renderError('Карточка не найдена.');
        return;
      }

      this.renderData(data);
    });
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

  clickDelete() {
    ajax.delete(stockUrls.removeStockById(this.id), (data, status) => {
      if (status !== 204) {
        this.renderError('Не удалось удалить карточку.');
        return;
      }

      const mainPage = new MainPage(this.parent);
      mainPage.render();
    });
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

import { ProductCardComponent } from "../../components/product-card/index.js";
import { ProductPage } from "../product/index.js";

export class MainPage {
  constructor(parent) {
    this.parent = parent;
  }

  get pageRoot() {
    return document.getElementById("main-page");
  }

  getData() {
    return [
      {
        id: 1,
        src: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=900&q=80",
        title: "Математика",
        text: "Алгебра, анализ и практические задачи для инженеров.",
        description: "Курс формирует математический аппарат для моделирования процессов и обработки данных.",
        gallery: [
          "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        id: 2,
        src: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=900&q=80",
        title: "Физика",
        text: "Механика, термодинамика и электромагнетизм.",
        description: "Изучаем фундаментальные законы природы и их применение в технике.",
        gallery: [
          "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1581091215367-59ab6dcef324?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        id: 3,
        src: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80",
        title: "Информатика",
        text: "Программирование, структуры данных и алгоритмы.",
        description: "Практический курс по разработке и автоматизации учебных проектов.",
        gallery: [
          "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80"
        ]
      }
    ];
  }

  getHTML() {
    return `
      <h1 class="mb-4">Учебные предметы</h1>
      <p class="text-muted mb-4">Выберите предмет, чтобы открыть подробную страницу с описанием и каруселью.</p>
      <div id="main-page" class="row row-cols-1 row-cols-md-3 g-4"></div>
    `;
  }

  clickCard(e) {
    const cardId = Number(e.target.dataset.id);
    const item = this.getData().find((subject) => subject.id === cardId);

    if (!item) {
      return;
    }

    const productPage = new ProductPage(this.parent, item);
    productPage.render();
  }

  render() {
    this.parent.innerHTML = "";
    const html = this.getHTML();
    this.parent.insertAdjacentHTML("beforeend", html);

    const data = this.getData();
    data.forEach((item) => {
      const productCard = new ProductCardComponent(this.pageRoot);
      productCard.render(item, this.clickCard.bind(this));
    });
  }
}

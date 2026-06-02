export class ProductComponent {
  constructor(parent) {
    this.parent = parent;
  }

  getCarouselId(data) {
    return `subject-carousel-${data.id}`;
  }

  getHTML(data) {
    const carouselId = this.getCarouselId(data);

    return `
      <div class="card shadow-sm">
        <div class="card-body">
          <h2 class="card-title mb-3">${data.title}</h2>
          <p class="card-text">${data.description}</p>
        </div>

        <div id="${carouselId}" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-indicators">
            ${data.gallery
              .map(
                (_, index) => `
                  <button type="button" data-bs-target="#${carouselId}" data-bs-slide-to="${index}" ${index === 0 ? 'class="active" aria-current="true"' : ""} aria-label="Слайд ${index + 1}"></button>
                `
              )
              .join("")}
          </div>
          <div class="carousel-inner rounded-bottom">
            ${data.gallery
              .map(
                (img, index) => `
                  <div class="carousel-item ${index === 0 ? "active" : ""}">
                    <img src="${img}" class="d-block w-100" alt="${data.title} ${index + 1}" style="height: 420px; object-fit: cover;">
                  </div>
                `
              )
              .join("")}
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Предыдущий</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Следующий</span>
          </button>
        </div>
      </div>
    `;
  }

  render(data) {
    const html = this.getHTML(data);
    this.parent.insertAdjacentHTML("beforeend", html);
  }
}

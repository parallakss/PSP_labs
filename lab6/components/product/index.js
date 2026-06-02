export class ProductComponent {
  constructor(parent) {
    this.parent = parent;
  }

  getHTML(data) {
    return `
      <article class="card shadow-sm">
        <img src="${data.src}" class="card-img-top" alt="${data.title}" style="max-height: 420px; object-fit: cover;">
        <div class="card-body">
          <h2 class="card-title">${data.title}</h2>
          <p class="card-text fs-5">${data.text}</p>
        </div>
      </article>
    `;
  }

  render(data) {
    const html = this.getHTML(data);
    this.parent.insertAdjacentHTML('beforeend', html);
  }
}

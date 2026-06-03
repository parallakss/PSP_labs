(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const c of n.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&s(c)}).observe(document,{childList:!0,subtree:!0});function e(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(r){if(r.ep)return;r.ep=!0;const n=e(r);fetch(r.href,n)}})();class l{constructor(t){this.parent=t}getHTML(t){return`
      <div class="col">
        <article class="card h-100 shadow-sm">
          <img src="${t.src}" class="card-img-top ship-card-img" alt="${t.title}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${t.title}</h5>
            <p class="card-text">${t.text}</p>
            <button class="btn btn-primary mt-auto" id="click-card-${t.id}" data-id="${t.id}">
              Подробнее
            </button>
          </div>
        </article>
      </div>
    `}addListeners(t,e){document.getElementById(`click-card-${t.id}`).addEventListener("click",e)}render(t,e){const s=this.getHTML(t);this.parent.insertAdjacentHTML("beforeend",s),this.addListeners(t,e)}}class u{async get(t){return this._request(t)}async post(t,e){return this._request(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)})}async patch(t,e){return this._request(t,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)})}async delete(t){return this._request(t,{method:"DELETE"})}async _request(t,e={}){const s=await fetch(t,e);return{data:s.status===204?null:await s.json(),status:s.status,ok:s.ok}}}const a=new u;class h{constructor(){this.baseUrl=window.location.port==="5173"?"http://localhost:3001":""}getStocks(t=""){const e=t?`?title=${encodeURIComponent(t)}`:"";return`${this.baseUrl}/stocks${e}`}getStockById(t){return`${this.baseUrl}/stocks/${t}`}createStock(){return`${this.baseUrl}/stocks`}removeStockById(t){return`${this.baseUrl}/stocks/${t}`}updateStockById(t){return`${this.baseUrl}/stocks/${t}`}}const i=new h;class m{constructor(t){this.parent=t}getHTML(){return`
      <button id="back-button" class="btn btn-outline-secondary" type="button">
        Назад к списку
      </button>
    `}addListeners(t){document.getElementById("back-button").addEventListener("click",t)}render(t){const e=this.getHTML();this.parent.insertAdjacentHTML("beforeend",e),this.addListeners(t)}}class p{constructor(t){this.parent=t}getHTML(t){return`
      <article class="card shadow-sm">
        <img src="${t.src}" class="card-img-top" alt="${t.title}" style="max-height: 420px; object-fit: cover;">
        <div class="card-body">
          <h2 class="card-title">${t.title}</h2>
          <p class="card-text fs-5">${t.text}</p>
        </div>
      </article>
    `}render(t){const e=this.getHTML(t);this.parent.insertAdjacentHTML("beforeend",e)}}class g{constructor(t,e){this.parent=t,this.id=e}get pageRoot(){return document.getElementById("product-page")}getHTML(){return`
      <div id="product-page" class="mx-auto" style="max-width: 900px;">
        <div id="product-actions" class="d-flex gap-2 mb-3"></div>
        <div id="product-status" class="alert alert-info">Загружаем карточку...</div>
      </div>
    `}async getData(){try{const{data:t,status:e}=await a.get(i.getStockById(this.id));if(e!==200||!t){this.renderError("Карточка не найдена.");return}this.renderData(t)}catch(t){console.error(t),this.renderError("Ошибка сети при получении карточки.")}}renderData(t){document.getElementById("product-status").remove(),new p(this.pageRoot).render(t)}renderError(t){const e=document.getElementById("product-status");e.className="alert alert-danger",e.textContent=t}clickBack(){new d(this.parent).render()}async clickDelete(){try{const{status:t}=await a.delete(i.removeStockById(this.id));if(t!==204){this.renderError("Не удалось удалить карточку.");return}new d(this.parent).render()}catch(t){console.error(t),this.renderError("Ошибка сети при удалении карточки.")}}render(){this.parent.innerHTML="";const t=this.getHTML();this.parent.insertAdjacentHTML("beforeend",t);const e=document.getElementById("product-actions");new m(e).render(this.clickBack.bind(this)),e.insertAdjacentHTML("beforeend",'<button id="delete-button" class="btn btn-danger" type="button">Удалить карточку</button>'),document.getElementById("delete-button").addEventListener("click",this.clickDelete.bind(this)),this.getData()}}class d{constructor(t){this.parent=t}get pageRoot(){return document.getElementById("main-page")}getHTML(){return`
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
    `}async getData(t=""){document.getElementById("status-message").textContent="Загружаем карточки...",this.pageRoot.innerHTML="";try{const{data:e,status:s}=await a.get(i.getStocks(t));if(s!==200||!Array.isArray(e)){this.renderError("Не удалось получить карточки с сервера.");return}this.renderData(e)}catch(e){console.error(e),this.renderError("Ошибка сети при получении карточек.")}}renderData(t){const e=document.getElementById("status-message");if(!t.length){e.className="alert alert-warning",e.textContent="Карточки не найдены.";return}e.className="alert alert-success",e.textContent=`Получено карточек: ${t.length}`,t.forEach(s=>{new l(this.pageRoot).render(s,this.clickCard.bind(this))})}renderError(t){const e=document.getElementById("status-message");e.className="alert alert-danger",e.textContent=t}clickCard(t){const e=Number(t.target.dataset.id);new g(this.parent,e).render()}addListeners(){document.getElementById("filter-button").addEventListener("click",()=>{const t=document.getElementById("filter-title").value.trim();this.getData(t)})}render(){this.parent.innerHTML="";const t=this.getHTML();this.parent.insertAdjacentHTML("beforeend",t),this.addListeners(),this.getData()}}const b=document.getElementById("root"),y=new d(b);y.render();

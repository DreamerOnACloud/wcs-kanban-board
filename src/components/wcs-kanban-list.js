export class WcsKanbanList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const title = this.getAttribute('title') || 'New List';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          background: #f4f4f4;
          border-radius: 8px;
          padding: 0.5rem;
          width: 200px;
        }
        h3 { margin: 0 0 0.5rem 0; }
      </style>
      <h3>${title}</h3>
      <div id="cards"></div>
      <button id="add-card">+ Add Card</button>
    `;

    this.shadowRoot
      .querySelector('#add-card')
      .addEventListener('click', () => this.addCard());
  }

  addCard() {
    const card = document.createElement('wcs-kanban-card');
    card.setAttribute('title', 'New Task');
    this.shadowRoot.querySelector('#cards').appendChild(card);
  }
}

customElements.define('wcs-kanban-list', WcsKanbanList);

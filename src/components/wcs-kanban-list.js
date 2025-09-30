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
        .list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        h3 { 
          margin: 0;
        }
        .remove-list {
          padding: 4px 8px;
          background: transparent;
          border: none;
          cursor: pointer;
          color: #666;
          font-weight: bold;
        }
        .remove-list:hover {
          color: #ff4444;
        }
      </style>
      <div class="list-header">
        <h3>${title}</h3>
        <button class="remove-list" title="Remove List">Χ</button>
      </div>
      <div id="cards"></div>
      <button id="add-card">+ Add Card</button>
    `;

    this.shadowRoot
      .querySelector('#add-card')
      .addEventListener('click', () => this.addCard());

    this.shadowRoot
      .querySelector('.remove-list')
      .addEventListener('click', () => this.remove());
  }

  addCard() {
    const card = document.createElement('wcs-kanban-card');
    card.setAttribute('title', 'New Task');
    this.shadowRoot.querySelector('#cards').appendChild(card);
  }
}

customElements.define('wcs-kanban-list', WcsKanbanList);

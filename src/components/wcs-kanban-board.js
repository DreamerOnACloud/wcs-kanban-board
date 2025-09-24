export class WcsKanbanBoard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          gap: 1rem;
          padding: 1rem;
        }
        #lists {
          display: flex;
        }
      </style>
      <div id="lists"></div>
      <button id="add-list">+ Add List</button>
    `;
  }

  connectedCallback() {
    this.shadowRoot
      .querySelector('#add-list')
      .addEventListener('click', () => this.addList());
  }

  addList() {
    const list = document.createElement('wcs-kanban-list');
    list.setAttribute('title', 'New List');
    this.shadowRoot.querySelector('#lists').appendChild(list);
  }
}

customElements.define('wcs-kanban-board', WcsKanbanBoard);

export class WcsKanbanCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

    connectedCallback() {
      const title = this.getAttribute('title') || 'New Task';

      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            background: white;
            border-radius: 6px;
            padding: 0.5rem;
            margin-bottom: 0.5rem;
            cursor: grab;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
        </style>
        <div>${title}</div>
      `;
  }
}

customElements.define('wcs-kanban-card', WcsKanbanCard);

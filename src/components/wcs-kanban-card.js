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
          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .remove-card {
            padding: 2px 6px;
            background: transparent;
            border: none;
            cursor: pointer;
            color: #666;
            font-weight: bold;
            font-size: 12px;
          }
          .remove-card:hover {
            color: #ff4444;
          }
        </style>
        <div class="card-header">
          <div>${title}</div>
          <button class="remove-card" title="Remove Card">×</button>
        </div>
      `;

      this.shadowRoot
        .querySelector('.remove-card')
        .addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent dragging when clicking remove
          this.remove();
        });
  }
}

customElements.define('wcs-kanban-card', WcsKanbanCard);

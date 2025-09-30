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
          .card-title {
            flex-grow: 1;
            min-width: 50px;
            padding: 2px 4px;
            border-radius: 3px;
          }
          .card-title:hover {
            background: #f0f0f0;
            cursor: text;
          }
          .card-title:focus {
            background: #fff;
            outline: 2px solid #0066cc;
            cursor: text;
          }
          .remove-card {
            padding: 2px 6px;
            background: transparent;
            border: none;
            cursor: pointer;
            color: #666;
            font-weight: bold;
            font-size: 12px;
            margin-left: 8px;
          }
          .remove-card:hover {
            color: #ff4444;
          }
        </style>
        <div class="card-header">
          <div class="card-title" contenteditable="true">${title}</div>
          <button class="remove-card" title="Remove Card">×</button>
        </div>
      `;

      // Title editing
      const titleElement = this.shadowRoot.querySelector('.card-title');
      
      titleElement.addEventListener('blur', () => {
        const newTitle = titleElement.textContent.trim();
        if (newTitle) {
          this.setAttribute('title', newTitle);
        } else {
          titleElement.textContent = this.getAttribute('title') || 'New Task';
        }
      });

      titleElement.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          titleElement.blur();
        }
        if (e.key === 'Escape') {
          titleElement.textContent = this.getAttribute('title') || 'New Task';
          titleElement.blur();
        }
      });

      // Remove button
      this.shadowRoot
        .querySelector('.remove-card')
        .addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent dragging when clicking remove
          this.remove();
        });
  }
}

customElements.define('wcs-kanban-card', WcsKanbanCard);

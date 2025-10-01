/**
 * Implementation of List Drop Zones from roadmap v1.2.0:
 * - Handle dragover and drop events
 * - Visual feedback for valid drop targets
 * - Smooth transitions for hover states
 * 
 * Also implements DOM Integration:
 * - Handle Shadow DOM boundaries
 * - Maintain card state during moves
 * - Update parent-child relationships
 */
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
          transition: background-color 0.2s ease;
        }
        :host(.drag-over) {
          background: #e4e4e4;
          outline: 2px dashed #666;
          outline-offset: -2px;
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
      
    // [List Drop Zones] Handle dragover and drop events
    this.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.classList.add('drag-over');  // [List Drop Zones] Visual feedback
      e.dataTransfer.dropEffect = 'move';
    });

    this.addEventListener('dragleave', () => {
      this.classList.remove('drag-over');  // [List Drop Zones] Visual feedback
    });

    this.addEventListener('drop', (e) => {
      e.preventDefault();
      this.classList.remove('drag-over');
      
      if (window._draggedCard) {  // [DOM Integration] Handle Shadow DOM boundaries
        const cardsContainer = this.shadowRoot.querySelector('#cards');
        cardsContainer.appendChild(window._draggedCard);  // [DOM Integration] Update parent-child relationships
      }
    });
  }

  addCard() {
    const card = document.createElement('wcs-kanban-card');
    card.setAttribute('title', 'New Task');
    this.shadowRoot.querySelector('#cards').appendChild(card);
  }
}

customElements.define('wcs-kanban-list', WcsKanbanList);

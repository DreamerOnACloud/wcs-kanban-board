export class WcsKanbanModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Setup keyboard handler
    this.handleKeyboard = (e) => {
      if (e.key === 'Escape') {
        this.close();
      }
    };

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          display: none;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.5);
        }
        .modal {
          background: white;
          padding: 1rem;
          border-radius: 8px;
          width: 300px;
        }

        .textarea-description {
          width: 100%;
          height: 100px;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
          resize: vertical;
        }
        .btn-save, .btn-close {
          padding: 0.5rem 1rem;
          margin-right: 0.5rem;
          cursor: pointer;
          border: none;
          border-radius: 4px;
        }

        .btn-save {
          background: #28a745;
          color: white;
        }
        .btn-close {
          background: #dc3545;
          color: white;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 1rem;
          gap: 0.5rem;
          text-align: right;
        }
      </style>
      <div class="modal">
        <slot></slot>
        <textarea class="textarea-description" placeholder="Enter card description..."></textarea>
        <div class="modal-actions">
          <button class="btn-save">Save</button>
          <button class="btn-close">Close</button>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    // Handle button clicks directly without relying on event bubbling
    this.shadowRoot.querySelector('.btn-close').addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent event from bubbling to modal
      this.close();
    });

    this.shadowRoot.querySelector('.btn-save').addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent event from bubbling to modal
      const description = this.shadowRoot.querySelector('.textarea-description').value;
      this.dispatchEvent(new CustomEvent('save', { detail: { description } }));
      this.close();
    });
  }

  getDescription() {
    return this.shadowRoot.querySelector('.textarea-description').value;
  }

  setDescription(value) {
    this.shadowRoot.querySelector('.textarea-description').value = value || '';
  }

  open(description) {
    this.setDescription(description);
    this.style.display = 'flex';
    // Add keyboard listener when modal opens
    document.addEventListener('keydown', this.handleKeyboard);
  }

  close() {
    console.log('Modal close method called');
    this.setDescription('');
    this.style.display = 'none';
    // Remove keyboard listener when modal closes
    document.removeEventListener('keydown', this.handleKeyboard);
  }
}

customElements.define('wcs-kanban-modal', WcsKanbanModal);

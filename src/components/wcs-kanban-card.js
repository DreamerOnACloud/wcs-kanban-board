/**
 * Implementation of Card Drag Operations from roadmap v1.2.0:
 * - Enable card dragging: Using HTML5 draggable attribute
 * - Set drag data and effects: Using dataTransfer API
 * - Animation and opacity during drag: Using CSS transitions
 */
import { debugLog, findParentBoard } from '../utils.js';

export class WcsKanbanCard extends HTMLElement {
  static get observedAttributes() {
    return ['title', 'description'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'description' && oldValue !== newValue) {
      this.updateDescriptionPreview(newValue);
    }
  }

  connectedCallback() {
    // 1. Initialize state and structure
    const title = this.getAttribute('title') || 'New Task';
    this.draggable = true;
    
    // 2. Set up HTML structure
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          background: white;
          border-radius: 6px;
          padding: 0.75rem;
          margin-bottom: 0.5rem;
          min-height: 2.5rem;
          cursor: grab;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        :host(.dragging) {
          opacity: 0.5;
          transform: scale(1.02);
          box-shadow: 0 5px 10px rgba(0,0,0,0.15);
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
        .card-description {
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: #666;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          line-height: 1.4;
          min-height: 0;
          transition: min-height 0.2s ease;
        }
        .card-description:empty {
          display: none;
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
      <div class="card-description"></div>
    `;

    // 3. Add modal to shadow DOM
    this.modal = document.createElement('wcs-kanban-modal');
    this.modal.innerHTML = '<h3>Edit Card</h3>';
    this.shadowRoot.appendChild(this.modal);

    // 4. Set up event handlers
    this.setupDragAndDrop();
    this.setupTitleEditing();
    this.setupModalHandling();
    this.setupRemoveButton();
  }

  setupDragAndDrop() {
    this.addEventListener('dragstart', (e) => {
      window._draggedCard = this;
      this.style.opacity = '0.4';
      this.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });

    this.addEventListener('dragend', () => {
      this.style.opacity = '';
      this.classList.remove('dragging');
      document.querySelectorAll('wcs-kanban-list')
        .forEach(list => list.classList.remove('drag-over'));
      window._draggedCard = null;
      this.notifyStateChange();
    });
  }

  setupTitleEditing() {
    const titleElement = this.shadowRoot.querySelector('.card-title');
    
    titleElement.addEventListener('blur', () => {
      const oldTitle = this.getAttribute('title');
      const newTitle = titleElement.textContent.trim() || 'New Task';
      
      debugLog('Card title change:', {
        id: this.getAttribute('id'),
        oldTitle,
        newTitle
      });
      
      if (oldTitle !== newTitle) {
        this.setAttribute('title', newTitle);
        titleElement.textContent = newTitle;
        
        requestAnimationFrame(() => {
          debugLog('Saving state after title change:', {
            id: this.getAttribute('id'),
            title: newTitle
          });
          this.notifyStateChange();
        });
      } else if (!newTitle) {
        titleElement.textContent = oldTitle || 'New Task';
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
  }

  setupModalHandling() {
    this.addEventListener('click', (e) => {
      if (!e.target.closest('.remove-card')) {
        const description = this.getAttribute('description') || '';
        this.modal.open(description);
      }
    });

    this.modal.addEventListener('save', (e) => {
      this.setAttribute('description', e.detail.description);
      this.updateDescriptionPreview(e.detail.description);
      // Close modal after saving description
      if (e.detail.closeModal) {
        this.modal.close();
      }
      this.notifyStateChange();
    });

    // Initialize description preview if exists
    const initialDescription = this.getAttribute('description');
    if (initialDescription) {
      this.updateDescriptionPreview(initialDescription);
    }
  }

  updateDescriptionPreview(description) {
    const previewEl = this.shadowRoot.querySelector('.card-description');
    if (description && description.trim()) {
      previewEl.textContent = description;
    } else {
      previewEl.textContent = '';
    }
  }

  setupRemoveButton() {
    this.shadowRoot.querySelector('.remove-card').addEventListener('click', (e) => {
      e.stopPropagation();
      this.remove();
      this.notifyStateChange();
    });
  }

  notifyStateChange() {
    debugLog('Card state change:', {
      id: this.getAttribute('id'),
      title: this.getAttribute('title')
    });
    
    // Find parent board and trigger state save
    const board = findParentBoard(this);
    if (board) {
      // Ensure DOM is updated before saving
      requestAnimationFrame(() => {
        debugLog('Saving board state after card update');
        board.saveState();
      });
    } else {
      console.error('Could not find parent board for card:', this.getAttribute('id'));
    }
  }
}

customElements.define('wcs-kanban-card', WcsKanbanCard);

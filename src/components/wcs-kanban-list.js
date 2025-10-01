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
import { debugLog, findParentBoard, generateId } from '../utils.js';

export class WcsKanbanList extends HTMLElement {
  static get observedAttributes() {
    return ['title'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Track original title for Escape handling
    this._originalTitle = '';
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'title' && this.shadowRoot && oldValue !== newValue) {
      console.log('List attribute changed:', oldValue, '->', newValue);
      const titleElement = this.shadowRoot.querySelector('.list-title');
      if (titleElement) {
        titleElement.textContent = newValue || 'New List';
        console.log('Updated title element to:', titleElement.textContent);
      }
    }
  }

  connectedCallback() {
    if (!this.hasAttribute('title')) {
      this.setAttribute('title', 'New List');
    }
    const title = this.getAttribute('title');

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
        .list-title {
          margin: 0;
          padding: 2px 4px;
          border-radius: 3px;
          font-size: 1.17em;
          font-weight: bold;
          min-width: 50px;
        }
        .list-title:hover {
          background: #e0e0e0;
          cursor: text;
        }
        .list-title:focus {
          background: #fff;
          outline: 2px solid #0066cc;
          cursor: text;
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
        <div class="list-title" contenteditable="true">${title}</div>
        <button class="remove-list" title="Remove List">×</button>
      </div>
      <div id="cards"></div>
      <button id="add-card">+ Add Card</button>
    `;

    // Store initial title
    this._originalTitle = title;

    // Set up title editing
    const titleElement = this.shadowRoot.querySelector('.list-title');
    
    titleElement.addEventListener('focus', () => {
      this._originalTitle = this.getAttribute('title') || 'New List';
    });

    titleElement.addEventListener('blur', () => {
      const oldTitle = this.getAttribute('title');
      const newTitle = titleElement.textContent.trim() || 'New List';
      
      console.log(`Title blur event for list ${this.getAttribute('id')}:`, {
        oldTitle,
        newTitle,
        elementContent: titleElement.textContent,
        listElement: this.tagName,
        parentElement: this.parentNode ? this.parentNode.tagName : 'none'
      });
      
      // Ensure consistent state
      if (titleElement.textContent !== newTitle) {
        console.log('Normalizing title element content');
        titleElement.textContent = newTitle;
      }
      
      // Update attribute and notify changes
      if (oldTitle !== newTitle) {
        console.log('Title changed, updating attribute and notifying state');
        // Update attribute first
        this.setAttribute('title', newTitle);
        
        // Use requestAnimationFrame to ensure DOM is updated
        requestAnimationFrame(() => {
          console.log('Triggering state change notification');
          this.notifyStateChange();
        });
      }
    });

    titleElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        titleElement.blur();
      }
      if (e.key === 'Escape') {
        titleElement.textContent = this._originalTitle;
        titleElement.blur();
      }
    });

    this.shadowRoot
      .querySelector('#add-card')
      .addEventListener('click', () => this.addCard());

    this.shadowRoot
      .querySelector('.remove-list')
      .addEventListener('click', () => {
        const board = this.closest('wcs-kanban-board');
        if (board && board.removeList) {
          board.removeList(this);
        }
      });
      
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
        this.notifyStateChange();  // Save state after card is dropped
      }
    });
  }

  addCard() {
    const card = document.createElement('wcs-kanban-card');
    card.setAttribute('id', this.generateId());
    card.setAttribute('title', 'New Task');
    this.shadowRoot.querySelector('#cards').appendChild(card);
    this.notifyStateChange();
  }

  generateId() {
    return generateId();
  }

  notifyStateChange() {
    debugLog('State change notification for list:', this.getAttribute('id'));
    
    const board = findParentBoard(this);
    if (!board) {
      console.error('Could not find board component!');
      return;
    }

    // Queue state save after DOM updates
    requestAnimationFrame(() => {
      board.saveState();
    });
  }
}

customElements.define('wcs-kanban-list', WcsKanbanList);

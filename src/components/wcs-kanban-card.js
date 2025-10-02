/**
 * Implementation of Card Drag Operations from roadmap v1.2.0:
 * - Enable card dragging: Using HTML5 draggable attribute
 * - Set drag data and effects: Using dataTransfer API
 * - Animation and opacity during drag: Using CSS transitions
 */
import { debugLog, findParentBoard } from '../utils.js';

export class WcsKanbanCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

    connectedCallback() {
      const title = this.getAttribute('title') || 'New Task';
      this.draggable = true; // [Card Drag Operations] Enable dragging
      
      // [Card Drag Operations] Enable dragging and visual feedback
      this.addEventListener('dragstart', (e) => {
        window._draggedCard = this;  // [DOM Integration] Handle Shadow DOM boundaries
        this.style.opacity = '0.4';  // [Card Drag Operations] Animation during drag
        this.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';  // [Card Drag Operations] Set drag effect
      });

      this.addEventListener('dragend', () => {
        this.style.opacity = '';  // [Card Drag Operations] Reset animation
        this.classList.remove('dragging');
        document.querySelectorAll('wcs-kanban-list').forEach(list => {
          list.classList.remove('drag-over');  // [List Drop Zones] Clean up visual feedback
        });
        window._draggedCard = null;  // [DOM Integration] Clean up reference
        this.notifyStateChange(); // Save state after card is moved
      });

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
        const oldTitle = this.getAttribute('title');
        const newTitle = titleElement.textContent.trim() || 'New Task';
        
        debugLog('Card title change:', {
          id: this.getAttribute('id'),
          oldTitle,
          newTitle
        });
        
        // Update title if changed
        if (oldTitle !== newTitle) {
          // Update DOM and attributes
          this.setAttribute('title', newTitle);
          titleElement.textContent = newTitle;
          
          // Queue state save after DOM updates are complete
          requestAnimationFrame(() => {
            debugLog('Saving state after title change:', {
              id: this.getAttribute('id'),
              title: newTitle
            });
            this.notifyStateChange();
          });
        } else if (!newTitle) {
          // Restore title if empty
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

      // Remove button
      this.shadowRoot
        .querySelector('.remove-card')
        .addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent dragging when clicking remove
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

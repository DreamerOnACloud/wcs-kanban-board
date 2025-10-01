/**
 * Board state structure:
 * {
 *   lists: [
 *     {
 *       id: string,
 *       title: string,
 *       cards: [
 *         {
 *           id: string,
 *           title: string
 *         }
 *       ]
 *     }
 *   ]
 * }
 */
export class WcsKanbanBoard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Initialize state
    this.state = {
      lists: []
    };
    
    // Initialize board structure
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          min-height: 100vh;
          background: #f9f9f9;
        }
        #lists {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }
        .board-controls {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        #add-list, #clear-storage {
          height: fit-content;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        #add-list {
          background: #e0e0e0;
        }
        #add-list:hover {
          background: #d0d0d0;
        }
        #clear-storage {
          background: #ffebee;
          color: #c62828;
        }
        #clear-storage:hover {
          background: #ffcdd2;
        }
      </style>
      <div id="lists"></div>
      <div class="board-controls">
        <button id="add-list">+ Add List</button>
        <button id="clear-storage" title="Remove all lists and cards">Clear Board</button>
      </div>
    `;
  }

  connectedCallback() {
    // Set up event listeners
    this.shadowRoot
      .querySelector('#add-list')
      .addEventListener('click', () => this.addList());
    
    this.shadowRoot
      .querySelector('#clear-storage')
      .addEventListener('click', () => {
        if (confirm('Are you sure you want to clear the board? This will remove all lists and cards.')) {
          this.clearState();
        }
      });
    
    // Load initial state
    this.loadState();
  }

  /**
   * Clear all board state and localStorage
   */
  clearState() {
    try {
      // Clear localStorage first
      localStorage.removeItem('wcs-kanban-state');
      
      // Reset state
      this.state = { lists: [] };
      
      // Clear DOM
      const listsContainer = this.shadowRoot.querySelector('#lists');
      while (listsContainer.firstChild) {
        listsContainer.removeChild(listsContainer.firstChild);
      }

      // Force a save of the empty state
      this.saveState();
    } catch (err) {
      console.error('Failed to clear board state:', err);
    }
  }

  /**
   * Generate a unique ID for new items
   * @returns {string} Unique ID
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Save current board state to localStorage
   */
  saveState() {
    try {
      const state = {
        lists: Array.from(this.shadowRoot.querySelectorAll('wcs-kanban-list')).map(list => ({
          id: list.getAttribute('id') || this.generateId(),
          title: list.getAttribute('title') || 'New List',
          cards: Array.from(list.shadowRoot.querySelectorAll('wcs-kanban-card')).map(card => ({
            id: card.getAttribute('id') || this.generateId(),
            title: card.getAttribute('title') || 'New Task'
          }))
        }))
      };
      
      localStorage.setItem('wcs-kanban-state', JSON.stringify(state));
      this.state = state;
    } catch (err) {
      console.error('Failed to save board state:', err);
    }
  }

  /**
   * Load board state from localStorage
   */
  loadState() {
    try {
      const savedState = localStorage.getItem('wcs-kanban-state');
      if (!savedState) return;

      const state = JSON.parse(savedState);
      this.state = state;

      // Clear existing lists
      const listsContainer = this.shadowRoot.querySelector('#lists');
      listsContainer.innerHTML = '';

      // Create all lists first
      const lists = state.lists.map(listData => {
        const list = document.createElement('wcs-kanban-list');
        list.setAttribute('id', listData.id);
        list.setAttribute('title', listData.title || 'New List');
        return { list, cards: listData.cards };
      });

      // Add lists to DOM and wait for them to be ready
      lists.forEach(({ list, cards }) => {
        listsContainer.appendChild(list);
        // Add cards after list is in DOM and initialized
        requestAnimationFrame(() => {
          if (cards && cards.length) {
            cards.forEach(cardData => {
              const card = document.createElement('wcs-kanban-card');
              card.setAttribute('id', cardData.id);
              card.setAttribute('title', cardData.title || 'New Task');
              list.shadowRoot.querySelector('#cards').appendChild(card);
            });
          }
        });
      });
    } catch (err) {
      console.error('Failed to load board state:', err);
    }
  }

  /**
   * Add a new list to the board
   */
  addList() {
    const list = document.createElement('wcs-kanban-list');
    list.setAttribute('id', this.generateId());
    list.setAttribute('title', 'New List');
    this.shadowRoot.querySelector('#lists').appendChild(list);
    this.saveState();
  }

  /**
   * Remove a list from the board
   */
  removeList(list) {
    if (list && list.parentNode) {
      list.parentNode.removeChild(list);
      this.saveState();
    }
  }
}

customElements.define('wcs-kanban-board', WcsKanbanBoard);

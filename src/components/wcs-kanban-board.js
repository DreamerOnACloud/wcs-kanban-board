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
import { debugLog, generateId, saveBoardState, loadBoardState, clearBoardState } from '../utils.js';

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
      // Clear storage and state
      clearBoardState();
      this.state = { lists: [] };
      
      // Clear DOM
      const listsContainer = this.shadowRoot.querySelector('#lists');
      listsContainer.innerHTML = '';
      
      // Ensure empty state is saved
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
    return generateId();
  }

  /**
   * Save current board state to localStorage
   */
  saveState() {
    try {
      debugLog('Starting state save', {
        containerChildren: this.shadowRoot.querySelector('#lists').children.length,
        existingLists: Array.from(this.shadowRoot.querySelector('#lists').children)
          .filter(el => el.tagName.toLowerCase() === 'wcs-kanban-list')
          .map(list => ({
            id: list.getAttribute('id'),
            title: list.getAttribute('title')
          }))
      });
      
      // Get current lists from DOM
      const listsContainer = this.shadowRoot.querySelector('#lists');
      const listElements = Array.from(listsContainer.children)
        .filter(el => el.tagName.toLowerCase() === 'wcs-kanban-list');
      
      // Map to state structure
      const lists = listElements.map(list => {
        const titleElement = list.shadowRoot.querySelector('.list-title');
        const currentTitle = titleElement?.textContent.trim() || 'New List';
        
        // Sync title attribute if needed
        if (currentTitle !== list.getAttribute('title')) {
          list.setAttribute('title', currentTitle);
        }
        
        return {
          id: list.getAttribute('id') || generateId(),
          title: currentTitle,
          cards: Array.from(list.shadowRoot.querySelectorAll('wcs-kanban-card'))
            .map(card => ({
              id: card.getAttribute('id') || generateId(),
              title: card.getAttribute('title') || 'New Task'
            }))
        };
      });
      
      debugLog('Building board state', {
        listElements: listElements.length,
        mappedLists: lists.length,
        listIds: lists.map(l => l.id),
        listTitles: lists.map(l => l.title),
        cardCounts: lists.map(l => l.cards.length),
        totalCards: lists.reduce((sum, l) => sum + l.cards.length, 0),
        state: lists.map(l => ({
          id: l.id,
          title: l.title,
          cardCount: l.cards.length,
          cards: l.cards.map(c => ({ id: c.id, title: c.title }))
        }))
      });
      
      // Update and save state
      this.state = { lists };
      saveBoardState(this.state);
      
    } catch (err) {
      console.error('Failed to save board state:', err);
    }
  }

  /**
   * Load board state from localStorage
   */
  loadState() {
    try {
      const state = loadBoardState();
      if (!state || !state.lists) return;
      
      this.state = state;

      // Clear existing lists
      const listsContainer = this.shadowRoot.querySelector('#lists');
      listsContainer.innerHTML = '';

      // Create all lists first
      const lists = state.lists.map(listData => {
        console.log('LOAD - Creating list from stored data:', listData);
        const list = document.createElement('wcs-kanban-list');
        
        // Create with guaranteed values
        const id = listData.id || this.generateId();
        const title = listData.title || 'New List';
        
        // Set properties in order
        list.setAttribute('id', id);
        list.setAttribute('title', title);
        
        // Verify the list was created correctly
        console.log(`LOAD - List ${id} created with title:`, list.getAttribute('title'));
        
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

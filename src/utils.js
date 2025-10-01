/**
 * Debug mode flag - set to false to disable debug logging
 */
export const DEBUG = true;

/**
 * Debug logger that only logs if DEBUG is true
 */
export function debugLog(message, data) {
  if (DEBUG) {
    console.log(message, data);
  }
}

/**
 * Find the closest parent board component, handling shadow DOM traversal
 */
export function findParentBoard(element) {
  // Try direct parent first
  let board = element.closest('wcs-kanban-board');
  if (board) return board;

  // Traverse shadow DOM boundaries
  let node = element;
  while (node) {
    if (node.getRootNode() && node.getRootNode().host) {
      node = node.getRootNode().host;
      if (node.tagName.toLowerCase() === 'wcs-kanban-board') {
        return node;
      }
    } else {
      node = node.parentNode;
    }
  }
  return null;
}

/**
 * Generate a unique ID for new items
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Get the current board state from localStorage
 */
export function loadBoardState() {
  try {
    const savedState = localStorage.getItem('wcs-kanban-state');
    return savedState ? JSON.parse(savedState) : { lists: [] };
  } catch (err) {
    console.error('Failed to load board state:', err);
    return { lists: [] };
  }
}

/**
 * Save board state to localStorage
 */
export function saveBoardState(state) {
  try {
    localStorage.setItem('wcs-kanban-state', JSON.stringify(state));
    return true;
  } catch (err) {
    console.error('Failed to save board state:', err);
    return false;
  }
}

/**
 * Clear board state from localStorage
 */
export function clearBoardState() {
  try {
    localStorage.removeItem('wcs-kanban-state');
    return true;
  } catch (err) {
    console.error('Failed to clear board state:', err);
    return false;
  }
}
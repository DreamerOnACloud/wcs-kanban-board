# State Management Architecture

## Overview

The Kanban board implements a hybrid state management approach that balances performance, reliability, and user experience. This document explains the core architectural decisions around state management and persistence.

## Core Principles

### 1. DOM as Source of Truth

During active usage, the DOM serves as the source of truth for the application state. This means:

- Direct DOM manipulation for immediate UI updates
- State reads from DOM when saving to localStorage
- Avoids unnecessary recreation of DOM elements

### 2. localStorage as Persistence Layer

localStorage acts as a persistence mechanism between page loads, not as a primary state store:

- Full state is saved after each meaningful change
- State is only reloaded from localStorage on page load
- Serves as a backup and persistence mechanism

## Implementation Details

### State Flow

1. **Initial Load**
   - Load state from localStorage
   - Create initial DOM structure
   - Initialize event listeners

2. **During Usage**
   - Direct DOM updates for immediate changes
   - Save to localStorage after changes
   - No DOM recreation from localStorage during usage

3. **State Saving Process**
   - Read current state from DOM
   - Transform into serializable structure
   - Save to localStorage

### Why This Approach?

#### Benefits

1. **Performance**
   - Minimizes expensive DOM operations
   - No unnecessary element recreation
   - Maintains smooth user experience

2. **UI Stability**
   - Prevents flickering from DOM rebuilds
   - Maintains focus states and temporary UI states
   - Preserves smooth animations and transitions

3. **Developer Experience**
   - Clear, predictable state flow
   - Easy to debug (DOM reflects current state)
   - Simpler event handling

#### Alternative Considered

We considered rebuilding the DOM from localStorage after each change (similar to React's approach), but rejected it because:

- More computationally expensive
- Would cause UI flickering
- Could lose transient states (focus, hover, etc.)
- Unnecessary for our use case

## Usage Example

```javascript
// Adding a new list:
addList() {
    // 1. Direct DOM update
    const list = document.createElement('wcs-kanban-list');
    list.setAttribute('id', this.generateId());
    list.setAttribute('title', 'New List');
    this.shadowRoot.querySelector('#lists').appendChild(list);
    
    // 2. Save to localStorage (reading from DOM)
    this.saveState();
    
    // Note: We don't reload from localStorage here
}
```

## Best Practices

1. Always update DOM first, then save to localStorage
2. Read state from DOM when saving to localStorage
3. Only reload from localStorage on page load
4. Use debug logging to track state transitions
5. Maintain clear separation between DOM updates and persistence logic
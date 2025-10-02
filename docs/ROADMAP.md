# 🗺️ Project Roadmap

## Current Status (v1.0.0)

- Initial project setup
- Release workflow and documentation
- Basic board structure implemented

## Upcoming Features

### Core Features (MVP) - v1.1.0

- [x] Basic board structure
  - [x] `<kanban-board>` component with static layout
  - [x] `<kanban-list>` component
  - [x] `<kanban-card>` component
- [x] List Management
  - [x] Add new lists
  - [x] Remove lists
  - [x] Default list titles
- [x] Card Management
  - [x] Add cards to lists
  - [x] Edit card titles
  - [x] Remove cards

### Drag & Drop - v1.2.0

- [x] Card Drag Operations
  - [x] Enable card dragging
  - [x] Set drag data and effects
  - [x] Animation and opacity during drag
- [x] List Drop Zones
  - [x] Handle dragover and drop events
  - [x] Visual feedback for valid drop targets
  - [x] Smooth transitions for hover states
- [x] DOM Integration
  - [x] Handle Shadow DOM boundaries
  - [x] Maintain card state during moves
  - [x] Update parent-child relationships

### Data Persistence - v1.3.0

- [x] Local Storage
  - [x] Save board state
  - [x] Load board state
  - [x] Handle state updates
  - [x] Clear board functionality
  - [x] Error handling and validation

### Polish & Enhancements - v1.4.0

- [ ] Card Details Modal
  - [ ] Description field
    - [ ] Rich text editor integration
    - [ ] Markdown support
    - [ ] Auto-save functionality
  - [ ] Due date picker
    - [ ] Calendar widget
    - [ ] Date validation
    - [ ] Overdue indicators
  - [ ] Tag system
    - [ ] Custom tag creation
    - [ ] Color selection
    - [ ] Tag filtering
- [ ] Responsive Design
  - [ ] Mobile-friendly layout
    - [ ] Collapsible lists
    - [ ] Touch-friendly spacing
    - [ ] Responsive typography
  - [ ] Touch interactions
    - [ ] Swipe gestures for cards
    - [ ] Long-press for context menu
    - [ ] Pinch-to-zoom board view
- [ ] User Experience
  - [ ] Loading states
    - [ ] Skeleton loading for lists
    - [ ] Progressive content load
  - [ ] Error handling
    - [ ] Friendly error messages
    - [ ] Auto-recovery options
  - [ ] Performance optimizations
    - [ ] Lazy loading for cards
    - [ ] State management improvements

## Future Ideas (Backlog)

### UI Enhancements

- [ ] List Reordering
  - Drag-and-drop reordering of lists
- [ ] Theming System
  - Light/dark theme toggle
  - CSS custom properties for easy customization
- [ ] Animations
  - Smooth transitions for all interactions

### Data Management

- [ ] Import/Export
  - Export board as JSON
  - Import board from JSON
- [ ] Undo/Redo
  - Track action history
  - Revert changes

### Accessibility

- [ ] Keyboard Navigation
  - Full keyboard control
  - Focus management
- [ ] Screen Reader Support
  - ARIA labels
  - Semantic markup

## Release Schedule

### Q4 2025

- October: v1.1.0 - Core Features
- November: v1.2.0 - Drag & Drop
- December: v1.3.0 - Data Persistence

### Q1 2026

- January: v1.4.0 - Polish & Enhancements
- February+: Future enhancements from backlog

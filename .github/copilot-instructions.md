# Copilot Instructions for wcs-kanban-board

## Project Overview
- This is a minimal Kanban board built with vanilla Web Components (no frameworks).
- Main components are in `src/components/`:
  - `wcs-kanban-board.js`: Board container, manages lists.
  - `wcs-kanban-list.js`: List/column, manages cards.
  - `wcs-kanban-card.js`: Task card.
  - `wcs-kanban-modal.js`: Modal for card details/editing.
- Entry point: `index.html` loads `<wcs-kanban-board>`, which dynamically creates lists and cards.
- All components use Shadow DOM for encapsulation.

## Developer Workflows
- **Dev server:** `npm run dev` (uses Vite, hot reload)
- **Build:** `npm run build`
- **Preview:** `npm run preview`
- **Changelog:**
  - Generate: `npm run changelog`
  - Dry run: `npm run changelog:dry`
  - Init: `npm run changelog:init`
- **Release:**
  - Patch: `npm run release`
  - Minor: `npm run release:minor`
  - Major: `npm run release:major`

## Key Patterns & Conventions
- **Component creation:**
  - Lists/cards are created dynamically via JS (see `addList`/`addCard` methods).
  - Default titles: "New List" and "New Task" if none provided.
- **Styling:**
  - All styles are scoped in Shadow DOM.
  - Shared styles in `src/styles.css`.
- **No external state management:**
  - State is local to each component; no global store.
- **Extensibility:**
  - Add new features by extending existing components or creating new ones in `src/components/`.

## Integration Points
- No backend/API integration by default.
- All data is in-memory and lost on reload.
- To persist data, add localStorage or backend logic in board/list components.

## Example Usage
```html
<wcs-kanban-board></wcs-kanban-board>
```
Lists and cards are added via UI buttons or by manipulating DOM in JS.

## References
- See `README.md` for setup and usage.
- See `package.json` for available scripts.
- See `src/components/` for component logic and patterns.

---
**For AI agents:**
- Follow the modular component pattern and use Shadow DOM for new elements.
- Use the provided scripts for builds and releases.
- Keep logic simple and vanilla JS unless otherwise specified.
- Document new conventions in this file for future agents.

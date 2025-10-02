# 🐛 Known Bugs

## Active Issues

### Modal Component

- [ ] Modal buttons duplicate event handling
  - **Description**: Modal save/close buttons sometimes trigger multiple times due to event bubbling through the modal content div
  - **Impact**: Low - Functionally non-breaking as state updates are idempotent
  - **Reproduction**:
    1. Open any card to show the modal
    2. Click Save or Close button
    3. Observe multiple console logs for close events
  - **Root Cause**:
    - Event listener on `.modal` div catches bubbled events
    - Both the button and container trigger the same handler
  - **Status**: In Progress
  - **Workaround**: Events are idempotent, so no user impact
  - **Component**: `wcs-kanban-modal.js`

### Data Persistence

- [x] ~~Task title changes don't always persist~~ *(Fixed)*
  - **Description**: ~~Title updates for tasks (cards) are inconsistently saved to localStorage~~
  - **Impact**: ~~Medium - User data could be lost on page refresh~~
  - **Reproduction**: *(No longer reproducible)*
    1. ~~Add a new card to any list~~
    2. ~~Edit the card's title~~
    3. ~~Refresh the page -> Title change is lost~~
    4. ~~However: If you drag-drop the card after editing its title, then refresh -> Title change persists~~
  - ~~**Root Cause**~~:
    - ~~Card component not notifying parent list/board of title changes~~
    - ~~State save only happens on drag-drop and list-level changes~~
    - ~~Missing state change propagation from card to board~~
  - **Resolution**: Fixed by implementing proper DOM update sequence and state change propagation

### UI/UX Issues

- [x] ~~List deletion ("×" button) non-functional~~ *(Fixed)*
  - **Description**: ~~The "×" button in list headers doesn't trigger list removal~~
  - **Impact**: ~~High - Users cannot delete lists through UI~~
  - ~~**Possible Causes**~~:
    - ~~Event listener not properly attached~~
    - ~~Event not propagating through shadow DOM~~
    - ~~removeList method not being called~~
  - **Resolution**: Fixed by using findParentBoard utility to properly traverse shadow DOM

## How to Report New Bugs

1. Check if the bug is already listed above
2. If not, open a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Any relevant error messages
   - Browser/environment details

## Recently Fixed

### Fixed: Card Title Persistence

- [x] Task title changes not persisting consistently

### Fixed: List Deletion

- [x] List deletion button not working
  - **Issue**: The "×" button in list headers wasn't triggering list removal
  - **Fix**: Used findParentBoard utility for proper shadow DOM traversal
  - **Details**: 
    - Same root cause as card title persistence issue
    - Updated event handler to properly find parent board
    - Added debug logging for better troubleshooting
  - **Fixed in**: October 2, 2025
  - **Issue**: Card title updates were lost on page refresh unless the card was dragged
  - **Fix**: Added proper DOM update sequence with requestAnimationFrame
  - **Details**: 
    - Ensure DOM updates complete before state saves
    - Use findParentBoard utility for reliable board lookup
    - Added debug logging for better state change tracking
  - **Fixed in**: October 2, 2025

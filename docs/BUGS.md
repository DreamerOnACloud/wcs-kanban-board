# 🐛 Known Bugs

## Active Issues

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

- [ ] List deletion ("×" button) non-functional
  - **Description**: The "×" button in list headers doesn't trigger list removal
  - **Impact**: High - Users cannot delete lists through UI
  - **Possible Causes**:
    - Event listener not properly attached
    - Event not propagating through shadow DOM
    - removeList method not being called

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
  - **Issue**: Card title updates were lost on page refresh unless the card was dragged
  - **Fix**: Added proper DOM update sequence with requestAnimationFrame
  - **Details**: 
    - Ensure DOM updates complete before state saves
    - Use findParentBoard utility for reliable board lookup
    - Added debug logging for better state change tracking
  - **Fixed in**: October 2, 2025

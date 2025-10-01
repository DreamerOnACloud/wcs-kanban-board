# 🐛 Known Bugs

## Active Issues

### Data Persistence

- [ ] Task title changes don't always persist
  - **Description**: Title updates for tasks (cards) are inconsistently saved to localStorage
  - **Impact**: Medium - User data could be lost on page refresh
  - **Possible Causes**:
    - State update not triggered for card title changes
    - Race condition in save operations
    - Card component not properly notifying parent list/board

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

No bugs have been fixed yet. This section will be updated as bugs are resolved.

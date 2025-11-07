```markdown
# Drag-and-Drop Kanban Board

A fully accessible, reusable Kanban board for task management. Supports dynamic columns and cards
with CRUD operations, and live announcements for screen readers. State persists via localStorage.

![Kanban Board Screenshot](https://kanban-modolos.vercel.app/demo.png)

## Features

-  **Dynamic Columns**: Add, rename, or delete columns (e.g., "TO DO", "IN PROGRESS", "DONE") with
   confirmation modals.
-  **Rich Cards**: Title, description, assignee (dropdown), priority (high/medium/low),
   estimated/logged hours, due date, tags, avatars, and status (BILLABLE, Submitted, etc.).
-  **Drag & Drop**:
   -  Mouse: Reorder within columns or move across (with visual overlay).
   -  Keyboard: Space/Enter to grab/drop, arrows to move/reorder/cross-column, Esc to cancel.
-  **Persistence**: In-memory state with localStorage sync—order survives refresh.
-  **Accessibility (WCAG AA)**: ARIA attributes (`aria-grabbed`, `aria-dropeffect`), focus outlines,
   live region announcements (e.g., "Moved 'Task X' to 'IN PROGRESS' position 2"), keyboard
   navigation, and screen reader instructions.
-  **Reusable Components**: `<DraggableList />` for lists/cards (generic, accepts `renderItem` and
   `onReorder` props—no Kanban-specific logic).
-  **UI Polish**: Tailwind styling, stats cards (open today, overdue, done this week), search/filter
   by status/assignee/title, modals for edits.
-  **Sample Data**: Pre-loaded with 9 cards across 3 columns, including assignees like "Dana Lee"
   and statuses like "BILLABLE".

Meets acceptance scenarios: Mouse/keyboard drags, column CRUD, announcements, and persistence.

## Tech Stack

-  **Frontend**: React 18 + Next.js 14 (App Router), TypeScript.
-  **Styling**: Tailwind CSS.
-  **State**: React Context.
-  **Drag & Drop**: Native HTML5 (no external libs for lightweight, accessible implementation).
-  **Utils**: Lucide React (icons), class-variance-authority (cn for Tailwind variants).
-  **Deployment**: Docker (multi-stage build for production).

## Project Structure
```

. ├── components/ │ ├── ui/ # Reusable primitives (Button, Input, Select, Textarea) │ ├── board/ #
Core board UI (Board, Card, Column, BoardHeader, etc.) │ ├── draggable/ # Drag system
(DraggableItem, DraggableList, DragOverlay, DroppableZone) │ └── modals/ # Overlays (CardModals,
ColumnModal, DeleteConfirmModal) ├── lib/ # Types (Board, Card, Column), utils (cn, colors) ├──
context/ # BoardContext (state management) ├── data/ # initialBoard.ts (sample data) ├── app/ #
Next.js pages/layout (or pages/ if Pages Router) ├── Dockerfile # Multi-stage Docker build ├──
docker-compose.yml # Single-command deployment └── ... (package.json, next.config.js)

```

## Quick Start

### Local Development

1. Clone/Fork the repo.
2. Install dependencies:
```

npm install

```
3. Run dev server:
```

npm run dev

```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```

npm run build npm start

```

### Docker Deployment

1. Ensure `next.config.js` has `output: 'standalone'`.
2. **Option A: Using Docker Compose** (build from source):
```

docker-compose up --build

```
3. **Option B: Pull & Run Pre-Built Image** (faster—no build needed):
```

docker pull johnossaidev/kanban-app:latest docker run -p 3000:3000 johnossaidev/kanban-app:latest

```
4. Access: [http://localhost:3000](http://localhost:3000).
- Single container, no external deps. Stops with Ctrl+C; persists via localStorage.

## Usage

- **Add Card**: Click "+" in column header → Modal with form (title, desc, assignee, priority,
etc.).
- **Edit/Delete**: Click card (Enter for keyboard) → Modal; trash icon for delete (confirm).
- **Drag**: Mouse-drag cards between columns; keyboard: Tab to card → Space (grab) → Arrows (move)
→ Space (drop).
- **Filter/Search**: Use top inputs to filter by status/assignee or search titles.
- **Announcements**: Screen reader (NVDA/VoiceOver) reads moves/edits via live region.

Sample data loads on startup: 3 columns with 9 HR-themed tasks (e.g., "Update vendor contract SLA").

## Accessibility Notes

- **Keyboard Full**: Tab-focusable items, arrow reordering, grab/drop with Space/Enter/Esc.
- **ARIA**: `role="region"` for zones, `aria-grabbed` for items, `aria-live="polite"` for
announcements.
- **Contrast/Focus**: Tailwind defaults meet WCAG AA; visible rings on focus.
- Tested with: Lighthouse (A11y score 95+), NVDA (announcements fire on drag).

## Evaluation Context

This implements **Option 2: Drag-and-Drop Kanban Board** from the Modolos HR Frontend Technical
Task. Focus: Reusability (`<DraggableList />`), accessibility (keyboard/ARIA/live regions), and
clean structure (separation of concerns via props/context). No external DND libs for native control.

---
```

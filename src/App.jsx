import { useState, useEffect } from 'react';

/**
 * Vibecoding Project Tracker — starter scaffold.
 *
 * This file is intentionally almost empty. The boilerplate (Vite, React,
 * Tailwind) is configured for you, plus a few shared constants and a
 * localStorage helper. Everything visible on screen, you build.
 *
 * Where to start (build sequence in Phase 3):
 *   - M4  data-model    : render the four columns and the task cards below.
 *   - M5  crud-modal    : add the "+" button modal and the edit-on-click modal.
 *   - M6  tag-style     : feature vs. bug color coding (uses DESIGN.md §2 colors).
 *   - M7  task-owner    : assignee badge + "Hand off to..." dropdown.
 *   - M8  due-tint      : color cards by due date (uses DESIGN.md §2 due-state colors).
 *   - M9  context       : a curated Context briefing field on the modal.
 *   - M10 copy-prompt   : a "Copy as Prompt Context" button that serializes the task + context.
 *   - M11 anchors       : the Anchor Board above the Kanban.
 *   - M12 secret-sauce  : the one open-ended thing that makes your tracker yours.
 *
 * Search the file for `TODO M<n>` to find the right hook for each milestone.
 */

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {'feature'|'bug'} type
 * @property {'todo'|'in-progress'|'review'|'done'} status
 * @property {string} assignee
 * @property {string|null} dueDate     ISO 'YYYY-MM-DD'
 * @property {string} createdDate      ISO 'YYYY-MM-DD'
 */

// The four columns of the board, in render order.
// Use these IDs everywhere — do not invent new ones.
export const STAGES = [
  { id: 'todo', label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
];

// Replace these placeholders with the three names from PRD §8 before M4.
// They become the only valid values for `Task.assignee`.
export const TEAM = ['Elias Tanzer', 'Tom Troll'];

const SEED_TASKS = [
  {
    id: 't1',
    title: 'Setup Vite project',
    description: 'Initialize Vite with React and TailwindCSS.',
    type: 'feature',
    status: 'done',
    assignee: 'Elias Tanzer',
    dueDate: '2026-06-01',
    createdDate: '2026-05-30',
  },
  {
    id: 't2',
    title: 'Design system + voice',
    description: 'Draft DESIGN.md and configure Tailwind theme colors.',
    type: 'feature',
    status: 'in-progress',
    assignee: 'Tom Troll',
    dueDate: '2026-06-12',
    createdDate: '2026-06-10',
  },
  {
    id: 't3',
    title: 'Data model & Kanban view',
    description: 'Implement M4 requirements: columns and task cards.',
    type: 'feature',
    status: 'todo',
    assignee: 'Elias Tanzer',
    dueDate: '2026-06-15',
    createdDate: '2026-06-10',
  },
  {
    id: 't4',
    title: 'Fix responsive layout on board',
    description: 'Board columns are squished on small screens.',
    type: 'bug',
    status: 'todo',
    assignee: 'Tom Troll',
    dueDate: null,
    createdDate: '2026-06-10',
  }
];

/**
 * A tiny localStorage hook — survives reloads, no library needed.
 *
 * Usage:
 *   const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', []);
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw != null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota or private-mode error — silently ignore for hackathon */
    }
  }, [key, value]);

  return [value, setValue];
}

export default function App() {
  // TODO M4 data-model:
  const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', SEED_TASKS);
  //
  // TODO M5 crud-modal:
  //   const [editing, setEditing] = useState(null);
  //
  // TODO M11 anchors:
  //   const [anchors, setAnchors] = useLocalStorage('vibetracker.anchors', [...]);

  return (
    <div className="min-h-screen p-6">
      <header className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Vibecoding Project Tracker
          </h1>
          <p className="text-sm text-slate-500">
            {/* Replace this line with your team name from PRD §11. */}
            BoraBoraBass
          </p>
        </div>
      </header>

      {/* TODO M11 anchors: render the Anchor Board (Presentation / Demo / Report / Documentation) above the board. */}

      {/*
        TODO M5 crud-modal:
          Add a "+" button that opens a modal with every Task field.
          Clicking a card should open the same modal in edit mode.
      */}
      <main className="flex gap-4 min-h-[calc(100vh-120px)]">
        {STAGES.map(stage => (
          <div key={stage.id} className="flex-1 flex flex-col rounded-lg bg-slate-100 p-4 border border-slate-200">
            <h2 className="font-semibold text-slate-700 mb-4">{stage.label}</h2>
            <div className="flex-1 flex flex-col gap-3">
              {tasks.filter(t => t.status === stage.id).map(task => (
                <div key={task.id} className="bg-white p-3 rounded shadow-sm border border-slate-200 flex flex-col gap-2 hover:shadow-md transition-shadow">
                  <span className="font-medium text-slate-800">{task.title}</span>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded border border-slate-200 text-slate-600">{task.assignee}</span>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{task.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

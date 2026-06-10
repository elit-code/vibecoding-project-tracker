import { useState, useEffect } from 'react';
import tailwindConfig from '../tailwind.config.js';

const themeColors = tailwindConfig.theme.extend.colors;

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

function getInitials(name) {
  if (!name) return '??';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
}

function getDueDateState(task) {
  if (task.status === 'done') return 'neutral';
  if (!task.dueDate) return null;

  const now = new Date();
  const due = new Date(task.dueDate + 'T23:59:59');
  const diffTime = due.getTime() - now.getTime();
  const diffHours = diffTime / (1000 * 60 * 60);

  if (diffTime < 0) {
    return 'overdue';
  }
  if (diffHours <= 24) {
    return 'warning';
  }
  // All other active tasks due in more than 24 hours are calm (safe)
  return 'safe';
}

function formatDueDate(dueDateStr) {
  if (!dueDateStr) return '';
  const date = new Date(dueDateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getDueDateBadgeText(task) {
  if (!task.dueDate) return '';

  const state = getDueDateState(task);
  if (task.status === 'done') {
    return `Done (${formatDueDate(task.dueDate)})`;
  }

  const formatted = formatDueDate(task.dueDate);
  if (state === 'overdue') {
    return `Overdue (${formatted})`;
  }

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  if (task.dueDate === todayStr) {
    return `Today (${formatted})`;
  } else if (task.dueDate === tomorrowStr) {
    return `Tomorrow (${formatted})`;
  }

  return formatted;
}

function getDueDateCardStyles(task) {
  const state = getDueDateState(task);
  if (!state) return 'bg-white border-slate-200';

  switch (state) {
    case 'safe':
      return 'bg-due-safe/10 border-due-safe/30';
    case 'warning':
      return 'bg-due-warning/20 border-due-warning/40';
    case 'overdue':
      return 'bg-due-overdue/20 border-due-overdue/40';
    case 'neutral':
      return 'bg-due-neutral/10 border-due-neutral/30';
    default:
      return 'bg-white border-slate-200';
  }
}

function getDueDateBadgeStyles(task) {
  const state = getDueDateState(task);
  if (!state) return 'bg-slate-100 border-slate-200 text-slate-600';

  switch (state) {
    case 'safe':
      return 'bg-due-safe border-due-safe text-slate-900 font-bold shadow-sm';
    case 'warning':
      return 'bg-due-warning border-due-warning text-slate-900 font-bold shadow-sm';
    case 'overdue':
      return 'bg-due-overdue border-due-overdue text-red-950 font-extrabold animate-pulse shadow-md';
    case 'neutral':
      return 'bg-due-neutral border-due-neutral text-white font-bold shadow-sm';
    default:
      return 'bg-slate-100 border-slate-200 text-slate-600';
  }
}

function DueIcon({ state }) {
  if (state === 'overdue') {
    return (
      <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    );
  }
  if (state === 'warning') {
    return (
      <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }
  if (state === 'neutral') {
    return (
      <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }
  return (
    <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

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
function ContributorCard({ member, tasks }) {
  const memberTasks = tasks.filter(t => t.assignee === member);
  const totalTasks = memberTasks.length;
  const completedTasks = memberTasks.filter(t => t.status === 'done').length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // SVG parameters
  const size = 48;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2; // 22.5
  const circumference = 2 * Math.PI * radius; // ~141.37
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  const isCompleted = completionPercentage === 100 && totalTasks > 0;
  const hasTasks = totalTasks > 0;

  // 0% - 99%: distinct blue/teal progress color, 100%: success green
  const ringColor = !hasTasks
    ? 'stroke-slate-200'
    : isCompleted
      ? 'stroke-emerald-500'
      : 'stroke-blue-500';

  return (
    <div className="relative group cursor-pointer">
      <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm min-w-[220px] transition-all duration-200 hover:shadow-md hover:border-slate-300">
        {/* Ring & Initials Wrapper */}
        <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              className="stroke-slate-100"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Foreground progress */}
            {hasTasks && (
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                className={`${ringColor} transition-all duration-500 ease-in-out`}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            )}
          </svg>
          
          {/* Initials/Avatar inside the ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-[38px] h-[38px] rounded-full flex items-center justify-center font-bold text-xs shrink-0 select-none ${
              isCompleted 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' 
                : !hasTasks
                  ? 'bg-slate-50 text-slate-400'
                  : 'bg-blue-50 text-blue-700 border border-blue-100/50'
            }`}>
              {getInitials(member)}
            </div>
          </div>
          
          {/* Success checkmark badge overlay for 100% */}
          {isCompleted && (
            <span className="absolute bottom-0 right-0 bg-emerald-500 text-white rounded-full p-0.5 border-2 border-white shadow-sm flex items-center justify-center w-4 h-4 animate-scale-in">
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
          )}
        </div>

        {/* Text Metrics next to Ring */}
        <div className="flex flex-col">
          <span className="font-semibold text-sm text-slate-800">{member}</span>
          <span className="text-xs text-slate-500">
            {hasTasks
              ? `${completedTasks}/${totalTasks} completed (${completionPercentage}%)`
              : 'No tasks assigned'}
          </span>
        </div>
      </div>

      {/* Floating Tooltip on Hover */}
      <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center pointer-events-none transition-all duration-200">
        <div className="bg-slate-950/90 backdrop-blur-sm text-slate-200 text-xs rounded-lg py-2 px-3 shadow-xl border border-slate-800 text-center min-w-[180px]">
          <p className="font-semibold text-white mb-0.5">{member}</p>
          <p className="text-[11px] text-slate-400">
            {completedTasks} of {totalTasks} tasks completed
          </p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-blue-500'}`} 
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-mono">
            {completionPercentage}% Completion Rate
          </p>
        </div>
        <div className="w-2.5 h-2.5 bg-slate-950/90 border-r border-b border-slate-800 transform rotate-45 -mt-1.5" />
      </div>
    </div>
  );
}

function FeatureIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function BugIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      {/* Head */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6a3 3 0 00-3 3v1h6V9a3 3 0 00-3-3z" />
      {/* Antennas */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6c0-1.5-1-2-1.5-2M15 6c0-1.5 1-2 1.5-2" />
      {/* Body */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 10h6v6a3 3 0 01-6 0v-6z" />
      {/* Legs */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 11h3M15 11h3M5 14h4M15 14h4M6 17h3M15 17h3" />
    </svg>
  );
}

function timeAgo(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} d ago`;
}

function TaskModal({ task, onSave, onClose, onDelete }) {
  const [formData, setFormData] = useState(() => {
    if (task) return { ...task };
    return {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
      title: '',
      description: '',
      type: 'feature',
      status: 'todo',
      assignee: TEAM[0],
      dueDate: '',
      createdDate: new Date().toISOString().split('T')[0],
      context: 'Background:\n\nConstraints:\n\nTried so far:\n\nPick up:\n',
      contextTool: '',
      contextUpdatedAt: null,
    };
  });

  const [modalCopied, setModalCopied] = useState(false);

  const handleModalCopyContext = () => {
    const title = formData.title || 'Untitled Task';
    const description = formData.description || 'No description provided.';
    const context = formData.context || 'No context provided.';

    const text = `# Task Briefing: ${title}

## Description
${description}

## Context
${context}`;

    navigator.clipboard.writeText(text).then(() => {
      setModalCopied(true);
      setTimeout(() => {
        setModalCopied(false);
      }, 2000);
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContextChange = (e) => {
    setFormData(prev => ({
      ...prev,
      context: e.target.value,
      contextUpdatedAt: new Date().toISOString()
    }));
  };

  const isFeature = formData.type === 'feature';
  const ringClass = isFeature
    ? 'focus:ring-2 focus:ring-feature focus:border-feature'
    : 'focus:ring-2 focus:ring-bug focus:border-bug';

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col max-h-full overflow-hidden">
        <div className={`h-1.5 w-full shrink-0 ${isFeature ? 'bg-feature' : 'bg-bug'}`} />
        <div className="flex justify-between items-center p-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className={isFeature ? 'text-feature' : 'text-bug'}>
              {isFeature ? <FeatureIcon className="w-5 h-5" /> : <BugIcon className="w-5 h-5" />}
            </span>
            {task ? 'Edit Task' : 'New Task'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl font-bold">✕</button>
        </div>

        <div className="p-4 overflow-y-auto flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className={`w-full border border-slate-300 rounded p-2 focus:outline-none ${ringClass}`} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className={`w-full border border-slate-300 rounded p-2 focus:outline-none h-24 ${ringClass}`} />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className={`w-full border border-slate-300 rounded p-2 focus:outline-none ${ringClass}`}>
                <option value="feature">Feature</option>
                <option value="bug">Bug</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className={`w-full border border-slate-300 rounded p-2 focus:outline-none ${ringClass}`}>
                {STAGES.map(stage => (
                  <option key={stage.id} value={stage.id}>{stage.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Assignee</label>
              <select name="assignee" value={formData.assignee} onChange={handleChange} className={`w-full border border-slate-300 rounded p-2 focus:outline-none ${ringClass}`}>
                {TEAM.map(member => (
                  <option key={member} value={member}>{member}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
              <input type="date" name="dueDate" value={formData.dueDate || ''} onChange={handleChange} className={`w-full border border-slate-300 rounded p-2 focus:outline-none ${ringClass}`} />
            </div>
          </div>

          {/* Context Section */}
          <div className="border-t border-slate-200 pt-4 mt-2">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <label className="block text-sm font-medium text-slate-700">Context</label>
                <button
                  type="button"
                  onClick={handleModalCopyContext}
                  className={`text-xs font-bold px-2 py-0.5 rounded transition-all duration-200 flex items-center gap-1 border ${modalCopied
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 border-slate-200'
                    }`}
                  title="Copy Context"
                >
                  {modalCopied ? (
                    <>
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      <span>Copy Context</span>
                    </>
                  )}
                </button>
              </div>
              {formData.contextUpdatedAt && (
                <span className="text-xs text-slate-400">
                  last updated {timeAgo(formData.contextUpdatedAt)}
                </span>
              )}
            </div>
            <textarea
              name="context"
              value={formData.context || ''}
              onChange={handleContextChange}
              className={`w-full border border-slate-300 rounded p-2 focus:outline-none h-32 font-mono text-sm ${ringClass}`}
              placeholder="Background / Constraints / Tried so far / Pick up"
            />
            <div className="mt-2 flex items-center gap-2">
              <label className="text-xs font-medium text-slate-500">AI Tool:</label>
              <select
                name="contextTool"
                value={formData.contextTool || ''}
                onChange={handleChange}
                className={`text-xs border border-slate-300 rounded p-1 focus:outline-none ${ringClass}`}
              >
                <option value="">None selected</option>
                <option value="Claude">Claude</option>
                <option value="ChatGPT">ChatGPT</option>
                <option value="Cursor">Cursor</option>
                <option value="Lovable">Lovable</option>
                <option value="Replit">Replit</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 flex justify-end gap-2">
          {task && (
            <button type="button" onClick={() => onDelete(task.id)} className="mr-auto px-4 py-2 text-red-600 hover:bg-red-50 rounded font-medium transition-colors">Delete</button>
          )}
          <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded font-medium transition-colors">Cancel</button>
          <button type="button" onClick={() => onSave(formData)} className={`px-4 py-2 text-white rounded font-medium transition-colors ${isFeature ? 'bg-feature hover:bg-emerald-600' : 'bg-bug hover:bg-red-700'
            }`}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  // TODO M4 data-model:
  const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', SEED_TASKS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Auto-refresh hook to ensure due-date tags color and texts update automatically in real-time
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(tick => tick + 1);
    }, 30000); // refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleOpenModal = (task = null) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingTask(null);
    setIsModalOpen(false);
  };

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      setTasks(tasks.map(t => t.id === taskData.id ? taskData : t));
    } else {
      setTasks([...tasks, taskData]);
    }
    handleCloseModal();
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId));
    handleCloseModal();
  };

  const handleHandoff = (e, taskId, newAssignee) => {
    e.stopPropagation();
    setTasks(tasks.map(t => t.id === taskId ? { ...t, assignee: newAssignee } : t));
  };

  const [anchors, setAnchors] = useLocalStorage('vibetracker.anchors', [
    { id: 'presentation', label: 'Presentation', url: '' },
    { id: 'demo', label: 'Demo', url: '' },
    { id: 'report', label: 'Report', url: '' },
    { id: 'documentation', label: 'Documentation', url: '' },
  ]);

  const handleAnchorChange = (id, newUrl) => {
    setAnchors(anchors.map(a => a.id === id ? { ...a, url: newUrl } : a));
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData("text/plain", taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, stageId) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    if (!taskId) return;

    setTasks(prevTasks => {
      const taskIndex = prevTasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return prevTasks;

      const task = prevTasks[taskIndex];
      const updatedTask = { ...task, status: stageId };
      const newTasks = [...prevTasks];
      newTasks.splice(taskIndex, 1);
      newTasks.push(updatedTask);

      return newTasks;
    });
  };

  return (
    <div className="min-h-screen p-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Vibecoding Project Tracker
          </h1>
          <p className="text-sm text-slate-500">
            {/* Replace this line with your team name from PRD §11. */}
            BoraBoraBass
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow transition-colors"
        >
          + Add Task
        </button>
      </header>

      {/* Contributors Overview */}
      <div className="mb-6">
        <h2 className="text-xs uppercase tracking-wider font-extrabold text-slate-400 mb-3 font-mono">
          Contributors Overview
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {TEAM.map(member => (
            <ContributorCard key={member} member={member} tasks={tasks} />
          ))}
        </div>
      </div>

      {/* Anchor Board */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {anchors.map(anchor => {
          const isFilled = anchor.url && anchor.url.trim().length > 0;
          return (
            <div key={anchor.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-2 transition-shadow hover:shadow-md">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-sm text-slate-800">{anchor.label}</span>
                <span className="flex items-center justify-center h-3 w-3" title={isFilled ? "Link active" : "No link"}>
                  {isFilled ? (
                    <span className="inline-flex rounded-full h-3 w-3 bg-feature"></span>
                  ) : (
                    <span className="inline-flex rounded-full h-3 w-3 border-2 border-slate-300 bg-transparent"></span>
                  )}
                </span>
              </div>
              <input
                type="url"
                placeholder="Paste URL..."
                value={anchor.url || ''}
                onChange={(e) => handleAnchorChange(anchor.id, e.target.value)}
                className="w-full text-xs border border-slate-300 rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>
          );
        })}
      </div>

      {/*
        TODO M5 crud-modal:
          Add a "+" button that opens a modal with every Task field.
          Clicking a card should open the same modal in edit mode.
      */}
      <main className="flex gap-4 min-h-[calc(100vh-120px)]">
        {STAGES.map(stage => (
          <div
            key={stage.id}
            className="flex-1 flex flex-col rounded-lg bg-slate-100 p-4 border border-slate-200"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            <h2 className="font-semibold text-slate-700 mb-4">{stage.label}</h2>
            <div className="flex-1 flex flex-col gap-3">
              {tasks
                .filter(t => t.status === stage.id)
                .sort((a, b) => {
                  if (!a.dueDate && !b.dueDate) return 0;
                  if (!a.dueDate) return 1;
                  if (!b.dueDate) return -1;
                  return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                })
                .map(task => {
                  const isFeature = task.type === 'feature';
                  const dueDateState = getDueDateState(task);
                  const cardStyles = getDueDateCardStyles(task);
                  const badgeStyles = getDueDateBadgeStyles(task);
                  const badgeText = getDueDateBadgeText(task);

                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onClick={() => handleOpenModal(task)}
                      className={`p-3 rounded shadow-sm border border-l-4 ${isFeature ? 'border-l-feature' : 'border-l-bug'} ${cardStyles} flex flex-col gap-2 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow relative group`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-medium text-slate-800 leading-tight">{task.title}</span>
                        <span className={`shrink-0 ${isFeature ? 'text-feature' : 'text-bug'}`}>
                          {isFeature ? <FeatureIcon className="w-4 h-4" /> : <BugIcon className="w-4 h-4" />}
                        </span>
                      </div>
                      {task.description && (
                        <p className="text-xs text-slate-500 line-clamp-2">{task.description}</p>
                      )}

                      {task.dueDate && (
                        <div className="flex items-center">
                          <span
                            style={{
                              backgroundColor: dueDateState === 'safe' ? themeColors['due-safe'] :
                                dueDateState === 'warning' ? themeColors['due-warning'] :
                                  dueDateState === 'overdue' ? themeColors['due-overdue'] :
                                    dueDateState === 'neutral' ? themeColors['due-neutral'] : '#f1f5f9',
                              color: dueDateState === 'overdue' ? '#7f1d1d' :
                                dueDateState === 'neutral' ? '#ffffff' : '#101415',
                              borderColor: dueDateState === 'safe' ? themeColors['due-safe'] :
                                dueDateState === 'warning' ? themeColors['due-warning'] :
                                  dueDateState === 'overdue' ? themeColors['due-overdue'] :
                                    dueDateState === 'neutral' ? themeColors['due-neutral'] : '#e2e8f0',
                            }}
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded border flex items-center shadow-sm ${dueDateState === 'overdue' ? 'animate-pulse shadow-md' : ''
                              }`}
                          >
                            <DueIcon state={dueDateState} />
                            {badgeText}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between items-end mt-1 gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold shrink-0" title={task.assignee}>
                            {getInitials(task.assignee)}
                          </div>
                          <select
                            value={task.assignee}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => handleHandoff(e, task.id, e.target.value)}
                            className="text-xs border-0 bg-transparent text-slate-600 focus:ring-0 p-0 cursor-pointer outline-none font-medium hover:text-slate-800 truncate"
                            title="Hand off to..."
                          >
                            {TEAM.map(member => (
                              <option key={member} value={member}>{member}</option>
                            ))}
                          </select>
                        </div>
                        <span
                          className={`text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded border ${isFeature
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-red-50 border-red-200 text-red-700'
                            }`}
                        >
                          {task.type}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </main>

      {isModalOpen && (
        <TaskModal
          task={editingTask}
          onSave={handleSaveTask}
          onClose={handleCloseModal}
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  );
}

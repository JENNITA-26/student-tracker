import React from 'react';
import { CheckCircle2, Circle, Pencil, Trash2, AlertCircle, Clock, BookOpen } from 'lucide-react';
import { formatDate, deadlineLabel, isOverdue, isDueToday } from '../utils/taskUtils';

const PRIORITY_BADGE = {
  High:   'bg-rose-100 text-rose-700 border border-rose-200',
  Medium: 'bg-amber-100 text-amber-700 border border-amber-200',
  Low:    'bg-emerald-100 text-emerald-700 border border-emerald-200',
};

export default function TaskCard({ task, onEdit, onDelete, onToggleStatus }) {
  const overdue = isOverdue(task);
  const dueToday = isDueToday(task);
  const completed = task.status === 'Completed';
  const dlLabel = deadlineLabel(task);

  return (
    <div
      className={`
        bg-white rounded-xl border shadow-card p-4 transition-all duration-200 group
        hover:shadow-soft hover:-translate-y-0.5
        ${completed ? 'border-slate-100 opacity-80' : overdue ? 'border-rose-200 bg-rose-50/30' : dueToday ? 'border-amber-200 bg-amber-50/30' : 'border-slate-100'}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Toggle status button */}
        <button
          id={`toggle-${task.id}`}
          onClick={() => onToggleStatus(task.id, task.status)}
          className={`mt-0.5 flex-shrink-0 transition-colors ${completed ? 'text-emerald-500 hover:text-emerald-600' : 'text-slate-300 hover:text-indigo-400'}`}
          title={completed ? 'Mark as pending' : 'Mark as completed'}
        >
          {completed
            ? <CheckCircle2 className="w-5 h-5" />
            : <Circle className="w-5 h-5" />
          }
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <h3 className={`text-sm font-semibold leading-snug ${completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
              {task.title}
            </h3>
            {/* Action buttons */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                id={`edit-${task.id}`}
                onClick={() => onEdit(task)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                title="Edit task"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                id={`delete-${task.id}`}
                onClick={() => onDelete(task)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Delete task"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {task.description && (
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{task.description}</p>
          )}

          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2 mt-2.5">
            {/* Subject */}
            {task.subject && (
              <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-medium border border-indigo-100">
                <BookOpen className="w-3 h-3" />
                {task.subject}
              </span>
            )}
            {/* Priority */}
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_BADGE[task.priority] || 'bg-slate-100 text-slate-600'}`}>
              {task.priority}
            </span>

            {/* Due date */}
            <span className={`flex items-center gap-1 text-xs ml-auto font-medium
              ${overdue ? 'text-rose-600 animate-urgent' : dueToday ? 'text-amber-600' : 'text-slate-400'}`}>
              {overdue && <AlertCircle className="w-3 h-3" />}
              {!overdue && <Clock className="w-3 h-3" />}
              {dlLabel || formatDate(task.due_date)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { todayStr } from '../utils/taskUtils';

const SUBJECTS = ['Mathematics', 'DSA', 'DBMS', 'Operating Systems', 'Computer Networks', 'Physics', 'Chemistry', 'English', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High'];

const emptyForm = {
  title: '',
  description: '',
  subject: 'Mathematics',
  due_date: todayStr(),
  priority: 'Medium',
  status: 'Pending',
};

export default function TaskForm({ open, task, onClose, onSubmit }) {
  const isEdit = Boolean(task?.id);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(task ? { ...emptyForm, ...task } : { ...emptyForm, due_date: todayStr() });
      setErrors({});
    }
  }, [open, task]);

  if (!open) return null;

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required.';
    if (!form.due_date) e.due_date = 'Due date is required.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setSaving(true);
    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim(),
        subject: form.subject,
        due_date: form.due_date,
        priority: form.priority,
        status: form.status,
      });
      onClose();
    } catch {
      // errors shown by hook toast
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-modal w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">
            {isEdit ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            id="task-form-close"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="e.g. Complete DSA assignment…"
              className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all
                ${errors.title ? 'border-rose-400 bg-rose-50' : 'border-slate-200 bg-slate-50 focus:bg-white'}`}
            />
            {errors.title && <p className="mt-1 text-xs text-rose-500">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea
              id="task-description"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={3}
              placeholder="Optional details about the task…"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all resize-none"
            />
          </div>

          {/* Subject + Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject</label>
              <select
                id="task-subject"
                value={form.subject}
                onChange={(e) => set('subject', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
              >
                {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Priority</label>
              <select
                id="task-priority"
                value={form.priority}
                onChange={(e) => set('priority', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
              >
                {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* Due date + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Due Date <span className="text-rose-500">*</span>
              </label>
              <input
                id="task-due-date"
                type="date"
                value={form.due_date}
                onChange={(e) => set('due_date', e.target.value)}
                className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all
                  ${errors.due_date ? 'border-rose-400 bg-rose-50' : 'border-slate-200 bg-slate-50 focus:bg-white'}`}
              />
              {errors.due_date && <p className="mt-1 text-xs text-rose-500">{errors.due_date}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
              <select
                id="task-status"
                value={form.status}
                onChange={(e) => set('status', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
              >
                <option>Pending</option>
                <option>Completed</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 text-sm font-medium text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              id="task-submit"
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-60"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

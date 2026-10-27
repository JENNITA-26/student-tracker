import React, { useState } from 'react';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import ConfirmDialog from './ConfirmDialog';
import SearchAndFilters, { defaultFilters } from './SearchAndFilters';
import EmptyState from './EmptyState';
import LoadingState from './LoadingState';
import { filterTasks, sortTasks } from '../utils/taskUtils';
import { Plus } from 'lucide-react';

/**
 * TaskList — renders a filtered, sorted list of tasks.
 * 
 * initialDateFilter: 'all' | 'today' | 'upcoming' | 'overdue'
 * initialStatus:     'All' | 'Pending' | 'Completed'
 * 
 * These set the starting filter state for the section.
 * The component is remounted (via key prop in App) when the section changes,
 * so initial values are always applied correctly.
 */
export default function TaskList({
  tasks, loading, onUpdate, onDelete, onToggleStatus, onCreate,
  initialDateFilter = 'all',
  initialStatus = 'All',
}) {
  const [filters, setFilters] = useState({
    ...defaultFilters,
    dateFilter: initialDateFilter,
    status: initialStatus,
  });

  const [editTask, setEditTask] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const openNew = () => { setEditTask(null); setFormOpen(true); };
  const openEdit = (t) => { setEditTask(t); setFormOpen(true); };

  const handleFormSubmit = async (data) => {
    if (editTask) {
      await onUpdate(editTask.id, data);
    } else {
      await onCreate(data);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteTarget) {
      await onDelete(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const visible = sortTasks(filterTasks(tasks, filters), filters.sortBy);

  const hasActiveFilters = filters.search
    || filters.dateFilter !== initialDateFilter
    || filters.subject !== 'All'
    || filters.priority !== 'All'
    || filters.status !== initialStatus;

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-4">
      <SearchAndFilters
        filters={filters}
        onChange={setFilters}
        defaultStatus={initialStatus}
        defaultDateFilter={initialDateFilter}
      />

      {visible.length === 0 ? (
        <EmptyState
          title="No tasks here"
          description={
            hasActiveFilters
              ? 'Try adjusting or clearing your filters.'
              : initialStatus === 'Completed'
              ? "You haven't completed any tasks yet. Keep going!"
              : initialDateFilter === 'today'
              ? "No tasks are due today. Enjoy your day! 🎉"
              : initialDateFilter === 'upcoming'
              ? "No upcoming tasks scheduled. Add one to plan ahead!"
              : 'Create your first task to get started!'
          }
          action={
            <button
              onClick={openNew}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create a Task
            </button>
          }
        />
      ) : (
        <div className="grid gap-3">
          {visible.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
              onToggleStatus={onToggleStatus}
            />
          ))}
        </div>
      )}

      <TaskForm
        open={formOpen}
        task={editTask}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Task?"
        message={`"${deleteTarget?.title}" will be permanently deleted.`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
} from '../services/taskService';

/**
 * useTasks — central hook for task state management.
 * Exposes tasks, loading/error states, and CRUD handlers.
 */
export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load tasks: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleCreate = async (taskData) => {
    try {
      const newTask = await createTask(taskData);
      setTasks((prev) => [newTask, ...prev]);
      toast.success('Task created successfully! 🎉');
      return newTask;
    } catch (err) {
      toast.error('Failed to create task: ' + err.message);
      throw err;
    }
  };

  const handleUpdate = async (id, updates) => {
    try {
      const updated = await updateTask(id, updates);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      toast.success('Task updated successfully!');
      return updated;
    } catch (err) {
      toast.error('Failed to update task: ' + err.message);
      throw err;
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success('Task deleted.');
    } catch (err) {
      toast.error('Failed to delete task: ' + err.message);
      throw err;
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const updated = await toggleTaskStatus(id, currentStatus);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      const msg = updated.status === 'Completed' ? '✅ Task completed!' : '🔄 Task reopened!';
      toast.success(msg);
      return updated;
    } catch (err) {
      toast.error('Failed to update status: ' + err.message);
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    reload: loadTasks,
    onCreate: handleCreate,
    onUpdate: handleUpdate,
    onDelete: handleDelete,
    onToggleStatus: handleToggleStatus,
  };
}

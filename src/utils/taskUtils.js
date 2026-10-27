/**
 * Date / task utility helpers.
 * All comparisons are done on YYYY-MM-DD strings to avoid timezone issues.
 */

/** Returns today as a YYYY-MM-DD string */
export function todayStr() {
  return new Date().toISOString().split('T')[0];
}

/** Returns a human-readable label for a due_date string */
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Number of calendar days between today and a due_date string (negative = overdue) */
export function daysUntil(dateStr) {
  if (!dateStr) return null;
  const today = new Date(todayStr());
  const [y, m, d] = dateStr.split('-').map(Number);
  const due = new Date(y, m - 1, d);
  return Math.round((due - today) / 86400000);
}

/** True if the task is past due AND not completed */
export function isOverdue(task) {
  if (task.status === 'Completed') return false;
  return daysUntil(task.due_date) < 0;
}

/** True if the task is due today */
export function isDueToday(task) {
  return task.due_date === todayStr();
}

/** Priority sort order mapping */
const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 };

/** Sort comparator factory */
export function sortTasks(tasks, sortBy) {
  const copy = [...tasks];
  switch (sortBy) {
    case 'due_date':
      return copy.sort((a, b) => (a.due_date || '').localeCompare(b.due_date || ''));
    case 'priority':
      return copy.sort(
        (a, b) => (PRIORITY_ORDER[a.priority] ?? 3) - (PRIORITY_ORDER[b.priority] ?? 3)
      );
    case 'created_at':
    default:
      return copy.sort((a, b) => b.created_at?.localeCompare(a.created_at || '') || 0);
  }
}

/** Filter tasks based on search text + filter options */
export function filterTasks(tasks, { search, subject, priority, status, dateFilter }) {
  const today = todayStr();
  return tasks.filter((t) => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (subject && subject !== 'All' && t.subject !== subject) return false;
    if (priority && priority !== 'All' && t.priority !== priority) return false;
    if (status && status !== 'All' && t.status !== status) return false;
    if (dateFilter === 'today') return t.due_date === today;
    // Upcoming: future due dates — can include completed tasks per user requirement
    if (dateFilter === 'upcoming') return t.due_date > today;
    if (dateFilter === 'overdue') return t.due_date < today && t.status !== 'Completed';
    return true;
  });
}

/** Compute dashboard statistics from a tasks array */
export function computeStats(tasks) {
  const today = todayStr();
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'Completed').length;
  const pending = tasks.filter((t) => t.status === 'Pending').length;
  const overdue = tasks.filter((t) => t.due_date < today && t.status === 'Pending').length;
  const dueToday = tasks.filter((t) => t.due_date === today).length;
  const completionPct = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { total, completed, pending, overdue, dueToday, completionPct };
}

/** Friendly "days remaining" label */
export function deadlineLabel(task) {
  if (task.status === 'Completed') return null;
  const days = daysUntil(task.due_date);
  if (days === null) return null;
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  return `${days}d left`;
}

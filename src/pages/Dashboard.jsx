import React from 'react';
import {
  ListChecks, CheckSquare, Clock, AlertCircle, CalendarCheck2, TrendingUp,
  Sparkles, Plus,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import { computeStats, filterTasks, sortTasks, todayStr, formatDate } from '../utils/taskUtils';

const MESSAGES = [
  'You\'ve got this! One task at a time. 🚀',
  'Stay focused — great things take time. 💪',
  'Progress, not perfection. Keep going! ✨',
  'Every completed task is a step forward. 🎯',
  'You\'re doing amazing — keep the momentum! 🌟',
];

export default function Dashboard({ tasks, loading, onEdit, onDelete, onToggleStatus, onNewTask }) {
  const stats = computeStats(tasks);
  const today = todayStr();
  const msg = MESSAGES[new Date().getDay() % MESSAGES.length];
  const todayTasks = sortTasks(filterTasks(tasks, { dateFilter: 'today', search: '', subject: 'All', priority: 'All', status: 'All' }), 'priority');
  const overdueTasks = filterTasks(tasks, { dateFilter: 'overdue', search: '', subject: 'All', priority: 'All', status: 'All' });

  const dateLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  if (loading) return <LoadingState message="Loading your dashboard…" />;

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">Good day!</p>
          </div>
          <h2 className="text-xl font-bold text-slate-800">{msg}</h2>
          <p className="text-sm text-slate-400 mt-0.5">{dateLabel}</p>
        </div>
        <button
          id="dashboard-new-task"
          onClick={onNewTask}
          className="self-start sm:self-center flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <StatCard label="Total Tasks" value={stats.total} icon={ListChecks} color="indigo" />
        <StatCard label="Pending" value={stats.pending} icon={Clock} color="amber" />
        <StatCard label="Completed" value={stats.completed} icon={CheckSquare} color="emerald" />
        <StatCard label="Overdue" value={stats.overdue} icon={AlertCircle} color="rose" />
        <StatCard label="Due Today" value={stats.dueToday} icon={CalendarCheck2} color="sky" />
        <StatCard label="Completion" value={`${stats.completionPct}%`} icon={TrendingUp} color="violet" />
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
        <ProgressBar pct={stats.completionPct} label="Overall Progress" />
        <p className="text-xs text-slate-400 mt-2">
          {stats.completed} of {stats.total} tasks completed
        </p>
      </div>

      {/* Overdue tasks */}
      {overdueTasks.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-semibold text-slate-700">Overdue Tasks</h3>
            <span className="text-xs font-bold bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full">{overdueTasks.length}</span>
          </div>
          <div className="grid gap-3">
            {overdueTasks.slice(0, 3).map((t) => (
              <TaskCard key={t.id} task={t} onEdit={onEdit} onDelete={onDelete} onToggleStatus={onToggleStatus} />
            ))}
          </div>
        </section>
      )}

      {/* Today's tasks */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <CalendarCheck2 className="w-4 h-4 text-sky-500" />
          <h3 className="text-sm font-semibold text-slate-700">Today's Tasks</h3>
          <span className="text-xs font-bold bg-sky-100 text-sky-600 px-2 py-0.5 rounded-full">{todayTasks.length}</span>
        </div>
        {todayTasks.length === 0 ? (
          <EmptyState
            title="Nothing due today"
            description="Enjoy a clear schedule — or add a task!"
          />
        ) : (
          <div className="grid gap-3">
            {todayTasks.map((t) => (
              <TaskCard key={t.id} task={t} onEdit={onEdit} onDelete={onDelete} onToggleStatus={onToggleStatus} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

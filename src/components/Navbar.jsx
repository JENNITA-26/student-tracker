import React from 'react';
import { Menu, Plus, RefreshCw } from 'lucide-react';

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  all: 'All Tasks',
  today: "Today's Tasks",
  upcoming: 'Upcoming Tasks',
  completed: 'Completed Tasks',
};

export default function Navbar({ currentPage, onMenuToggle, onNewTask, onRefresh, loading }) {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-slate-100 px-4 sm:px-6 h-16 flex items-center gap-4 shadow-sm">
      {/* Mobile hamburger */}
      <button
        id="btn-mobile-menu"
        onClick={onMenuToggle}
        className="lg:hidden p-2 -ml-1 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1">
        <h1 className="text-lg font-semibold text-slate-800">{PAGE_TITLES[currentPage] || 'Tasks'}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          id="btn-refresh"
          onClick={onRefresh}
          disabled={loading}
          title="Refresh tasks"
          className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>

        <button
          id="btn-new-task"
          onClick={onNewTask}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm hover:shadow"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Task</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>
    </header>
  );
}

import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const SUBJECTS = ['All', 'Mathematics', 'DSA', 'DBMS', 'Operating Systems', 'Computer Networks', 'Physics', 'Chemistry', 'English', 'Other'];
const PRIORITIES = ['All', 'High', 'Medium', 'Low'];
const STATUSES = ['All', 'Pending', 'Completed'];
const DATE_FILTERS = [
  { value: 'all', label: 'All Dates' },
  { value: 'today', label: 'Today' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'overdue', label: 'Overdue' },
];
const SORT_OPTIONS = [
  { value: 'created_at', label: 'Recently Added' },
  { value: 'due_date', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
];

const defaultFilters = {
  search: '',
  subject: 'All',
  priority: 'All',
  status: 'All',
  dateFilter: 'all',
  sortBy: 'created_at',
};

export { defaultFilters };

/**
 * SearchAndFilters
 * defaultDateFilter / defaultStatus are the section's baseline filters —
 * the "Clear" button resets back to them, not the global defaults.
 */
export default function SearchAndFilters({
  filters,
  onChange,
  defaultDateFilter = 'all',
  defaultStatus = 'All',
}) {
  const set = (key, val) => onChange({ ...filters, [key]: val });

  // "Clear" resets only the user-added extras — preserves the section baseline
  const reset = () => onChange({
    ...defaultFilters,
    dateFilter: defaultDateFilter,
    status: defaultStatus,
    sortBy: filters.sortBy,
  });

  // Show the Clear button only if the user has changed anything beyond the section defaults
  const hasActive =
    filters.search ||
    filters.subject !== 'All' ||
    filters.priority !== 'All' ||
    filters.status !== defaultStatus ||
    filters.dateFilter !== defaultDateFilter;

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-card p-4 space-y-3">
      {/* Search row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="search-tasks"
            type="text"
            value={filters.search}
            onChange={(e) => set('search', e.target.value)}
            placeholder="Search tasks…"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
          />
          {filters.search && (
            <button
              onClick={() => set('search', '')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        {hasActive && (
          <button
            id="btn-reset-filters"
            onClick={reset}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-rose-500 border border-rose-200 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors whitespace-nowrap"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap gap-2">
        <Select
          id="filter-date"
          value={filters.dateFilter}
          onChange={(v) => set('dateFilter', v)}
          options={DATE_FILTERS}
        />
        <Select
          id="filter-subject"
          value={filters.subject}
          onChange={(v) => set('subject', v)}
          options={SUBJECTS.map((s) => ({ value: s, label: s }))}
        />
        <Select
          id="filter-priority"
          value={filters.priority}
          onChange={(v) => set('priority', v)}
          options={PRIORITIES.map((p) => ({ value: p, label: p }))}
        />
        <Select
          id="filter-status"
          value={filters.status}
          onChange={(v) => set('status', v)}
          options={STATUSES.map((s) => ({ value: s, label: s }))}
        />
        <div className="flex items-center gap-1.5 ml-auto">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <Select
            id="sort-tasks"
            value={filters.sortBy}
            onChange={(v) => onChange({ ...filters, sortBy: v })}
            options={SORT_OPTIONS}
          />
        </div>
      </div>
    </div>
  );
}

function Select({ id, value, onChange, options }) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="text-sm border border-slate-200 rounded-lg px-2.5 py-2 bg-slate-50 text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all cursor-pointer"
    >
      {options.map((o) => (
        <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
      ))}
    </select>
  );
}

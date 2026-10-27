import React from 'react';
import {
  BookOpen, LayoutDashboard, ListChecks, CalendarClock,
  CalendarCheck2, CheckSquare, Menu, X, LogOut, User,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'all', label: 'All Tasks', icon: ListChecks },
  { id: 'today', label: "Today's Tasks", icon: CalendarClock },
  { id: 'upcoming', label: 'Upcoming', icon: CalendarCheck2 },
  { id: 'completed', label: 'Completed', icon: CheckSquare },
];

export default function Sidebar({ currentPage, onNavigate, user, onLogout, mobileOpen, onMobileClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-100 shadow-sm z-30
          flex flex-col transition-transform duration-300
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:shadow-none lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-800 tracking-tight">StudyTrack</span>
          </div>
          <button
            onClick={onMobileClose}
            className="lg:hidden p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <p className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Menu</p>
          <ul className="space-y-0.5">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
              const active = currentPage === id;
              return (
                <li key={id}>
                  <button
                    id={`nav-${id}`}
                    onClick={() => { onNavigate(id); onMobileClose(); }}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                      transition-all duration-150 group
                      ${active
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                    `}
                  >
                    <Icon
                      className={`w-4.5 h-4.5 flex-shrink-0 ${active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`}
                      size={18}
                    />
                    {label}
                    {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User / Logout */}
        {user && (
          <div className="px-3 py-4 border-t border-slate-100">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-50">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-700 truncate">{user.email}</p>
                <p className="text-xs text-slate-400">Student</p>
              </div>
              <button
                id="btn-logout"
                onClick={onLogout}
                title="Sign out"
                className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { supabase } from './lib/supabase';
import { useTasks } from './hooks/useTasks';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import TaskForm from './components/TaskForm';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Login from './pages/Login';
import Signup from './pages/Signup';
import LoadingState from './components/LoadingState';

export default function App() {
  const [session, setSession] = useState(undefined); // undefined = initializing
  const [authPage, setAuthPage] = useState('login');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [newTaskOpen, setNewTaskOpen] = useState(false);

  const { tasks, loading, reload, onCreate, onUpdate, onDelete, onToggleStatus } = useTasks();

  // Listen to auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentPage('dashboard');
  };

  // While Supabase is checking session
  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingState message="Initializing…" />
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    if (authPage === 'signup') return <Signup onSwitchToLogin={() => setAuthPage('login')} />;
    return <Login onSwitchToSignup={() => setAuthPage('signup')} />;
  }

  // Page content renderer
  // key={currentPage} forces TaskList to remount when the section changes,
  // ensuring initial filter state is always applied fresh per section.
  const renderPage = () => {
    const common = { tasks, loading, onUpdate, onDelete, onToggleStatus, onCreate };
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            key="dashboard"
            {...common}
            onEdit={() => {}}
            onNewTask={() => setNewTaskOpen(true)}
          />
        );
      case 'all':
        // Show ALL tasks — no date or status pre-filter
        return (
          <Tasks
            key="all"
            {...common}
            initialDateFilter="all"
            initialStatus="All"
          />
        );
      case 'today':
        // Only tasks whose due_date === today
        return (
          <Tasks
            key="today"
            {...common}
            initialDateFilter="today"
            initialStatus="All"
          />
        );
      case 'upcoming':
        // Tasks with due_date strictly after today (includes completed)
        return (
          <Tasks
            key="upcoming"
            {...common}
            initialDateFilter="upcoming"
            initialStatus="All"
          />
        );
      case 'completed':
        // Only tasks with status = Completed
        return (
          <Tasks
            key="completed"
            {...common}
            initialDateFilter="all"
            initialStatus="Completed"
          />
        );
      default:
        return <Dashboard key="dashboard" {...common} onEdit={() => {}} onNewTask={() => setNewTaskOpen(true)} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: { borderRadius: '12px', fontSize: '14px', fontFamily: 'Inter, sans-serif' },
        }}
      />

      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        user={session.user}
        onLogout={handleLogout}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Navbar
          currentPage={currentPage}
          onMenuToggle={() => setMobileSidebarOpen(true)}
          onNewTask={() => setNewTaskOpen(true)}
          onRefresh={reload}
          loading={loading}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-4xl mx-auto">
            {renderPage()}
          </div>
        </main>
      </div>

      {/* Global new task form */}
      <TaskForm
        open={newTaskOpen}
        task={null}
        onClose={() => setNewTaskOpen(false)}
        onSubmit={onCreate}
      />
    </div>
  );
}

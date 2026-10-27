# 📚 Student Task Manager

A modern, full-stack student productivity web app built with **React + Vite**, **Tailwind CSS**, and **Supabase** (PostgreSQL + Auth).

---

## ✨ Features

| Feature | Details |
|---|---|
| **Dashboard** | Live stats (total, pending, completed, overdue, due today, % complete) |
| **Task CRUD** | Create, view, edit, delete with confirmation dialogs |
| **Status toggle** | Mark complete / reopen with one click |
| **Overdue detection** | Calculated from current date — no stale flags |
| **Search & Filters** | Search by title; filter by subject, priority, status, date; sort by any field |
| **Sections** | Dashboard · All · Today · Upcoming · Completed |
| **Authentication** | Supabase Auth — email/password, session persistence, RLS-secured data |
| **Toast feedback** | Every action gives instant feedback (react-hot-toast) |
| **Responsive** | Works on mobile and desktop |

---

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Supabase

#### a) Create a Supabase project
Go to [https://supabase.com](https://supabase.com), create a new project, and note your **Project URL** and **anon/public key** (Settings → API).

#### b) Run the SQL setup script
Open **Supabase → SQL Editor**, paste the contents of [`supabase-setup.sql`](./supabase-setup.sql), and click **Run**.

This creates the `tasks` table, indexes, `updated_at` trigger, and RLS policies.

#### c) Enable Email Auth
Go to **Supabase → Authentication → Providers** and confirm **Email** is enabled.

> **Optional:** In **Authentication → Settings**, you can disable email confirmation for local development.

### 3. Set environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🗂️ Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── Sidebar.jsx
│   ├── Navbar.jsx
│   ├── StatCard.jsx
│   ├── TaskCard.jsx
│   ├── TaskForm.jsx
│   ├── TaskList.jsx
│   ├── SearchAndFilters.jsx
│   ├── ProgressBar.jsx
│   ├── ConfirmDialog.jsx
│   ├── EmptyState.jsx
│   └── LoadingState.jsx
├── pages/             # Full pages
│   ├── Dashboard.jsx
│   ├── Tasks.jsx
│   ├── Login.jsx
│   └── Signup.jsx
├── lib/
│   └── supabase.js    # Supabase client
├── services/
│   └── taskService.js # CRUD operations
├── hooks/
│   └── useTasks.js    # Task state management
├── utils/
│   └── taskUtils.js   # Date helpers, filter/sort/stat logic
├── App.jsx
├── main.jsx
└── index.css
```

---

## ✅ Manual Testing Checklist

- [ ] Sign up with a new email → receive confirmation or land on app
- [ ] Log in with email + password
- [ ] Create a task → appears in All Tasks list immediately
- [ ] Refresh the browser → task still appears (persisted in DB)
- [ ] Edit a task → changes saved and reflected
- [ ] Mark a task as completed → status toggles, dashboard counter updates
- [ ] Reopen a completed task
- [ ] Delete a task → confirmation dialog appears → task is removed
- [ ] Search tasks by title
- [ ] Filter by subject, priority, status, date range
- [ ] Sort by due date / priority / recently added
- [ ] Reset filters clears all active filters
- [ ] Overdue tasks highlighted in red on dashboard and task list
- [ ] Tasks due today highlighted in amber
- [ ] Dashboard stats match the actual task counts
- [ ] Progress bar reflects % completion
- [ ] Logout → redirected to login page
- [ ] Log in again → see only your own tasks (RLS working)
- [ ] Mobile: sidebar opens via hamburger, closes on navigation
- [ ] All toast notifications appear for create/edit/delete/complete

---

## 🏗️ Deploy to Vercel

```bash
npm run build
```

Then push to GitHub and import the repo in [vercel.com](https://vercel.com). Add the two environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in the Vercel project settings.

---

## ⚠️ Known Limitations

1. **Email verification**: By default Supabase requires email confirmation. You can disable this in Auth settings for development.
2. **No offline support**: Requires an active internet connection for Supabase operations.
3. **Single user per session**: No multi-account switching.
4. **No file attachments**: Tasks are text-only.

import { supabase } from '../lib/supabase';

/**
 * Fetch all tasks for the currently authenticated user,
 * ordered by creation date descending.
 */
export async function fetchTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Create a new task.
 * @param {Object} task - Task fields (title, description, subject, due_date, priority, status)
 */
export async function createTask(task) {
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('tasks')
    .insert([{ ...task, user_id: user?.id }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update an existing task by id.
 * @param {string} id - UUID of the task
 * @param {Object} updates - Fields to update
 */
export async function updateTask(id, updates) {
  const { data, error } = await supabase
    .from('tasks')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete a task by id.
 * @param {string} id - UUID of the task
 */
export async function deleteTask(id) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

/**
 * Toggle a task's status between 'Pending' and 'Completed'.
 * @param {string} id - UUID of the task
 * @param {string} currentStatus - Current status value
 */
export async function toggleTaskStatus(id, currentStatus) {
  const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
  return updateTask(id, { status: newStatus });
}

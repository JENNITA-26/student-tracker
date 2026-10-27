import React from 'react';
import TaskList from '../components/TaskList';

export default function Tasks({ tasks, loading, onCreate, onUpdate, onDelete, onToggleStatus, initialDateFilter, initialStatus }) {
  return (
    <TaskList
      tasks={tasks}
      loading={loading}
      onCreate={onCreate}
      onUpdate={onUpdate}
      onDelete={onDelete}
      onToggleStatus={onToggleStatus}
      initialDateFilter={initialDateFilter}
      initialStatus={initialStatus}
    />
  );
}

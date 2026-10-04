import { useEffect, useState } from 'react';

const STORAGE_KEY = 'task-manager:v1';

function makeId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function loadTasks() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed)
      ? parsed.filter((task) => task && typeof task.id === 'string' && typeof task.title === 'string' && typeof task.completed === 'boolean')
      : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [title, setTitle] = useState('');
  const [tasks, setTasks] = useState(loadTasks);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [tasks]);

  function addTask(event) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    const now = new Date().toISOString();
    setTasks((current) => [
      ...current,
      {
        id: makeId(),
        title: trimmedTitle,
        description: '',
        priority: 'medium',
        dueDate: '',
        completed: false,
        createdAt: now,
        updatedAt: now,
      },
    ]);
    setTitle('');
  }

  function toggleTask(id) {
    setTasks((current) => current.map((task) =>
      task.id === id ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() } : task,
    ));
  }

  function deleteTask(id) {
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#main" aria-label="Task Manager home">
          <span className="brand-mark" aria-hidden="true">✓</span>
          <span>Task Manager</span>
        </a>
        <span className="local-badge"><span aria-hidden="true" /> Saved on this device</span>
      </header>

      <main id="main" className="workspace">
        <section className="welcome" aria-labelledby="page-title">
          <div>
            <p className="eyebrow">YOUR WORKSPACE</p>
            <h1 id="page-title">Make room for what matters.</h1>
            <p className="welcome-copy">A clear plan turns a busy day into steady progress.</p>
          </div>
          <div className="progress-card" aria-label={`${completedCount} of ${tasks.length} tasks completed`}>
            <div className="progress-ring" aria-hidden="true">{completedCount}</div>
            <div><strong>Completed</strong><span>of {tasks.length} tasks</span></div>
          </div>
        </section>

        <section className="task-panel" aria-label="Task list">
          <div className="panel-heading">
            <div><p className="eyebrow">THE PLAN</p><h2>Today’s tasks</h2></div>
            <span className="task-count">{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</span>
          </div>

          <form className="task-form" onSubmit={addTask}>
            <label className="sr-only" htmlFor="task-title">Task title</label>
            <input
              id="task-title"
              name="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="What needs to get done?"
              maxLength={120}
              autoComplete="off"
            />
            <button className="add-button" type="submit"><span aria-hidden="true">+</span> Add task</button>
          </form>

          {storageError && <p className="storage-error" role="alert">Could not save changes in this browser. Check storage settings and try again.</p>}

          {tasks.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon" aria-hidden="true">✳</span>
              <h3>Your next step starts here.</h3>
              <p>Add a task above and give your day a little direction.</p>
            </div>
          ) : (
            <ul className="task-list" aria-live="polite">
              {tasks.map((task) => (
                <li className={`task-row${task.completed ? ' is-complete' : ''}`} key={task.id}>
                  <button
                    className="check-button"
                    type="button"
                    aria-label={`${task.completed ? 'Mark incomplete' : 'Complete'}: ${task.title}`}
                    aria-pressed={task.completed}
                    onClick={() => toggleTask(task.id)}
                  >{task.completed ? '✓' : ''}</button>
                  <span className="task-title">{task.title}</span>
                  <button className="delete-button" type="button" aria-label={`Delete: ${task.title}`} onClick={() => deleteTask(task.id)}>×</button>
                </li>
              ))}
            </ul>
          )}
          <p className="privacy-note">Your tasks are saved in this browser on this device.</p>
        </section>
        <footer className="page-footer">Small steps. Clear head. Good work.</footer>
      </main>
    </div>
  );
}

import { useEffect, useState } from 'react'
import './App.css'

// Keep the storage key in one place so reads and writes use the same name.
const STORAGE_KEY = 'taskflow-tasks'
const filters = ['All', 'Active', 'Completed']

// Load the previous task list when the app starts.
function readSavedTasks() {
  const savedTasks = localStorage.getItem(STORAGE_KEY)
  if (!savedTasks) return []

  try {
    const tasks = JSON.parse(savedTasks)
    // Ignore saved entries that do not have the fields this app expects.
    return Array.isArray(tasks)
      ? tasks.filter(
          (task) =>
            task &&
            typeof task.id === 'string' &&
            typeof task.text === 'string' &&
            typeof task.completed === 'boolean',
        )
      : []
  } catch {
    return []
  }
}

function App() {
  // State is the app's current data; changing it tells React to update the page.
  const [tasks, setTasks] = useState(readSavedTasks)
  const [taskText, setTaskText] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [inputError, setInputError] = useState('')

  // Save the list whenever it changes so tasks remain after a page refresh.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  // Calculate counts and the filtered list from tasks instead of storing duplicate data.
  const completedCount = tasks.filter((task) => task.completed).length
  const activeCount = tasks.length - completedCount
  const visibleTasks = tasks.filter((task) => {
    if (activeFilter === 'Active') return !task.completed
    if (activeFilter === 'Completed') return task.completed
    return true
  })

  // The form submit handler is used by both the button and the Enter key.
  function addTask(event) {
    event.preventDefault()
    const text = taskText.trim()

    if (!text) {
      setInputError('Add a task name before continuing.')
      return
    }

    setTasks((currentTasks) => [
      { id: crypto.randomUUID(), text, completed: false },
      ...currentTasks,
    ])
    // Clear the form and any old validation message after a successful add.
    setTaskText('')
    setInputError('')
  }

  // Return a new task array with only the selected task's completion changed.
  function toggleTask(taskId) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  // Keep every task except the one the user chose to delete.
  function deleteTask(taskId) {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId),
    )
  }

  return (
    <main className="app-shell">
      {/* The header contains the app identity and short tagline. */}
      <header className="topbar">
        <a className="brand" href="/" aria-label="TaskFlow home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="m5 12.5 4.2 4.2L19.5 6.8"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 2.8a9.2 9.2 0 1 0 9.2 9.2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span>TaskFlow</span>
        </a>
        <span className="topbar-note">A little progress, every day.</span>
      </header>

      <section className="workspace">
        {/* Introductory heading gives the task list context. */}
        <div className="page-heading">
          <div>
            <p className="eyebrow">YOUR PERSONAL WORKSPACE</p>
            <h1>Make room for what matters.</h1>
            <p className="page-subtitle">
              Keep your day moving, one task at a time.
            </p>
          </div>
          <div className="date-chip">
            <span className="date-dot" />
            Your task list
          </div>
        </div>

        {/* These totals update automatically because they are calculated from tasks. */}
        <section className="stats-grid" aria-label="Task statistics">
          <article className="stat-card">
            <span className="stat-icon total-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M8 6h12M8 12h12M8 18h12M3.5 6h.01M3.5 12h.01M3.5 18h.01"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <div>
              <p className="stat-label">Total tasks</p>
              <p className="stat-value">{tasks.length}</p>
            </div>
            <span className="stat-caption">in your list</span>
          </article>
          <article className="stat-card">
            <span className="stat-icon active-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="8.5"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M12 7v5l3 2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div>
              <p className="stat-label">In progress</p>
              <p className="stat-value">{activeCount}</p>
            </div>
            <span className="stat-caption">ready when you are</span>
          </article>
          <article className="stat-card">
            <span className="stat-icon completed-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="m5 12.5 4.2 4.2L19.5 6.8"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div>
              <p className="stat-label">Completed</p>
              <p className="stat-value">{completedCount}</p>
            </div>
            <span className="stat-caption">nice work</span>
          </article>
        </section>

        {/* Main task area: form, filters, task rows, and helpful empty states. */}
        <section className="task-panel" aria-labelledby="tasks-heading">
          <div className="panel-heading">
            <div>
              <h2 id="tasks-heading">Your tasks</h2>
              <p className="panel-description">
                Capture it now. Check it off when it’s done.
              </p>
            </div>
            <span className="task-count">
              {activeCount} {activeCount === 1 ? 'task' : 'tasks'} left
            </span>
          </div>

          {/* Submitting the form adds a task; Enter submits it as well. */}
          <form className="task-form" onSubmit={addTask} noValidate>
            <label className="visually-hidden" htmlFor="new-task">
              Add a task
            </label>
            <span className="input-plus" aria-hidden="true">
              +
            </span>
            <input
              id="new-task"
              type="text"
              placeholder="What needs to get done?"
              value={taskText}
              maxLength={120}
              onChange={(event) => {
                setTaskText(event.target.value)
                if (inputError) setInputError('')
              }}
              aria-invalid={Boolean(inputError)}
              aria-describedby={inputError ? 'task-error' : undefined}
            />
            <button className="add-button" type="submit">
              <span aria-hidden="true">+</span>
              Add task
            </button>
          </form>
          {inputError && (
            <p className="input-error" id="task-error" role="alert">
              {inputError}
            </p>
          )}

          {/* Selecting a filter changes which tasks are shown, not the saved tasks. */}
          <div className="list-toolbar">
            <div className="filter-tabs" role="group" aria-label="Filter tasks">
              {filters.map((filter) => (
                <button
                  className={`filter-tab${activeFilter === filter ? ' is-selected' : ''}`}
                  key={filter}
                  type="button"
                  aria-pressed={activeFilter === filter}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                  <span className="filter-count">
                    {filter === 'All'
                      ? tasks.length
                      : filter === 'Active'
                        ? activeCount
                        : completedCount}
                  </span>
                </button>
              ))}
            </div>
            <span className="list-hint">
              <span className="keyboard-key">↵</span> to add a task
            </span>
          </div>

          {/* Render a row for each matching task, or explain why the list is empty. */}
          <div className="task-list" aria-live="polite">
            {visibleTasks.length > 0 ? (
              visibleTasks.map((task) => (
                <article
                  className={`task-row${task.completed ? ' is-completed' : ''}`}
                  key={task.id}
                >
                  <button
                    className="complete-button"
                    type="button"
                    aria-label={
                      task.completed
                        ? `Mark "${task.text}" as active`
                        : `Mark "${task.text}" as completed`
                    }
                    aria-pressed={task.completed}
                    onClick={() => toggleTask(task.id)}
                  >
                    {task.completed && (
                      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <path
                          d="m4.5 10 3.4 3.4 7.6-7.6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                  <span className="task-text">{task.text}</span>
                  <span className="task-status">
                    {task.completed ? 'Done' : 'In progress'}
                  </span>
                  <button
                    className="delete-button"
                    type="button"
                    aria-label={`Delete "${task.text}"`}
                    onClick={() => deleteTask(task.id)}
                  >
                    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path
                        d="M4.5 6h11M8 6V4.5h4V6m2.5 0-.6 9.5H6.1L5.5 6m3 2.5v4m3-4v4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </article>
              ))
            ) : (
              <div className="empty-state">
                <span className="empty-icon" aria-hidden="true">
                  {tasks.length === 0 ? '✦' : '✓'}
                </span>
                <h3>
                  {tasks.length === 0
                    ? 'A fresh start'
                    : activeFilter === 'Active'
                      ? 'All caught up'
                      : 'Nothing here just yet'}
                </h3>
                <p>
                  {tasks.length === 0
                    ? 'Add your first task above and make today count.'
                    : activeFilter === 'Active'
                      ? 'You’ve completed every task. Take a moment to celebrate.'
                      : 'There are no tasks in this view right now.'}
                </p>
              </div>
            )}
          </div>

          {/* Summarize the current view and remind users that tasks are saved locally. */}
          <footer className="panel-footer">
            <span>
              Showing {visibleTasks.length} of {tasks.length}{' '}
              {tasks.length === 1 ? 'task' : 'tasks'}
            </span>
            <span className="saved-note">
              <span className="saved-dot" />
              Saved on this device
            </span>
          </footer>
        </section>
        <p className="page-footer">Small steps add up. You’ve got this.</p>
      </section>
    </main>
  )
}

export default App

const PRIORITIES = new Set(['low', 'medium', 'high']);
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

export function createTask(input, { id = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`, now = () => new Date().toISOString() } = {}) {
  const title = typeof input?.title === 'string' ? input.title.trim() : '';
  if (!title) throw new TypeError('Task title must be a non-empty string');
  if (title.length > 120) throw new RangeError('Task title must be 120 characters or fewer');
  const description = input.description ?? '';
  if (typeof description !== 'string') throw new TypeError('Task description must be a string');
  const priority = input.priority ?? 'medium';
  if (!PRIORITIES.has(priority)) throw new TypeError('Task priority must be low, medium, or high');
  const dueDate = input.dueDate ?? '';
  if (dueDate && (!DATE_ONLY.test(dueDate) || Number.isNaN(Date.parse(`${dueDate}T00:00:00`)))) {
    throw new TypeError('Task due date must be a valid YYYY-MM-DD date');
  }
  const timestamp = now();
  return { id: id(), title, description, priority, dueDate, completed: false, createdAt: timestamp, updatedAt: timestamp };
}

export function isTask(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  return typeof value.id === 'string' && value.id.trim().length > 0
    && typeof value.title === 'string' && value.title.trim().length > 0 && value.title.length <= 120
    && typeof value.description === 'string'
    && PRIORITIES.has(value.priority)
    && (value.dueDate === '' || (typeof value.dueDate === 'string' && DATE_ONLY.test(value.dueDate) && !Number.isNaN(Date.parse(`${value.dueDate}T00:00:00`))))
    && typeof value.completed === 'boolean'
    && isTimestamp(value.createdAt) && isTimestamp(value.updatedAt);
}

function isTimestamp(value) {
  return typeof value === 'string' && Number.isFinite(Date.parse(value));
}

export function validateTasks(value) {
  return Array.isArray(value) && value.every(isTask);
}

export function toggleTask(task, now = () => new Date().toISOString()) {
  if (!isTask(task)) throw new TypeError('Cannot toggle an invalid task');
  return { ...task, completed: !task.completed, updatedAt: now() };
}

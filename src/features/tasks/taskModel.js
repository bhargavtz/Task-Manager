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
  if (dueDate && !isCalendarDate(dueDate)) {
    throw new TypeError('Task due date must be a valid YYYY-MM-DD date');
  }
  const timestamp = now();
  return { id: id(), title, description, priority, dueDate, completed: false, createdAt: timestamp, updatedAt: timestamp };
}

export function validateTasks(value) {
  return Array.isArray(value) && value.every(isTaskRecord);
}

export function isTaskRecord(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  return typeof value.id === 'string' && value.id.trim().length > 0
    && typeof value.title === 'string' && value.title.trim().length > 0 && value.title.length <= 120
    && typeof value.description === 'string'
    && PRIORITIES.has(value.priority)
    && (value.dueDate === '' || isCalendarDate(value.dueDate))
    && typeof value.completed === 'boolean'
    && isTimestamp(value.createdAt) && isTimestamp(value.updatedAt);
}

function isCalendarDate(value) {
  if (typeof value !== 'string' || !DATE_ONLY.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return parsed.getUTCFullYear() === year
    && parsed.getUTCMonth() === month - 1
    && parsed.getUTCDate() === day;
}

function isTimestamp(value) {
  if (typeof value !== 'string') return false;
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(Z|[+-](\d{2}):(\d{2}))$/.exec(value);
  if (!match) return false;
  const [, year, month, day, hour, minute, second, , zone, offsetHour, offsetMinute] = match;
  if (!isCalendarDate(`${year}-${month}-${day}`)) return false;
  if (Number(hour) > 23 || Number(minute) > 59 || Number(second) > 59) return false;
  if (zone !== 'Z') {
    const offsetHours = Number(offsetHour);
    const offsetMinutes = Number(offsetMinute);
    if (offsetHours > 14 || offsetMinutes > 59 || (offsetHours === 14 && offsetMinutes !== 0)) return false;
  }
  return Number.isFinite(Date.parse(value));
}

export function toggleTask(task, now = () => new Date().toISOString()) {
  if (!isTaskRecord(task)) throw new TypeError('Cannot toggle an invalid task');
  return { ...task, completed: !task.completed, updatedAt: now() };
}

import { describe, expect, it } from 'vitest';
import { createTask, isTaskRecord, toggleTask } from './taskModel.js';

describe('task model', () => {
  it('trims titles and applies safe defaults', () => {
    const task = createTask({ title: '  Prepare proposal  ' }, {
      id: () => 'task-1',
      now: () => '2026-10-04T18:00:00.000Z',
    });
    expect(task).toEqual({
      id: 'task-1', title: 'Prepare proposal', description: '', priority: 'medium',
      dueDate: '', completed: false,
      createdAt: '2026-10-04T18:00:00.000Z', updatedAt: '2026-10-04T18:00:00.000Z',
    });
  });

  it('rejects empty or non-string titles', () => {
    expect(() => createTask({ title: '   ' })).toThrow(/title/i);
    expect(() => createTask({ title: null })).toThrow(/title/i);
  });

  it('validates every persisted display field', () => {
    const valid = createTask({ title: 'Valid' }, { id: () => 'task-2' });
    expect(isTaskRecord(valid)).toBe(true);
    expect(isTaskRecord({ ...valid, priority: 'urgent' })).toBe(false);
    expect(isTaskRecord({ ...valid, description: {} })).toBe(false);
    expect(isTaskRecord({ ...valid, dueDate: 'tomorrow' })).toBe(false);
    expect(isTaskRecord({ ...valid, title: {} })).toBe(false);
    expect(isTaskRecord({ ...valid, completed: 'false' })).toBe(false);
  });

  it('rejects impossible calendar dates', () => {
    expect(() => createTask({ title: 'Impossible date', dueDate: '2026-02-30' })).toThrow(/date/i);
    const valid = createTask({ title: 'Valid date', dueDate: '2026-02-28' }, { id: () => 'date-task' });
    expect(isTaskRecord(valid)).toBe(true);
    expect(isTaskRecord({ ...valid, dueDate: '2026-02-30' })).toBe(false);
  });

  it('requires timestamps in ISO 8601 form', () => {
    const valid = createTask({ title: 'Timestamp' }, { id: () => 'time-task' });
    expect(isTaskRecord({ ...valid, updatedAt: 'October 5 2026' })).toBe(false);
  });

  it('toggles completion and updates the timestamp immutably', () => {
    const task = createTask({ title: 'Review' }, { id: () => 'task-3' });
    const next = toggleTask(task, () => '2026-10-05T00:00:00.000Z');
    expect(next.completed).toBe(true);
    expect(next.updatedAt).toBe('2026-10-05T00:00:00.000Z');
    expect(task.completed).toBe(false);
  });
});

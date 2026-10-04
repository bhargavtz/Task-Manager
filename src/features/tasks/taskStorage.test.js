import { describe, expect, it } from 'vitest';
import { createTask } from './taskModel.js';
import { createTaskStorage } from './taskStorage.js';

function memoryStorage(initial = null) {
  let value = initial;
  return {
    getItem: () => value,
    setItem: (_key, next) => { value = next; },
    inspect: () => value,
  };
}

describe('task storage', () => {
  it('returns an empty array when no record exists', () => {
    expect(createTaskStorage(memoryStorage()).load()).toEqual([]);
  });

  it('saves and loads a valid task array', () => {
    const storage = memoryStorage();
    const api = createTaskStorage(storage);
    const tasks = [createTask({ title: 'Check supplier quote' }, { id: () => 't1' })];
    expect(api.save(tasks)).toBe(true);
    expect(api.load()).toEqual(tasks);
  });

  it('recovers from malformed JSON and invalid records', () => {
    expect(createTaskStorage(memoryStorage('{bad')).load()).toEqual([]);
    const invalid = JSON.stringify([{ id: 'x', title: {}, completed: false }]);
    expect(createTaskStorage(memoryStorage(invalid)).load()).toEqual([]);
  });

  it('reports a write failure instead of claiming it was saved', () => {
    const blocked = { getItem: () => null, setItem: () => { throw new Error('quota'); } };
    const api = createTaskStorage(blocked);
    expect(api.save([createTask({ title: 'Valid' }, { id: () => 't2' })])).toBe(false);
  });
});

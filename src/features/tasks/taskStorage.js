import { validateTasks } from './taskModel.js';

export const TASKS_STORAGE_KEY = 'task-manager:v1';

export function createTaskStorage(storage = globalThis.localStorage, key = TASKS_STORAGE_KEY) {
  return {
    load() {
      try {
        const raw = storage?.getItem(key);
        if (raw == null) return [];
        const tasks = JSON.parse(raw);
        return validateTasks(tasks) ? tasks : [];
      } catch {
        return [];
      }
    },
    save(tasks) {
      if (!validateTasks(tasks) || !storage) return false;
      try {
        storage.setItem(key, JSON.stringify(tasks));
        return true;
      } catch {
        return false;
      }
    },
  };
}

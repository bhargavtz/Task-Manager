import { test, expect } from '@playwright/test';

test('creates a task and keeps it after reloading the page', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Task title' }).fill('Review launch plan');
  await page.getByRole('button', { name: 'Add task' }).click();
  await expect(page.getByText('Review launch plan')).toBeVisible();

  await page.reload();
  await expect(page.getByText('Review launch plan')).toBeVisible();
});

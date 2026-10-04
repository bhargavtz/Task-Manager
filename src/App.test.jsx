import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App.jsx';

describe('Task Manager', () => {
  it('shows the accessible workspace and task entry form', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: /make room for what matters/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /task title/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
  });

  it('creates a task, trims its title, and clears the field', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByRole('textbox', { name: /task title/i }), '  Prepare proposal  ');
    await user.keyboard('{Enter}');
    expect(screen.getByText('Prepare proposal')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /task title/i })).toHaveValue('');
  });

  it('toggles a task complete and deletes only that task', async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByRole('textbox', { name: /task title/i });
    await user.type(input, 'First task{Enter}');
    await user.type(input, 'Second task{Enter}');

    await user.click(screen.getByRole('button', { name: 'Complete: First task' }));
    expect(screen.getByRole('button', { name: 'Mark incomplete: First task' })).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('button', { name: 'Delete: First task' }));
    expect(screen.queryByText('First task')).not.toBeInTheDocument();
    expect(screen.getByText('Second task')).toBeInTheDocument();
  });

  it('renders user-supplied markup as text, not executable HTML', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByRole('textbox', { name: /task title/i }), '<img src=x onerror=alert(1)>{Enter}');
    expect(screen.getByText('<img src=x onerror=alert(1)>')).toBeInTheDocument();
    expect(document.querySelector('.task-list img')).toBeNull();
  });
});

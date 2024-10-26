document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskTitle = document.getElementById('task-title');
    const taskDescription = document.getElementById('task-description');
    const taskList = document.getElementById('task-list').querySelector('ul');
    const taskCounter = document.getElementById('task-counter');

    let tasks = [];

    // Update Task Counter
    const updateTaskCounter = () => {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        taskCounter.textContent = `${totalTasks} tasks total, ${completedTasks} completed`;
    };

    // Render Task List
    const renderTasks = () => {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = `list-group-item d-flex justify-content-between align-items-center ${task.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <div>
                    <h5>${task.title}</h5>
                    <p>${task.description}</p>
                </div>
                <div>
                    <button class="btn btn-sm btn-outline-success me-2" onclick="editTask(${index})">Edit</button>
                    <button class="btn btn-sm btn-outline-info me-2" onclick="toggleTaskCompletion(${index})">${task.completed ? 'Undo' : 'Complete'}</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteTask(${index})">Delete</button>
                </div>
            `;
            taskList.appendChild(li);
        });
        updateTaskCounter();
    };

    // Add Task
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = taskTitle.value.trim();
        const description = taskDescription.value.trim();
        if (title && description) {
            tasks.push({ title, description, completed: false });
            renderTasks();
            taskTitle.value = '';
            taskDescription.value = '';
        }
    });

    // Edit Task
    window.editTask = (index) => {
        const task = tasks[index];
        taskTitle.value = task.title;
        taskDescription.value = task.description;
        deleteTask(index);
    };

    // Toggle Task Completion
    window.toggleTaskCompletion = (index) => {
        tasks[index].completed = !tasks[index].completed;
        renderTasks();
    };

    // Delete Task
    window.deleteTask = (index) => {
        tasks.splice(index, 1);
        renderTasks();
    };
});

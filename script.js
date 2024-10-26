// Select DOM elements
const taskForm = document.getElementById('task-form');
const taskTitle = document.getElementById('task-title');
const taskDescription = document.getElementById('task-description');
const taskList = document.querySelector('#task-list .list-group');
const taskCounter = document.getElementById('task-counter');

let tasks = [];
let editMode = false;
let editTaskId = null;

// Function to update the task counter
function updateTaskCounter() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    taskCounter.textContent = `${totalTasks} tasks total, ${completedTasks} completed`;
}

// Function to add or update a task
function saveTask(title, description) {
    if (editMode) {
        // Update existing task
        tasks = tasks.map(task => 
            task.id === editTaskId ? { ...task, title, description } : task
        );
        editMode = false;
        editTaskId = null;
    } else {
        // Add a new task
        const task = {
            id: Date.now(),
            title: title,
            description: description,
            completed: false
        };
        tasks.push(task);
    }
    renderTasks();
}

// Function to render tasks
function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = `list-group-item d-flex justify-content-between align-items-start ${task.completed ? 'completed' : ''}`;
        taskItem.innerHTML = `
            <div>
                <h5>${task.title}</h5>
                <p>${task.description}</p>
            </div>
            <div>
                <button class="btn btn-sm btn-success me-2" onclick="toggleTask(${task.id})">
                    ${task.completed ? 'Undo' : 'Complete'}
                </button>
                <button class="btn btn-sm btn-warning me-2" onclick="startEditTask(${task.id})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;
        taskList.appendChild(taskItem);
    });
    updateTaskCounter();
}

// Function to toggle task completion
function toggleTask(taskId) {
    tasks = tasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    renderTasks();
}

// Function to delete a task
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    renderTasks();
}

// Function to start editing a task
function startEditTask(taskId) {
    const taskToEdit = tasks.find(task => task.id === taskId);
    taskTitle.value = taskToEdit.title;
    taskDescription.value = taskToEdit.description;
    editMode = true;
    editTaskId = taskId;
}

// Form submission event listener
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (taskTitle.value.trim() && taskDescription.value.trim()) {
        saveTask(taskTitle.value, taskDescription.value);
        taskTitle.value = '';
        taskDescription.value = '';
    }
});

// Initial rendering of tasks
renderTasks();

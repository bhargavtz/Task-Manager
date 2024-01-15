document.addEventListener('DOMContentLoaded', function () {
    const taskForm = document.getElementById('task-form');
    const taskTitleInput = document.getElementById('task-title');
    const taskDescriptionInput = document.getElementById('task-description');
    const taskList = document.getElementById('task-list');

    taskForm.addEventListener('submit', function (event) {
        event.preventDefault();
        createTask();
    });

    function createTask() {
        const title = taskTitleInput.value.trim();
        const description = taskDescriptionInput.value.trim();

        if (title === '' || description === '') {
            alert('Please fill out both title and description.');
            return;
        }

        const task = new Task(title, description);
        addTaskToList(task);
        clearInputFields();
        displayNotification('Task added successfully!');
    }

    function addTaskToList(task) {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task', task.status === 'complete' ? 'completed' : '');

        taskElement.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <button class="complete-button">${task.status === 'complete' ? 'Incomplete' : 'Complete'}</button>
        <button class="delete-button">Delete</button>
    `;

        taskElement.querySelector('.complete-button').addEventListener('click', function () {
            toggleTaskStatus(taskElement, task);
        });

        taskElement.querySelector('.delete-button').addEventListener('click', function () {
            deleteTask(taskElement);
        });

        taskList.appendChild(taskElement);
    }

    function toggleTaskStatus(taskElement, task) {
        task.status = task.status === 'complete' ? 'incomplete' : 'complete';
        taskElement.classList.toggle('completed');
        const completeButton = taskElement.querySelector('.complete-button');
        completeButton.textContent = task.status === 'complete' ? 'Incomplete' : 'Complete';
    }

    function deleteTask(taskElement) {
        const confirmation = confirm('Are you sure you want to delete this task?');

        if (confirmation) {
            taskElement.classList.add('fade-out');
            setTimeout(() => {
                taskElement.remove();
                displayNotification('Task deleted successfully!');
            }, 300);
        }
    }


    function clearInputFields() {
        taskTitleInput.value = '';
        taskDescriptionInput.value = '';
    }

    function Task(title, description) {
        this.title = title;
        this.description = description;
        this.status = 'incomplete';
    }

    function displayNotification(message) {
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
});

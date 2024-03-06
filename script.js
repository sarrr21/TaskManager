document.addEventListener('DOMContentLoaded', function () {
    // Selecting elements
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const categoryInput = document.getElementById('categoryInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const priorityInput = document.getElementById('priorityInput');
    const taskList = document.getElementById('taskList');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const dueDateFilter = document.getElementById('dueDateFilter');
    const priorityFilter = document.getElementById('priorityFilter');
    const setReminderBtn = document.getElementById('setReminderBtn');

    // Function to add a new task
    function addTask(taskContent, category, dueDate, priority) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${taskContent}</span>
            <div>
                <span>${category}</span>
                <span>${dueDate}</span>
                <span>${priority}</span>
                <button class="complete-btn>Completed</button>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
        taskList.appendChild(li);
    }
    function editTask(taskItem, taskContent, category, dueDate, priority) {
        taskItem.innerHTML = `
            <span>${taskContent}</span>
            <div>
                <span>${category}</span>
                <span>${dueDate}</span>
                <span>${priority}</span>
                <button class="complete-btn">Complete</button>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
    }
    function setReminder() {
        const priorityValue = priorityInput.value.toLowerCase();
        if (priorityValue === 'high') {
            // Implement reminder logic here (e.g., send notification)
            alert('Reminder set for this important task!');
        }
    }

    // Add event listener to the Set Reminder button
    setReminderBtn.addEventListener('click', setReminder);

    function markTaskComplete(event) {
        const btn = event.target;
        if (btn.classList.contains('complete-btn')) {
            const taskItem = btn.parentElement.parentElement;
            taskItem.classList.toggle('completed');
        }
    }

    // Add event listener to the task list for complete button
    taskList.addEventListener('click', markTaskComplete);

    // Rest of your JavaScript code...


    // Function to save tasks to local storage
    function saveTasksToLocalStorage() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(task => {
            tasks.push({
                content: task.querySelector('span').innerText,
                category: task.querySelector('div > span:nth-child(1)').innerText,
                dueDate: task.querySelector('div > span:nth-child(2)').innerText,
                priority: task.querySelector('div > span:nth-child(3)').innerText,
                completed: task.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Function to load tasks from local storage
    function loadTasksFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        if (tasks) {
            tasks.forEach(task => {
                addTask(task.content, task.category, task.dueDate, task.priority);
                const addedTask = taskList.lastElementChild;
                if (task.completed) {
                    addedTask.classList.add('completed');
                }
            });
        }
    }

    // Load tasks from local storage when the page is loaded
    loadTasksFromLocalStorage();

    // Event listener for submitting the form
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const taskContent = taskInput.value.trim();
        const category = categoryInput.value.trim();
        const dueDate = dueDateInput.value.trim();
        const priority = priorityInput.value.trim();

        if (taskContent !== '') {
            addTask(taskContent, category, dueDate, priority);
            taskInput.value = '';
            categoryInput.value = '';
            dueDateInput.value = '';
            priorityInput.value = '';
            saveTasksToLocalStorage();
        }
    });
    
    // Event delegation for handling toggle, edit, and delete buttons
    taskList.addEventListener('click', function(e) {
        const target = e.target;
        if (target.classList.contains('complete-btn')) {
            const taskItem = target.closest('li');
            taskItem.classList.toggle('completed');
            saveTasksToLocalStorage();
        } else if (target.classList.contains('edit-btn')) {
            // Implement edit functionality here
        } else if (target.classList.contains('delete-btn')) {
            const taskItem = target.closest('li');
            taskItem.remove();
            saveTasksToLocalStorage();
        }
    });
    taskList.addEventListener('click', function(e) {
        const target = e.target;
        if (target.classList.contains('edit-btn')) {
            const taskItem = target.closest('li');
            const span = taskItem.querySelector('span');
            const category = taskItem.querySelector('div > span:nth-child(1)').innerText;
            const dueDate = taskItem.querySelector('div > span:nth-child(2)').innerText;
            const priority = taskItem.querySelector('div > span:nth-child(3)').innerText;

            const newTaskContent = prompt('Enter new task content:', span.innerText);
            if (newTaskContent !== null) {
                const newCategory = prompt('Enter new category:', category);
                const newDueDate = prompt('Enter new due date:', dueDate);
                const newPriority = prompt('Enter new priority:', priority);
                
                if (newTaskContent.trim() !== '') {
                    span.innerText = newTaskContent;
                    editTask(taskItem, newTaskContent, newCategory, newDueDate, newPriority);
                } else {
                    alert('Task content cannot be empty!');
                }
            }
        }
    });

    // Function to filter tasks
    function filterTasks() {
        const searchValue = searchInput.value.toLowerCase();
        const categoryValue = categoryFilter.value.toLowerCase();
        const dueDateValue = dueDateFilter.value;
        const priorityValue = priorityFilter.value.toLowerCase();

        taskList.querySelectorAll('li').forEach(task => {
            const taskContent = task.querySelector('span').innerText.toLowerCase();
            const category = task.querySelector('div > span:nth-child(1)').innerText.toLowerCase();
            const dueDate = task.querySelector('div > span:nth-child(2)').innerText;
            const priority = task.querySelector('div > span:nth-child(3)').innerText.toLowerCase();

            const matchesSearch = taskContent.includes(searchValue);
            const matchesCategory = category.includes(categoryValue) || categoryValue === '';
            const matchesDueDate = dueDate.includes(dueDateValue) || dueDateValue === '';
            const matchesPriority = priority.includes(priorityValue) || priorityValue === '';

            if (matchesSearch && matchesCategory && matchesDueDate && matchesPriority) {
                task.style.display = 'flex';
            } else {
                task.style.display = 'none';
            }
        });
    }

    // Event listeners for filtering tasks
    searchInput.addEventListener('input', filterTasks);
    categoryFilter.addEventListener('change', filterTasks);
    dueDateFilter.addEventListener('input', filterTasks);
    priorityFilter.addEventListener('change', filterTasks);
});
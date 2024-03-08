document.addEventListener("DOMContentLoaded", function () {
  // Selecting elements
  const taskForm = document.getElementById("taskForm");
  const taskInput = document.getElementById("taskInput");
  const categoryInput = document.getElementById("categoryInput");
  const dueDateInput = document.getElementById("dueDateInput");
  const priorityInput = document.getElementById("priorityInput");
  const taskList = document.getElementById("taskList");
  const searchInput = document.getElementById("searchInput");
  const dueDateFilter = document.getElementById("dueDateFilter");
  const priorityFilter = document.getElementById("priorityFilter");
  const setReminderCheckbox = document.getElementById("setReminderBtn");

  function addTask(
    taskContent,
    category,
    dueDate,
    priority,
    isReminderSet,
    completed = false
  ) {
    const li = document.createElement("li");
    li.innerHTML = `
    <input type="checkbox" class="complete-checkbox" ${
      completed ? "checked" : ""
    }>
      <span>${taskContent}</span>
      <div>
        <span>${category}</span>
        <span>${dueDate}</span>
        <span>${priority}</span>
        <img src="./edit.png" alt="edit" class="edit-btn" />
        <img src="./bin.png" alt="delete" class="delete-btn" />
      </div>
    `;
    
    taskList.appendChild(li);
    saveTaskToLocalStorage({
      content: taskContent,
      category: category,
      dueDate: dueDate,
      priority: priority,
      completed: completed,
      setReminder: isReminderSet,
    });
  }
  

  function saveTaskToLocalStorage(task) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    if (tasks) {
      tasks.forEach((task) => {
        const li = document.createElement("li");
        li.innerHTML = `
        
        <input type="checkbox" class="complete-checkbox" ${
          task.completed ? "checked" : ""
        }>
        <span>${task.content}</span>
                    <div>
                    
                        <span>${task.category}</span>
                        <span>${task.dueDate}</span>
                        <span>${task.priority}</span>
                        <img src="./edit.png" alt="edit" class="edit-btn" />
                        <img src="./bin.png" alt="delete" class="delete-btn" />
                    </div> `;
                    
        taskList.appendChild(li);
        
        const completeCheckbox = li.querySelector(".complete-checkbox");
        completeCheckbox.addEventListener("change", function () {
          task.completed = this.checked;
          if (task.completed) {
            li.classList.add("completed");
          } else {
            li.classList.remove("completed");
          }
          saveTasksToLocalStorage();
        });
        if (task.completed) {
          li.classList.add("completed");
        }

        function showNotification(message) {
          const toast = document.createElement("div");
          toast.classList.add("toast");
          toast.textContent = message;

          const toastContainer = document.getElementById("toast-container");
          toastContainer.appendChild(toast);

          setTimeout(() => {
            toast.remove();
          }, 8000);
        }

        if (task.dueDate && task.setReminder) {
          const reminderDateTime = new Date(task.dueDate).getDate();
          const currentTime = new Date().getDate();

          if (reminderDateTime === currentTime) {
            showNotification(
              `Reminder: Don't forget about your task - ${task.content}`
            );
          }
        }
      });
    }
  }
  function saveTasksToLocalStorage() {
    const tasks = [];
    taskList.querySelectorAll("li").forEach((taskItem) => {
      tasks.push({
        content: taskItem.querySelector("span").innerText,
        category: taskItem.querySelector("div > span:nth-child(1)").innerText,
        dueDate: taskItem.querySelector("div > span:nth-child(2)").innerText,
        priority: taskItem.querySelector("div > span:nth-child(3)").innerText,
        completed: taskItem.classList.contains("completed"),
        setReminder: setReminderCheckbox,
      });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Load tasks from local storage when the page is loaded
  loadTasksFromLocalStorage();

  // Event listener for submitting the form
  taskForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const taskContent = taskInput.value.trim();
    const category = categoryInput.value.trim();
    const dueDate = dueDateInput.value.trim();
    const priority = priorityInput.value.trim();
    const setReminder = isReminderSet;

    if (taskContent !== "") {
      addTask(taskContent, category, dueDate, priority, setReminder);
      taskInput.value = "";
      categoryInput.value = "";
      dueDateInput.value = "";
      priorityInput.value = "";
    }
  });

  // Event delegation for handling edit, and delete buttons
  taskList.addEventListener("click", function (e) {
    const target = e.target;
    if (target.classList.contains("edit-btn")) {
      const taskItem = target.closest("li");
      const span = taskItem.querySelector("span");
      const category = taskItem.querySelector(
        "div > span:nth-child(1)"
      ).innerText;
      const dueDate = taskItem.querySelector(
        "div > span:nth-child(2)"
      ).innerText;
      const priority = taskItem.querySelector(
        "div > span:nth-child(3)"
      ).innerText;

      const newTaskContent = prompt("Enter new task content:", span.innerText);
      if (newTaskContent !== null) {
        const newCategory = prompt("Enter new category:", category);
        const newDueDate = prompt("Enter new due date:", dueDate);
        const newPriority = prompt("Enter new priority:", priority);

        if (newTaskContent.trim() !== "") {
          span.innerText = newTaskContent;
          editTask(
            taskItem,
            newTaskContent,
            newCategory,
            newDueDate,
            newPriority
          );
        } else {
          alert("Task content cannot be empty!");
        }
      }
    } else if (target.classList.contains("delete-btn")) {
      const taskItem = target.closest("li");
      taskItem.remove();
      saveTasksToLocalStorage();
    }
  });

  // Function to filter tasks
  function filterTasks() {
    const searchValue = searchInput.value.toLowerCase();
    const dueDateValue = dueDateFilter.value;
    const priorityValue = priorityFilter.value.toLowerCase();

    taskList.querySelectorAll("li").forEach((task) => {
      const taskContent = task.querySelector("span").innerText.toLowerCase();
      const dueDate = task.querySelector("div > span:nth-child(2)").innerText;
      const priority = task
        .querySelector("div > span:nth-child(3)")
        .innerText.toLowerCase();

      const matchesSearch = taskContent.includes(searchValue);
      const matchesDueDate =
        dueDate.includes(dueDateValue) || dueDateValue === "";
      const matchesPriority =
        priority.includes(priorityValue) || priorityValue === "";

      if (matchesSearch && matchesDueDate && matchesPriority) {
        task.style.display = "flex";
      } else {
        task.style.display = "none";
      }
    });
  }

  // Event listeners for filtering tasks
  searchInput.addEventListener("input", filterTasks);
  dueDateFilter.addEventListener("input", filterTasks);
  priorityFilter.addEventListener("change", filterTasks);

  // Function to set a reminder

  let isReminderSet = setReminderCheckbox.checked;
  setReminderCheckbox.addEventListener("change", function () {
    isReminderSet = this.checked;
  });
});
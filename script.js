// ========================================
// DOM ELEMENTS
// ========================================

const taskInput = document.getElementById("taskInput");
const dueDate = document.getElementById("dueDate");
const priority = document.getElementById("priority");
const category = document.getElementById("category");
const taskList = document.getElementById("taskList");
const themeBtn = document.getElementById("themeBtn");
const searchTask = document.getElementById("searchTask");
const filterTask = document.getElementById("filterTask");
const sortTask = document.getElementById("sortTask");


// ========================================
// LOAD SAVED TASKS
// ========================================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// ========================================
// LOAD SAVED THEME
// ========================================

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeBtn.innerHTML = "☀️ Light Mode";
} else {
    themeBtn.innerHTML = "🌙 Dark Mode";
}


// ========================================
// SAVE TASKS
// ========================================

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// ========================================
// ADD TASK
// ========================================

function addTask() {

    const text = taskInput.value.trim();
    const date = dueDate.value;
    const taskPriority = priority.value;
    const taskCategory = category.value;

    if (text === "") {
        alert("Please enter a task.");
        taskInput.focus();
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        dueDate: date,
        priority: taskPriority,
        category: taskCategory,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";
    dueDate.value = "";
    priority.value = "Medium";
    category.value = "Study";

    refreshTaskList();

    taskInput.focus();
}


// ========================================
// RENDER TASKS
// ========================================

function renderTasks(taskArray = tasks) {

    taskList.innerHTML = "";

    if (taskArray.length === 0) {

        taskList.innerHTML = `
            <div class="empty">
                <div class="empty-icon">📋</div>
                <h3>No Tasks Yet</h3>
                <p>Add your first task above.</p>
            </div>
        `;

        updateCounter();
        return;
    }


    taskArray.forEach(task => {

        const li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }

        const priorityClass = task.priority
            ? task.priority.toLowerCase()
            : "medium";


        li.innerHTML = `
            <div class="task-info">

                <h3>${escapeHTML(task.text)}</h3>

                <p>
                    📅 ${task.dueDate || "No Date"}
                </p>

                <p>
                    Priority:
                    <strong class="${priorityClass}">
                        ${escapeHTML(task.priority || "Medium")}
                    </strong>
                </p>

                <p>
                    📂 ${escapeHTML(task.category || "Study")}
                </p>

            </div>

            <div class="actions">

                <button onclick="toggleTask(${task.id})">
                    ${task.completed ? "↩️" : "✅"}
                </button>

                <button onclick="editTask(${task.id})">
                    ✏️
                </button>

                <button onclick="deleteTask(${task.id})">
                    🗑️
                </button>

            </div>
        `;

        taskList.appendChild(li);

    });

    updateCounter();
}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// ========================================
// TOGGLE TASK
// ========================================

function toggleTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) return;

    task.completed = !task.completed;

    saveTasks();

    refreshTaskList();
}


// ========================================
// EDIT TASK
// ========================================

function editTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) return;

    const updated = prompt(
        "Edit Task",
        task.text
    );

    if (
        updated !== null &&
        updated.trim() !== ""
    ) {

        task.text = updated.trim();

        saveTasks();

        refreshTaskList();
    }
}


// ========================================
// DELETE TASK
// ========================================

function deleteTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) return;

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    refreshTaskList();
}


// ========================================
// SEARCH TASKS
// ========================================

function searchTasks() {

    refreshTaskList();
}


// ========================================
// FILTER TASKS
// ========================================

function filterTasks() {

    refreshTaskList();
}


// ========================================
// SORT TASKS
// ========================================

function sortTasks() {

    refreshTaskList();
}


// ========================================
// REFRESH TASK LIST
// SEARCH + FILTER + SORT
// ========================================

function refreshTaskList() {

    let filteredTasks = [...tasks];


    // -------------------------------
    // SEARCH
    // -------------------------------

    const keyword = searchTask.value
        .trim()
        .toLowerCase();

    if (keyword !== "") {

        filteredTasks = filteredTasks.filter(task =>
            task.text.toLowerCase().includes(keyword)
        );

    }


    // -------------------------------
    // FILTER
    // -------------------------------

    const filterValue = filterTask.value;

    if (filterValue === "Completed") {

        filteredTasks = filteredTasks.filter(
            task => task.completed
        );

    }

    if (filterValue === "pending") {

        filteredTasks = filteredTasks.filter(
            task => !task.completed
        );

    }


    // -------------------------------
    // SORT
    // -------------------------------

    const sortValue = sortTask.value;


    // Name
    if (sortValue === "name") {

        filteredTasks.sort((a, b) =>
            a.text.localeCompare(b.text)
        );

    }


    // Date
    if (sortValue === "date") {

        filteredTasks.sort((a, b) => {

            if (!a.dueDate && !b.dueDate) {
                return 0;
            }

            if (!a.dueDate) {
                return 1;
            }

            if (!b.dueDate) {
                return -1;
            }

            return new Date(a.dueDate) -
                   new Date(b.dueDate);

        });

    }


    // Priority
    if (sortValue === "priority") {

        const priorityOrder = {
            High: 1,
            Medium: 2,
            Low: 3
        };

        filteredTasks.sort((a, b) =>
            (priorityOrder[a.priority] || 2) -
            (priorityOrder[b.priority] || 2)
        );

    }


    renderTasks(filteredTasks);
}


// ========================================
// UPDATE COUNTERS
// ========================================

function updateCounter() {

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const remaining = total - completed;

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("remainingTasks").textContent = remaining;

    document.getElementById("taskCount").textContent = total;
}


// ========================================
// CLEAR COMPLETED
// ========================================

function clearCompleted() {

    const completedCount = tasks.filter(
        task => task.completed
    ).length;

    if (completedCount === 0) {
        alert("There are no completed tasks.");
        return;
    }

    tasks = tasks.filter(
        task => !task.completed
    );

    saveTasks();

    refreshTaskList();
}


// ========================================
// DARK MODE
// ========================================

function toggleTheme() {

    document.body.classList.toggle("dark-mode");

    const darkMode =
        document.body.classList.contains("dark-mode");


    if (darkMode) {

        localStorage.setItem(
            "theme",
            "dark"
        );

        themeBtn.innerHTML =
            "☀️ Light Mode";

    } else {

        localStorage.setItem(
            "theme",
            "light"
        );

        themeBtn.innerHTML =
            "🌙 Dark Mode";
    }
}


// ========================================
// ENTER KEY TO ADD TASK
// ========================================

taskInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {
            addTask();
        }

    }
);


// ========================================
// CURRENT YEAR
// ========================================

document.getElementById("year").textContent =
    new Date().getFullYear();


// ========================================
// INITIAL LOAD
// ========================================

refreshTaskList();
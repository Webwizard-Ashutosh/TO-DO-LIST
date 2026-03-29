const taskInput  = document.getElementById("task-input");
const addBtn     = document.getElementById("add-btn");
const taskList   = document.getElementById("task-list");
const filterBtns = document.querySelectorAll(".filter-btn");
const clearBtn   = document.getElementById("clear-btn");
const tasksLeft  = document.getElementById("tasks-left");
const statTotal  = document.getElementById("stat-total");
const statActive = document.getElementById("stat-active");
const statDone   = document.getElementById("stat-done");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateStats() {
    const total     = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const active    = total - completed;
    statTotal.textContent  = total;
    statActive.textContent = active;
    statDone.textContent   = completed;
    tasksLeft.textContent  = active === 0 && total > 0
        ? "All done! 🎉"
        : `${active} task${active !== 1 ? 's' : ''} remaining`;
}

function renderTasks() {
    taskList.innerHTML = "";

    let filtered = tasks.filter(function(task) {
        if (currentFilter === "all")       return true;
        if (currentFilter === "active")    return !task.completed;
        if (currentFilter === "completed") return task.completed;
    });

    if (filtered.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">✦</span>
                <p class="empty-text">No tasks here</p>
            </div>`;
        updateStats();
        return;
    }

    filtered.forEach(function(task) {
        const li = document.createElement("li");
        if (task.completed) li.classList.add("completed");

        const checkbox = document.createElement("div");
        checkbox.className = "custom-checkbox" + (task.completed ? " checked" : "");
        checkbox.addEventListener("click", function() { toggleTask(task.id); });

        const span = document.createElement("span");
        span.textContent = task.text;

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.innerHTML = "✕";
        deleteBtn.addEventListener("click", function() { deleteTask(task.id); });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });

    updateStats();
}

function addTask() {
    const text = taskInput.value.trim();
    if (text === "") return;
    tasks.push({ id: Date.now(), text: text, completed: false });
    saveTasks();
    renderTasks();
    taskInput.value = "";
    taskInput.focus();
}

function deleteTask(id) {
    tasks = tasks.filter(function(task) { return task.id !== id; });
    saveTasks();
    renderTasks();
}

function toggleTask(id) {
    tasks = tasks.map(function(task) {
        if (task.id === id) task.completed = !task.completed;
        return task;
    });
    saveTasks();
    renderTasks();
}

clearBtn.addEventListener("click", function() {
    tasks = tasks.filter(function(task) { return !task.completed; });
    saveTasks();
    renderTasks();
});

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") addTask();
});

filterBtns.forEach(function(btn) {
    btn.addEventListener("click", function() {
        filterBtns.forEach(function(b) { b.classList.remove("active"); });
        btn.classList.add("active");
        currentFilter = btn.getAttribute("data-filter");
        renderTasks();
    });
});

renderTasks();
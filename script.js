let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

setInterval(() => {
    const date = new Date();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    const formattedHours = hours % 12 || 12;
    // const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    // const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    const time = `${formattedHours}:${minutes}:${seconds} ${ampm}`;

    document.querySelector(".time").textContent = time;

    const iconElement = document.querySelector(".icon");

    if (hours >= 6 && hours < 12) {
        iconElement.innerHTML = '<i class="fa-solid fa-cloud-sun"></i>';
    } else if (hours >= 12 && hours < 18) {
        iconElement.innerHTML = '<i class="fas fa-sun"></i>';
    } else if (hours >= 18 && hours < 21) {
        iconElement.innerHTML = '<i class="fa-solid fa-cloud-moon"></i>';
    } else {
        iconElement.innerHTML = '<i class="fas fa-moon"></i>';
    }
}, 1000);

document
    .getElementById("add-task-form")
    .addEventListener("submit", function (event) {
        event.preventDefault();

        const titleInput = document.getElementById("title");
        const descriptionInput = document.getElementById("description");
        const dueDateInput = document.getElementById("due-date");
        const categorySelect = document.getElementById("category");
        const dueTimeInput = document.getElementById("due-time");

        const title = titleInput.value;
        const description = descriptionInput.value;
        const dueDate = dueDateInput.value;
        const category = categorySelect.value; // Get the selected category value
        const dueTime = dueTimeInput.value;

        // Validate inputs (you can add more validation if needed)

        // Add the task
        addTask(title, description, dueDate, category, dueTime);

        // Clear the form
        titleInput.value = "";
        descriptionInput.value = "";
        dueDateInput.value = "";
        categorySelect.value = ""; // Reset the category selection
        dueTime.value = "";
    });

// Function to render tasks in the UI
function renderTasks() {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const taskElement = document.createElement("div");
        taskElement.classList.add("task");

        if (task.completed) {
            taskElement.classList.add("completed");
        }

        const editForm = `
            <input type="text" class="edit-title" value="${task.title}" />
            <input type="text" class="edit-description" value="${task.description}"/>
            <input type="date" class="edit-due-date" value="${task.dueDate}" />
            <input type="time" class="edit-due-time" value="${task.dueTime}" />
            <input type="text" class="edit-category" value="${task.category}" />
            <button onclick="saveEditedTask(${index})">Save</button>
            <button onclick="cancelEdit(${index})">Cancel</button>
        `;

        const displayContent = `
            <h3 class="t"><span>${task.title}</span></h3>
            <p class= "d">Description: <span>${task.description}</span></p>
            <p class= "de">Due Date: <span>${task.dueDate}</span></p>
            <p class= "de">Due Time: <span>${task.dueTime}</span></p>
            <p class="c">Category: <span>${task.category}</span></p>
            ${!task.completed
                ? `<button onclick="markAsCompleted(${index})"><i class="fa-solid fa-check"></i></button>`
                : ""
            }
            <button onclick="startEdit(${index})"><i class="fa-solid fa-pen-to-square"></i></button>
            <button onclick="deleteTask(${index})"><i class="fa-solid fa-trash"></i></button>
        `;

        taskElement.innerHTML = task.editing ? editForm : displayContent;
        taskList.appendChild(taskElement);
    });
}

// Function to save tasks to local storage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

// Function to add a new task
function addTask(title, description, dueDate, category, dueTime) {
    tasks.push({
        title,
        description,
        dueDate,
        category,
        completed: false,
        dueTime,
    });
    saveTasks();
}

// Function to mark a task as completed
function markAsCompleted(index) {
    tasks[index].completed = true;
    saveTasks();
    renderTasks();
}

// Function to edit a task
function startEdit(index) {
    tasks[index].editing = true;
    renderTasks();
}

// Function to save the edited task
function saveEditedTask(index) {
    const editedTitle = document.querySelector(
        `.task:nth-child(${index + 1}) .edit-title`
    ).value;
    const editedDescription = document.querySelector(
        `.task:nth-child(${index + 1}) .edit-description`
    ).value;
    const editedDueDate = document.querySelector(
        `.task:nth-child(${index + 1}) .edit-due-date`
    ).value;
    const editedDueTime = document.querySelector(
        `.task:nth-child(${index + 1}) .edit-due-time`
    ).value;
    const editedCategory = document.querySelector(
        `.task:nth-child(${index + 1}) .edit-category`
    ).value;

    if (editedTitle && editedDescription && editedDueDate && editedCategory) {
        tasks[index].title = editedTitle;
        tasks[index].description = editedDescription;
        tasks[index].dueDate = editedDueDate;
        tasks[index].dueTime = editedDueTime;
        tasks[index].category = editedCategory;
        tasks[index].editing = false;
        saveTasks();
        renderTasks();
    } else {
        alert("Please provide valid inputs.");
    }
}

// Function to cancel the editing process
function cancelEdit(index) {
    tasks[index].editing = false;
    renderTasks();
}

// Function to delete a task
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    
}

function sortTasksByDueDate() {
    tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
}

// Function to render sorted tasks
function renderSortedTasks() {
    sortTasksByDueDate();
    renderTasks();
}

// Add an event listener to a button (e.g., a "Sort" button) that triggers the sorting and rendering
const sortButton = document.getElementById("sort-button"); // Replace 'sort-button' with your button's ID
sortButton.addEventListener("click", renderSortedTasks);

function filterTasksByCompletion(selectedFilter) {
    if (selectedFilter === "All") {
        renderTasks();
    } else if (selectedFilter === "Completed") {
        const completedTasks = tasks.filter((task) => task.completed);
        renderFilteredTasks(completedTasks);
    } else if (selectedFilter === "Incomplete") {
        const incompleteTasks = tasks.filter((task) => !task.completed);
        renderFilteredTasks(incompleteTasks);
    }
}

// Function to render filtered tasks
function renderFilteredTasks(filteredTasks) {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    filteredTasks.forEach((task, index) => {
        const taskElement = document.createElement("div");
        taskElement.classList.add("task");

        if (task.completed) {
            taskElement.classList.add("completed");
        }

        const editForm = `
            <input type="text" class="edit-title" value="${task.title}" />
            <input type="text" class="edit-description" value="${task.description}"/>
            <input type="date" class="edit-due-date" value="${task.dueDate}" />
            <input type="time" class="edit-due-time" value="${task.dueTime}" />
            <input type="text" class="edit-category" value="${task.category}" />
            <button onclick="saveEditedTask(${index})">Save</button>
            <button onclick="cancelEdit(${index})">Cancel</button>
        `;

        const displayContent = `
    <h3 class="t"><span>${task.title}</span></h3>
    <p class= "d">Description: <span>${task.description}</span></p>
    <p class= "de">Due Date: <span>${task.dueDate}</span></p>
    <p class= "de">Due Time: <span>${task.dueTime}</span></p>
    <p class="c">Category: <span>${task.category}</span></p>
    ${!task.completed
                ? `<button onclick="markAsCompleted(${index})"><i class="fa-solid fa-check"></i></button>`
                : ""
            }
    <button onclick="startEdit(${index})"><i class="fa-solid fa-pen-to-square"></i></button>
    <button onclick="deleteTask(${index})"><i class="fa-solid fa-trash"></i></button>
        `;

        taskElement.innerHTML = task.editing ? editForm : displayContent;
        taskList.appendChild(taskElement);
    });
}

// Add event listener to the filter select dropdown
const filterSelect = document.getElementById("filter-select");
filterSelect.addEventListener("change", handleFilterChange);

// Function to handle filter change
function handleFilterChange() {
    const selectedFilter = filterSelect.value;
    filterTasksByCompletion(selectedFilter);
}

function searchTasks(query) {
    const filteredTasks = tasks.filter((task) => {
        const searchTerm = query.toLowerCase();
        const titleMatch = task.title.toLowerCase().includes(searchTerm);
        const descriptionMatch = task.description
            .toLowerCase()
            .includes(searchTerm);
        return titleMatch || descriptionMatch;
    });

    renderFilteredTasks(filteredTasks);
}

// Add an event listener to the voice search button
const voiceSearchButton = document.getElementById("voice-search-button");
voiceSearchButton.addEventListener("click", startVoiceRecognition);

// Function to start voice recognition
function startVoiceRecognition() {
    const recognition = new window.SpeechRecognition();
    recognition.lang = "en-US"; // Set the recognition language

    recognition.onresult = function (event) {
        const voiceInput = event.results[0][0].transcript;
        handleVoiceSearch(voiceInput);
    };

    recognition.start();
}

// Function to display the recognized task
function displayRecognizedTask(task) {
    const recognizedTaskContainer = document.getElementById(
        "recognized-task-container"
    );
    recognizedTaskContainer.textContent = "Recognized Task: " + task;
}
// Function to handle voice search
function handleVoiceSearch(query) {
    const searchInput = document.getElementById("search");
    searchInput.value = query;
    handleSearch(); // Trigger the search with the recognized query
}
// Add event listener to the search button

// Function to handle search button click
function handleSearch() {
    const searchInput = document.getElementById("search");
    const query = searchInput.value;
    searchTasks(query);
}

// Add event listener to search input field for pressing Enter key
const searchInput = document.getElementById("search");
searchInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        handleSearch();
    }
});

// Initial rendering of tasks
renderTasks();
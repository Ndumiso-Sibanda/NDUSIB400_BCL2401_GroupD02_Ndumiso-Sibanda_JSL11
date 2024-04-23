// TASK: import helper functions from utils
// TASK: import initialData

/*************************************************************************************************************************************************
 * FIX BUGS!!!
 * **********************************************************************************************************************************************/

// Function checks if local storage already has data, if not it loads initialData to localStorage
function initializeData() {
 if (!localStorage.getItem("tasks")) {
  localStorage.setItem("tasks", JSON.stringify(initialData));
  localStorage.setItem("showSideBar", "true");
 } else {
  console.log("Data already exists in localStorage");
 }
}

// TASK: Get elements from the DOM
const elements = {};

let activeBoard = "";

// Extracts unique board names from tasks
// TASK: FIX BUGS
function fetchAndDisplayBoardsAndTasks() {
 const tasks = getTasks();
 const boards = [...new Set(tasks.map((task) => task.board).filter(Boolean))];
 displayBoards(boards);
 if (boards.length > 0) {
  let activeBoard = JSON.parse(localStorage.getItem("activeBoard"));
  activeBoard = activeBoard || boards[0]; // Use default board if no active board in localStorage
  elements.headerBoardName.textContent = activeBoard;
  styleActiveBoard(activeBoard);
  refreshTasksUI();
 }
}

function displayBoards(boards) {
 const boardsContainer = document.getElementById("boards-nav-links-div");
 boardsContainer.innerHTML = ""; // Clears the container
 boards.forEach((board) => {
  const boardElement = document.createElement("button");
  boardElement.textContent = board;
  boardElement.classList.add("board-btn");
  boardElement.addEventListener("click", () => {
   elements.headerBoardName.textContent = board;
   filterAndDisplayTasksByBoard(board);
   activeBoard = board; // Assigns active board
   localStorage.setItem("activeBoard", JSON.stringify(activeBoard));
   styleActiveBoard(activeBoard);
  });
  boardsContainer.appendChild(boardElement);
 });
}

function filterAndDisplayTasksByBoard(boardName) {
 const tasks = getTasks(); // Fetch tasks from a simulated local storage function
 const filteredTasks = tasks.filter((task) => task.board === boardName);

 elements.columnDivs.forEach((column) => {
  const status = column.getAttribute("data-status");
  // Reset column content while preserving the column title
  column.innerHTML = `<div class="column-head-div">
                          <span class="dot" id="${status}-dot"></span>
                          <h4 class="columnHeader">${status.toUpperCase()}</h4>
                        </div>`;

  const tasksContainer = document.createElement("div");
  column.appendChild(tasksContainer);

  filteredTasks
   .filter((task) => task.status === status)
   .forEach((task) => {
    const taskElement = document.createElement("div");
    taskElement.classList.add("task-div");
    taskElement.textContent = task.title;
    taskElement.setAttribute("data-task-id", task.id);

    // Listen for a click event on each task and open a modal
    taskElement.addEventListener("click", () => {
     openEditTaskModal(task);
    });

    tasksContainer.appendChild(taskElement);
   });
 });
}

function styleActiveBoard(boardName) {
 document.querySelectorAll(".board-btn").forEach((btn) => {
  if (btn.textContent === boardName) {
   btn.classList.add("active");
  } else {
   btn.classList.remove("active");
  }
 });
}

function addTaskToUI(task) {
 const column = document.querySelector(
  '.column-div[data-status="${task.status}"]'
 );
 if (!column) {
  console.error(`Column not found for status: ${task.status}`);
  return;
 }

 let tasksContainer = column.querySelector(".tasks-container");
 if (!tasksContainer) {
  console.warn(
   `Tasks container not found for status: ${task.status}, creating one.`
  );
  tasksContainer = document.createElement("div");
  tasksContainer.className = "tasks-container";
  column.appendChild(tasksContainer);
 }

 const taskElement = document.createElement("div");
 taskElement.className = "task-div";
 taskElement.textContent = task.title; // Modify as needed
 taskElement.setAttribute("data-task-id", task.id);

 tasksContainer.appendChild();
}

function setupEventListeners() {
 // Cancel editing task event listener
 const cancelEditBtn = document.getElementById("cancel-edit-btn");
 cancelEditBtn.addEventListener("click", () =>
  toggleModal(false, elements.editTaskModal)
 );

 // Cancel adding new task event listener
 const cancelAddTaskBtn = document.getElementById("cancel-add-task-btn");
 cancelAddTaskBtn.addEventListener("click", () => {
  toggleModal(false);
  elements.filterDiv.style.display = "none"; // Also hide the filter overlay
 });
}

// Clicking outside the modal to close it
elements.filterDiv.addEventListener("click", () => {
 toggleModal(false);
 elements.filterDiv.style.display = "none"; // Also hide the filter overlay
});

// Show sidebar event listener
elements.hideSideBarBtn.addEventListener("click", () => toggleSidebar(false));
elements.showSideBarBtn.addEventListener("click", () => toggleSidebar(true));

// Theme switch event listener
elements.themeSwitch.addEventListener("change", toggleTheme);

// Show Add New Task Modal event listener
elements.createNewTaskBtn.addEventListener("click", () => {
 toggleModal(true);
 elements.filterDiv.style.display = "block"; // Also show the filter overlay
});

// Add new task form submission event listener
elements.modalWindow.addEventListener("submit", (event) => {
 addTask(event);
});

// Toggles tasks modal
// Task: Fix bugs
function toggleModal(show, modal = elements.modalWindow) {
 modal.style.display = show ? "block" : "none";
}

/*************************************************************************************************************************************************
 * COMPLETE FUNCTION CODE
 * **********************************************************************************************************************************************/

function addTask(event) {
 event.preventDefault();

 //Assign user input to the task object
 const task = {};
 const newTask = createNewTask(task);
 if (newTask) {
  addTaskToUI(newTask);
  toggleModal(false);
  elements.filterDiv.style.display = "none"; // Also hide the filter overlay
  event.target.reset();
  refreshTasksUI();
 }
}

function toggleSidebar(show) {}

function toggleTheme() {}

function openEditTaskModal(task) {
 // Set task details in modal inputs
 // Assuming you have input fields in your modal with IDs 'task-title' and 'task-description'
 document.getElementById("task-title").value = task.title;
 document.getElementById("task-description").value = task.description;

 // Get button elements from the task modal
 const saveChangesBtn = document.getElementById("save-changes-btn");
 const deleteTaskBtn = document.getElementById("delete-task-btn");

 // Call saveTaskChanges upon click of Save Changes button
 saveChangesBtn.addEventListener("click", () => saveTaskChanges(task));

 // Delete task using a helper function and close the task modal
 deleteTaskBtn.addEventListener("click", () => {
  deleteTask(task);
  toggleModal(false, elements.editTaskModal);
 });

 toggleModal(true, elements.editTaskModal); // Show the edit task modal
}

function saveTaskChanges(taskId) {
 // Get new user inputs
 const newTitle = document.getElementById("task-title").value;
 const newDescription = document.getElementById("task-description").value;

 // Create an object with the updated task details
 const updatedTask = {
  id: taskId,
  title: newTitle,
  description: newDescription,
  // Assuming other properties like status and board remain the same
 };

 // Update task using a helper function
 updateTask(updatedTask);

 // Close the modal and refresh the UI to reflect the changes
 toggleModal(false, elements.editTaskModal);
 refreshTasksUI();
}

/*************************************************************************************************************************************************/

document.addEventListener("DOMContentLoaded", function () {
 init(); // init is called after the DOM is fully loaded
});

function init() {
 setupEventListeners();
 const showSidebar = localStorage.getItem("showSideBar") === "true";
 toggleSidebar(showSidebar);
 const isLightTheme = localStorage.getItem("light-theme") === "enabled";
 document.body.classList.toggle("light-theme", isLightTheme);
 fetchAndDisplayBoardsAndTasks(); // Initial display of boards and tasks
}

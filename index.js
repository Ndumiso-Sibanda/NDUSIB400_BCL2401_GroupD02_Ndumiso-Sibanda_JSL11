// TASK: import helper functions from utils
// TASK: import initialData
import {
 getTasks,
 createNewTask,
 putTask,
 deleteTask,
} from "./utils/taskFunctions.js";
import { initialData } from "./initialData.js";

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
initializeData();

// TASK: Get elements from the DOM
// DOM elements for the Navigation Sidebar
const elements = {
 headerBoardName: document.getElementById("header-board-name"),
 sideBar: document.querySelector(".side-bar"),
 sideLogoDiv: document.getElementById("logo"),
 sideBarDiv: document.getElementById("side-bar-div"),
 boardsNavLinksDiv: document.getElementById("boards-nav-links-div"),
 themeSwitch: document.getElementById("switch"),
 hideSideBarBtn: document.getElementById("hide-side-bar-btn"),
 showSideBarBtn: document.getElementById("show-side-bar-btn"),
 sideBarBottom: document.querySelector("side-bar-bottom"),

 // DOM elements for the Main Layout: Header with board title, add task button
 header: document.getElementById("header"),
 headerBoardName: document.getElementById("header-board-name"),
 dropdownBtn: document.getElementById("dropdownBtn"),
 addNewTaskBtn: document.getElementById("add-new-task-btn"),
 editBoardBtn: document.getElementById("edit-board-btn"),
 deleteBoardBtn: document.getElementById("deleteBoardBtn"),

 // DOM elements for the Main Layout: main content area for task columns
 columnDivs: document.querySelectorAll(".column-div"),
 tasksContainers: document.querySelectorAll(".tasks-container"),

 // DOM elements for New Task Modal: Form for adding a new task
 modalWindow: document.getElementById("new-task-modal-window"),
 titleInput: document.getElementById("title-input"),
 descInput: document.getElementById("desc-input"),
 selectStatus: document.getElementById("select-status"),
 createNewTaskBtn: document.getElementById("add-new-task-btn"),
 cancelAddTaskBtn: document.getElementById("cancel-add-task-btn"),

 // DOM elements for Edit Task Modal: Form for editing an existing task's details
 editTaskModal: document.querySelector(".edit-task-modal-window"),
 editTaskForm: document.getElementById("edit-task-form"),
 editTaskTitleInput: document.getElementById("edit-task-title-input"),
 editTaskDescInput: document.getElementById("edit-task-desc-input"),
 editSelectStatus: document.getElementById("edit-select-status"),
 saveTaskChangesBtn: document.getElementById("save-task-changes-btn"),
 cancelEditBtn: document.getElementById("cancel-edit-btn"),
 deleteTaskBtn: document.getElementById("delete-task-btn"),

 // Filter Div
 filterDiv: document.getElementById("filterDiv"),
};

let activeBoard = "";

// Extracts unique board names from tasks
// TASK: FIX BUGS

function fetchAndDisplayBoardsAndTasks() {
 const tasks = getTasks();
 const boards = [...new Set(tasks.map((task) => task.board).filter(Boolean))];
 displayBoards(boards);
 if (boards.length > 0) {
  const localStorageBoard = JSON.parse(localStorage.getItem("activeBoard"));
  activeBoard = localStorageBoard ? localStorageBoard : boards[0];
  elements.headerBoardName.textContent = activeBoard;
  styleActiveBoard(activeBoard);
  refreshTasksUI();
 }
}

// Creates different boards in the DOM
// TASK: Fix Bugs
function displayBoards(boards) {
 const boardsContainer = document.querySelector("#boards-nav-links-div"); // change id to 'container'
 boardsContainer.innerHTML = ""; // Clears the container ***
 boards.forEach((board) => {
  const boardElement = document.createElement("button");
  boardElement.textContent = board;
  boardElement.classList.add("board-btn");
  boardElement.addEventListener("click", () => {
   // replace click() with eventListener
   elements.headerBoardName.textContent = board;
   filterAndDisplayTasksByBoard(board);
   activeBoard = board; //assigns active board
   localStorage.setItem("activeBoard", JSON.stringify(activeBoard));
   styleActiveBoard(activeBoard);
  });
  boardsContainer.appendChild(boardElement);
 });
}
const colTitles = {
 todo: "todo",
 doing: "doing",
 done: "done",
};

// Filters tasks corresponding to the board name and displays them on the DOM.
// TASK: Fix Bugs
function filterAndDisplayTasksByBoard(boardName) {
 const tasks = getTasks(); // Fetch tasks from a simulated local storage function
 const filteredTasks = tasks.filter((task) => task.board === boardName);

 // Ensure the column titles are set outside of this function or correctly initialized before this function runs

 elements.columnDivs.forEach((column) => {
  const status = column.getAttribute("data-status");
  // Reset column content while preserving the column title
  const colTitle = colTitles[status];
  column.innerHTML = `<div class="column-head-div">
                          <span class="dot" id="${status}-dot"></span>
                          <h4 class="columnHeader">${colTitle.toUpperCase()}</h4>
                        </div>`;

  const tasksContainer = document.createElement("div");
  column.appendChild(tasksContainer);

  filteredTasks
   .filter((task) => task.status === status)
   .forEach((task) => {
    // add === for comparison
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

function refreshTasksUI() {
 filterAndDisplayTasksByBoard(activeBoard);
}

// Style the active board by adding an active class
// TASK: Fix Bugs
function styleActiveBoard(boardName) {
 document.querySelectorAll(".board-btn").forEach((btn) => {
  if (btn.textContent === boardName) {
   btn.classList.add("active");
  } else {
   // use classList
   btn.classList.remove("active");
  }
 });
}

function addTaskToUI(task) {
 const column = document.querySelector(
  `.column-div[data-status="${task.status}"]`
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
 taskElement.className = "task-div"; // change class name OR task-div
 taskElement.textContent = task.title; // Modify as needed
 taskElement.setAttribute("data-task-id", task.id);

 tasksContainer.appendChild(taskElement);
}

function setupEventListeners() {
 // Cancel editing task event listener
 const cancelEditBtn = document.getElementById("cancel-edit-btn");
 cancelEditBtn.addEventListener("click", () => {
  toggleModal(false, elements.editTaskModal);
 });

 // Cancel adding new task event listener
 const cancelAddTaskBtn = document.getElementById("cancel-add-task-btn");
 cancelAddTaskBtn.addEventListener("click", () => {
  toggleModal(false);
  elements.filterDiv.style.display = "none"; // Also hide the filter overlay
 });

 // Clicking outside the modal to close it
 elements.filterDiv.addEventListener("click", () => {
  toggleModal(false);
  elements.filterDiv.style.display = "none"; // Also hide the filter overlay
 });

 // Show sidebar event listener
 elements.hideSideBarBtn.addEventListener("click", () => {
  toggleSidebar(false);
 });
 elements.showSideBarBtn.addEventListener("click", () => {
  toggleSidebar(true);
 });

 //elements.sideBarBottom.style.paddingTop = "300px";

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
}

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
 const task = {
  title: elements.titleInput.value,
  description: elements.descInput.value,
  status: elements.selectStatus.value,
  board: activeBoard,
 };

 const newTask = createNewTask(task);
 if (newTask) {
  addTaskToUI(newTask);
  toggleModal(false);
  elements.filterDiv.style.display = "none"; // Also hide the filter overlay
  event.target.reset();
  refreshTasksUI();
 }
}

function toggleSidebar(show) {
 if (show) {
  elements.sideBar.style.display = "block";
  elements.showSideBarBtn.style.display = "none";
 } else {
  elements.sideBar.style.display = "none";
  elements.showSideBarBtn.style.display = "block";
 }

 localStorage.setItem("showSideBar", show);
}

function toggleTheme() {
 const isLightTheme = document.body.classList.contains("light-theme");
 document.body.classList.toggle("light-theme");
 localStorage.setItem("light-theme", !isLightTheme ? "enabled" : "disabled");

 if (isLightTheme) {
  localStorage.setItem("logo-theme", "./assets/logo-dark.svg");
  localStorage.setItem("light-theme", "disabled");
 } else {
  localStorage.setItem("logo-theme", "./assets/logo-light.svg");
  localStorage.setItem("light-theme", "enabled");
 }

 elements.logo.src = localStorage.getItem("logo-theme");
}
function openEditTaskModal(task) {
 // Get button elements from the task modal
 elements.editTaskTitleInput.value = task.title;
 elements.editSelectStatus.value = task.status;
 elements.editTaskDescInput.value = task.description;
 // Call saveTaskChanges upon click of Save Changes button
 elements.saveTaskChangesBtn.onclick = () => {
  saveTaskChanges(task.id);
  toggleModal(false, elements.editTaskModal);
  refreshTasksUI();
 };
 // Delete task using a helper function and close the task modal
 elements.deleteTaskBtn.onclick = () => {
  if (confirm("Are you sure you want to delete this task?")) {
   //  Extra feature
   deleteTask(task.id);
   toggleModal(false, elements.editTaskModal);
   refreshTasksUI();
  }
 };
 toggleModal(true, elements.editTaskModal); // Show the edit task modal
 refreshTasksUI();
}

function saveTaskChanges(taskId) {
 // Create an object with the updated task details
 const updatedTaskDetails = {
  id: taskId,
  title: elements.editTaskTitleInput.value,
  description: elements.editTaskDescInput,
  status: elements.editSelectStatus.value,
  board: activeBoard,
 };

 // Update task using a helper functoin
 putTask(taskId, updatedTaskDetails);

 // Close the modal and refresh the UI to reflect the changes
 toggleModal(false, elements.editTaskModal);
 refreshTasksUI();
}

/*************************************************************************************************************************************************/

document.addEventListener("DOMContentLoaded", function () {
 init(); // init is called after the DOM is fully loaded
});

function init() {
 if (localStorage.getItem("logo-theme") === "./assets/logo-light.svg") {
  elements.logo.src = "./assets/logo-light.svg";
 }
 setupEventListeners();
 const showSidebar = localStorage.getItem("showSideBar") === "true";
 toggleSidebar(showSidebar);
 const isLightTheme = localStorage.getItem("light-theme") === "enabled";
 document.body.classList.toggle("light-theme", isLightTheme);
 elements.themeSwitch.checked = isLightTheme;
 fetchAndDisplayBoardsAndTasks(); // Initial display of boards and tasks
}

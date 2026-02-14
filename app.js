/* ============================================================
   TO DO APP
   ------------------------------------------------------------
   Simple task manager using:
   - JavaScript
   - LocalStorage persistence
   - Dynamic DOM manipulation
   - Date/time sorting
   - Overdue highlighting
   ============================================================ */


/* =======================
   DOM ELEMENT REFERENCES
   ======================= */

const todoForm = document.querySelector('form');
const todoInput = document.getElementById('todo-input');
const todoListUL = document.getElementById('todo-list');
const todoDateInput = document.getElementById("todo-date");
const todoTimeInput = document.getElementById("todo-time");


/* =======================
   APPLICATION STATE
   ======================= */

// Retrieve stored todos from localStorage or initialize empty array
let allTodos = getTodos();

// Initial render when page loads
updateTodoList();


/* =======================
   EVENT LISTENERS
   ======================= */

// Handle form submission
todoForm.addEventListener('submit', function (e) {
    e.preventDefault();
    addTodo();
});


/* =======================
   CORE FUNCTIONALITY
   ======================= */

/**
 * Adds a new todo item to the list
 */
function addTodo() {
    const todoText = todoInput.value.trim();
    const todoDate = todoDateInput.value;
    const todoTime = todoTimeInput.value;

    if (todoText.length === 0) return;

    // 🔥 Validar data passada
    if (todoDate) {
        const selectedDateTime = new Date(`${todoDate}T${todoTime || "00:00"}`);
        const now = new Date();

        if (selectedDateTime < now) {
            alert("⚠️ This date/time has already passed. Please select a future date.");
            return;
        }
    }

    const todoObject = {
        text: todoText,
        completed: false,
        date: todoDate,
        time: todoTime
    };

    allTodos.push(todoObject);

    saveTodos();
    updateTodoList();
    resetInputs();
}


/**
 * Renders the entire todo list
 */
function updateTodoList() {
    todoListUL.innerHTML = "";

    // Sort by date & time (earliest first)
    allTodos.sort((a, b) => {
        const dateA = new Date(`${a.date || ""}T${a.time || "00:00"}`);
        const dateB = new Date(`${b.date || ""}T${b.time || "00:00"}`);
        return dateA - dateB;
    });

    allTodos.forEach((todo, index) => {
        const todoItem = createTodoItem(todo, index);
        todoListUL.append(todoItem);

        // Smooth animation effect
        setTimeout(() => {
            todoItem.classList.add("show");
        }, 10);
    });
}


/**
 * Creates a single todo list item element
 */
function createTodoItem(todo, index) {
    const todoId = `todo-${index}`;
    const todoLI = document.createElement("li");

    todoLI.className = "todo";

    // Check if overdue
    if (todo.date) {
        const now = new Date();
        const todoDateTime = new Date(`${todo.date}T${todo.time || "00:00"}`);

        if (todoDateTime < now && !todo.completed) {
            todoLI.classList.add("overdue");
        }
    }

    todoLI.innerHTML = `
        <input type="checkbox" id="${todoId}">
        
        <label for="${todoId}" class="custom-checkbox">
            <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" 
                 height="24px" viewBox="0 -960 960 960" width="24px">
                <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
            </svg>
        </label>

        <label for="${todoId}" class="todo-text">
            ${todo.text}
            ${todo.date || todo.time ? `
                <br>
                <small style="color: var(--secondary-color)">
                    ${todo.date} ${todo.time}
                </small>
            ` : ""}
        </label>

        <button class="delete-button"> 
           <svg fill= "var(--text-color)" xmlns="http://www.w3.org/2000/svg" 
              height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
              <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
           </svg> 
         </button>
    `;

    const deleteButton = todoLI.querySelector(".delete-button");
    const checkbox = todoLI.querySelector("input");

    deleteButton.addEventListener("click", () => {
        deleteTodoItem(index);
    });

    checkbox.addEventListener("change", () => {
        allTodos[index].completed = checkbox.checked;
        saveTodos();
        updateTodoList();
    });

    checkbox.checked = todo.completed;

    return todoLI;
}


/**
 * Deletes a todo item
 */
function deleteTodoItem(index) {
    allTodos = allTodos.filter((_, i) => i !== index);
    saveTodos();
    updateTodoList();
}


/* =======================
   STORAGE MANAGEMENT
   ======================= */

/**
 * Save todos to localStorage
 */
function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(allTodos));
}

/**
 * Retrieve todos from localStorage
 */
function getTodos() {
    return JSON.parse(localStorage.getItem("todos") || "[]");
}


/* =======================
   UTILITIES
   ======================= */

/**
 * Clears input fields after adding a task
 */
function resetInputs() {
    todoInput.value = "";
    todoDateInput.value = "";
    todoTimeInput.value = "";
}

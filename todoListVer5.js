/* -------------------- Global Variables --------------------  */

let todoLists = document.getElementById("todoLists") // Container for the whole todo lists 
let btnAdd = document.getElementById("btn-add") // Button of「新增」
let newToDo = document.getElementById("todo-text-input") // Textbox for entering new todo content
const localStorageKey = "todo" // Key to data in Local Storage
let currentTodoObj = {} // Value of data in Local Storage


/* -------------------- Event Registration --------------------  */

btnAdd.addEventListener("click", generateToDoItem)

/* -------------------- Functions --------------------  */

function generateToDoItem() {
    // Create a container to hold a todo item
    let divForATodoItem = document.createElement("div")
    Object.assign(divForATodoItem, {
        id: Date.now(),
        style: "border: 1px solid lightgray; padding: 25px; display: grid; gap: 2%; grid-template-columns: 76% 10% 10%;"
    })

    // Create components of a todo item : Checkbox, Textbox, Edit Button, and Delete Button
    let checkboxAndTextbox = createCheckboxAndTextbox();
    let btnEdit = createEditButton();
    let btnDelete = createDeleteButton();

    divForATodoItem.append(checkboxAndTextbox, btnEdit, btnDelete)
    todoLists.append(divForATodoItem)

    // Put the new todo item to local storage
    createNewTodoInStorage(divForATodoItem)

    return divForATodoItem
}

function createCheckboxAndTextbox() {
    // Create a container to hold the Checkbox & Textbox
    let divForCheckboxAndTextbox = document.createElement("div")
    divForCheckboxAndTextbox.setAttribute("class", "input-group input-group-lg")

    // Create a container to hold the Checkbox 
    let divForCheckbox = document.createElement("div")
    divForCheckbox.setAttribute("class", "input-group-text")

    // Create a Checkbox
    let checkbox = document.createElement("input")
    Object.assign(checkbox, {
        type: "checkbox",
        className: "form-check-input mt-0 checkbox",
    })

    // Create a Textbox
    let todoTextBox = document.createElement("input")

    Object.assign(todoTextBox, {
        type: "text",
        className: "form-control todo-text bg-light",
        ariaLabel: "Text input with checkbox",
        value: newToDo.value.trim(),
        readOnly: true
    })

    divForCheckbox.append(checkbox)
    divForCheckboxAndTextbox.append(divForCheckbox, todoTextBox)


    // Event registration for the Checkbox : strike through the text and update the data in local storage when checked
    checkbox.addEventListener("click", (clickEvent) => {
        let storedTodoObj = getTodoFromStorage()
        let keyToCheck = clickEvent.target.parentNode.parentNode.parentNode.id
        console.log(keyToCheck)

        todoTextBox.style.textDecoration = checkbox.checked ? "line-through" : "none"
        storedTodoObj[keyToCheck].checked = checkbox.checked

        updateStorage(storedTodoObj)

        if (checkbox.checked) {
            let todoItem = checkbox.parentElement.parentElement.parentElement
            todoLists.appendChild(todoItem)
        }
    })
    return divForCheckboxAndTextbox
}

function createEditButton() {
    // Create a「編輯」button 
    let btnEdit = document.createElement("button")
    Object.assign(btnEdit, {
        type: "button",
        className: "btn btn-warning",
        innerText: "編輯"
    })

    // Event registration for the 「編輯」button  : edit the todo content and update the data in local storage when clicked
    btnEdit.addEventListener("click", (clickEvent) => {

        let todoElement = clickEvent.target.parentNode
        let keyToEdit = todoElement.id
        let todoTextBox = todoElement.querySelector(".todo-text")

        // Switch the appearance of Edit Button
        btnEdit.classList.toggle('btn-warning');
        btnEdit.classList.toggle('btn-success');
        btnEdit.innerText = btnEdit.innerText === "編輯" ? "保存" : "編輯";
        todoTextBox.readOnly = !todoTextBox.readOnly;
        todoTextBox.classList.toggle('bg-white');
        todoTextBox.classList.toggle('bg-light');

        // Update the todo content
        if (btnEdit.innerText === "編輯") {
            let storedtodoObj = getTodoFromStorage()
            let valueToSave = todoTextBox.value
            storedtodoObj[keyToEdit].text = valueToSave

            updateStorage(storedtodoObj)
        }
    })
    return btnEdit
}

function createDeleteButton() {
    // Create a「刪除」button 
    let btnDelete = document.createElement("button")
    Object.assign(btnDelete, {
        type: "button",
        className: "btn btn-danger delete-button",
        innerText: "刪除"
    })

    // Make an event registration for the 「刪除」button : delete the todo item
    btnDelete.addEventListener("click", deleteTodoItem)
    return btnDelete
}

function deleteTodoItem(clickEvent) {
    // Remove the todo item from DOM
    let todoElement = clickEvent.target.parentNode
    todoElement.remove()

    // Remove the todo item from Local Storage
    deleteTodoFromStorage(todoElement)
}

function clearInputTextbox() {
    newToDo.value = ""
}

/* -------------------- Local Storage --------------------  */

//Create
function createNewTodoInStorage(newTodoItem) {
    // Using created time as the key to a new todo item
    const timestamp = newTodoItem.id
    let todoTextBox = newTodoItem.querySelector(".todo-text")
    let checkbox = newTodoItem.querySelector(".checkbox")
    const todoContent = {
        "text": todoTextBox.value.trim(),
        "checked": checkbox.checked
    }
    currentTodoObj[timestamp] = todoContent

    updateStorage(currentTodoObj)
    clearInputTextbox()
}

//Read(Get)
function getTodoFromStorage() {
    const storedTodoObj = JSON.parse(localStorage.getItem(localStorageKey))
    if (storedTodoObj) {
        currentTodoObj = storedTodoObj;
    }
    return currentTodoObj
}

//Update
function updateStorage(todoObj) {
    const jsonStr = JSON.stringify(todoObj)
    localStorage.setItem(localStorageKey, jsonStr)
}

//Delete
function deleteTodoFromStorage(todoElement) {
    let storedTodoObj = getTodoFromStorage()
    let keyToRemove = todoElement.id
    console.log(keyToRemove)

    delete storedTodoObj[keyToRemove]
    updateStorage(storedTodoObj)
}

function renderTodoList() {
    // Clear out the todo list
    todoLists.innerHTML = '';

    const storedTodoObj = getTodoFromStorage();

    // Re-render the todo list
    for (let timestamp in storedTodoObj) {

        // Create a container to hold a todo item
        let divForATodoItem = document.createElement("div")
        Object.assign(divForATodoItem, {
            id: timestamp,
            style: "border: 1px solid lightgray; padding: 25px; display: grid; gap: 2%; grid-template-columns: 76% 10% 10%;"
        })

        // Create components of a todo item : Checkbox, Textbox, Edit Button, and Delete Button
        let checkboxAndTextbox = createCheckboxAndTextbox();
        let btnEdit = createEditButton();
        let btnDelete = createDeleteButton();

        // Set TextBox value and Checkbox checked
        let todoTextBox = checkboxAndTextbox.querySelector(".todo-text");
        let checkbox = checkboxAndTextbox.querySelector(".checkbox");
        todoTextBox.value = storedTodoObj[timestamp].text;
        checkbox.checked = storedTodoObj[timestamp].checked;
        todoTextBox.style.textDecoration = checkbox.checked ? "line-through" : "none";

        divForATodoItem.append(checkboxAndTextbox, btnEdit, btnDelete)
        todoLists.append(divForATodoItem)
    }
}

window.onload = function () {
    renderTodoList()
}
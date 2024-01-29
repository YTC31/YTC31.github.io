/* -------------------- Variables --------------------  */
const btnToday = document.querySelector('.btn-today')
const btnLastMonth = document.querySelector('.btn-last-month')
const btnNextMonth = document.querySelector('.btn-next-month')
const btnAddTodo = document.querySelector('.btn-add-todo') // 加號
const btnSaveTodo = document.querySelector('.btn-save-todo') // 新增
const btnReviseTodo = document.querySelector('.btn-update')
const btnDeleteTodo = document.querySelector('.btn-delete')
const calendarTitle = document.querySelector('h1')
const calendarBody = document.querySelector('.calendar-body')
const localStorageKey = "myCalendar"
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const today = new Date()
let currentYear, currentMonth;

const createTodoModal = bootstrap.Modal.getOrCreateInstance("#create_todo_modal");
const updateTodoModal = bootstrap.Modal.getOrCreateInstance("#update_todo_modal")
const dateInput = document.querySelector('#date_input')
const timeInput = document.querySelector('#time_input')
const contentInput = document.querySelector('#todo_content')
const alertDiv = document.querySelector('#requiredAlert')
const dateUpdateInput = document.querySelector('#date_update_input')
const timeUpdateInput = document.querySelector('#time_update_input')
const contentUpdateInput = document.querySelector('#content_update_input')

/* -------------------- Event Registration --------------------  */
btnToday.addEventListener('click', initCalendar)
btnLastMonth.addEventListener('click', showLastMonth)
btnNextMonth.addEventListener('click', showNextMonth)
btnSaveTodo.addEventListener('click', saveTodo)

/* -------------------- Functions --------------------  */
window.onload = function () {
    initCalendar()
}

function initCalendar() {
    currentYear = today.getFullYear()
    currentMonth = today.getMonth() // 0 for Jan.
    renderCalendar(currentYear, currentMonth)
}

function showLastMonth() {
    currentMonth--
    if (currentMonth < 0) {
        currentYear--
        currentMonth = 11
    }
    renderCalendar(currentYear, currentMonth)
}

function showNextMonth() {
    currentMonth++
    if (currentMonth > 11) {
        currentYear++
        currentMonth = 0
    }
    renderCalendar(currentYear, currentMonth)
}

function renderCalendar(year, month) {
    renderTitle(year, month)
    renderDates(year, month)
    checkAndRenderTodos()
}

function renderTitle(year, month) {
    const monthName = months[month]
    calendarTitle.innerText = `${year} ${monthName}`
}

function renderDates(year, month) {
    calendarBody.innerHTML = ""
    // 當月第一天
    let firstDateOfMonth = new Date(year, month, 1)
    // 當月最後一天
    let lastDateOfMonth = new Date(year, month + 1, 0)
    // 當月第一天：星期幾
    let dayOfTheFirstDate = firstDateOfMonth.getDay()
    // 當月最後一天：星期幾
    let dayOfTheLastDate = lastDateOfMonth.getDay()

    // 當月第一格幾月幾日 = 1 號 - 該月 1 號的星期幾數字
    let starNum = 1 - dayOfTheFirstDate
    //let startDate = new Date(year, month, starNum)

    // 當月最後一格幾月幾日 = 當月最後一號 + 6 - 該月最後一號的星期幾數字
    let endNum = lastDateOfMonth.getDate() + 6 - dayOfTheLastDate
    //let endDate = new Date(year, month, endNum)

    for (starNum; starNum <= endNum; starNum++) {
        const currDate = new Date(year, month, starNum)
        const dateDiv = document.createElement('div')
        const dateP = document.createElement('p')
        const dateUL = document.createElement('ul')
        dateDiv.setAttribute('class', 'border')

        if (
            currDate.getFullYear() === today.getFullYear() &&
            currDate.getMonth() === today.getMonth() &&
            currDate.getDate() === today.getDate()
        ) {
            dateP.setAttribute('class', 'badge rounded-pill text-bg-danger')
        }
        dateP.dataset.date = getDateStr(currDate)
        dateP.innerHTML = `${currDate.getDate()}`
        dateDiv.append(dateP, dateUL)
        calendarBody.append(dateDiv)

        dateDiv.addEventListener('click', function () {
            dateInput.value = getDateStr(currDate)
            timeInput.value = '00:00:00'
            alertDiv.innerText = ''
            createTodoModal.show()
        })
    }
}

function checkAndRenderTodos() {
    const storedTodos = getTodosFromStorage()
    if (storedTodos) {
        renderTodos(storedTodos)
    }
}

function renderTodos(storedTodos) {
    let listItems = document.querySelectorAll('li')
    listItems.forEach(item => item.remove())

    storedTodos.forEach(todo => {
        const targetDateNode = document.querySelector(`p[data-date="${todo.date}"]`);
        if (targetDateNode) {
            const elementTodo = document.createElement('li')
            elementTodo.dataset.id = todo.id
            elementTodo.innerText = todo.content
            targetDateNode.nextElementSibling.append(elementTodo)

            elementTodo.addEventListener('click', function (e) {
                // 避免跳出「新增行程」Modal
                e.stopPropagation()
                // 將 todo item 內容顯示到「編輯行程」Modal 上
                dateUpdateInput.value = todo.date
                timeUpdateInput.value = todo.time
                contentUpdateInput.value = todo.content
                updateTodoModal.show()

                btnDeleteTodo.onclick = function () {
                    const targetTodo = e.target
                    targetTodo.remove()
                    deleteTodoFromStorage(targetTodo)
                    updateTodoModal.hide()
                }

                btnReviseTodo.onclick = function () {
                    const dateUpdate = dateUpdateInput.value
                    const timeUpdate = timeUpdateInput.value
                    const todoUpdate = contentUpdateInput.value
                    const alertboxUpdate = document.querySelector('#requiredAlert_update')
                    if (checkRequiredAreas(dateUpdate, timeUpdate, todoUpdate, alertboxUpdate)) {
                        reviseTodoToStorage(targetTodo)
                        checkAndRenderTodos()
                        updateTodoModal.hide()
                    }
                }
            })
        }
    })
};

function saveTodo() {
    const todoDate = dateInput.value
    const todoTime = timeInput.value
    const todoContent = contentInput.value.trim()

    // 點擊「新增」按鈕後執行的函式
    if (checkRequiredAreas(todoDate, todoTime, todoContent, alertDiv)) {
        saveTodoToStorage()
        checkAndRenderTodos()
        createTodoModal.hide()
        clearModal()
    }
}

function checkRequiredAreas(todoDate, todoTime, todoContent, alertDiv) {
    if (!todoDate || !todoTime || !todoContent) {
        alertDiv.innerText = "三格皆填寫才可儲存"
        return false
    } else {
        return true
    }
}

function getDateStr(dateTime) {
    const year = dateTime.getFullYear()
    const month = (dateTime.getMonth() + 1).toString().padStart(2, 0)
    const date = dateTime.getDate().toString().padStart(2, 0)
    return `${year}-${month}-${date}`
}

function clearModal() {
    timeInput.value = ''
    contentInput.value = ''
    alertDiv.innerText = ''
    document.querySelector('#requiredAlert_update').innerText = ''
}

/* -------------------- Functions Regarding Local Storage --------------------  */
function getTodosFromStorage() {
    let storedTodos = JSON.parse(localStorage.getItem(localStorageKey))
    if (storedTodos) {
        return storedTodos
    } else {
        return storedTodos = []
    }
}

function saveTodoToStorage() {
    let currentTodoArr = getTodosFromStorage()
    const timestamp = Date.now()
    const todoDate = dateInput.value
    const todoTime = timeInput.value
    const todoContent = contentInput.value.trim()

    const newTodo = {
        "id": timestamp,
        "date": todoDate,
        "time": todoTime,
        "content": todoContent
    }
    currentTodoArr.push(newTodo)
    updateLocalStorage(currentTodoArr)
}

function updateLocalStorage(todos) {
    const jsonStr = JSON.stringify(todos)
    localStorage.setItem(localStorageKey, jsonStr)
}

function reviseTodoToStorage(todoElement) {
    const storedTodo = getTodosFromStorage()
    const idToEdit = Number(todoElement.dataset.id)
    const indexToEdit = storedTodo.findIndex(todo => todo.id === idToEdit)
    storedTodo[indexToEdit].date = dateUpdateInput.value
    storedTodo[indexToEdit].time = timeUpdateInput.value
    storedTodo[indexToEdit].content = contentUpdateInput.value
    updateLocalStorage(storedTodo)
}

function deleteTodoFromStorage(todoElement) {
    const storedTodo = getTodosFromStorage()
    const idToRemove = Number(todoElement.dataset.id)
    const itemsToKeep = storedTodo.filter(todo => todo.id !== idToRemove)
    updateLocalStorage(itemsToKeep)
}
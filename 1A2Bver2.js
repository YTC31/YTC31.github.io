let answer, countA, countB;
const btnStart = document.querySelector('.btn-group :nth-child(1)')
const btnRestart = document.querySelector('.btn-group :nth-child(2)')
const btnShowAnswer = document.querySelector('.btn-group :nth-child(3)')
const btnGuess = document.getElementById('btnGuess')
const inputGuessBox = document.querySelector('.form-control')
const listGameHistory = document.getElementById('gameHistory')
const answerModal = document.getElementById('answerModal')
const inputModal = document.getElementById('inputModal')


btnStart.addEventListener('click', initGame)
btnRestart.addEventListener('click', initGame)
btnShowAnswer.addEventListener('click', showAnswer)
btnGuess.addEventListener('click', checkAnswer)


function initGame() {
    listGameHistory.innerHTML = ""
    generateAnswer()
    changeBtnStatus()
}

function generateAnswer() {
    answer = []
    let numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    while (answer.length < 4) {
        let number = numbers[Math.floor(Math.random() * numbers.length)]
        let index = numbers.indexOf(number)
        answer.push(number)
        numbers.splice(index, 1)
    }
}

function changeBtnStatus() {
    btnRestart.disabled = false
    btnShowAnswer.disabled = false
    btnGuess.disabled = false
    inputGuessBox.disabled = false
    inputGuessBox.placeholder = "請輸入 4 個不重複數字"
    btnStart.disabled = true
}

function showAnswer() {
    answerModal.addEventListener('shown.bs.modal', () => {
        document.querySelector('#answerModal .modal-body').innerHTML = `<p><strong>${answer.join('')}<strong></p>`
    })
}

function checkAnswer() {
    const guessValue = inputGuessBox.value.trim()
    const digitSet = new Set(guessValue)
    const regExpforNum = /^[0-9]{4}$/
    console.log(`checkAnswer guessValue ${guessValue}`)
    if (!regExpforNum.test(guessValue) || digitSet.size !== 4) {
        alert('請輸入符合規定的數字（4 個不重複數字，不含任何符號)')
        clearInputBox()
        return
    } else {
        compareAnswer(guessValue)
        renderAnswer(guessValue)
    }
}

function compareAnswer(guessValue) {
    const strAnswer = answer.join('')
    countA = 0
    countB = 0
    for (let i = 0; i < strAnswer.length; i++) {
        if (strAnswer[i] == guessValue[i]) {
            countA++
        } else if (strAnswer.includes(guessValue[i])) {
            countB++
        }
    }
    if (countA === 4) {
        alert(`恭喜猜對！答案就是 ${answer.join('')}`)
    }
}

function renderAnswer(guessValue) {
    const li = document.createElement('li')
    li.setAttribute('class', 'list-group-item')
    let color = countA === 4 ? "bg-danger" : "bg-success"
    li.innerHTML = `第 ${checkGuessTimes()} 次猜：<span class="badge ${color}">${countA}A${countB}B</span> ${guessValue} `
    listGameHistory.append(li)
    clearInputBox()
}

function clearInputBox() {
    inputGuessBox.value = ''
}

function checkGuessTimes() {
    let liCounts = document.getElementsByTagName('li').length
    return liCounts + 1
}



const socket = io();
let cnt = 0;
let winner = false
var userId;
let play = false
var symbol;
var userName;
var tableId;

// Sign-up Event
document.getElementById('join-table-form').addEventListener('submit', (event) => {
    event.preventDefault();
    let userName = document.getElementById('userName').value
    if (userName == "") return alert("Please enter Valid UserName")

    let data = {
        eventName: 'SIGN_UP',
        data: {
            userName: userName
        }
    }
    document.getElementById('userName').value = ''
    sendEmmiter(data)
})

// Make Table Event
document.getElementById('play-video').addEventListener('click', (event) => {
    event.preventDefault();
    data = {
        eventName: 'JOIN_TABLE',
        data: {
            userId: userId
        }
    }
    sendEmmiter(data)
})

// Play Event
function sendIdToSocket(id) {
    data = {
        eventName: 'PLAY',
        data: {
            data: id,
            sign: symbol,
            tableId,
            userId
        }
    }
    sendEmmiter(data)
}

function disableBoard(data) {
    // console.log("Status Data=======", data);
    document.querySelector(".board").classList.add("disabled");
    document.querySelector('#winner').innerHTML = data
}
function enableBoard() {
    document.querySelector(".board").classList.remove("disabled");

    // document.querySelector('#winner').innerHTML = 'Waiting for Opponent'
}

// All any Function ::::::::::::::::::::
const signUpGame = (data) => {
    if (data.message == "ok") {
        userId = data.data._id
        userName = data.data.userName
        // console.log(`UserId is:::::${userId}`)
        document.querySelector('.form-container').style.display = 'none'
        document.querySelector('.play-btn').style.display = 'block'
    }
}

const joinGame = (data) => {
    if (data.message == "ok") {
        // console.log("JoinGame Data:::", data.data)
        if (data.data.symbol == 'X') {
            symbol = 'X'
        }
        if (data.data.symbol == 'O') {
            symbol = 'O'
        }
        document.querySelector('.play-btn').style.display = 'none';
        document.querySelector('#all-game').style.display = 'block';
        document.querySelector('#currentUserName').innerHTML = userName
        disableBoard('Waiting');
    }
}

const roundTimer = (data) => {
    if (data.message === "ok") {
        tableId = data.data._id;
        // Start the timer
        const timerElement = document.getElementById('winner');
        let seconds = 10;
        function updateTimer() {
            timerElement.textContent = `Game Start in ${seconds}`;
            seconds--;
            if (seconds < 0) {
                timerElement.textContent = "Waiting"
                clearInterval(timerInterval);
            }
        }
        // Call updateTimer function every second
        const timerInterval = setInterval(updateTimer, 1000);
    }
}

const checkTurn = (data) => {
    console.log(`Data Of CheckTurn:::${JSON.stringify(data)}`)
    if (data.message == "ok") {
        if (data.symbol == symbol) {
            enableBoard()
            document.getElementById('winner').innerHTML = "It's your Turn.";
        }
        if (data.symbol != symbol) {
            disableBoard('Aponent Turn.')
        }
    }
}

const printValue = (data) => {
    console.log(`Data Of printValue:::${JSON.stringify(data)}`)
    if (data.message == "ok") {
        document.getElementById(data.cellId).innerHTML = data.symbol
        document.getElementById(data.cellId).classList.add("disabled");
    }
}
const changeTurn = (data) => {
    console.log(`Data of changeTurn is :::${JSON.stringify(data)}`)
    if (data.data.symbol == symbol) {
        enableBoard()
        document.getElementById('winner').innerHTML = "It's your Turn.";
    }
    if (data.data.symbol != symbol) {
        disableBoard('Aponent Turn.')
    }
}
const declareWinner = (data) => {
    console.log(`Data of DeclareWinner is :::${JSON.stringify(data)}`)
    if (data.message == "Winner") {
        if (data.symbol == symbol) {
            document.getElementById('winner').innerHTML = `${userName} You Win`;
            document.querySelector(".board").classList.add("disabled");
        }
        if (data.symbol != symbol) {
            document.getElementById('winner').innerHTML = `${userName} You Lose`;
            document.querySelector(".board").classList.add("disabled");
        }
        setTimeout(() => {
            window.location.reload();
        }, 5000)
    }
    if (data.message == "TIE") {
        document.getElementById('winner').innerHTML = "IT'S TIE";
        document.querySelector(".board").classList.add("disabled");
        setTimeout(() => {
            window.location.reload();
        }, 5000)
    }
}

const sendEmmiter = (data) => {
    console.log(`EventName IS:::${data.eventName} and Data is ${JSON.stringify(data.data)}`)
    socket.emit(data.eventName, data.data)
}

socket.onAny((eventName, data) => {
    console.log(`EventName IS:::${eventName} and Data is ${JSON.stringify(data)}`)
    switch (eventName) {
        case "SIGN_UP":
            signUpGame(data)
            break;
        case "JOIN_TABLE":
            joinGame(data)
            break;
        case "ROUND_TIMER":
            roundTimer(data)
            break;
        case "CHECK_TURN":
            checkTurn(data)
            break;
        case "PLAY":
            printValue(data)
            break;
        case "CHANGE_TURN":
            changeTurn(data)
            break;
        case "WINNER":
            declareWinner(data)
            break;
        default:
            break;
    }
})
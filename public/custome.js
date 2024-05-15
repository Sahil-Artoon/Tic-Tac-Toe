const socket = io();
let cnt = 0;
let winner = false
var userId;
let play = false
var symbol;
var userName;
var tableId;
let seconds;

const currentUser = getSession("CurrentUser")

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
    document.querySelector(".board").classList.add("disabled");
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

// leave Table

function leaveTable() {
    let getDataOfSession = getSession('CurrentUser')
    if (getDataOfSession) {
        data = {
            eventName: 'LEAVE_GAME',
            data: {
                userData: getDataOfSession
            }
        }
        sendEmmiter(data)
    }
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

// ::::: This is for Timer Function ::::::
const timerForTurn = (start, time) => {
    console.log("Secound is :::::::::::::", data)
    let milliseconds
    const timerElement = document.getElementById('timer');
    if (start == 0) {
        milliseconds = start;
    } else {
        milliseconds = time - start
    }
    let intervalId;
    let endTimer = time
    function updateTimer() {
        milliseconds += 100;
        const time = new Date(milliseconds).toISOString().substr(11, 12);
        timerElement.textContent = time;
        if (milliseconds >= endTimer) {
            clearInterval(intervalId);
            timerElement.textContent = '00:00:10.000';
        }
    }
    intervalId = setInterval(updateTimer, 100);
}

// :::::::::::::: Session Functions ::::::::::::::
function setSession(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
}

// Function to get session storage value
function getSession(key) {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : null;
}

//::::::: Print Bord Value at Rejoin Time ::::::::
const PrintTableDataAtRejoinTime = (data, index) => {
    document.getElementById(`cell-${index + 1}`).textContent = data.symbol
}
// ::::::::::::::::::::::::::::::::::::::::::::

// :::::::::::::: Socket.on All Functions :::::::::::::::

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
        console.log("JoinGame Data:::", data)
        if (data.data.playerInfo.length == 1) {
            if (data.data.playerInfo[0].symbol == 'X') {
                symbol = 'X'
            }
            if (data.data.playerInfo[0].symbol == 'O') {
                symbol = 'O'
            }
            dataOfSession = {
                tableId: data.data._id,
                userData: data.data.playerInfo[0]
            }
            setSession("CurrentUser", dataOfSession)
        }
        if (data.data.playerInfo.length == 2) {
            if (data.data.playerInfo[1].symbol == 'X') {
                symbol = 'X'
            }
            if (data.data.playerInfo[1].symbol == 'O') {
                symbol = 'O'
            }
            data = {
                tableId: data.data._id,
                userData: data.data.playerInfo[1]
            }
            setSession("CurrentUser", data)
        }
        document.querySelector('.play-btn').style.display = 'none';
        document.querySelector('#all-game').style.display = 'block';
        document.querySelector('#currentUserName').innerHTML = userName
        document.getElementById('leave-button').style.display = 'block';
        disableBoard('Waiting');
    }
}

const roundTimer = (data) => {
    if (data.message === "ok") {
        tableId = data.data._id;
        // Start the timer
        const timerElement = document.getElementById('winner');
        seconds = data.roundTimer;
        function updateTimer() {
            timerElement.textContent = `Game Start in ${seconds}`;
            seconds--;
            if (seconds < 0) {
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
        document.getElementById('leave-button').style.display = "block"
        if (data.symbol == symbol) {
            enableBoard()
            document.getElementById('winner').innerHTML = "It's your Turn.";
            document.getElementById('main-timer').style.display = "block"
            timerForTurn(0, data.time)
        }
        if (data.symbol != symbol) {
            disableBoard('Aponent Turn.')
            document.getElementById('main-timer').style.display = "none"
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
        document.getElementById('main-timer').style.display = "block"
        timerForTurn(0, data.time)
    }
    if (data.data.symbol != symbol) {
        disableBoard('Aponent Turn.')
        document.getElementById('main-timer').style.display = "none"
    }
}
const declareWinner = (data) => {
    console.log(`Data of DeclareWinner is :::${JSON.stringify(data)}`)
    if (data.message == "Winner") {
        document.getElementById('main-timer').style.display = "none"
        if (data.isLeave == true) {
            if (data.userId != userId) {
                document.querySelector('.form-container').style.display = 'block'
                document.getElementById('leave-button').style.display = 'none'
                document.querySelector('#all-game').style.display = 'none';
                reStart()
            } else {
                document.getElementById('winner').innerHTML = `${userName} You Win`;
                document.querySelector(".board").classList.add("disabled");
            }

        }
        else {
            document.getElementById('leave-button').style.display = "none"
            if (data.symbol == symbol) {
                document.getElementById('winner').innerHTML = `${userName} You Win`;
                document.querySelector(".board").classList.add("disabled");
            }
            if (data.symbol != symbol) {
                document.getElementById('winner').innerHTML = `${userName} You Lose`;
                document.querySelector(".board").classList.add("disabled");
            }
        }
    }
    if (data.message == "TIE") {
        document.getElementById('leave-button').style.display = "none"
        document.getElementById('winner').innerHTML = "IT'S TIE";
        document.getElementById('main-timer').style.display = "none"
        document.querySelector(".board").classList.add("disabled");
    }
}

const reJoinGame = (data) => {
    console.log("EvenetName is Rejoin :::::", data);
    if (data.message == "ok") {
        if (data.gameStatus == "WATING") {
            symbol = data.data.userData.symbol;
            userId = data.data.userData.userId;
            userName = data.data.userData.userName;
            document.querySelector('.form-container').style.display = 'none'
            document.getElementById('main-timer').style.display = "none"
            document.getElementById('leave-button').style.display = 'block'
            document.querySelector('#all-game').style.display = 'block';
            document.querySelector('#currentUserName').innerHTML = userName
            disableBoard('Waiting');
        }
        if (data.gameStatus == "ROUND_TIMER_START") {
            symbol = data.data.userData.symbol;
            userId = data.data.userData.userId;
            userName = data.data.userData.userName;
            tableId = data.data.tableId;
            document.querySelector('.form-container').style.display = 'none'
            document.getElementById('main-timer').style.display = "none"
            document.querySelector('#all-game').style.display = 'block';
            document.querySelector('#currentUserName').innerHTML = userName
            disableBoard('');
            if (data.leaveButton == true) {
                document.getElementById('leave-button').style.display = "block"
            } else {
                document.getElementById('leave-button').style.display = "none"
            }
            const timerElement = document.getElementById('winner');
            let secondss = (data.time / 1000) - 1;
            function updateTimer() {
                timerElement.textContent = `Game Start in ${secondss}`;
                secondss--;
                if (secondss < 5) {
                    document.getElementById('leave-button').style.display = "none"
                }
                if (secondss < 0) {
                    clearInterval(timerInterval);
                }
            }
            const timerInterval = setInterval(updateTimer, 1000);
        }
        if (data.gameStatus == "LOCK") {
            symbol = data.data.userData.symbol;
            userId = data.data.userData.userId;
            userName = data.data.userData.userName;
            tableId = data.data.tableId;
            document.querySelector('.form-container').style.display = 'none'
            document.getElementById('main-timer').style.display = "none"
            document.querySelector('#all-game').style.display = 'block';
            document.querySelector('#currentUserName').innerHTML = userName
            disableBoard('');
            if (data.leaveButton == true) {
                document.getElementById('leave-button').style.display = "block"
            } else {
                document.getElementById('leave-button').style.display = "none"
            }
            const timerElement = document.getElementById('winner');
            let secondss = (data.time / 1000) - 1;
            function updateTimer() {
                timerElement.textContent = `Game Start in ${secondss}`;
                secondss--;
                if (secondss < 5) {
                    document.getElementById('leave-button').style.display = "none"
                }
                if (secondss < 0) {
                    clearInterval(timerInterval);
                }
            }
            const timerInterval = setInterval(updateTimer, 1000);
        }
        if (data.gameStatus == "CHECK_TURN") {
            symbol = data.data.userData.symbol;
            userId = data.data.userData.userId;
            userName = data.data.userData.userName;
            tableId = data.data.tableId;
            document.getElementById('leave-button').style.display = "block"
            if (data.tableData.currentTurnUserId == userId) {
                document.querySelector('.form-container').style.display = 'none'
                document.querySelector('#all-game').style.display = 'block';
                enableBoard()
                document.getElementById('winner').innerHTML = "It's your Turn.";
                document.getElementById('main-timer').style.display = "block"
                timerForTurn(data.pandingTime, data.time)
            }
            if (data.tableData.currentTurnUserId != userId) {
                document.querySelector('.form-container').style.display = 'none'
                document.querySelector('#all-game').style.display = 'block';
                document.getElementById('main-timer').style.display = "none"
                disableBoard('Aponent Turn.')
            }
        }
        if (data.gameStatus == "PLAYING") {
            symbol = data.data.userData.symbol;
            userId = data.data.userData.userId;
            userName = data.data.userData.userName;
            tableId = data.data.tableId;
            document.getElementById('leave-button').style.display = "block"
            if (data.tableData.currentTurnUserId == userId) {
                document.querySelector('.form-container').style.display = 'none'
                document.querySelector('#all-game').style.display = 'block';
                enableBoard()
                document.getElementById('winner').innerHTML = "It's your Turn.";
                document.getElementById('main-timer').style.display = "block"
                timerForTurn(data.pandingTime, data.time)
            }
            if (data.tableData.currentTurnUserId != userId) {
                document.querySelector('.form-container').style.display = 'none'
                document.querySelector('#all-game').style.display = 'block';
                document.getElementById('main-timer').style.display = "none"
                disableBoard('Aponent Turn.')
            }
            for (let i = 0; i < data.tableData.playingData.length; i++) {
                PrintTableDataAtRejoinTime(data.tableData.playingData[i], i)
            }
        }
        if (data.gameStatus == "WINNING" || data.gameStatus == "TIE") {
            symbol = data.data.userData.symbol;
            userId = data.data.userData.userId;
            userName = data.data.userData.userName;
            tableId = data.data.tableId;
            document.querySelector('.form-container').style.display = 'none'
            document.querySelector('#all-game').style.display = 'block';
            document.querySelector(".board").classList.add("disabled");
            for (let i = 0; i < data.tableData.playingData.length; i++) {
                PrintTableDataAtRejoinTime(data.tableData.playingData[i], i)
            }
            if (data.gameStatus == "WINNING") {
                if (data.tableData.winnerUserId == userId) {
                    document.getElementById('winner').innerHTML = `${userName} You Win`;
                }
                if (data.tableData.winnerUserId != userId) {
                    document.getElementById('winner').innerHTML = `${userName} You Lose`;
                }
            }
            if (data.gameStatus == "TIE") {
                document.getElementById('winner').innerHTML = `It's TIE`;
            }
        }
    }
}

const error = (data) => {
    console.log("EvenetName is Error :::::", data);
    if (data.return == true) {
        alert(data.message)
        document.querySelector('.form-container').style.display = 'block'
        document.querySelector('.play-btn').style.display = 'none';
        sessionStorage.clear();
    } else {
        alert(data.message)
    }
}

const leaveGame = (data) => {
    console.log("EvenetName is LEAVE_GAME :::::", data);
    if (data.gameStatus == "WATING") {
        if (data.message == "ok") {
            document.querySelector('.form-container').style.display = 'block'
            document.getElementById('leave-button').style.display = 'none'
            document.querySelector('#all-game').style.display = 'none';
            reStart()
        }
    }

    if (data.gameStatus == "ROUND_TIMER") {
        if (data.message == "ok") {
            if (data.userId == userId) {
                document.querySelector('.form-container').style.display = 'block'
                document.getElementById('leave-button').style.display = 'none'
                document.querySelector('#all-game').style.display = 'none';
                reStart()
            } else {
                seconds = 0
                setTimeout(() => {
                    disableBoard("Waiting")
                }, 1000)
                document.getElementById('leave-button').style.display = 'block'
            }
        }
    }

    if (data.gameStatus == "CHECK_TURN") {
        if (data.message == "ok") {
            if (data.tableData.playerInfo[0].userId != userId) {
                document.querySelector('.form-container').style.display = 'block'
                document.getElementById('leave-button').style.display = 'none'
                document.querySelector('#all-game').style.display = 'none';
                reStart()
            } else {
                disableBoard("Waiting")
            }
        }
    }
}

const disableLeaveButton = (data) => {
    console.log("EvenetName is LEAVE_BUTTON :::::", data);
    if (data.message == "ok") {
        if (document.getElementById('winner').innerHTML != "Waiting")
            document.getElementById('leave-button').style.display = 'none'
    }
}

const reStart = (data) => {
    sessionStorage.clear();
    window.location.reload();
}

const sendEmmiter = (data) => {
    console.log(`EventName IS ::: ${data.eventName} and Data is ${JSON.stringify(data.data)}`)
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
        case "REJOIN_GAME":
            reJoinGame(data)
            break;
        case "RE_START":
            reStart(data)
            break;
        case "POP_UP":
            error(data)
            break;
        case "LEAVE_GAME":
            leaveGame(data)
            break;
        case "LEAVE_BUTTON":
            disableLeaveButton(data)
            break;
        default:
            break;
    }
})


if (currentUser) {
    console.log("CurrentUser is ::::::::::::::::: ", currentUser)
    data = {
        eventName: 'REJOIN_GAME',
        data: {
            tableId: currentUser.tableId,
            userData: currentUser.userData
        }
    }
    sendEmmiter(data)
}
const socket = io();
let cnt = 0;
let winner = false
var userId;
let play = false
var symbol;
var userName;
var tableId;

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

function checkWinner() {
    let c1 = document.getElementById('cell-1').innerHTML
    let c2 = document.getElementById('cell-2').innerHTML
    let c3 = document.getElementById('cell-3').innerHTML

    let c4 = document.getElementById('cell-4').innerHTML
    let c5 = document.getElementById('cell-5').innerHTML
    let c6 = document.getElementById('cell-6').innerHTML

    let c7 = document.getElementById('cell-7').innerHTML
    let c8 = document.getElementById('cell-8').innerHTML
    let c9 = document.getElementById('cell-9').innerHTML

    if (
        c1 == 'X' && c2 == "X" && c3 == "X" ||
        c1 == "X" && c4 == "X" && c7 == "X" ||
        c1 == "X" && c5 == "X" && c9 == "X" ||
        c4 == "X" && c5 == "X" && c6 == "X" ||
        c7 == "X" && c8 == "X" && c9 == "X" ||
        c2 == "X" && c5 == "X" && c8 == "X" ||
        c3 == "X" && c6 == "X" && c9 == "X" ||
        c3 == "X" && c5 == "X" && c7 == "X"
    ) {
        winner = true;
        if (winner == true) {
            data = {
                eventName: 'WINNER',
                data: {
                    tableId,
                    userId,
                    symbol: "X"
                }
            }
            return data
        }
        // document.getElementById('winner').innerHTML = "PLAYER X WINNER"
        // setTimeout(() => {
        //     // window.location.reload();
        // }, 2000)
    } else if (c1 == 'X' && c2 == "X" && c3 == "X" ||
        c1 == "O" && c4 == "O" && c7 == "O" ||
        c1 == "O" && c5 == "O" && c9 == "O" ||
        c4 == "O" && c5 == "O" && c6 == "O" ||
        c7 == "O" && c8 == "O" && c9 == "O" ||
        c2 == "O" && c5 == "O" && c8 == "O" ||
        c3 == "O" && c6 == "O" && c9 == "O" ||
        c3 == "O" && c5 == "O" && c7 == "O"
    ) {
        winner = true;
        if (winner == true) {
            data = {
                eventName: 'WINNER',
                data: {
                    tableId,
                    userId,
                    symbol: "O"
                }
            }
            return data
        }
        //     document.getElementById('winner').innerHTML = "PLAYER O WINNER"

        //     setTimeout(() => {
        //         window.location.reload();
        //     }, 10000)
    } else if (c1 != "" && c2 != "" && c3 != "" &&
        c4 != "" && c5 != "" && c6 != "" &&
        c7 != "" && c8 != "" && c9 != "") {
        winner = true;
        if (winner == true) {
            data = {
                eventName: 'WINNER',
                data: {
                    tableId,
                    userId,
                    symbol: "TIE"
                }
            }
            return data
        }
    } else {
        return 0
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
        } else if (data.data.symbol == 'O') {
            symbol = 'O'
        }
        document.querySelector('.play-btn').style.display = 'none';
        document.querySelector('#all-game').style.display = 'block';
        document.querySelector('#currentUserName').innerHTML = userName
        disableBoard('Waiting');
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
            // document.getElementById('winner').innerHTML = "Aponent Turn.";
        }
    }
}

const printValue = (data) => {
    console.log(`Data Of printValue:::${JSON.stringify(data)}`)
    if (data.message == "ok") {
        document.getElementById(data.cellId).innerHTML = data.symbol
        document.getElementById(data.cellId).classList.add("disabled");
        disableBoard('Aponent Turn.')
        if (data.winner == true) {
            data = {
                eventName: 'WINNER',
                data: {
                    tableId,
                    userId,
                    symbol: data.symbol
                }
            }
            return sendEmmiter(data);
        }
        if (data.winner == "TIE") {
            data = {
                eventName: 'WINNER',
                data: {
                    tableId,
                    userId,
                    symbol: "TIE"
                }
            }
            return sendEmmiter(data);
        }
        if (data.symbol != symbol) {
            enableBoard()
            document.getElementById('winner').innerHTML = "It's your Turn.";
        }
    }
}



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
const declareWinner = (data) => {
    console.log(`EventName IS:::${data.eventName} and Data is :::${JSON.stringify(data.data)}`)
    if (data.message == "Winner") {
        if (data.symbol == symbol) {
            document.getElementById('winner').innerHTML = `${userName} You Win`;
        }
        if (data.symbol != symbol) {
            document.getElementById('winner').innerHTML = `${userName} You Lose`;
        }
        setTimeout(() => {
            window.location.reload();
        }, 5000)
    }
    if (data.message == "TIE") {
        document.getElementById('winner').innerHTML = "IT'S TIE";
        setTimeout(() => {
            window.location.reload();
        }, 5000)
    }
}
const startGame = (data) => {
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
                if (symbol == "X") {
                    data = {
                        eventName: 'CHECK_TURN',
                        data: {
                            data: {
                                symbol: symbol,
                                userId: userId,
                                tableId: data.data._id
                            }
                        }
                    }
                    sendEmmiter(data)
                }
            }
        }
        // Call updateTimer function every second
        const timerInterval = setInterval(updateTimer, 1000);
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
        case "START_GAME":
            startGame(data)
            break;
        case "CHECK_TURN":
            checkTurn(data)
            break;
        case "PLAY":
            printValue(data)
            break;
        case "WINNER":
            declareWinner(data)
            break;
        default:
            break;
    }
})
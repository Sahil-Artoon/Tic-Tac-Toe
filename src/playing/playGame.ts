import { Socket } from "socket.io"
import { logger } from "../logger"
import { json } from "express"
import { EVENT_NAME } from "../constant/eventName"
import { Table } from "../model/tableModel"
import { sendToRoomEmmiter } from "../eventEmmitter"

const playGame = async (data: any, socket: Socket) => {
    logger.info(`Data is This :::${JSON.stringify(data)} and Socket is ::::: ${socket.id}`)
    if (data.data.symbol == "X") {
        let gameStatusUpdate = await Table.findByIdAndUpdate(data.data.tableId, { gameStatus: "Check Turn" })
        // this is for CheckTurn
        data = {
            eventName: EVENT_NAME.CHECK_TURN,
            data: {
                _id: data.data.tableId,
                symbol: "X",
                userID: data.userID,
                message: "ok"
            },
            socket
        }
        sendToRoomEmmiter(data)
    }
    if (data.data.symbol == "O") {
        // this is for CheckTurns
        let gameStatusUpdate = await Table.findByIdAndUpdate(data.data.tableId, { gameStatus: "Check Turn" })
        data = {
            eventName: EVENT_NAME.CHECK_TURN,
            data: {
                _id: data.data.tableId,
                symbol: "O",
                userID: data.userID,
                message: "ok"
            },
            socket
        }
        sendToRoomEmmiter(data)
    }

    if (data.sign == "X") {
        // This is for Play
        let gameStatusUpdate = await Table.findByIdAndUpdate(data.tableId, { gameStatus: "Playing" })
        let parts = data.data.split("-");
        let numberOfBox = parts[1];
        let updateTable = await Table.findByIdAndUpdate(data.tableId, { [`playingData.${numberOfBox - 1}`]: { userId: data.userId, symbol: data.sign } });
        const findTableForCheckWinner = await Table.findById(data.tableId)
        if (findTableForCheckWinner) {
            if (
                findTableForCheckWinner.playingData[0].symbol == "X" && findTableForCheckWinner.playingData[1].symbol == "X" && findTableForCheckWinner.playingData[2].symbol == "X" ||//1
                findTableForCheckWinner.playingData[3].symbol == "X" && findTableForCheckWinner.playingData[4].symbol == "X" && findTableForCheckWinner.playingData[5].symbol == "X" ||//2
                findTableForCheckWinner.playingData[6].symbol == "X" && findTableForCheckWinner.playingData[7].symbol == "X" && findTableForCheckWinner.playingData[8].symbol == "X" ||//3
                findTableForCheckWinner.playingData[0].symbol == "X" && findTableForCheckWinner.playingData[3].symbol == "X" && findTableForCheckWinner.playingData[6].symbol == "X" ||//4
                findTableForCheckWinner.playingData[1].symbol == "X" && findTableForCheckWinner.playingData[4].symbol == "X" && findTableForCheckWinner.playingData[7].symbol == "X" ||//5
                findTableForCheckWinner.playingData[2].symbol == "X" && findTableForCheckWinner.playingData[5].symbol == "X" && findTableForCheckWinner.playingData[8].symbol == "X" ||//6
                findTableForCheckWinner.playingData[0].symbol == "X" && findTableForCheckWinner.playingData[4].symbol == "X" && findTableForCheckWinner.playingData[8].symbol == "X" ||//7
                findTableForCheckWinner.playingData[2].symbol == "X" && findTableForCheckWinner.playingData[4].symbol == "X" && findTableForCheckWinner.playingData[6].symbol == "X"   //8
            ) {
                data = {
                    eventName: EVENT_NAME.PLAY_GAME,
                    data: {
                        _id: data.tableId,
                        symbol: "X",
                        message: "ok",
                        winner: true,
                        cellId: data.data
                    },
                    socket
                }
                return sendToRoomEmmiter(data)
            } else if (
                findTableForCheckWinner.playingData[0].symbol != "" && findTableForCheckWinner.playingData[1].symbol != "" && findTableForCheckWinner.playingData[2].symbol != "" &&//1
                findTableForCheckWinner.playingData[3].symbol != "" && findTableForCheckWinner.playingData[4].symbol != "" && findTableForCheckWinner.playingData[5].symbol != "" &&//2
                findTableForCheckWinner.playingData[6].symbol != "" && findTableForCheckWinner.playingData[7].symbol != "" && findTableForCheckWinner.playingData[8].symbol != "" &&//3
                findTableForCheckWinner.playingData[0].symbol != "" && findTableForCheckWinner.playingData[3].symbol != "" && findTableForCheckWinner.playingData[6].symbol != "" &&//4
                findTableForCheckWinner.playingData[1].symbol != "" && findTableForCheckWinner.playingData[4].symbol != "" && findTableForCheckWinner.playingData[7].symbol != "" &&//5
                findTableForCheckWinner.playingData[2].symbol != "" && findTableForCheckWinner.playingData[5].symbol != "" && findTableForCheckWinner.playingData[8].symbol != "" &&//6
                findTableForCheckWinner.playingData[0].symbol != "" && findTableForCheckWinner.playingData[4].symbol != "" && findTableForCheckWinner.playingData[8].symbol != "" &&//7
                findTableForCheckWinner.playingData[2].symbol != "" && findTableForCheckWinner.playingData[4].symbol != "" && findTableForCheckWinner.playingData[6].symbol != ""   //8
            ) {
                data = {
                    eventName: EVENT_NAME.PLAY_GAME,
                    data: {
                        _id: data.tableId,
                        symbol: "X",
                        message: "ok",
                        winner: "TIE",
                        cellId: data.data
                    },
                    socket
                }
                return sendToRoomEmmiter(data)
            }
        }
        data = {
            eventName: EVENT_NAME.PLAY_GAME,
            data: {
                _id: data.tableId,
                symbol: "X",
                message: "ok",
                winner: false,
                cellId: data.data
            },
            socket
        }
        return sendToRoomEmmiter(data)
    }

    if (data.sign == "O") {
        // This is for Play
        let gameStatusUpdate = await Table.findByIdAndUpdate(data.tableId, { gameStatus: "Playing" })
        let parts = data.data.split("-");
        let numberOfBox = parts[1];
        let updateTable = await Table.findByIdAndUpdate(data.tableId, { [`playingData.${numberOfBox - 1}`]: { userId: data.userId, symbol: data.sign } });
        const findTableForCheckWinner = await Table.findById(data.tableId)
        if (findTableForCheckWinner) {
            if (findTableForCheckWinner.playingData[0].symbol == "O" && findTableForCheckWinner.playingData[1].symbol == "O" && findTableForCheckWinner.playingData[2].symbol == "O" ||//1
                findTableForCheckWinner.playingData[3].symbol == "O" && findTableForCheckWinner.playingData[4].symbol == "O" && findTableForCheckWinner.playingData[5].symbol == "O" ||//2
                findTableForCheckWinner.playingData[6].symbol == "O" && findTableForCheckWinner.playingData[7].symbol == "O" && findTableForCheckWinner.playingData[8].symbol == "O" ||//3
                findTableForCheckWinner.playingData[0].symbol == "O" && findTableForCheckWinner.playingData[3].symbol == "O" && findTableForCheckWinner.playingData[6].symbol == "O" ||//4
                findTableForCheckWinner.playingData[1].symbol == "O" && findTableForCheckWinner.playingData[4].symbol == "O" && findTableForCheckWinner.playingData[7].symbol == "O" ||//5
                findTableForCheckWinner.playingData[2].symbol == "O" && findTableForCheckWinner.playingData[5].symbol == "O" && findTableForCheckWinner.playingData[8].symbol == "O" ||//6
                findTableForCheckWinner.playingData[0].symbol == "O" && findTableForCheckWinner.playingData[4].symbol == "O" && findTableForCheckWinner.playingData[8].symbol == "O" ||//7
                findTableForCheckWinner.playingData[2].symbol == "O" && findTableForCheckWinner.playingData[4].symbol == "O" && findTableForCheckWinner.playingData[6].symbol == "O"   //8
            ) {
                data = {
                    eventName: EVENT_NAME.PLAY_GAME,
                    data: {
                        _id: data.tableId,
                        symbol: "O",
                        winner: true,
                        message: "ok",
                        cellId: data.data
                    },
                    socket
                }
                return sendToRoomEmmiter(data)
            } else if (
                findTableForCheckWinner.playingData[0].symbol != "" && findTableForCheckWinner.playingData[1].symbol != "" && findTableForCheckWinner.playingData[2].symbol != "" &&//1
                findTableForCheckWinner.playingData[3].symbol != "" && findTableForCheckWinner.playingData[4].symbol != "" && findTableForCheckWinner.playingData[5].symbol != "" &&//2
                findTableForCheckWinner.playingData[6].symbol != "" && findTableForCheckWinner.playingData[7].symbol != "" && findTableForCheckWinner.playingData[8].symbol != "" &&//3
                findTableForCheckWinner.playingData[0].symbol != "" && findTableForCheckWinner.playingData[3].symbol != "" && findTableForCheckWinner.playingData[6].symbol != "" &&//4
                findTableForCheckWinner.playingData[1].symbol != "" && findTableForCheckWinner.playingData[4].symbol != "" && findTableForCheckWinner.playingData[7].symbol != "" &&//5
                findTableForCheckWinner.playingData[2].symbol != "" && findTableForCheckWinner.playingData[5].symbol != "" && findTableForCheckWinner.playingData[8].symbol != "" &&//6
                findTableForCheckWinner.playingData[0].symbol != "" && findTableForCheckWinner.playingData[4].symbol != "" && findTableForCheckWinner.playingData[8].symbol != "" &&//7
                findTableForCheckWinner.playingData[2].symbol != "" && findTableForCheckWinner.playingData[4].symbol != "" && findTableForCheckWinner.playingData[6].symbol != ""   //8
            ) {
                data = {
                    eventName: EVENT_NAME.PLAY_GAME,
                    data: {
                        _id: data.tableId,
                        symbol: "O",
                        message: "ok",
                        winner: "TIE",
                        cellId: data.data
                    },
                    socket
                }
                return sendToRoomEmmiter(data)
            }
        }
        data = {
            eventName: EVENT_NAME.PLAY_GAME,
            data: {
                _id: data.tableId,
                symbol: "O",
                message: "ok",
                winner: false,
                cellId: data.data
            },
            socket
        }
        return sendToRoomEmmiter(data)
    }
}
export { playGame }
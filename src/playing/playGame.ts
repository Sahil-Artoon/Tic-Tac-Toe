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
        console.log("This is for Play Game::::", data)
        let gameStatusUpdate = await Table.findByIdAndUpdate(data.tableId, { gameStatus: "Playing" })
        let parts = data.data.split("-");
        let numberOfBox = parts[1];
        let updateTable = await Table.findByIdAndUpdate(data.tableId, { [`playingData.${numberOfBox - 1}`]: { userId: data.userId, symbol: data.sign } });
        data = {
            eventName: EVENT_NAME.PLAY_GAME,
            data: {
                _id: data.tableId,
                symbol: "X",
                message: "ok",
                cellId: data.data
            },
            socket
        }
        sendToRoomEmmiter(data)
    }
    if (data.sign == "O") {
        // This is for Play
        console.log("This is for Play Game::::", data)
        let gameStatusUpdate = await Table.findByIdAndUpdate(data.tableId, { gameStatus: "Playing" })
        let parts = data.data.split("-");
        let numberOfBox = parts[1];
        let updateTable = await Table.findByIdAndUpdate(data.tableId, { [`playingData.${numberOfBox - 1}`]: { userId: data.userId, symbol: data.sign } });
        data = {
            eventName: EVENT_NAME.PLAY_GAME,
            data: {
                _id: data.tableId,
                symbol: "O",
                message: "ok",
                cellId: data.data
            },
            socket
        }
        sendToRoomEmmiter(data)
    }
}
export { playGame }
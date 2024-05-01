import { Socket } from "socket.io"
import { logger } from "../logger"
import { json } from "express"
import { EVENT_NAME } from "../constant/eventName"
import { Table } from "../model/tableModel"
import { sendToRoomEmmiter } from "../eventEmmitter"
import { checkWinner } from "./checkWinner"
import { declareWinner } from "./declareWinner"
import { changeTurn } from "./changeTurn"

const playGame = async (data: any, socket: Socket) => {
    try {
        logger.info(`Data is This :::${JSON.stringify(data)} and Socket is ::::: ${socket.id}`)
        if (data.sign == "X") {
            // This is for Play
            await Table.findByIdAndUpdate(data.tableId, { gameStatus: "PLAYING" })
            let parts = data.data.split("-");
            let numberOfBox = parts[1];
            let updateTable = await Table.findByIdAndUpdate(data.tableId, { [`playingData.${numberOfBox - 1}`]: { userId: data.userId, symbol: data.sign } });
            const findTableForCheckWinner = await Table.findById(data.tableId)
            if (findTableForCheckWinner) {
                let checkWinnerorNot = await checkWinner(findTableForCheckWinner)
                if (checkWinnerorNot == "X") {
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
                    sendToRoomEmmiter(data)
                    data = {
                        tableId: findTableForCheckWinner._id,
                        symbol: "X",
                    }
                    return await declareWinner(data)
                } else if (checkWinnerorNot == "TIE") {
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
                    sendToRoomEmmiter(data)
                    data = {
                        tableId: findTableForCheckWinner._id,
                        symbol: "TIE",
                    }
                    return await declareWinner(data)
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
                sendToRoomEmmiter(data)
                return await changeTurn({ tableId: findTableForCheckWinner._id })
            }
        }

        if (data.sign == "O") {
            // This is for Play
            let gameStatusUpdate = await Table.findByIdAndUpdate(data.tableId, { gameStatus: "PLAYING" })
            let parts = data.data.split("-");
            let numberOfBox = parts[1];
            await Table.findByIdAndUpdate(data.tableId, { [`playingData.${numberOfBox - 1}`]: { userId: data.userId, symbol: data.sign } });
            const findTableForCheckWinner = await Table.findById(data.tableId)
            if (findTableForCheckWinner) {
                let checkWinnerorNot = await checkWinner(findTableForCheckWinner)
                if (checkWinnerorNot == "O") {
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
                    sendToRoomEmmiter(data)
                    data = {
                        tableId: findTableForCheckWinner._id,
                        symbol: "O",
                    }
                    return await declareWinner(data)
                } else if (checkWinnerorNot == "TIE") {
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
                    sendToRoomEmmiter(data)
                    data = {
                        tableId: findTableForCheckWinner._id,
                        symbol: "TIE",
                    }
                    return await declareWinner(data)
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
                sendToRoomEmmiter(data)
                return await changeTurn({ tableId: findTableForCheckWinner._id })
            }
        }
    } catch (error) {
        console.log("PlayGame Error: ", error)
        logger.error("PlayGame Error: ", error)
    }
}
export { playGame }
import { Socket } from "socket.io"
import { logger } from "../logger"
import { json } from "express"
import { EVENT_NAME } from "../constant/eventName"
import { Table } from "../model/tableModel"
import { sendToRoomEmmiter, sendToSocketIdEmmiter } from "../eventEmmitter"
import { checkWinner } from "./checkWinner"
import { declareWinner } from "./declareWinner"
import { changeTurn } from "./changeTurn"
import { validatePlayGameData } from "../validation/playGameValidation"

const playGame = async (data: any, socket: Socket) => {
    try {
        logger.info(`PLAY_GAME EVENT DATA :::: ${JSON.stringify(data)}`)
        let checkData = await validatePlayGameData(data)
        if (checkData.error) {
            data = {
                eventName: EVENT_NAME.POP_UP,
                data: {
                    message: checkData.error?.details[0].message
                },
                socket
            }
            return sendToSocketIdEmmiter(data);
        }
        if (data.sign == "X") {
            // This is for Play
            await Table.findByIdAndUpdate(data.tableId, { gameStatus: "PLAYING" })
            let parts = data.data.split("-");
            let numberOfBox = parts[1];
            await Table.findByIdAndUpdate(data.tableId, { [`playingData.${numberOfBox - 1}`]: { userId: data.userId, symbol: data.sign } });
            const findTableForCheckWinner = await Table.findById(data.tableId)
            if (findTableForCheckWinner) {
                let checkWinnerorNot = await checkWinner(findTableForCheckWinner)
                if (checkWinnerorNot == "X") {
                    data = {
                        eventName: EVENT_NAME.PLAY_GAME,
                        data: {
                            _id: data.tableId,
                            userId: data.userId,
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
                        userId: data.data.userId,
                        symbol: "X",
                    }
                    return await declareWinner(data)
                } else if (checkWinnerorNot == "TIE") {
                    data = {
                        eventName: EVENT_NAME.PLAY_GAME,
                        data: {
                            _id: data.tableId,
                            userId: data.userId,
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
                        userId: data.data.userId,
                        symbol: "TIE",
                    }
                    return await declareWinner(data)
                }
                data = {
                    eventName: EVENT_NAME.PLAY_GAME,
                    data: {
                        _id: data.tableId,
                        userId: data.userId,
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
            await Table.findByIdAndUpdate(data.tableId, { gameStatus: "PLAYING" })
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
                            userId: data.userId,
                            winner: true,
                            message: "ok",
                            cellId: data.data
                        },
                        socket
                    }
                    sendToRoomEmmiter(data)
                    data = {
                        tableId: findTableForCheckWinner._id,
                        userId: data.data.userId,
                        symbol: "O",
                    }
                    return await declareWinner(data)
                } else if (checkWinnerorNot == "TIE") {
                    data = {
                        eventName: EVENT_NAME.PLAY_GAME,
                        data: {
                            _id: data.tableId,
                            userId: data.userId,
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
                        userId: data.data.userId,
                        symbol: "TIE",
                    }
                    return await declareWinner(data)
                }
                data = {
                    eventName: EVENT_NAME.PLAY_GAME,
                    data: {
                        _id: data.tableId,
                        userId: data.userId,
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
        logger.error("PLAY_GAME ERROR: ", error)
    }
}
export { playGame }
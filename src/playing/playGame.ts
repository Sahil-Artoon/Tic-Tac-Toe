import { Socket } from "socket.io"
import { logger } from "../logger"
import { EVENT_NAME } from "../constant/eventName"
import { Table } from "../model/tableModel"
import { sendToRoomEmmiter, sendToSocketIdEmmiter } from "../eventEmmitter"
import { checkWinner } from "./checkWinner"
import { declareWinner } from "./declareWinner"
import { changeTurn } from "./changeTurn"
import { validatePlayGameData } from "../validation/playGameValidation"
import { cancleTurnTimerJob } from "../bull/cancleQueue/cancleTurnTimerQueue"
import { redisDel, redisGet, redisSet } from "../redisOption"

const playGame = async (data: any, socket: any) => {
    try {
        logger.info(`START FUNCTION : playGame :: DATA :: ${JSON.stringify(data)}`);
        let checkData = await validatePlayGameData(data)
        if (checkData?.error) {
            data = {
                eventName: EVENT_NAME.POP_UP,
                data: {
                    message: checkData.error?.details[0].message
                },
                socket
            }
            logger.error(`END : playGame :: DATA :: ${JSON.stringify(data.data)}`);
            return sendToSocketIdEmmiter(data);
        }

        let tableId:any = data.tableId
        console.log("***********>>>", tableId);
        let canelTimer = await cancleTurnTimerJob(tableId)
        logger.info("::>>>>>>>>>>", JSON.stringify(canelTimer));
        if (data.sign == "X") {
            let findTable: any = await redisGet(`${tableId}`)
            findTable = JSON.parse(findTable)
            findTable.gameStatus = "PLAYING"
            await redisDel(`${findTable._id}`)
            await redisSet(`${findTable._id}`, JSON.stringify(findTable));
            let parts = data.data.split("-");
            let numberOfBox = parts[1];
            findTable.playingData[numberOfBox - 1] = {
                userId: data.userId,
                symbol: data.sign
            }
            await redisDel(`${findTable._id}`)
            await redisSet(`${findTable._id}`, JSON.stringify(findTable));

            let checkWinnerorNot = await checkWinner(findTable)
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
                    tableId: findTable._id,
                    userId: data.data.userId,
                    symbol: "X",
                    isLeave: false
                }
                logger.info(`END : playGame :: DATA :: ${JSON.stringify(data)}`);
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
                    tableId: findTable._id,
                    userId: data.data.userId,
                    symbol: "TIE",
                }
                logger.info(`END : playGame :: DATA :: ${JSON.stringify(data)}`);
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
            logger.info(`END : playGame :: DATA :: ${JSON.stringify(data.data)}`);
            return await changeTurn({ tableId: findTable._id, play: true }, socket)
        }

        if (data.sign == "O") {
            // This is for Play
            let findTable: any = await redisGet(`${data.tableId}`)
            findTable = JSON.parse(findTable)
            findTable.gameStatus = "PLAYING"
            await redisDel(`${findTable._id}`)
            await redisSet(`${findTable._id}`, JSON.stringify(findTable));
            let parts = data.data.split("-");
            let numberOfBox = parts[1];
            findTable.playingData[numberOfBox - 1] = {
                userId: data.userId,
                symbol: data.sign
            }
            await redisDel(`${findTable._id}`)
            await redisSet(`${findTable._id}`, JSON.stringify(findTable));
            if (findTable) {
                let checkWinnerorNot = await checkWinner(findTable)
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
                        tableId: findTable._id,
                        userId: data.data.userId,
                        symbol: "O",
                        isLeave: false
                    }
                    logger.info(`END : playGame :: DATA :: ${JSON.stringify(data)}`);
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
                        tableId: findTable._id,
                        userId: data.data.userId,
                        symbol: "TIE",
                    }
                    logger.info(`END : playGame :: DATA :: ${JSON.stringify(data)}`);
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
                logger.info(`END : playGame :: DATA :: ${JSON.stringify(data.data)}`);
                return await changeTurn({ tableId: findTable._id }, socket)
            }
        }
    } catch (error) {
        logger.error(`CATCH_ERROR  playGame :: ${data} , ${error}`);
    }
}
export { playGame }
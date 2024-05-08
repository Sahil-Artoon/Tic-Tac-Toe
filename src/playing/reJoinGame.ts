import { Socket } from "socket.io";
import { logger } from "../logger";
import { Table } from "../model/tableModel";
import { User } from "../model/userModel";
import { sendToRoomEmmiter, sendToSocketIdEmmiter } from "../eventEmmitter";
import { EVENT_NAME } from "../constant/eventName";
import { eventHandler } from "../eventHandler";
import { getJob } from "../bull/getQueue/getRoundTimerQueue";
import { validateRejoinData } from "../validation/rejoinValidation";

const reJoinGame = async (data: any, socket: Socket) => {
    try {
        logger.info(`eventName is::::: Rejoin_game and data is::: ${JSON.stringify(data)}`)
        // console.log("Rejoin Event::::::", data)
        let checkData = await validateRejoinData(data)
        if (checkData.error) {
            data = {
                eventName: EVENT_NAME.REJOIN_GAME,
                data: {
                    message: checkData.error?.details[0].message
                },
                socket
            }
            return sendToSocketIdEmmiter(data);
        }
        let findTable = await Table.findById(data.tableId)
        if (checkData.error) {
            data = {
                eventName: EVENT_NAME.REJOIN_GAME,
                data: {
                    message: "Can't found record !!!"
                },
                socket
            }
            return sendToSocketIdEmmiter(data);
        }
        if (findTable) {
            // console.log("This is Rejoin Table ::::", findTable)
            if (findTable.playerInfo.length == 1) {
                console.log("This is One Player", findTable.playerInfo)
                if (findTable.playerInfo[0].userId == data.userData.userId) {
                    await User.findByIdAndUpdate(findTable.playerInfo[0].userId, { socketId: socket.id })
                    await Table.findByIdAndUpdate(findTable._id, { $set: { 'playerInfo[0].socketId': socket.id } })
                }
                socket.join(findTable._id.toString())
                if (findTable.gameStatus == "WATING") {
                    data = {
                        eventName: EVENT_NAME.REJOIN_GAME,
                        data: {
                            gameStatus: findTable.gameStatus,
                            data
                        },
                        socket
                    }
                    return sendToSocketIdEmmiter(data)
                }
            }
            if (findTable.playerInfo.length == 2) {
                if (findTable.playerInfo[0].userId == data.userData.userId) {
                    await User.findByIdAndUpdate(findTable.playerInfo[0].userId, { socketId: socket.id })
                }
                if (findTable.playerInfo[1].userId == data.userData.userId) {
                    await User.findByIdAndUpdate(findTable.playerInfo[1].userId, { socketId: socket.id })
                }
                socket.join(findTable._id.toString())
                if (findTable.gameStatus == "WATING") {
                    data = {
                        eventName: EVENT_NAME.REJOIN_GAME,
                        data: {
                            gameStatus: findTable.gameStatus,
                            data
                        },
                        socket
                    }
                    return sendToSocketIdEmmiter(data)
                }
                if (findTable.gameStatus == "ROUND_TIMER_START") {
                    const getpanddingTime = await getJob(findTable._id.toString())
                    data = {
                        eventName: EVENT_NAME.REJOIN_GAME,
                        data: {
                            gameStatus: findTable.gameStatus,
                            data,
                            time: getpanddingTime
                        },
                        socket
                    }
                    return sendToSocketIdEmmiter(data)
                }
                if (findTable.gameStatus == "CHECK_TURN") {
                    data = {
                        eventName: EVENT_NAME.REJOIN_GAME,
                        data: {
                            gameStatus: findTable.gameStatus,
                            data,
                            tableData: findTable
                        },
                        socket
                    }
                    return sendToSocketIdEmmiter(data)
                }

                if (findTable.gameStatus == "PLAYING") {
                    data = {
                        eventName: EVENT_NAME.REJOIN_GAME,
                        data: {
                            gameStatus: findTable.gameStatus,
                            data,
                            tableData: findTable
                        },
                        socket
                    }
                    return sendToSocketIdEmmiter(data)
                }
                if (findTable.gameStatus == "WINNING" || findTable.gameStatus == "TIE") {
                    data = {
                        eventName: EVENT_NAME.REJOIN_GAME,
                        data: {
                            gameStatus: findTable.gameStatus,
                            data,
                            tableData: findTable
                        },
                        socket
                    }
                    return sendToSocketIdEmmiter(data)
                }
            }
        }
    } catch (error) {
        console.log("Rejoin Game Error::::", error)
        logger.error("Rejoin Game Error::::", error)
    }
}

export { reJoinGame }
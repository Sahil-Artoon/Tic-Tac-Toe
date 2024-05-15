import { Socket } from "socket.io";
import { logger } from "../logger";
import { Table } from "../model/tableModel";
import { User } from "../model/userModel";
import { sendToRoomEmmiter, sendToSocketIdEmmiter } from "../eventEmmitter";
import { EVENT_NAME } from "../constant/eventName";
import { eventHandler } from "../eventHandler";
import { getJob } from "../bull/getQueue/getRoundTimerQueue";
import { validateRejoinData } from "../validation/rejoinValidation";
import { getTurnTimerQueue } from "../bull/getQueue/getTurnTimerQueue";
import { TIMER } from "../constant/timerConstant";

const reJoinGame = async (data: any, socket: Socket) => {
    try {
        logger.info(`RE_JOIN EVENT DATA :::: ${JSON.stringify(data)}`)
        let checkData = await validateRejoinData(data)
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
        let findTable = await Table.findById(data.tableId)
        if (findTable) {
            if (findTable.playerInfo.length == 1) {
                if (findTable.playerInfo[0].userId == data.userData.userId) {
                    await User.findByIdAndUpdate(findTable.playerInfo[0].userId, { socketId: socket.id, tableId: findTable._id.toString() });
                    await Table.findByIdAndUpdate(findTable._id, { $set: { 'playerInfo[0].socketId': socket.id } })
                }
                socket.join(findTable._id.toString())
                if (findTable.gameStatus == "WATING") {
                    data = {
                        eventName: EVENT_NAME.REJOIN_GAME,
                        data: {
                            gameStatus: findTable.gameStatus,
                            data,
                            message: "ok"
                        },
                        socket
                    }
                    return sendToSocketIdEmmiter(data)
                }
            }
            if (findTable.playerInfo.length == 2) {
                if (findTable.playerInfo[0].userId == data.userData.userId) {
                    await User.findByIdAndUpdate(findTable.playerInfo[0].userId, { socketId: socket.id, tableId: findTable._id.toString() })
                }
                if (findTable.playerInfo[1].userId == data.userData.userId) {
                    await User.findByIdAndUpdate(findTable.playerInfo[1].userId, { socketId: socket.id, tableId: findTable._id.toString() })
                }
                socket.join(findTable._id.toString())
                if (findTable.gameStatus == "WATING") {
                    data = {
                        eventName: EVENT_NAME.REJOIN_GAME,
                        data: {
                            gameStatus: findTable.gameStatus,
                            data,
                            message: "ok"
                        },
                        socket
                    }
                    return sendToSocketIdEmmiter(data)
                }
                if (findTable.gameStatus == "ROUND_TIMER_START") {
                    const getpanddingTime: any = await getJob(findTable._id.toString())
                    if (getpanddingTime > 5) {
                        data = {
                            eventName: EVENT_NAME.REJOIN_GAME,
                            data: {
                                gameStatus: findTable.gameStatus,
                                data,
                                time: getpanddingTime,
                                message: "ok",
                                leaveButton: true,
                            },
                            socket
                        }
                        return sendToSocketIdEmmiter(data)
                    } else {
                        data = {
                            eventName: EVENT_NAME.REJOIN_GAME,
                            data: {
                                gameStatus: findTable.gameStatus,
                                data,
                                time: getpanddingTime,
                                message: "ok",
                                leaveButton: false,
                            },
                            socket
                        }
                        return sendToSocketIdEmmiter(data)
                    }
                }
                if (findTable.gameStatus == "LOCK") {
                    let getpanddingTime: any = await getJob(findTable._id.toString())
                    data = {
                        eventName: EVENT_NAME.REJOIN_GAME,
                        data: {
                            gameStatus: findTable.gameStatus,
                            data,
                            time: getpanddingTime,
                            message: "ok",
                            leaveButton: false,
                        },
                        socket
                    }
                    return sendToSocketIdEmmiter(data)
                }
                if (findTable.gameStatus == "CHECK_TURN") {
                    let getpanddingTime: any = await getTurnTimerQueue(findTable._id.toString())
                    data = {
                        eventName: EVENT_NAME.REJOIN_GAME,
                        data: {
                            gameStatus: findTable.gameStatus,
                            data,
                            tableData: findTable,
                            message: "ok",
                            pandingTime: getpanddingTime,
                            time: TIMER.TURN_TIMER
                        },
                        socket
                    }
                    return sendToSocketIdEmmiter(data)
                }

                if (findTable.gameStatus == "PLAYING") {
                    let getpanddingTime: any = await getTurnTimerQueue(findTable._id.toString())
                    data = {
                        eventName: EVENT_NAME.REJOIN_GAME,
                        data: {
                            gameStatus: findTable.gameStatus,
                            data,
                            tableData: findTable,
                            message: "ok",
                            pandingTime: getpanddingTime,
                            time: TIMER.TURN_TIMER
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
                            tableData: findTable,
                            message: "ok"
                        },
                        socket
                    }
                    return sendToSocketIdEmmiter(data)
                }
            }
        }
    } catch (error) {
        logger.error("RE_JOIN ERROR :::: ", error)
    }
}

export { reJoinGame }
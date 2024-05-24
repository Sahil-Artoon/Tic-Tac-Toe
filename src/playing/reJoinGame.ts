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
import { redisDel, redisGet, redisSet } from "../redisOption";

const reJoinGame = async (data: any, socket: any) => {
    try {
        logger.info(`START FUNCTION : reJoinGame :: DATA :: ${JSON.stringify(data)}`);
        let checkData = await validateRejoinData(data)
        if (checkData?.error) {
            data = {
                eventName: EVENT_NAME.POP_UP,
                data: {
                    message: checkData.error?.details[0].message
                },
                socket
            }
            logger.error(`END : reJoinGame :: DATA :: ${JSON.stringify(data.data)}`);
            return sendToSocketIdEmmiter(data);
        }
        let findTable: any = await redisGet(`${data.tableId}`)
        findTable = JSON.parse(findTable)
        if (findTable) {
            if (findTable.playerInfo.length == 1) {
                if (findTable.playerInfo[0].userId == data.userData.userId) {
                    let findUser: any = await redisGet(`${findTable.playerInfo[0].userId}`)
                    findUser = JSON.parse(findUser)
                    findUser.socketId = socket.id
                    findUser.tableId = findTable._id
                    await redisDel(`${findUser._id}`)
                    await redisSet(`${findUser._id}`, JSON.stringify(findUser))
                }
                socket.join(findTable._id)
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
                    logger.info(`END : reJoinGame :: DATA :: ${JSON.stringify(data.data)}`);
                    return sendToSocketIdEmmiter(data)
                }
            }
            if (findTable.playerInfo.length == 2) {
                if (findTable.playerInfo[0].userId == data.userData.userId) {
                    let findUser: any = await redisGet(`${findTable.playerInfo[0].userId}`)
                    findUser = JSON.parse(findUser)
                    findUser.socketId = socket.id
                    findUser.tableId = findTable._id
                    await redisDel(`${findUser._id}`)
                    await redisSet(`${findUser._id}`, JSON.stringify(findUser))
                }
                if (findTable.playerInfo[1].userId == data.userData.userId) {
                    let findUser: any = await redisGet(`${findTable.playerInfo[1].userId}`)
                    findUser = JSON.parse(findUser)
                    findUser.socketId = socket.id
                    findUser.tableId = findTable._id
                    await redisDel(`${findUser._id}`)
                    await redisSet(`${findUser._id}`, JSON.stringify(findUser))
                }
                socket.join(findTable._id)
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
                    logger.info(`END : reJoinGame :: DATA :: ${JSON.stringify(data.data)}`);
                    return sendToSocketIdEmmiter(data)
                }
                if (findTable.gameStatus == "ROUND_TIMER_START") {
                    const getpanddingTime: any = await getJob(findTable._id)
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
                        logger.info(`END : reJoinGame :: DATA :: ${JSON.stringify(data.data)}`);
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
                        logger.info(`END : reJoinGame :: DATA :: ${JSON.stringify(data.data)}`);
                        return sendToSocketIdEmmiter(data)
                    }
                }
                if (findTable.gameStatus == "LOCK") {
                    let getpanddingTime: any = await getJob(findTable._id)
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
                    logger.info(`END : reJoinGame :: DATA :: ${JSON.stringify(data.data)}`);
                    return sendToSocketIdEmmiter(data)
                }
                if (findTable.gameStatus == "CHECK_TURN") {
                    let getpanddingTime: any = await getTurnTimerQueue(findTable._id)
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
                    logger.info(`END : reJoinGame :: DATA :: ${JSON.stringify(data.data)}`);
                    return sendToSocketIdEmmiter(data)
                }
                if (findTable.gameStatus == "PLAYING") {
                    let getpanddingTime: any = await getTurnTimerQueue(findTable._id)
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
                    logger.info(`END : reJoinGame :: DATA :: ${JSON.stringify(data.data)}`);
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
                    logger.info(`END : reJoinGame :: DATA :: ${JSON.stringify(data.data)}`);
                    return sendToSocketIdEmmiter(data)
                }
            }
        }
    } catch (error) {
        logger.error(`CATCH_ERROR  reJoinGame :: ${data} , ${error}`);
    }
}

export { reJoinGame }
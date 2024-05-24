import { Socket } from 'socket.io';
import { logger } from '../logger';
import { Table } from '../model/tableModel';
import { validationLeaveGame } from '../validation/leaveGameValidation';
import { EVENT_NAME } from '../constant/eventName';
import { sendToRoomEmmiter, sendToSocketIdEmmiter } from '../eventEmmitter';
import { User } from '../model/userModel';
import { declareWinner } from './declareWinner';
import { getCancleJob } from '../bull/cancleQueue/cancleRoundTimerQueue';
import { cancleLeaveButton } from '../bull/cancleQueue/cancleLeaveButton';
import { cancleTurnTimerJob } from '../bull/cancleQueue/cancleTurnTimerQueue';
import { redisDel, redisGet, redisSet } from '../redisOption';
import { REDIS_KEY } from '../constant/redisKey';
import { TIMER } from '../constant/timerConstant';
import { addBotQueue } from '../bull/queue/botTimerQueue';
const leaveGame = async (data: any, socket: any) => {
    try {
        logger.info(`START FUNCTION : leaveGame :: DATA :: ${JSON.stringify(data)}`);
        let checkData: any = await validationLeaveGame(data.userData)
        if (checkData?.error) {
            data = {
                eventName: EVENT_NAME.POP_UP,
                data: {
                    message: "Please send Valid data"
                },
                socket
            }
            logger.error(`END : leaveGame :: DATA :: ${JSON.stringify(data.data)}`);
            return sendToSocketIdEmmiter(data);
        }
        let findTable: any = await redisGet(`${data.userData.tableId}`)
        findTable = JSON.parse(findTable)
        if (findTable) {
            if (findTable.gameStatus == "WATING") {
                await redisDel(`${findTable._id}`)
                await redisDel(`${data.userData.userData.userId}`)
                await redisDel(`${REDIS_KEY.QUEUE}`)
                data = {
                    eventName: EVENT_NAME.LEAVE_GAME,
                    data: {
                        gameStatus: "WATING",
                        message: "ok"
                    },
                    socket
                }
                logger.info(`END : leaveGame :: DATA :: ${JSON.stringify(data.data)}`);
                return sendToSocketIdEmmiter(data);
            }
            if (findTable.gameStatus == "ROUND_TIMER_START") {
                await cancleLeaveButton(findTable._id);
                if (findTable.playerInfo[0].userId == data.userData.userData.userId) {
                    let check = await getCancleJob(findTable._id)
                    if (check == true) {
                        findTable.playerInfo = findTable.playerInfo.splice(0, 1)
                        findTable.activePlayer = findTable.activePlayer - 1
                        findTable.gameStatus = "WATING"
                        let findUser: any = await redisGet(`${data.userData.userData.userId}`)
                        findUser = JSON.parse(findUser)
                        findUser.tableId = ""
                        await redisDel(`${findUser._id}`)
                        await redisSet(`${findUser._id}`, JSON.stringify(findUser))
                        let dataOfQueue: any = await redisGet(`${REDIS_KEY.QUEUE}`)
                        dataOfQueue = JSON.parse(dataOfQueue)
                        if (dataOfQueue) {
                            // console.log("Data of Queue: ", dataOfQueue._id)
                            dataOfQueue._id.push(findTable._id)
                            await redisDel(`${REDIS_KEY.QUEUE}`)
                            await redisSet(`${REDIS_KEY.QUEUE}`, JSON.stringify(dataOfQueue))
                        } else {
                            dataOfQueue = {
                                _id: [findTable._id]
                            }
                            await redisSet(`${REDIS_KEY.QUEUE}`, JSON.stringify(dataOfQueue))
                        }
                        data = {
                            eventName: EVENT_NAME.LEAVE_GAME,
                            data: {
                                _id: findTable?._id.toString(),
                                gameStatus: "ROUND_TIMER",
                                tableData: findTable,
                                message: "ok",
                                userId: data.userData.userData.userId
                            },
                            socket
                        }
                        data = {
                            _id: findTable._id,
                            time: TIMER.BOT_TIMER
                        }
                        await addBotQueue(data, socket)
                        logger.info(`END : leaveGame :: DATA :: ${JSON.stringify(data.data)}`);
                        return sendToRoomEmmiter(data)
                    }
                }
                if (findTable.playerInfo[1].userId == data.userData.userData.userId) {
                    let check = await getCancleJob(findTable._id)
                    if (check == true) {
                        findTable.playerInfo = findTable.playerInfo.splice(1, 1)
                        findTable.activePlayer = findTable.activePlayer - 1
                        findTable.gameStatus = "WATING"
                        let findUser: any = await redisGet(`${data.userData.userData.userId}`)
                        findUser = JSON.parse(findUser)
                        findUser.tableId = ""
                        await redisDel(`${findUser._id}`)
                        await redisSet(`${findUser._id}`, JSON.stringify(findUser))
                        let dataOfQueue: any = await redisGet(`${REDIS_KEY.QUEUE}`)
                        dataOfQueue = JSON.parse(dataOfQueue)
                        if (dataOfQueue) {
                            // console.log("Data of Queue: ", dataOfQueue._id)
                            dataOfQueue._id.push(findTable._id)
                            await redisDel(`${REDIS_KEY.QUEUE}`)
                            await redisSet(`${REDIS_KEY.QUEUE}`, JSON.stringify(dataOfQueue))
                        } else {
                            dataOfQueue = {
                                _id: [findTable._id]
                            }
                            await redisSet(`${REDIS_KEY.QUEUE}`, JSON.stringify(dataOfQueue))
                        }
                        data = {
                            eventName: EVENT_NAME.LEAVE_GAME,
                            data: {
                                _id: findTable?._id.toString(),
                                gameStatus: "ROUND_TIMER",
                                tableData: findTable,
                                message: "ok",
                                userId: data.userData.userData.userId
                            },
                            socket
                        }
                        logger.info(`END : leaveGame :: DATA :: ${JSON.stringify(data.data)}`);
                        return sendToRoomEmmiter(data)
                    }
                }
            }
            if (findTable.gameStatus == "CHECK_TURN") {
                await cancleTurnTimerJob(findTable._id.toString())
                if (findTable.playerInfo[0].userId == data.userData.userData.userId) {
                    data = {
                        userId: findTable.playerInfo[1].userId,
                        symbol: data.userData.userData.symbol,
                        tableId: data.userData.tableId,
                        isLeave: true
                    }
                    logger.info(`END : leaveGame :: DATA :: ${JSON.stringify(data)}`);
                    return declareWinner(data)
                }
                if (findTable.playerInfo[1].userId == data.userData.userData.userId) {
                    data = {
                        userId: findTable.playerInfo[0].userId,
                        symbol: data.userData.userData.symbol,
                        tableId: data.userData.tableId,
                        isLeave: true
                    }
                    logger.info(`END : leaveGame :: DATA :: ${JSON.stringify(data)}`);
                    return declareWinner(data)
                }
            }
            if (findTable.gameStatus == "PLAYING") {
                await cancleTurnTimerJob(findTable._id)
                if (findTable.playerInfo[0].userId == data.userData.userData.userId) {
                    data = {
                        userId: findTable.playerInfo[1].userId,
                        symbol: data.userData.userData.symbol,
                        tableId: data.userData.tableId,
                        isLeave: true
                    }
                    logger.info(`END : leaveGame :: DATA :: ${JSON.stringify(data)}`);
                    return declareWinner(data)
                }
                if (findTable.playerInfo[1].userId == data.userData.userData.userId) {
                    data = {
                        userId: findTable.playerInfo[0].userId,
                        symbol: data.userData.userData.symbol,
                        tableId: data.userData.tableId,
                        isLeave: true
                    }
                    logger.info(`END : leaveGame :: DATA :: ${JSON.stringify(data)}`);
                    return declareWinner(data)
                }
            }
        }
    } catch (error) {
        logger.error(`CATCH_ERROR  leaveGame :: ${data} , ${error}`);
    }
}

export { leaveGame }
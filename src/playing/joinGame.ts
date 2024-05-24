import { Socket } from "socket.io"
import { logger } from "../logger"
import { Table } from "../model/tableModel"
import { User } from "../model/userModel"
import { EVENT_NAME } from "../constant/eventName"
import { sendToRoomEmmiter, sendToSocketIdEmmiter } from "../eventEmmitter"
import { roundTimer } from "../bull/queue/roundTimer"
import { validateJoinTable } from "../validation/joinTableValidation"
import { leaveButton } from "../bull/queue/leaveButton"
import { addBotQueue } from "../bull/queue/botTimerQueue"
import { TIMER } from "../constant/timerConstant"
import { cancleBotTimer } from "../bull/cancleQueue/cancleBotQueue"
import { generateRandomId } from "../common/objectId"
import { REDIS_KEY } from "../constant/redisKey"
import { redisDel, redisGet, redisSet } from "../redisOption"

const joinGame = async (data: any, socket: any) => {
    try {
        logger.info(`START : joinGame :: DATA :: ${JSON.stringify(data)}`);
        let { userId } = data
        const checkData = await validateJoinTable(data)
        if (checkData?.error) {
            data = {
                eventName: EVENT_NAME.POP_UP,
                data: {
                    message: checkData.error?.details[0].message
                },
                socket
            }
            logger.error(`END : joinGame :: DATA :: ${JSON.stringify(data.data)}`);
            return sendToSocketIdEmmiter(data);
        }

        let findUser: any = await redisGet(`${userId}`)
        findUser = JSON.parse(findUser)
        if (!findUser) {
            data = {
                eventName: EVENT_NAME.POP_UP,
                data: {
                    message: "Can't found User by Id"
                },
                socket
            }
            logger.error(`END : joinGame :: DATA :: ${JSON.stringify(data.data)}`);
            return sendToSocketIdEmmiter(data);
        }

        let checkTable: any = await redisGet(`${REDIS_KEY.QUEUE}`)
        checkTable = JSON.parse(checkTable)
        if (checkTable) {
            await redisDel(`${REDIS_KEY.QUEUE}`)
            console.log("CheckTable Is::::", checkTable._id.length)
            if (checkTable._id.length > 1) {
                console.log("This is inside length > 1")
            } else {
                console.log("This is inside length < 1")
                if (findUser.tableId == checkTable._id) {
                    data = {
                        eventName: EVENT_NAME.POP_UP,
                        data: {
                            message: "User Already in Table !!!",
                            return: true
                        },
                        socket
                    }
                    logger.error(`END : joinGame :: DATA :: ${JSON.stringify(data.data)}`);
                    return sendToSocketIdEmmiter(data);
                }
                let findTable: any = await redisGet(`${checkTable._id[0]}`)
                findTable = JSON.parse(findTable)
                let symbol;
                if (findTable.playerInfo[0].symbol == "X") {
                    symbol = "O"
                } else {
                    symbol = "X"
                }
                if (findUser.isBot == false) {
                    await cancleBotTimer(findTable._id)
                }
                findTable.playerInfo.push(
                    {
                        userId: findUser._id,
                        userName: findUser.userName,
                        isActive: true,
                        symbol: symbol,
                        turnMiss: 0
                    }
                )
                findTable.activePlayer = 2;
                findTable.gameStatus = "WATING"
                await redisDel(`${findTable._id}`)
                await redisSet(`${findTable._id}`, JSON.stringify(findTable))
                findUser.tableId = findTable._id
                await redisDel(`${findUser._id}`)
                await redisSet(`${findUser._id}`, JSON.stringify(findUser))
                if (findUser.isBot == false) {
                    data = {
                        eventName: EVENT_NAME.JOIN_TABLE,
                        data: {
                            data: findTable,
                            message: "ok",
                            status: "waiting"
                        },
                        socket
                    }
                    sendToSocketIdEmmiter(data)
                }
                findTable.gameStatus = "ROUND_TIMER_START"
                await redisDel(`${findTable._id}`)
                await redisSet(`${findTable._id}`, JSON.stringify(findTable))
                let currentTable: any = await redisGet(`${findTable._id}`)
                currentTable = JSON.parse(currentTable)
                if (currentTable) {
                    console.log("currentTable._id is ::::", currentTable._id)
                    socket.join(currentTable._id)
                    data = {
                        eventName: EVENT_NAME.ROUND_TIMER,
                        data: {
                            _id: currentTable._id,
                            data: currentTable,
                            message: "ok",
                            roundTimer: 10
                        },
                        socket
                    }
                    sendToRoomEmmiter(data)
                    data = {
                        tableId: currentTable._id,
                        time: 6000
                    }
                    leaveButton(data)
                    data = {
                        tableId: currentTable._id,
                        time: 10000
                    }
                    await roundTimer(data, socket)
                }


            }
        } else {
            let findUser: any = await redisGet(`${userId}`)
            findUser = JSON.parse(findUser)
            let _id: string = generateRandomId()
            let dataOfTable = {
                _id: `${REDIS_KEY.TABLE}:${_id}`,
                playerInfo: [{
                    userId: findUser._id,
                    userName: findUser.userName,
                    isActive: true,
                    symbol: "X",
                    turnMiss: 0
                }],
                playingData: [
                    { userId: "", symbol: "" },
                    { userId: "", symbol: "" },
                    { userId: "", symbol: "" },
                    { userId: "", symbol: "" },
                    { userId: "", symbol: "" },
                    { userId: "", symbol: "" },
                    { userId: "", symbol: "" },
                    { userId: "", symbol: "" },
                    { userId: "", symbol: "" },
                ],
                activePlayer: 1,
                gameStatus: "WATING",
                currentTurnSeatIndex: null,
                currentTurnUserId: null
            }
            await redisSet(`${REDIS_KEY.TABLE}:${_id}`, JSON.stringify(dataOfTable))
            let dataOfQueue: any = await redisGet(`${REDIS_KEY.QUEUE}`)
            dataOfQueue = JSON.parse(dataOfQueue)
            if (dataOfQueue) {
                dataOfQueue._id.push(dataOfTable._id)
                await redisDel(`${REDIS_KEY.QUEUE}`)
                await redisSet(`${REDIS_KEY.QUEUE}`, JSON.stringify(dataOfQueue))
            } else {
                dataOfQueue = {
                    _id: [dataOfTable._id]
                }
                await redisSet(`${REDIS_KEY.QUEUE}`, JSON.stringify(dataOfQueue))
            }
            let dataOfUser = {
                _id: userId,
                userName: findUser.userName,
                socketId: findUser.socketId,
                tableId: dataOfTable._id,
                isBot: findUser.isBot
            }
            await redisDel(`${userId}`)
            data = await redisSet(`${userId}`, JSON.stringify(dataOfUser));
            if (data) {
                data = {
                    eventName: EVENT_NAME.JOIN_TABLE,
                    data: {
                        data: dataOfTable,
                        message: "ok",
                        status: "Waiting"
                    },
                    socket
                }
                console.log("DataOfSocket._id is :::", dataOfTable._id)
                socket.join(dataOfTable._id)
                sendToSocketIdEmmiter(data)
                data = {
                    _id: dataOfTable._id,
                    time: TIMER.BOT_TIMER
                }
                await addBotQueue(data, socket)
            }
            logger.info(`END : joinGame :: DATA :: ${JSON.stringify(data)}`);
        }
    } catch (error) {
        logger.error(`CATCH_ERROR joinGame :: ${data}, ${error}`);
    }
}

export { joinGame }
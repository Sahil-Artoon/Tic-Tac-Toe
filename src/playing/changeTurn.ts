import { logger } from "../logger";
import { Table } from "../model/tableModel";
import { EVENT_NAME } from "../constant/eventName";
import { sendToRoomEmmiter } from "../eventEmmitter";
import { turnTimer } from "../bull/queue/turnTimer";
import { cancleTurnTimerJob } from "../bull/cancleQueue/cancleTurnTimerQueue";
import { TIMER } from "../constant/timerConstant";
import { declareWinner } from "./declareWinner";
import { botPlay } from "../bot/botPlay";
import { User } from "../model/userModel";
import { redisDel, redisGet, redisSet } from "../redisOption";

const changeTurn = async (data: any, socket: any) => {
    try {
        logger.info(`START FUNCTION : changeTurn :: DATA :: ${JSON.stringify(data)}`);
        let finalTable: any = await redisGet(`${data.tableId}`)
        finalTable = JSON.parse(finalTable)
        console.log("change turn table :::: ", finalTable);
        if (finalTable) {
            if (finalTable.currentTurnSeatIndex == 0) {
                let findTable: any = await redisGet(`${finalTable._id}`)
                findTable = JSON.parse(findTable)
                if (data.play == false) {
                    findTable.playerInfo[0].turnMiss = findTable.playerInfo[0].turnMiss + 1
                    await redisDel(`${findTable._id}`)
                    await redisSet(`${findTable._id}`, JSON.stringify(findTable));
                    console.log("==============>>", findTable);
                    console.log("----------------------->>>>>>>>", findTable?.playerInfo[0]?.turnMiss)
                    if (findTable?.playerInfo[0]?.turnMiss == 3) {
                        data = {
                            tableId: findTable?._id,
                            userId: findTable?.playerInfo[1].userId,
                            symbol: findTable?.playerInfo[1].symbol,
                            isLeave: false
                        }
                        logger.info(`END : changeTurn :: DATA :: ${JSON.stringify(data)}`);
                        return declareWinner(data)
                    }
                }
                findTable.currentTurnSeatIndex = 1
                findTable.currentTurnUserId = findTable.playerInfo[1].userId
                findTable.gameStatus = "PLAYING"
                await redisDel(`${findTable._id}`)
                await redisSet(`${findTable._id}`, JSON.stringify(findTable));
                data = {
                    eventName: EVENT_NAME.CHANGE_TURN,
                    data: {
                        _id: findTable?._id,
                        data: findTable?.playerInfo[1],
                        userId: findTable?.playerInfo[1].userId,
                        symbol: findTable?.playerInfo[1].symbol,
                        time: TIMER.TURN_TIMER,
                        seatIndex: findTable?.currentTurnSeatIndex
                    }
                }

                console.log("changeTurn ::: data send :::: ---->    ", data)

                sendToRoomEmmiter(data)

                data = {
                    tableId: findTable?._id,
                    time: TIMER.TURN_TIMER
                }
                await turnTimer(data, socket)
                let findUser: any = await redisGet(`${findTable?.playerInfo[1].userId}`)
                findUser = JSON.parse(findUser)
                if (findUser?.isBot == true) {
                    await botPlay(findTable._id, socket)
                }
            }
            if (finalTable.currentTurnSeatIndex == 1) {
                let findTable: any = await redisGet(`${finalTable._id}`)
                findTable = JSON.parse(findTable)
                if (data.play == false) {
                    findTable.playerInfo[1].turnMiss = findTable.playerInfo[1].turnMiss + 1
                    await redisDel(`${findTable._id}`)
                    await redisSet(`${findTable._id}`, JSON.stringify(findTable))
                    if (findTable?.playerInfo[1]?.turnMiss == 3) {
                        data = {
                            tableId: findTable?._id,
                            userId: findTable?.playerInfo[0].userId,
                            symbol: findTable?.playerInfo[0].symbol,
                            isLeave: false
                        }
                        logger.info(`END : changeTurn :: DATA :: ${JSON.stringify(data)}`);
                        return declareWinner(data)
                    }
                }
                findTable.currentTurnSeatIndex = 0
                findTable.currentTurnUserId = findTable.playerInfo[0].userId
                findTable.gameStatus = "PLAYING"
                await redisDel(`${findTable._id}`)
                await redisSet(`${findTable._id}`, JSON.stringify(findTable));
                data = {
                    eventName: EVENT_NAME.CHANGE_TURN,
                    data: {
                        _id: findTable?._id,
                        data: findTable?.playerInfo[0],
                        userId: findTable?.playerInfo[0].userId,
                        symbol: findTable?.playerInfo[0].symbol,
                        time: TIMER.TURN_TIMER,
                        seatIndex: findTable?.currentTurnSeatIndex
                    }
                }
                sendToRoomEmmiter(data)
                data = {
                    tableId: findTable?._id,
                    time: TIMER.TURN_TIMER
                }
                await turnTimer(data, socket)
                let findUser: any = await redisGet(`${findTable?.playerInfo[0].userId}`)
                findUser = JSON.parse(findUser)
                if (findUser?.isBot == true) {
                    await botPlay(data.tableId, socket)
                }
            }
            logger.info(`END : changeTurn :: DATA :: ${JSON.stringify(data)}`);
        }
    } catch (error) {
        logger.error(`CATCH_ERROR  changeTurn :: ${data}, ${error}`);
    }
}

export { changeTurn }
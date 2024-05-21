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

const changeTurn = async (data: any, socket: any) => {
    try {
        logger.info(`START FUNCTION : changeTurn :: DATA :: ${JSON.stringify(data)}`);
        let findTable = await Table.findById(data.tableId)
        if (findTable) {
            if (findTable.currentTurnSeatIndex == 0) {
                if (data.play == false) {
                    let checkData = await Table.findByIdAndUpdate(findTable._id, { $inc: { [`playerInfo.${0}.turnMiss`]: 1 } }, { new: true })
                    if (checkData?.playerInfo[0]?.turnMiss == 3) {
                        data = {
                            tableId: checkData?._id.toString(),
                            userId: checkData?.playerInfo[1].userId,
                            symbol: checkData?.playerInfo[1].symbol,
                            isLeave: false
                        }
                        logger.info(`END : changeTurn :: DATA :: ${JSON.stringify(data)}`);
                        return declareWinner(data)
                    }
                }
                let updateTable = await Table.findByIdAndUpdate(findTable._id, {
                    currentTurnSeatIndex: "1",
                    currentTurnUserId: findTable.playerInfo[1].userId,
                    gameStatus: "PLAYING",
                }, { new: true })
                data = {
                    eventName: EVENT_NAME.CHANGE_TURN,
                    data: {
                        _id: updateTable?._id.toString(),
                        data: updateTable?.playerInfo[1],
                        userId: updateTable?.playerInfo[1].userId,
                        symbol: updateTable?.playerInfo[1].symbol,
                        time: TIMER.TURN_TIMER
                    }
                }
                sendToRoomEmmiter(data)
                let result = await cancleTurnTimerJob(updateTable?._id.toString())
                if (result == true) {
                    data = {
                        tableId: updateTable?._id.toString(),
                        time: TIMER.TURN_TIMER
                    }
                    await turnTimer(data, socket)
                }
                else {
                    data = {
                        tableId: updateTable?._id.toString(),
                        time: TIMER.TURN_TIMER
                    }
                    await turnTimer(data, socket)
                }
                let findUser = await User.findById(updateTable?.playerInfo[1].userId)
                if (findUser?.isBot == true) {
                    await botPlay(data.tableId, socket)
                }
            }
            if (findTable.currentTurnSeatIndex == 1) {
                if (data.play == false) {
                    let checkData = await Table.findByIdAndUpdate(findTable._id, { $inc: { [`playerInfo.${1}.turnMiss`]: 1 } }, { new: true })
                    if (checkData?.playerInfo[1]?.turnMiss == 3) {
                        data = {
                            tableId: checkData?._id.toString(),
                            userId: checkData?.playerInfo[0].userId,
                            symbol: checkData?.playerInfo[0].symbol,
                            isLeave: false
                        }
                        logger.info(`END : changeTurn :: DATA :: ${JSON.stringify(data)}`);
                        return declareWinner(data)
                    }
                }
                let updateTable = await Table.findByIdAndUpdate(findTable._id, {
                    currentTurnSeatIndex: "0",
                    currentTurnUserId: findTable.playerInfo[0].userId,
                    gameStatus: "PLAYING",
                }, { new: true })
                data = {
                    eventName: EVENT_NAME.CHANGE_TURN,
                    data: {
                        _id: updateTable?._id.toString(),
                        data: updateTable?.playerInfo[0],
                        userId: updateTable?.playerInfo[0].userId,
                        symbol: updateTable?.playerInfo[0].symbol,
                        time: TIMER.TURN_TIMER
                    }
                }
                sendToRoomEmmiter(data)
                let result = await cancleTurnTimerJob(updateTable?._id.toString())
                if (result == true) {
                    data = {
                        tableId: updateTable?._id.toString(),
                        time: TIMER.TURN_TIMER
                    }
                    await turnTimer(data, socket)
                }
                else {
                    data = {
                        tableId: updateTable?._id.toString(),
                        time: TIMER.TURN_TIMER
                    }
                    await turnTimer(data, socket)
                }
                let findUser = await User.findById(updateTable?.playerInfo[0].userId)
                if (findUser?.isBot == true) {
                    await botPlay(data.tableId, socket)
                }
            }
            logger.info(`END : changeTurn :: DATA :: ${JSON.stringify(data)}`);
        }
    } catch (error) {
        logger.error(`CATCH_ERROR  changeTurn :: ${data} , ${error}`);
    }
}

export { changeTurn }
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
        let findTable: any = await Table.findById(data.userData.tableId)
        if (findTable) {
            if (findTable.gameStatus == "WATING") {
                await Table.findByIdAndDelete(findTable._id)
                await User.findByIdAndUpdate(data.userData.userData.userId, { $set: { tableId: "" } })
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
                await cancleLeaveButton(findTable._id.toString());
                if (findTable.playerInfo[0].userId == data.userData.userData.userId) {
                    let check = await getCancleJob(findTable._id.toString())
                    if (check == true) {
                        await Table.findByIdAndUpdate(findTable._id, { $pull: { playerInfo: findTable.playerInfo[0] } })
                        let newTable = await Table.findByIdAndUpdate(findTable._id, { $set: { activePlayer: findTable.activePlayer - 1, gameStatus: "WATING" } }, { new: true })
                        await User.findByIdAndUpdate(data.userData.userData.userId, { $set: { tableId: "" } })
                        data = {
                            eventName: EVENT_NAME.LEAVE_GAME,
                            data: {
                                _id: newTable?._id.toString(),
                                gameStatus: "ROUND_TIMER",
                                tableData: newTable,
                                message: "ok",
                                userId: data.userData.userData.userId
                            },
                            socket
                        }
                        logger.info(`END : leaveGame :: DATA :: ${JSON.stringify(data.data)}`);
                        return sendToRoomEmmiter(data)
                    }
                }
                if (findTable.playerInfo[1].userId == data.userData.userData.userId) {
                    let check = await getCancleJob(findTable._id.toString())
                    if (check == true) {
                        await Table.findByIdAndUpdate(findTable._id, { $pull: { playerInfo: findTable.playerInfo[1] } })
                        let newTable = await Table.findByIdAndUpdate(findTable._id, { $set: { activePlayer: findTable.activePlayer - 1, gameStatus: "WATING" } }, { new: true })
                        await User.findByIdAndUpdate(data.userData.userData.userId, { $set: { tableId: "" } })
                        data = {
                            eventName: EVENT_NAME.LEAVE_GAME,
                            data: {
                                _id: newTable?._id.toString(),
                                gameStatus: "ROUND_TIMER",
                                tableData: newTable,
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
        }
    } catch (error) {
        logger.error(`CATCH_ERROR  leaveGame :: ${data} , ${error}`);
    }
}

export { leaveGame }
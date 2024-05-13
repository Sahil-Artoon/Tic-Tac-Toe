import { Socket } from 'socket.io';
import { logger } from '../logger';
import { Table } from '../model/tableModel';
import { validationLeaveGame } from '../validation/leaveGameValidation';
import { EVENT_NAME } from '../constant/eventName';
import { sendToRoomEmmiter, sendToSocketIdEmmiter } from '../eventEmmitter';
import { User } from '../model/userModel';
import { io } from '..';
import { declareWinner } from './declareWinner';
import { getCancleJob } from '../bull/cancleQueue/cancleRoundTimerQueue';
const leaveGame = async (data: any, socket: Socket) => {
    try {
        logger.info(`LEAVE_GAME DATA :::: ${JSON.stringify(data)}`)
        let checkData: any = await validationLeaveGame(data.userData)
        if (checkData.error) {
            data = {
                eventName: EVENT_NAME.POP_UP,
                data: {
                    message: "Please send Valid data"
                },
                socket
            }
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
                return sendToSocketIdEmmiter(data);
            }
            if (findTable.gameStatus == "ROUND_TIMER_START") {
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
                        return sendToRoomEmmiter(data)
                    }
                }
            }
            if (findTable.gameStatus == "CHECK_TURN") {
                if (findTable.playerInfo[0].userId == data.userData.userData.userId) {
                    data = {
                        userId: findTable.playerInfo[1].userId,
                        symbol: data.userData.userData.symbol,
                        tableId: data.userData.tableId,
                        isLeave: true
                    }
                    return declareWinner(data)
                }
                if (findTable.playerInfo[1].userId == data.userData.userData.userId) {
                    data = {
                        userId: findTable.playerInfo[0].userId,
                        symbol: data.userData.userData.symbol,
                        tableId: data.userData.tableId,
                        isLeave: true
                    }
                    return declareWinner(data)
                }
            }
            if (findTable.gameStatus == "PLAYING") {
                if (findTable.playerInfo[0].userId == data.userData.userData.userId) {
                    data = {
                        userId: findTable.playerInfo[1].userId,
                        symbol: data.userData.userData.symbol,
                        tableId: data.userData.tableId,
                        isLeave: true
                    }
                    return declareWinner(data)
                }
                if (findTable.playerInfo[1].userId == data.userData.userData.userId) {
                    data = {
                        userId: findTable.playerInfo[0].userId,
                        symbol: data.userData.userData.symbol,
                        tableId: data.userData.tableId,
                        isLeave: true
                    }
                    return declareWinner(data)
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}

export { leaveGame }
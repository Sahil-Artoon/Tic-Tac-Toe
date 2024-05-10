import { Socket } from 'socket.io';
import { logger } from '../logger';
import { Table } from '../model/tableModel';
import { validationLeaveGame } from '../validation/leaveGameValidation';
import { EVENT_NAME } from '../constant/eventName';
import { sendToRoomEmmiter, sendToSocketIdEmmiter } from '../eventEmmitter';
import { User } from '../model/userModel';
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
            if (findTable.gameStatus == "CHECK_TURN") {
                if (findTable.playerInfo[0].userId == data.userData.userData.userId) {
                    await Table.findByIdAndUpdate(findTable._id, { $set: { $remove: findTable.playerInfo[0] }, gameStatus: "WATING" })
                    await User.findByIdAndUpdate(data.userData.userData.userId, { $set: { tableId: "" } })
                    data = {
                        eventName: EVENT_NAME.LEAVE_GAME,
                        data: {
                            _id: findTable._id,
                            gameStatus: "WATING",
                            message: "ok",
                            userId: data.userData.userData.userId
                        },
                        socket
                    }
                    return sendToRoomEmmiter(data)
                }
                if (findTable.playerInfo[1].userId == data.userData.userData.userId) {
                    await Table.findByIdAndUpdate(findTable._id, { $set: { $remove: findTable.playerInfo[1] }, gameStatus: "WATING" })
                    await User.findByIdAndUpdate(data.userData.userData.userId, { $set: { tableId: "" } })
                    data = {
                        eventName: EVENT_NAME.LEAVE_GAME,
                        data: {
                            _id: findTable._id,
                            gameStatus: "WATING",
                            message: "ok",
                            userId: data.userData.userData.userId
                        },
                        socket
                    }
                    return sendToRoomEmmiter(data)
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}

export { leaveGame }
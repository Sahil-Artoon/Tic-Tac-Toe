import { Socket } from 'socket.io';
import { logger } from '../logger';
import { Table } from '../model/tableModel';
import { validationLeaveGame } from '../validation/leaveGameValidation';
import { EVENT_NAME } from '../constant/eventName';
import { sendToSocketIdEmmiter } from '../eventEmmitter';
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
        }
    } catch (error) {
        console.log(error);
    }
}

export { leaveGame }
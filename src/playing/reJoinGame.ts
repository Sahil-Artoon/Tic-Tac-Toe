import { Socket } from "socket.io";
import { logger } from "../logger";
import { Table } from "../model/tableModel";
import { User } from "../model/userModel";
import { sendToSocketIdEmmiter } from "../eventEmmitter";
import { EVENT_NAME } from "../constant/eventName";

const reJoinGame = async (data: any, socket: Socket) => {
    try {
        logger.info(`eventName is::::: Rejoin_game and data is::: ${JSON.stringify(data)}`)
        // console.log("Rejoin Event::::::", data)
        let findTable = await Table.findById(data.tableId)

        if (findTable) {
            // console.log("This is Rejoin Table ::::", findTable)
            if (findTable.playerInfo.length == 1) {
                console.log("This is One Player", findTable.playerInfo)
                if (findTable.playerInfo[0].userId == data.userData.userId) {
                    await User.findByIdAndUpdate(findTable.playerInfo[0].userId, { socketId: socket.id })
                    await Table.findByIdAndUpdate(findTable._id, { $set: { 'playerInfo[0].socketId': socket.id } })
                }
                socket.join(findTable._id.toString())
                if (findTable.gameStatus == "WATING") {
                    data = {
                        eventName: EVENT_NAME.REJOIN_GAME,
                        data: {
                            gameStatus: findTable.gameStatus,
                            data
                        },
                        socket
                    }
                    return sendToSocketIdEmmiter(data)
                }
            }
            if (findTable.playerInfo.length == 2) {
                if (findTable.playerInfo[0].userId == data.userData.userId) {
                    await User.findByIdAndUpdate(findTable.playerInfo[0].userId, { socketId: socket.id })
                    await Table.findByIdAndUpdate(findTable._id, { $set: { 'playerInfo[0].socketId': socket.id } })
                }
                if (findTable.playerInfo[1].userId == data.userData.userId) {
                    await User.findByIdAndUpdate(findTable.playerInfo[1].userId, { socketId: socket.id })
                    await Table.findByIdAndUpdate(findTable._id, { $set: { 'playerInfo[1].socketId': socket.id } })
                }
                socket.join(findTable._id.toString())
                if (findTable.gameStatus == "WATING") {
                    data = {
                        eventName: EVENT_NAME.REJOIN_GAME,
                        data: {
                            gameStatus: findTable.gameStatus,
                            data
                        },
                        socket
                    }
                    return sendToSocketIdEmmiter(data)
                }
                if (findTable.gameStatus == "ROUND_TIMER_START") {
                    data = {
                        eventName: EVENT_NAME.ROUND_TIMER,
                        data: {
                            gameStatus: findTable.gameStatus,
                            data
                        },
                        socket
                    }
                    return sendToSocketIdEmmiter(data)
                }
            }
        }
    } catch (error) {
        console.log("Rejoin Game Error::::", error)
        logger.error("Rejoin Game Error::::", error)
    }
}

export { reJoinGame }
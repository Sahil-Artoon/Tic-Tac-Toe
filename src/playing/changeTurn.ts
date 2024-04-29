import { Socket } from "socket.io";
import { logger } from "../logger";
import { Table } from "../model/tableModel";
import { EVENT_NAME } from "../constant/eventName";
import { sendToRoomEmmiter } from "../eventEmmitter";

const changeTurn = async (data: any, socket: Socket) => {
    try {
        logger.info(`changeTurn:::Data: ${JSON.stringify(data)} and Socket Id::: ${socket.id}`);
        // {"tableId":"662f7557b813436b36222971","userId":"662f{"tableId":"666b7a66976c3419de4a85"} and Socket Id::: 
        // oNs_l6DzrGbCde4a85"} and S2f7557b813436b36222971","userId":Xt31AAAH
        let findTable = await Table.findById(data.tableId)
        if (findTable) {
            if (findTable.currentTurnSeatIndex == "0") {
                let updateTable = await Table.findByIdAndUpdate(findTable._id, {
                    currentTurnSeatIndex: "1",
                    currentTurnUserId: findTable.playerInfo[1].userId
                }, { new: true })
                data = {
                    eventName: EVENT_NAME.CHANGE_TURN,
                    data: {
                        _id:data.tableId,
                        data: updateTable?.playerInfo[1],
                        userId: updateTable?.playerInfo[1].userId,
                        symbol: updateTable?.playerInfo[1].symbol
                    }
                }
                return sendToRoomEmmiter(data)
            }
            if (findTable.currentTurnSeatIndex == "1") {
                let updateTable = await Table.findByIdAndUpdate(findTable._id, {
                    currentTurnSeatIndex: "0",
                    currentTurnUserId: findTable.playerInfo[0].userId
                }, { new: true })
                data = {
                    eventName: EVENT_NAME.CHANGE_TURN,
                    data: {
                        _id:data.tableId,
                        data: updateTable?.playerInfo[0],
                        userId: updateTable?.playerInfo[0].userId,
                        symbol: updateTable?.playerInfo[0].symbol
                    }
                }
                return sendToRoomEmmiter(data)
            }
        }
    } catch (error) {
        console.log("changeTurn ::::", error)
        logger.error(`changeTurn Error: ${error}`)
    }
}

export { changeTurn }
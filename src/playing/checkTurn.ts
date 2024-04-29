import { Socket } from "socket.io";
import { sendToRoomEmmiter } from "../eventEmmitter";
import { EVENT_NAME } from "../constant/eventName";
import { Table } from "../model/tableModel";
import { logger } from "../logger";

const checkTurn = async (data: any, socket: Socket) => {
    try {
        logger.info(`Data is This :::${JSON.stringify(data)} and Socket is ::::: ${socket.id}`)
        // RandomeTurn
        const randomNumber = Math.random();
        const ramdomNumberForGiveUserTurn = Math.round(randomNumber);
        let dataOfTable = await Table.findById(data.data.tableId)
        if (dataOfTable) {
            await Table.findByIdAndUpdate(dataOfTable._id, {
                currentTurnSeatIndex: ramdomNumberForGiveUserTurn,
                currentTurnUserId: dataOfTable.playerInfo[ramdomNumberForGiveUserTurn].userId,
                gameStatus: "CHECK_TURN"
            })
            data = {
                eventName: EVENT_NAME.CHECK_TURN,
                data: {
                    _id: data.data.tableId,
                    symbol: dataOfTable.playerInfo[ramdomNumberForGiveUserTurn].symbol,
                    userID: data.userID,
                    message: "ok"
                },
                socket
            }
            sendToRoomEmmiter(data)
        }

    } catch (error) {
        console.log("checkTurn Error: ", error)
        logger.error("checkTurn Error: ", error)
    }
}

export { checkTurn }
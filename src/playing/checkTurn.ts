import { Socket } from "socket.io";
import { sendToRoomEmmiter } from "../eventEmmitter";
import { EVENT_NAME } from "../constant/eventName";
import { Table } from "../model/tableModel";
import { logger } from "../logger";

const checkTurn = async (data: any) => {
    try {
        logger.info(`Data is This :::${JSON.stringify(data.tableId)}`)
        // RandomeTurn
        const randomNumber = Math.random();
        const ramdomNumberForGiveUserTurn = Math.round(randomNumber);
        console.log(`Random number is::::${ramdomNumberForGiveUserTurn}`)
        let dataOfTable = await Table.findById(data.tableId)
        if (dataOfTable) {
            await Table.findByIdAndUpdate(dataOfTable._id, {
                currentTurnSeatIndex: ramdomNumberForGiveUserTurn,
                currentTurnUserId: dataOfTable.playerInfo[ramdomNumberForGiveUserTurn].userId,
                gameStatus: "CHECK_TURN"
            })
            console.log("Check Turn Room id::::",dataOfTable._id)
            data = {
                eventName: EVENT_NAME.CHECK_TURN,
                data: {
                    _id: dataOfTable._id.toString(),
                    symbol: dataOfTable.playerInfo[ramdomNumberForGiveUserTurn].symbol,
                    userID: dataOfTable.playerInfo[ramdomNumberForGiveUserTurn].userId,
                    message: "ok"
                }
            }
            sendToRoomEmmiter(data)
        }

    } catch (error) {
        console.log("checkTurn Error: ", error)
        logger.error("checkTurn Error: ", error)
    }
}

export { checkTurn }
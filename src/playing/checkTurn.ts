import { Socket } from "socket.io";
import { sendToRoomEmmiter } from "../eventEmmitter";
import { EVENT_NAME } from "../constant/eventName";
import { Table } from "../model/tableModel";
import { logger } from "../logger";

const checkTurn = async (data: any) => {
    try {
        logger.info(`CheckTurn Data :::${JSON.stringify(data.tableId)}`)
        // RandomeTurn
        const randomNumber = Math.floor(Math.random() * 100) + 1;
        let ramdomNumberForGiveUserTurn;
        if (randomNumber % 2 == 1) {
            ramdomNumberForGiveUserTurn = 1;
        } else {
            ramdomNumberForGiveUserTurn = 0;
        }
        console.log(`Random number is::::${1}`)
        let dataOfTable = await Table.findById(data.tableId)
        if (dataOfTable) {
            await Table.findByIdAndUpdate(dataOfTable._id, {
                currentTurnSeatIndex: ramdomNumberForGiveUserTurn,
                currentTurnUserId: dataOfTable.playerInfo[ramdomNumberForGiveUserTurn].userId,
                gameStatus: "CHECK_TURN"
            })
            console.log("Check Turn Room id::::", dataOfTable._id)
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
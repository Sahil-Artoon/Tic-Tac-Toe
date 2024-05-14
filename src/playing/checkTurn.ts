import { Socket } from "socket.io";
import { sendToRoomEmmiter } from "../eventEmmitter";
import { EVENT_NAME } from "../constant/eventName";
import { Table } from "../model/tableModel";
import { logger } from "../logger";
import { turnTimer } from "../bull/queue/turnTimer";
import { cancleTurnTimerJob } from "../bull/cancleQueue/cancleTurnTimerQueue";

const checkTurn = async (data: any) => {
    try {
        logger.info(`CHECK_TURN DATA :::: ${JSON.stringify(data.tableId)}`)
        // RandomeTurn
        const randomNumber = Math.floor(Math.random() * 100) + 1;
        let ramdomNumberForGiveUserTurn;
        if (randomNumber % 2 == 1) {
            ramdomNumberForGiveUserTurn = 1;
        } else {
            ramdomNumberForGiveUserTurn = 0;
        }
        let dataOfTable = await Table.findById(data.tableId)
        if (dataOfTable) {
            await Table.findByIdAndUpdate(dataOfTable._id, {
                currentTurnSeatIndex: ramdomNumberForGiveUserTurn,
                currentTurnUserId: dataOfTable.playerInfo[ramdomNumberForGiveUserTurn].userId,
                gameStatus: "CHECK_TURN"
            })
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
            data = {
                tableId: dataOfTable?._id.toString(),
                time: 10000
            }
            await turnTimer(data)
            return 0
        }

    } catch (error) {
        logger.error("CHECK_TURN ERROR :::: ", error)
    }
}

export { checkTurn }
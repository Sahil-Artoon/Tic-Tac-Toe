import { logger } from "../logger";
import { EVENT_NAME } from "../constant/eventName";
import { sendToRoomEmmiter } from "../eventEmmitter";
import { Table } from "../model/tableModel";
import { reStart } from "../bull/queue/reStart";

const declareWinner = async (data: any) => {
    try {
        logger.info(`DECLARE_WINNWE DATA :::: ${JSON.stringify(data)}`)
        if (data.symbol == "TIE") {
            let tableId = data.tableId
            await Table.findByIdAndUpdate(data.tableId, { gameStatus: "TIE", winnerUserId: data.userId })
            data = {
                eventName: EVENT_NAME.WINNER,
                data: {
                    _id: data.tableId.toString(),
                    message: "TIE",
                    symbol: data.symbol,
                    timer: 5000
                }
            }
            setTimeout(() => {
                deleteTable(tableId)
            }, (60000 * 2))
            sendToRoomEmmiter(data)
            return await reStart(data.data)
        }
        if (data.symbol == "O" || data.symbol == "X") {
            let tableId = data.tableId
            await Table.findByIdAndUpdate(data.tableId, { gameStatus: "WINNING", winnerUserId: data.userId })
            data = {
                eventName: EVENT_NAME.WINNER,
                data: {
                    _id: data.tableId.toString(),
                    message: "Winner",
                    symbol: data.symbol,
                    timer: 5000
                },
            }
            setTimeout(() => {
                deleteTable(tableId)
            }, (60000 * 2))

            sendToRoomEmmiter(data)
            return await reStart(data.data)
        }
    } catch (error) {
        logger.error("DECLARE_WINNWE ERROR ::::", error)
    }
}


const deleteTable = async (tableId: String) => {
    try {
        await Table.findByIdAndDelete(tableId)
    } catch (error) {
        logger.error("WINNER_TABLE_DELETE_ERROR", error)
    }
}

export { declareWinner }
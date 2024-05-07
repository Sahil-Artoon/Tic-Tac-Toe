import { logger } from "../logger";
import { EVENT_NAME } from "../constant/eventName";
import { sendToRoomEmmiter } from "../eventEmmitter";
import { Table } from "../model/tableModel";
import { reStart } from "../bull/queue/reStart";

const declareWinner = async (data: any) => {
    try {
        logger.info(`Data is Winner::::::: ${JSON.stringify(data)}`)
        console.log("Declare Winner Data", data)
        if (data.symbol == "TIE") {
            let tableId = data.tableId
            await Table.findByIdAndUpdate(data.tableId, { gameStatus: "TIE", winnerUserId: data.userId })
            data = {
                eventName: EVENT_NAME.WINNER,
                data: {
                    _id: data.tableId.toString(),
                    message: "TIE",
                    symbol: data.symbol,
                    timer: 10000
                }
            }
            setTimeout(() => {
                deleteTable(tableId)
            }, 60000)
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
                    timer: 10000
                },
            }
            setTimeout(() => {
                deleteTable(tableId)
            }, 60000)

            sendToRoomEmmiter(data)
            return await reStart(data.data)
        }
    } catch (error) {
        console.log("Winner Error:", error)
        logger.error("Winner Error:", error)
    }
}


const deleteTable = async (tableId: String) => {
    try {
        await Table.findByIdAndDelete(tableId)
    } catch (error) {
        console.log("winner Delete Table Error", error)
        logger.error("winner Delete Table Error", error)
    }
}

export { declareWinner }
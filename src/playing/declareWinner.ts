import { logger } from "../logger";
import { EVENT_NAME } from "../constant/eventName";
import { sendToRoomEmmiter } from "../eventEmmitter";
import { Table } from "../model/tableModel";

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
                    symbol: data.symbol
                }
            }
            setTimeout(() => {
                deleteTable(tableId)
            }, 60000)
            return sendToRoomEmmiter(data)
        }
        if (data.symbol == "O" || data.symbol == "X") {
            let tableId = data.tableId
            await Table.findByIdAndUpdate(data.tableId, { gameStatus: "WINNER", winnerUserId: data.userId })
            data = {
                eventName: EVENT_NAME.WINNER,
                data: {
                    _id: data.tableId.toString(),
                    message: "Winner",
                    symbol: data.symbol
                },
            }
            setTimeout(() => {
                deleteTable(tableId)
            }, 60000)
            return sendToRoomEmmiter(data)
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
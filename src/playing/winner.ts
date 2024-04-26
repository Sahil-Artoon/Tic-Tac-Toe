import { Socket } from "socket.io";
import { logger } from "../logger";
import { EVENT_NAME } from "../constant/eventName";
import { sendToRoomEmmiter } from "../eventEmmitter";
import { Table } from "../model/tableModel";

const winner = async (data: any, socket: Socket) => {
    try {
        logger.info(`Data is ::: ${JSON.stringify(data)} and socket is ::: ${socket.id}`)
        if (data.symbol == "TIE") {
            let tableId = data.tableId
            let gameStatusUpdate = await Table.findByIdAndUpdate(data.tableId, { gameStatus: "Tie" })
            data = {
                eventName: EVENT_NAME.WINNER,
                data: {
                    _id: data.tableId,
                    message: "TIE",
                    symbol: data.symbol
                },
                socket
            }
            setTimeout(() => {
                deleteTable(tableId)
            }, 5000)
            return sendToRoomEmmiter(data)
        }
        if (data.symbol == "O" || data.symbol == "X") {
            let tableId = data.tableId
            let gameStatusUpdate = await Table.findByIdAndUpdate(data.tableId, { gameStatus: "Winner" })
            data = {
                eventName: EVENT_NAME.WINNER,
                data: {
                    _id: data.tableId,
                    message: "Winner",
                    symbol: data.symbol
                },
                socket
            }
            setTimeout(() => {
                deleteTable(tableId)
            }, 10000)
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

export { winner }
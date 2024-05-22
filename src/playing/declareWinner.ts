import { logger } from "../logger";
import { EVENT_NAME } from "../constant/eventName";
import { sendToRoomEmmiter } from "../eventEmmitter";
import { Table } from "../model/tableModel";
import { reStart } from "../bull/queue/reStart";
import { User } from "../model/userModel";

const declareWinner = async (data: any) => {
    try {
        logger.info(`START FUNCTION : declareWinner :: DATA :: ${JSON.stringify(data)}`);
        let tableId = data.tableId
        let winnerTable = await Table.findById(tableId)
        if (winnerTable) {
            if (data.symbol == "TIE") {
                await Table.findByIdAndUpdate(winnerTable, { gameStatus: "TIE", winnerUserId: data.userId })
                await User.findByIdAndUpdate(winnerTable.playerInfo[0].userId, { $set: { tableId: "" } })
                await User.findByIdAndUpdate(winnerTable.playerInfo[1].userId, { $set: { tableId: "" } })
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
                }, (60000))
                sendToRoomEmmiter(data)
                logger.info(`END : declareWinner :: DATA :: ${JSON.stringify(data.data)}`);
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
                        userId: data.userId,
                        isLeave: data.isLeave,
                        timer: 5000
                    },
                }
                setTimeout(() => {
                    deleteTable(tableId)
                }, (60000))

                sendToRoomEmmiter(data)
                logger.info(`END : declareWinner :: DATA :: ${JSON.stringify(data.data)}`);
                return await reStart(data.data)
            }
        }
    } catch (error) {
        logger.error(`CATCH_ERROR  declareWinner :: ${data} , ${error}`);
    }
}


const deleteTable = async (tableId: String) => {
    try {
        await Table.findByIdAndDelete(tableId)
    } catch (error) {
        logger.error(`CATCH_ERROR  deleteTable :: ${tableId} , ${error}`);
    }
}

export { declareWinner }
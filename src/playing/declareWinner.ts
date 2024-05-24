import { logger } from "../logger";
import { EVENT_NAME } from "../constant/eventName";
import { sendToRoomEmmiter } from "../eventEmmitter";
import { Table } from "../model/tableModel";
import { reStart } from "../bull/queue/reStart";
import { User } from "../model/userModel";
import { redisDel, redisGet, redisSet } from "../redisOption";

const declareWinner = async (data: any) => {
    try {
        logger.info(`START FUNCTION : declareWinner :: DATA :: ${JSON.stringify(data)}`);
        let tableId = data.tableId
        let winnerTable: any = await redisGet(`${tableId}`)
        winnerTable = JSON.parse(winnerTable)
        if (winnerTable) {
            if (data.symbol == "TIE") {
                let table: any = await redisGet(`${winnerTable._id}`)
                table = JSON.parse(table)
                table.gameStatus = "TIE"
                table.winnerUserId = data.userID
                await redisDel(`${table._id}`)
                await redisSet(`${table._id}`, JSON.stringify(table));

                let firstUser: any = await redisGet(`${table.playerInfo[0].userId}`)
                firstUser = JSON.parse(firstUser)
                firstUser.tableId = ""
                await redisSet(`${firstUser._id}`, JSON.stringify(firstUser));

                let secoundUser: any = await redisGet(`${table.playerInfo[1].userId}`)
                secoundUser = JSON.parse(secoundUser)
                secoundUser.tableId = ""
                await redisSet(`${secoundUser._id}`, JSON.stringify(secoundUser));

                data = {
                    eventName: EVENT_NAME.WINNER,
                    data: {
                        _id: table._id,
                        message: "TIE",
                        symbol: data.symbol,
                        timer: 5000
                    }
                }
                setTimeout(() => {
                    deleteTable(tableId)
                }, (60000))
                sendToRoomEmmiter(data)
                logger.info(`END: declareWinner:: DATA:: ${JSON.stringify(data.data)} `);
                return await reStart(data.data)
            }
            if (data.symbol == "O" || data.symbol == "X") {
                let tableId = data.tableId
                let table: any = await redisGet(`${data.tableId}`)
                table = JSON.parse(table)
                table.gameStatus = "WINNING"
                table.winnerUserId = data.userId
                await redisDel(`${table._id}`)
                await redisSet(`${table._id}`, JSON.stringify(table));
                data = {
                    eventName: EVENT_NAME.WINNER,
                    data: {
                        _id: table._id,
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
                logger.info(`END: declareWinner:: DATA:: ${JSON.stringify(data.data)} `);
                return await reStart(data.data)
            }
        }
    } catch (error) {
        logger.error(`CATCH_ERROR  declareWinner:: ${data} , ${error} `);
    }
}


const deleteTable = async (tableId: String) => {
    try {
        await redisDel(`${tableId}`)
    } catch (error) {
        logger.error(`CATCH_ERROR  deleteTable:: ${tableId} , ${error} `);
    }
}

export { declareWinner }
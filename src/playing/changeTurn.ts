import { logger } from "../logger";
import { Table } from "../model/tableModel";
import { EVENT_NAME } from "../constant/eventName";
import { sendToRoomEmmiter } from "../eventEmmitter";
import { turnTimer } from "../bull/queue/turnTimer";
import { cancleTurnTimerJob } from "../bull/cancleQueue/cancleTurnTimerQueue";

const changeTurn = async (data: any) => {
    try {
        logger.info(`CHANGE_TURN DATA :::: ${JSON.stringify(data)}`);
        let findTable = await Table.findById(data.tableId)
        if (findTable) {
            if (findTable.currentTurnSeatIndex == "0") {
                let updateTable = await Table.findByIdAndUpdate(findTable._id, {
                    currentTurnSeatIndex: "1",
                    currentTurnUserId: findTable.playerInfo[1].userId
                }, { new: true })
                data = {
                    eventName: EVENT_NAME.CHANGE_TURN,
                    data: {
                        _id: updateTable?._id.toString(),
                        data: updateTable?.playerInfo[1],
                        userId: updateTable?.playerInfo[1].userId,
                        symbol: updateTable?.playerInfo[1].symbol
                    }
                }
                sendToRoomEmmiter(data)
                let result = await cancleTurnTimerJob(updateTable?._id.toString())
                if (result == true) {
                    data = {
                        tableId: updateTable?._id.toString(),
                        time: 10000
                    }
                    await turnTimer(data)
                } else {
                    data = {
                        tableId: updateTable?._id.toString(),
                        time: 10000
                    }
                    await turnTimer(data)
                }
            }
            if (findTable.currentTurnSeatIndex == "1") {
                let updateTable = await Table.findByIdAndUpdate(findTable._id, {
                    currentTurnSeatIndex: "0",
                    currentTurnUserId: findTable.playerInfo[0].userId
                }, { new: true })
                data = {
                    eventName: EVENT_NAME.CHANGE_TURN,
                    data: {
                        _id: updateTable?._id.toString(),
                        data: updateTable?.playerInfo[0],
                        userId: updateTable?.playerInfo[0].userId,
                        symbol: updateTable?.playerInfo[0].symbol
                    }
                }
                sendToRoomEmmiter(data)
                let result = await cancleTurnTimerJob(updateTable?._id.toString())
                if (result == true) {
                    data = {
                        tableId: updateTable?._id.toString(),
                        time: 10000
                    }
                    await turnTimer(data)
                } else {
                    data = {
                        tableId: updateTable?._id.toString(),
                        time: 10000
                    }
                    await turnTimer(data)
                }
            }
        }
    } catch (error) {
        logger.error(`CHANGE_TURN ERROR :::: ${error}`)
    }
}

export { changeTurn }
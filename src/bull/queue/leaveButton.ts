import Queue from "bull"
import { redisOption } from "../../connection/redisConnection";
import { QUEUE_EVENT } from "../../constant/queueConstant";
import { logger } from "../../logger";
import { sendToRoomEmmiter } from "../../eventEmmitter";
import { Table } from "../../model/tableModel";
import { redisGet, redisSet } from "../../redisOption";

const leaveButton = async (data: any) => {
    try {
        const tableId: any = data.tableId
        let roundTimerQueue = new Queue(QUEUE_EVENT.LEAVE_BUTTON, redisOption);
        let options = {
            jobId: tableId,
            delay: data.time,
            attempts: 1
        }
        roundTimerQueue.add(data, options)
        roundTimerQueue.process(async (data: any) => {
            let updateTable: any = await redisGet(`${data.data.tableId}`)
            updateTable = JSON.parse(updateTable)
            updateTable.gameStatus = "LOCK"
            await redisSet(`${updateTable._id}`, JSON.stringify(updateTable))
            let dataofLeavetable = {
                eventName: "LEAVE_BUTTON",
                data: {
                    _id: data.data.tableId,
                    message: "ok",
                    updateTable
                }
            }
            sendToRoomEmmiter(dataofLeavetable)
        })
    } catch (error) {
        logger.error("LEAVE_BUTTTON QUEUE ERROR :::", error)
    }
}

export { leaveButton }
import Queue from "bull"
import { QUEUE_EVENT } from "../../constant/queueConstant";
import { redisOption } from "../../connection/redisConnection";
import { Table } from "../../model/tableModel";
import { logger } from "../../logger";
import { changeTurn } from "../../playing/changeTurn";

const turnTimer = async (data: any, socket: any) => {
    try {
        logger.info(`START turnTimer :::: ${JSON.stringify(data)}`)
        const tableId: any = data.tableId
        let roundTimerQueue = new Queue(QUEUE_EVENT.TURN_TIMER, redisOption);
        let options = {
            jobId: data.tableId,
            delay: data.time,
            removeOnComplete: true
        }
        roundTimerQueue.add(data, options)
        roundTimerQueue.process(async (data: any) => {
            changeTurn({ tableId: data.data.tableId, play: false }, socket)
        })
    } catch (error) {
        logger.error("ROUND_TIMER QUEUE ERROR :::", error)
    }
}

export { turnTimer }
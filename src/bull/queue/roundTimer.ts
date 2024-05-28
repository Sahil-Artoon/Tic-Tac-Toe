import Queue from "bull"
import { logger } from "../../logger";
import { redisOption } from "../../connection/redisConnection";
import { checkTurn } from "../../playing/checkTurn";
import { QUEUE_EVENT } from "../../constant/queueConstant";

const roundTimer = async (data: any, socket: any) => {
    try {
        logger.info(`START roundTimer :::: ${JSON.stringify(data)}`)
        const tableId: any = data.tableId
        let roundTimerQueue = new Queue(QUEUE_EVENT.ROUND_TIMER, redisOption);
        let options = {
            jobId: tableId,
            delay: data.time,
            removeOnComplete: true
        }
        roundTimerQueue.add(data, options)
        roundTimerQueue.process(async (data: any) => {
            data = {
                tableId: data.data.tableId,
            }
            await setTimeout(() => {
                checkTurn(data, socket)
            }, 2000)
        })
    } catch (error) {
        logger.error("ROUND_TIMER QUEUE ERROR :::", error)
    }
}

export { roundTimer }
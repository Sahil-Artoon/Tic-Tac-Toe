import Queue from "bull"
import { logger } from "../../logger";
import { redisOption } from "../../connection/redisConnection";
import { checkTurn } from "../../playing/checkTurn";
import { QUEUE_EVENT } from "../../constant/queueConstant";
import { log } from "winston";

const roundTimer = async (data: any) => {
    try {
        const tableId: any = data.tableId
        let roundTimerQueue = new Queue(QUEUE_EVENT.ROUND_TIMER, redisOption);
        let options = {
            jobId: tableId.toString(),
            delay: data.time,
            attempts: 1
        }
        roundTimerQueue.add(data, options)
        roundTimerQueue.process(async (data: any) => {
            console.log("This is in Process ::::::::::::::", data.data)
            data = {
                tableId: data.data.tableId.toString(),
            }
            await setTimeout(() => {
                checkTurn(data)
            }, 1000)
        })
    } catch (error) {
        logger.error("ROUND_TIMER QUEUE ERROR :::", error)
    }
}

export { roundTimer }
import Queue from "bull"
import { logger } from "../../logger";
import { redisOption } from "../../connection/redisConnection";
import { checkTurn } from "../../playing/checkTurn";
import { QUEUE_EVENT } from "../../constant/queueConstant";

const roundTimer = (data: any) => {
    try {
        const tableId: any = data.tableId
        console.log("current table Id is ::::", tableId)
        let roundTimerQueue = new Queue(QUEUE_EVENT.ROUND_TIMER, redisOption);
        let options = {
            jobId: tableId.toString(),
            delay: data.time,
            attempts: 1
        }
        console.log("Options:::::::", options)
        roundTimerQueue.add(data, options)
        roundTimerQueue.process((data: any) => {
            data = {
                tableId: data.data.tableId
            }
            setTimeout(() =>{
                checkTurn(data)
            },1000)
        })
    } catch (error) {
        console.log("Queue RoundTimer Error :::", error)
        logger.error("Queue RoundTimer Error :::", error)
    }
}

export { roundTimer }
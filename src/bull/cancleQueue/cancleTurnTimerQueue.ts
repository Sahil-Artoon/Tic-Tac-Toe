import Queue from "bull"
import { QUEUE_EVENT } from "../../constant/queueConstant";
import { redisOption } from "../../connection/redisConnection";
import { logger } from "../../logger";


const cancleTurnTimerJob = async (jobId: string) => {
    try {
        logger.info("START cancleTurnTimerJob :::: ", jobId)
        const queue = new Queue(QUEUE_EVENT.TURN_TIMER, redisOption);
        const job = await queue.getJob(jobId);
        console.log("THis is Job :::::: in cancleTurnTimerJob ::::: ", job)
        if (job) {
            logger.info(`END cancleTurnTimerJob :::: ${JSON.stringify(jobId)}`)
            await job?.remove();
            return true
        }
        return false;
    } catch (error) {
        logger.error("ROUND_TIMER CANCLE QUEUE ERROR :::: ", error)
    }
}

export { cancleTurnTimerJob }
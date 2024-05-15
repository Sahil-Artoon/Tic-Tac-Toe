import Queue from "bull"
import { QUEUE_EVENT } from "../../constant/queueConstant";
import { redisOption } from "../../connection/redisConnection";
import { logger } from "../../logger";


const getCancleJob = async (jobId: any) => {
    try {
        const queue = new Queue(QUEUE_EVENT.ROUND_TIMER, redisOption);
        const job = await queue.getJob(jobId);
        if(job){
            await job?.remove();
            return true
        }
        return false;
    } catch (error) {
        logger.error("ROUND_TIMER CANCLE QUEUE ERROR :::: ", error)
    }
}

export { getCancleJob }
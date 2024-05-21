import Queue from "bull"
import { QUEUE_EVENT } from "../../constant/queueConstant";
import { redisOption } from "../../connection/redisConnection";
import { logger } from "../../logger";


const cancleBotTimer = async (jobId: any) => {
    try {
        const queue = new Queue(QUEUE_EVENT.BOT_TIMER, redisOption);
        const job = await queue.getJob(jobId);
        if (job) {
            await job?.remove();
            return true
        }
        return false;
    } catch (error) {
        logger.error("LEAVE_BUTTON CANCLE QUEUE ERROR :::: ", error)
    }
}

export { cancleBotTimer }
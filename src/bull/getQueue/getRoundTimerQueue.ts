import Queue from "bull"
import { QUEUE_EVENT } from "../../constant/queueConstant";
import { redisOption } from "../../connection/redisConnection";


const queue = new Queue(QUEUE_EVENT.ROUND_TIMER, redisOption);
const getJob = async (jobId: any) => {
    try {
        const job = await queue.getJob(jobId);
        if (job) {
            const currentTime = Date.now();
            const enqueueTime = job.timestamp;
            const timestramptime = currentTime - enqueueTime;
            let timePassed = Math.floor(timestramptime / 1000)
            let penddingTime = job.data.time - (timePassed * 1000)
            return penddingTime;
        }
    } catch (error) {
        console.error('Error getting job:', error);
    }
}

export { getJob }
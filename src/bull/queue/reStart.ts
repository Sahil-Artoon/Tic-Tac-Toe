import Queue from "bull"
import { logger } from "../../logger";
import { redisOption } from "../../connection/redisConnection";
import { QUEUE_EVENT } from "../../constant/queueConstant";
import { EVENT_NAME } from "../../constant/eventName";
import { sendToRoomEmmiter } from "../../eventEmmitter";

const reStart = (data: any) => {
    try {
        logger.info(`START reStart :::: ${JSON.stringify(data)}`)
        let reStartQueue = new Queue(QUEUE_EVENT.RE_START, redisOption);
        let options = {
            jobId: data._id,
            delay: data.timer,
            removeOnComplete: true
        }
        reStartQueue.add(data, options)
        reStartQueue.process((data: any) => {
            data = {
                eventName: EVENT_NAME.RE_START,
                data: {
                    _id: data.data._id
                }
            }
            sendToRoomEmmiter(data)
        })
    } catch (error) {
        logger.error("Queue reStart Error :::", error)
    }
}

export { reStart }
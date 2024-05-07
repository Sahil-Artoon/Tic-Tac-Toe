import Queue from "bull"
import { logger } from "../../logger";
import { redisOption } from "../../connection/redisConnection";
import { QUEUE_EVENT } from "../../constant/queueConstant";
import { EVENT_NAME } from "../../constant/eventName";
import { sendToRoomEmmiter } from "../../eventEmmitter";

const reStart = (data: any) => {
    try {
        const reStartQueue = new Queue(QUEUE_EVENT.RE_START, redisOption);
        let options = {
            tableId: data._id,
            delay: data.timer,
            attempts: 1
        }
        console.log("Options:::::::", options)
        reStartQueue.add(data, options)
        reStartQueue.process(() => {
            data = {
                eventName: EVENT_NAME.RE_START,
                data: {
                    _id: options.tableId.toString()
                }
            }
            sendToRoomEmmiter(data)
        })
    } catch (error) {
        console.log("Queue RoundTimer Error :::", error)
        logger.error("Queue RoundTimer Error :::", error)
    }
}

export { reStart }
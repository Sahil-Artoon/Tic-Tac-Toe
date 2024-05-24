import Queue from "bull"
import { logger } from "../../logger";
import { redisOption } from "../../connection/redisConnection";
import { QUEUE_EVENT } from "../../constant/queueConstant";
import { botSignUp } from "../../bot/signUpBot";
import { joinBotInTable } from "../../bot/joinBotInTable";

const addBotQueue = (data: any, socket: any) => {
    try {
        let reStartQueue = new Queue(QUEUE_EVENT.BOT_TIMER, redisOption);
        let options = {
            jobId: data._id,
            delay: data.time,
            attempts: 1
        }
        reStartQueue.add(data, options)
        reStartQueue.process(async (data: any) => {
            let dataOfBot = await botSignUp(socket);
            if (dataOfBot) {
                data = {
                    userId: dataOfBot?._id
                }
                await joinBotInTable(data, socket)
            } else {
                return logger.error(`END addBotQueue :: ${dataOfBot}`)
            }
        })
    } catch (error) {
        logger.error("Queue RoundTimer Error :::", error)
    }
}

export { addBotQueue }
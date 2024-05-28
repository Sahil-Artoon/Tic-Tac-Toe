import Queue from "bull"
import { logger } from "../../logger";
import { redisOption } from "../../connection/redisConnection";
import { QUEUE_EVENT } from "../../constant/queueConstant";
import { botSignUp } from "../../bot/signUpBot";
import { joinBotInTable } from "../../bot/joinBotInTable";

const addBotQueue = (data: any, socket: any) => {
    try {
        logger.info(`START addBotQueue :::: ${JSON.stringify(data)}`)
        let reStartQueue = new Queue(QUEUE_EVENT.BOT_TIMER, redisOption);
        let options = {
            jobId: data._id,
            delay: data.time,
            removeOnComplete: true
        }
        reStartQueue.add(data, options)
        reStartQueue.process(async (data: any) => {
            let dataOfBot: any = await botSignUp(socket);
            console.log(":::::::::::::::::::::::")
            console.log(dataOfBot)
            console.log(":::::::::::::::::::::::")
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
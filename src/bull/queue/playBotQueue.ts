import Queue from "bull"
import { logger } from "../../logger";
import { redisOption } from "../../connection/redisConnection";
import { QUEUE_EVENT } from "../../constant/queueConstant";
import { EVENT_NAME } from "../../constant/eventName";
import { redisGet } from "../../redisOption";
import { findRandomNumber } from "../../common/findRandomNumber";
import { playGame } from "../../playing/playGame";
import { checkGameDataForBot } from "../../common/checkGameDataForBot";

const playBotQueue = (data: any, socket: any) => {
    try {
        logger.info(`START playBotQueue :::: ${JSON.stringify(data)}`)
        let reStartQueue = new Queue(QUEUE_EVENT.PLAY_BOT, redisOption);
        let options = {
            jobId: data._id,
            delay: data.timer,
            removeOnComplete: true
        }
        reStartQueue.add(data, options)
        reStartQueue.process(async (data: any) => {
            console.log("PLAYBOTQUEUE PROCESS :::::::::")
            let findTable: any = await redisGet(`${data.data._id}`)
            findTable = JSON.parse(findTable)
            let numberOfCell: any = await checkGameDataForBot(findTable.playingData)
            data = {
                data: `cell-${numberOfCell + 1}`,
                sign: findTable.playerInfo[1].symbol,
                tableId: findTable._id.toString(),
                userId: findTable.playerInfo[1].userId
            }
            playGame(data, socket)
        })
    } catch (error) {
        logger.error("Queue playBotQueue Error :::", error)
    }
}

export { playBotQueue }
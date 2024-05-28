import { playBotQueue } from "../bull/queue/playBotQueue";
import { findRandomNumber } from "../common/findRandomNumber";
import { TIMER } from "../constant/timerConstant";
import { logger } from "../logger";
import { Table } from "../model/tableModel";
import { playGame } from "../playing/playGame";
import { redisGet } from "../redisOption";

const botPlay = async (data: any, socket: any) => {
    try {
        logger.info(`START : botPlay :: DATA :: ${JSON.stringify(data)}`)
        data = {
            _id: data,
            timer: TIMER.BOT_PLAY_TIMER
        }
        playBotQueue(data, socket);
    } catch (error) {
        logger.error(`CATCH_ERROR botPlay :: ${error}`);
    }
}

export { botPlay }
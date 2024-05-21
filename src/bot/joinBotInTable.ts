import { logger } from "../logger";
import { Table } from "../model/tableModel"
import { User } from "../model/userModel";
import { joinGame } from "../playing/joinGame";

const joinBotInTable = async (data: any, socket: any) => {
    try {
        await joinGame(data, socket)
    } catch (error) {
        logger.error(`CATCH_ERROR joinBotInTable :: ${error}`);
    }
}

export { joinBotInTable }
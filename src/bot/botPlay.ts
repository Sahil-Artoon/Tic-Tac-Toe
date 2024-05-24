import { findRandomNumber } from "../common/findRandomNumber";
import { logger } from "../logger";
import { Table } from "../model/tableModel";
import { playGame } from "../playing/playGame";
import { redisGet } from "../redisOption";

const botPlay = async (data: any, socket: any) => {
    try {
        logger.info(`START : botPlay :: DATA :: ${JSON.stringify(data)}`)
        let findTable: any = await redisGet(`${data}`)
        findTable = JSON.parse(findTable)
        if (findTable) {
            let numberOfCell: number;
            do {
                numberOfCell = findRandomNumber()
            } while (findTable.playingData[numberOfCell - 1].symbol != "")
            data = {
                data: `cell-${numberOfCell}`,
                sign: findTable.playerInfo[1].symbol,
                tableId: findTable._id.toString(),
                userId: findTable.playerInfo[1].userId
            }
            playGame(data, socket)
        }
    } catch (error) {
        logger.error(`CATCH_ERROR botPlay :: ${error}`);
    }
}

export { botPlay }
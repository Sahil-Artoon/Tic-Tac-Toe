import { findRandomNumber } from "../common/findRandomNumber";
import { logger } from "../logger";
import { Table } from "../model/tableModel";
import { playGame } from "../playing/playGame";

const botPlay = async (data: any, socket: any) => {
    try {
        logger.info(`START : botPlay :: DATA :: ${JSON.stringify(data)}`)
        let findTable = await Table.findById(data)
        if (findTable) {
            let numberOfCell: number;
            let check = false
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
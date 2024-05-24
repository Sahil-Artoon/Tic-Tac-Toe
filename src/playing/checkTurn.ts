import { sendToRoomEmmiter } from "../eventEmmitter";
import { EVENT_NAME } from "../constant/eventName";
import { Table } from "../model/tableModel";
import { logger } from "../logger";
import { turnTimer } from "../bull/queue/turnTimer";
import { TIMER } from "../constant/timerConstant";
import { botPlay } from "../bot/botPlay";
import { User } from "../model/userModel";
import { redisDel, redisGet, redisSet } from "../redisOption";

const checkTurn = async (data: any, socket: any) => {
    try {
        logger.info(`START FUNCTION : checkTurn :: DATA :: ${JSON.stringify(data)}`);
        const randomNumber = Math.floor(Math.random() * 100) + 1;
        let ramdomNumberForGiveUserTurn = 1;
        if (randomNumber % 2 == 1) {
            ramdomNumberForGiveUserTurn = 1;
        } else {
            ramdomNumberForGiveUserTurn = 0;
        }
        let dataOfTable: any = await redisGet(`${data.tableId}`)
        dataOfTable = JSON.parse(dataOfTable)

        dataOfTable.currentTurnSeatIndex = ramdomNumberForGiveUserTurn
        dataOfTable.currentTurnUserId = dataOfTable?.playerInfo[ramdomNumberForGiveUserTurn].userId
        dataOfTable.gameStatus = "CHECK_TURN"
        await redisDel(`${dataOfTable._id}`)
        await redisSet(`${dataOfTable._id}`, JSON.stringify(dataOfTable))
        data = {
            eventName: EVENT_NAME.CHECK_TURN,
            data: {
                _id: dataOfTable?._id,
                symbol: dataOfTable?.playerInfo[ramdomNumberForGiveUserTurn].symbol,
                userID: dataOfTable?.playerInfo[ramdomNumberForGiveUserTurn].userId,
                time: TIMER.TURN_TIMER,
                message: "ok"
            }
        }
        sendToRoomEmmiter(data)
        data = {
            tableId: dataOfTable?._id,
            time: TIMER.TURN_TIMER
        }
        console.log(":::::::::::::::::::::::::::::::::::::::::::::")
        console.log("This is In checkTurn data of TurnTimer ", data)
        console.log(":::::::::::::::::::::::::::::::::::::::::::::")
        turnTimer(data, socket)
        if (ramdomNumberForGiveUserTurn == 1) {
            let findUser: any = await redisGet(`${dataOfTable?.playerInfo[1].userId}`)
            findUser = JSON.parse(findUser)
            if (findUser?.isBot == true) {
                botPlay(dataOfTable?._id, socket)
            }
        }
        if (ramdomNumberForGiveUserTurn == 0) {
            let findUser: any = await redisGet(`${dataOfTable?.playerInfo[0].userId}`)
            findUser = JSON.parse(findUser)
            if (findUser?.isBot == true) {
                botPlay(dataOfTable?._id, socket)
            }
        }
        logger.info(`END : checkTurn :: DATA :: ${JSON.stringify(data)}`);
    } catch (error) {
        logger.error(`CATCH_ERROR  checkTurn :: ${data} , ${error}`);
    }
}

export { checkTurn }
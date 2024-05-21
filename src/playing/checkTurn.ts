import { sendToRoomEmmiter } from "../eventEmmitter";
import { EVENT_NAME } from "../constant/eventName";
import { Table } from "../model/tableModel";
import { logger } from "../logger";
import { turnTimer } from "../bull/queue/turnTimer";
import { TIMER } from "../constant/timerConstant";
import { botPlay } from "../bot/botPlay";
import { User } from "../model/userModel";

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
        let dataOfTable = await Table.findById(data.tableId)
        await Table.findByIdAndUpdate(dataOfTable?._id, {
            currentTurnSeatIndex: ramdomNumberForGiveUserTurn,
            currentTurnUserId: dataOfTable?.playerInfo[ramdomNumberForGiveUserTurn].userId,
            gameStatus: "CHECK_TURN"
        })
        data = {
            eventName: EVENT_NAME.CHECK_TURN,
            data: {
                _id: dataOfTable?._id.toString(),
                symbol: dataOfTable?.playerInfo[ramdomNumberForGiveUserTurn].symbol,
                userID: dataOfTable?.playerInfo[ramdomNumberForGiveUserTurn].userId,
                time: TIMER.TURN_TIMER,
                message: "ok"
            }
        }
        sendToRoomEmmiter(data)
        data = {
            tableId: dataOfTable?._id.toString(),
            time: TIMER.TURN_TIMER + 2
        }
        turnTimer(data, socket)
        if (ramdomNumberForGiveUserTurn == 1) {
            let findUser = await User.findById(dataOfTable?.playerInfo[1].userId)
            if (findUser?.isBot == true) {
                botPlay(dataOfTable?._id, socket)
            }
        }
        if (ramdomNumberForGiveUserTurn == 0) {
            let findUser = await User.findById(dataOfTable?.playerInfo[0].userId)
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
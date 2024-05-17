import { Socket } from "socket.io";
import { logger } from "../logger";
import { EVENT_NAME } from "../constant/eventName";
import { signUp } from "../playing/signUpUser";
import { joinGame } from "../playing/joinGame";
import { playGame } from "../playing/playGame";
import { reJoinGame } from "../playing/reJoinGame";
import { leaveGame } from "../playing/leaveGame";

const eventHandler = async (socket: Socket) => {
    try {
        socket.onAny((eventName: String, data: any) => {
            logger.info(`::::::::::::::::::::::::::: Event Name is : ${eventName} ::::::::::::::::::::::::::: Request Data : ${JSON.stringify(data)}`);
            switch (eventName) {
                case EVENT_NAME.SIGN_UP:
                    signUp(data, socket)
                    break;
                case EVENT_NAME.JOIN_TABLE:
                    joinGame(data, socket)
                    break;
                case EVENT_NAME.PLAY_GAME:
                    playGame(data, socket)
                    break;
                case EVENT_NAME.REJOIN_GAME:
                    reJoinGame(data, socket)
                    break;
                case EVENT_NAME.LEAVE_GAME:
                    leaveGame(data, socket)
                    break;
            }
        })
    } catch (error) {
        logger.error("eventHandler ::::::::::", error);
    }
}

export { eventHandler };
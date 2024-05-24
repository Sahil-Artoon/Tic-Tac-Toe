import { logger } from "../logger";
import { sendToSocketIdEmmiter } from "../eventEmmitter";
import { EVENT_NAME } from "../constant/eventName";
import { signUpValidation } from "../validation/signUpValidation";
import { generateRandomId } from "../common/objectId";
import { redisGet, redisSet } from "../redisOption";
import { REDIS_KEY } from "../constant/redisKey";

const signUp = async (data: any, socket: any) => {
    logger.info(`START FUNCTION : signUp :: DATA :: ${JSON.stringify(data)}`);
    try {
        let checkData = await signUpValidation(data)
        if (checkData?.error) {
            data = {
                eventName: EVENT_NAME.POP_UP,
                data: {
                    message: checkData.error?.details[0].message
                },
                socket
            }
            logger.error(`END : signUp :: DATA :: ${JSON.stringify(data.data)}`);
            sendToSocketIdEmmiter(data);
            return data
        }

        let { userName, isBot } = data;
        let _id: string = await generateRandomId()
        data = {
            _id: `${REDIS_KEY.USER}:${_id}`,
            userName,
            socketId: socket.id,
            tableId: "",
            isBot
        }
        console.log(`${REDIS_KEY.USER}:${_id}`)
        await redisSet(`${REDIS_KEY.USER}:${_id}`, JSON.stringify(data))
        let findNewUser: any = await redisGet(`${data._id}`)
        findNewUser = JSON.parse(findNewUser)
        if (data.isBot == false) {
            data = {
                eventName: EVENT_NAME.SIGN_UP,
                socket,
                data: {
                    message: "ok",
                    data
                }
            }
            sendToSocketIdEmmiter(data);
        }
        logger.info(`END : signUp :: DATA OF BOT :: ${JSON.stringify(data.data)}`);
        return findNewUser
    } catch (error) {
        logger.error(`CATCH_ERROR  signUp :: ${JSON.stringify(data)} , ${error}`);
    }
}

export { signUp }
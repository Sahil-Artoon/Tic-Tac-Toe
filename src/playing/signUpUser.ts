import { Socket } from "socket.io"
import { logger } from "../logger";
import { sendToRoomEmmiter, sendToSocketIdEmmiter } from "../eventEmmitter";
import { User } from "../model/userModel";
import { EVENT_NAME } from "../constant/eventName";
import { signUpValidation } from "../validation/signUpValidation";

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
        if (isBot == true) {
            let newUser = await User.create({
                userName,
                socketId: socket.id,
                tableId: "",
                isBot: true
            })
            data = {
                eventName: EVENT_NAME.SIGN_UP,
                socket,
                data: {
                    message: "ok",
                    data: newUser
                }
            }
            logger.info(`END : signUp :: DATA OF BOT :: ${JSON.stringify(data.data)}`);
            return newUser
        } else {
            let checkUserIsExistOrNot = await User.findOne({ userName })
            if (!checkUserIsExistOrNot) {
                let newUser = await User.create({
                    userName,
                    socketId: socket.id,
                    tableId: "",
                    isBot: false
                })
                data = {
                    eventName: EVENT_NAME.SIGN_UP,
                    socket,
                    data: {
                        message: "ok",
                        data: newUser
                    }
                }
                logger.info(`END : signUp :: DATA :: ${JSON.stringify(data.data)}`);
                sendToSocketIdEmmiter(data);
                return data.data
            } else {
                let updateUser = await User.findByIdAndUpdate(checkUserIsExistOrNot._id, { socketId: socket.id });
                data = {
                    eventName: EVENT_NAME.SIGN_UP,
                    socket,
                    data: {
                        message: "ok",
                        data: updateUser
                    }
                }
                logger.info(`END : signUp :: DATA :: ${JSON.stringify(data.data)}`);
                return sendToSocketIdEmmiter(data)
            }
        }
    } catch (error) {
        logger.error(`CATCH_ERROR  signUp :: ${JSON.stringify(data)} , ${error}`);
    }
}

export { signUp }
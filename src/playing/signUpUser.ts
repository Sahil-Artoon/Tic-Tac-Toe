import { Socket } from "socket.io"
import { logger } from "../logger";
import { sendToSocketIdEmmiter } from "../eventEmmitter";
import { User } from "../model/userModel";
import { EVENT_NAME } from "../constant/eventName";
import { signUpValidation } from "../validation/signUpValidation";

const signUp = async (data: any, socket: Socket) => {
    logger.info(`signUp:::Data: ${JSON.stringify(data)} and Socket Id::: ${socket.id}`);
    try {
        let checkData = await signUpValidation(data)
        if (checkData.error) {
            data = {
                eventName: EVENT_NAME.SIGN_UP,
                data: {
                    message: checkData.error?.details
                },
                socket
            }
            return sendToSocketIdEmmiter(data);
        }

        let { userName } = data;
        let checkUserIsExistOrNot = await User.findOne({ userName })
        if (!checkUserIsExistOrNot) {
            let newUser = await User.create({
                userName,
                socketId: socket.id
            })
            data = {
                eventName: EVENT_NAME.SIGN_UP,
                socket,
                data: {
                    message: "ok",
                    data: newUser
                }
            }
            return sendToSocketIdEmmiter(data);
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
            return sendToSocketIdEmmiter(data)
        }
    } catch (error) {
        logger.error(`SignUp User Error::${error}`);
    }
}

export { signUp }
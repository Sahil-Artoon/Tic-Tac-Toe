import { logger } from "../logger";
import { User } from "../model/userModel"
import { signUp } from "../playing/signUpUser";
import { joinBotInTable } from "./joinBotInTable";

const botSignUp = async (socket: any) => {
    try {
        logger.info("LOG botSignUp :: 1")
        let data = {
            userName: "bot",
            isBot: true
        }
        let dataOfBot: any = signUp(data, socket)
        return dataOfBot
    } catch (error) {
        logger.error(`CATCH_ERROR createBot :: ${error}`);
    }
}

export { botSignUp }
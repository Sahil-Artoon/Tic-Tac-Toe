import Joi from "joi";
import { logger } from "../logger";

const validatePlayGameData = async (data: any) => {
    try {
        logger.info(`START : validatePlayGameData :: DATA :: ${JSON.stringify(data)}`);
        const schema = Joi.object({
            data: Joi.string().required(),
            sign: Joi.string().required(),
            tableId: Joi.string().required(),
            userId: Joi.string().required(),
        });

        const validationResult = schema.validate(data);
        logger.info(`END : validatePlayGameData :: DATA :: ${JSON.stringify(data)}`);
        return validationResult;
    } catch (error) {
        logger.error(`CATCH_ERROR validatePlayGameData :: ${data} , ${error}`);
    }
}

export { validatePlayGameData };

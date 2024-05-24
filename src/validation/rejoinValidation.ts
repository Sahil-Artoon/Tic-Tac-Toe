import Joi from "joi";
import { logger } from "../logger";

const validateRejoinData = async (data: any) => {
    try {
        logger.info(`START : validateRejoinData :: DATA :: ${JSON.stringify(data)}`);
        const schema = Joi.object({
            tableId: Joi.string().required(),
            userData: Joi.object({
                userId: Joi.string().required(),
                userName: Joi.string().required(),
                isActive: Joi.boolean().required(),
                symbol: Joi.string().required(),
                turnMiss: Joi.number().required(),
            }).required()
        });

        const validationResult = schema.validate(data);
        logger.info(`END : validateRejoinData :: DATA :: ${JSON.stringify(data)}`);
        return validationResult;
    } catch (error) {
        logger.error(`CATCH_ERROR validateRejoinData :: ${data} , ${error}`);
    }
}

export { validateRejoinData };
import Joi from "joi";
import { logger } from "../logger";

const validateJoinTable = async (data: any) => {
    try {
        logger.info(`START : validateJoinTable :: DATA :: ${JSON.stringify(data)}`);
        const schema = Joi.object({
            userId: Joi.string().required(),
        });

        const validationResult = schema.validate(data);
        logger.info(`END : validateJoinTable :: DATA :: ${JSON.stringify(validationResult)}`);
        return validationResult;
    } catch (error) {
        logger.error(`CATCH_ERROR  validateJoinTable :: ${data} , ${error}`);
    }
}

export { validateJoinTable };
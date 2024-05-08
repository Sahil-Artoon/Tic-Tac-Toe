import Joi from "joi";

const validatePlayGameData = async (data: any) => {
    const schema = Joi.object({
        data: Joi.string().required(),
        sign: Joi.string().required(),
        tableId: Joi.string().required(),
        userId: Joi.string().required(),
    });

    const validationResult = schema.validate(data);
    return validationResult;
}

export { validatePlayGameData };

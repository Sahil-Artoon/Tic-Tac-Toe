import Joi from "joi";

const validateRejoinData = async (data: any) => {
    const schema = Joi.object({
        tableId: Joi.string().required(),
        userData: Joi.object({
            userId: Joi.string().required(),
            userName: Joi.string().required(),
            isActive: Joi.boolean().required(),
            symbol: Joi.string().required(),
            _id: Joi.string().required()
        }).required()
    });

    const validationResult = schema.validate(data);
    return validationResult;
}

export { validateRejoinData };
import Joi from "joi";

const validateJoinTable = async (data: any) => {
    const schema = Joi.object({
        userId: Joi.string().alphanum().min(3).max(30).required(),
    });

    const validationResult = schema.validate(data);
    return validationResult;
}

export { validateJoinTable };
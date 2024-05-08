import Joi from "joi";

const signUpValidation = async (data: any) => {
    const signUpSchema = Joi.object({
        userName: Joi.string().regex(/^[a-zA-Z]+$/).min(3).max(30).required()
    });

    let resultofSignUpvalidation = signUpSchema.validate(data);
    return resultofSignUpvalidation;

}

export { signUpValidation }
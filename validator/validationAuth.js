const Joi = require('@hapi/joi');
//const { schema } = require('../models/user');

const RegisterValidation = data => {
    
    const Schema = Joi.object({
        fullname: Joi.string().required(),
        NIM: Joi.string().length(10).required(),
        major: Joi.string().required(),
        faculty: Joi.string().required(),
        year: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        homeAddress: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    })

    return Schema.validate(data);
}

const LoginValidation = data => {
    
    const Schema = Joi.object({
        email: Joi.string(),
        password: Joi.string().min(6)
    })

    return Schema.validate(data);
}

const updateValidation = data => {
    const Schema = Joi.object({
        phoneNumber: Joi.string().required(),
        homeAddress: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
        
    })
    return Schema.validate(data);
}
module.exports.RegisterValidation = RegisterValidation;
module.exports.LoginValidation = LoginValidation;
module.exports.updateValidation = updateValidation;
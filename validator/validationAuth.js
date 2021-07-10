const Joi = require('@hapi/joi');
//const { schema } = require('../models/user');

const RegisterValidation = data => {
    
    const Schema = Joi.object({
        fullname: Joi.string(),
        NIM: Joi.string().length(10),
        major: Joi.string(),
        faculty: Joi.string(),
        year: Joi.string(),
        phoneNumber: Joi.string(),
        homeAddress: Joi.string(),
        email: Joi.string().email(),
        password: Joi.string().min(6)
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

module.exports.RegisterValidation = RegisterValidation;
module.exports.LoginValidation = LoginValidation;
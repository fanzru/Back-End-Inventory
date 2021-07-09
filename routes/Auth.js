const router = require('express').Router();
const USER   = require('../models/user');
const {RegisterValidation } = require('../validator/validationAuth')
router.post('/register',async(req,res)=>{
    
    const {error} = RegisterValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const newUser =  new USER({
        fullname: req.body.fullname,
        NIM: req.body.NIM,
        major: req.body.major,
        faculty: req.body.faculty,
        year: req.body.year,
        phoneNumber: req.body.phoneNumber,
        homeAddress: req.body.homeAddress,
        email: req.body.email,
        password: req.body.password
    });

    res.send(newUser);
});

module.exports = router;
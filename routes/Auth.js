const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken'); 

const USER   = require('../models/user');

const {RegisterValidation,LoginValidation } = require('../validator/validationAuth')

router.post('/register',async(req,res)=>{
    // Validation for user input in api/user/register
    const {error} = RegisterValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    
    // check email in database
    const emailExist = await USER.findOne({email: req.body.email})
    if(emailExist) return res.status(400).send('Email Already Exist!')
    
    // hash password to database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,salt);
    
    const newUser =  new USER({
        fullname: req.body.fullname,
        NIM: req.body.NIM,
        major: req.body.major,
        faculty: req.body.faculty,
        year: req.body.year,
        phoneNumber: req.body.phoneNumber,
        homeAddress: req.body.homeAddress,
        email: req.body.email,
        password: hashedPassword
    });
    
    try{
        const savedUser = await newUser.save();
        res.send(savedUser)
    } catch(err) {
        res.status(400).send(err)
    }
    
});

router.post('/login',async(req,res)=> {
    // Validation for user input in api/user/register
    const {error} = LoginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    
    // check email in database
    const userFound = await USER.findOne({email: req.body.email})
    if(!userFound) return res.status(400).send('Email Not Found')
    
    // check password owened by the email above
    const validPassword = await bcrypt.compare(req.body.password, userFound.password)
    if (!validPassword) return res.status(400).send('Invalid Password')
    

    // token auth
    const token = jwt.sign({_id: userFound._id}, process.env.TOKEN);
    res.header('auth-token',token).send(token);
})
module.exports = router;
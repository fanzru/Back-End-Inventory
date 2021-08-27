const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken'); 
const USER   = require('../models/user');
const {RegisterValidation,LoginValidation } = require('../validator/validationAuth')
const handlererror = null
const {response} = require('../controllers/response')
const error = null

/*
Malem ini dateline buat benerin auth putusin mau make jwt atau local save user
*/

router.get('/',async (req,res)=>{
    const listuser = await USER.find();
    try {
        response(res,true,listuser,'Get All User Succes',200)
    } catch {
        response(res,false,error,'Faild Get Data',400)
    }
})

router.post('/register',async(req,res)=>{
    // Validation for user input in api/user/register
    const {error} = RegisterValidation(req.body)
    // check email in database
    const emailExist = await USER.findOne({email: req.body.email})
    // check confirm password
    
    if(emailExist){
        return response(res,false,emailExist,error.details[0].message,400)
    } else if (error) {
        return response(res,false,error,error.details[0].message,400)
    }
        
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
        response(res,true,savedUser,'register success',200)
        
    }catch(err) {
        response(res,true,savedUser,'register success',200)
        res.status(400).json({
            status: 400,
            message: 'register failed'
        })
    }
});

router.post('/login',async(req,res)=> {
    let realAdmin = false;
    if (req.body.email === 'adminlab@gmail.com' && req.body.password === 'adminlab') {
        realAdmin = true;
    }
    // Validation for user input in api/user/register
    const {error} = LoginValidation(req.body)
    if (error) return res.status(400).json({
        status: 400,
        message: error.details[0].message,
        error: error
    })
    
    // check email in database
    const userFound = await USER.findOne({email: req.body.email})
    if(!userFound) return res.status(400).json({
        status: 400,
        message: "Email Not Found"
    })
    
    // check password owened by the email above
    const validPassword = await bcrypt.compare(req.body.password, userFound.password)
    if (!validPassword) return res.status(400).json({
        status: 400,
        message: "Invalid Password"
    })
    
    // token auth
    const token = jwt.sign({_id: userFound._id}, process.env.ACCESS_TOKEN_SECRET, {});
    res.header('Auth-Token',token)

    
    if (userFound.email === 'adminlab@gmail.com' && realAdmin) {
        res.status(200).json({
            status: 200,
            message: "Login Success",
            type: 'Admin',
            details: token
        })
    } else {
        res.status(200).json({
            status: 200,
            message: "Login Success",
            type: 'User',
            details: token
        })
    
    }
})
module.exports = router;
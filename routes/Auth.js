const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken'); 
const USER   = require('../models/user');
const {RegisterValidation,LoginValidation } = require('../validator/validationAuth')


router.get('/',(req,res)=>{
    res.send('Helloo')
})

router.post('/register',async(req,res)=>{
    // Validation for user input in api/user/register
    const {error} = RegisterValidation(req.body)
    if(error) return res.json({
        status: 400,
        message: error.details[0].message,
        error: error
    })
    
    // check email in database
    const emailExist = await USER.findOne({email: req.body.email})
    if(emailExist) return res.json({
        status: 400,
        message: error.details[0].message,
        error: emailExist
    })

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
        password: hashedPassword,
        aslab: req.body.aslab
    });
    
    try{
        const savedUser = await newUser.save();
        res.status(200).json({
            status: 200,
            message: 'register success',
            details: savedUser
        })
            
    } catch(err) {
        res.status(400).json({
            status: 400,
            message: 'register failed'
        })
    }
    
});

router.post('/login',async(req,res)=> {
    
    // Validation for user input in api/user/register
    const {error} = LoginValidation(req.body)
    if(error) return res.status(400).json({
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
    //const token = jwt.sign({_id: userFound._id}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s'});
    //res.header('auth-token',token).send(token);
    
    res.status(200).json({
        status: 200,
        message: "Login Success"
    })
})
module.exports = router;
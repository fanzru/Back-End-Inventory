const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken'); 
const USERS   = require('../models/user');
const {RegisterValidation,LoginValidation } = require('../validator/validationAuth')
const handlererror = null
const {response} = require('../controllers/response')
const error = null
const {signUser, authenticateToken} = require('../controllers/auth')
let refreshTokens = []

/*
Malem ini dateline buat benerin auth putusin mau make jwt atau local save user
*/

router.get('/',async (req,res)=>{
    const listuser = await USERS.find();
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
    const emailExist = await USERS.findOne({email: req.body.email})
    // check confirm password
    
    if(emailExist){
        return response(res,false,emailExist,error.details[0].message,400)
    } else if (error) {
        return response(res,false,error,error.details[0].message,400)
    }
        
    // hash password to database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,salt);

    const newUser =  new USERS({
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
    const userFound = await USERS.findOne({email: req.body.email})
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
    //const token = jwt.sign({_id: userFound}, process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '15s' });
    //console.log(token)
    //const refreshToken = jwt.sign({_id: userFound}, process.env.REFRESH_TOKEN_SECRET,{ expiresIn: '15s' })
    //refreshTokens.push(refreshToken)
    token = signUser(userFound)
    if (userFound.email === 'adminlab@gmail.com' && realAdmin) {
        res.header('authorization',token).status(200).json({
            status: 200,
            message: "Login Success",
            type: 'Admin',
            accessToken: token,
            //refreshToken: refreshToken
        })
    } else {
        res.header('authorization',token).status(200).json({
            status: 200,
            message: "Login Success",
            type: 'User',
            accessToken: token,
            //refreshToken: refreshToken
        })
    }
})

router.get('/getdetailuser', authenticateToken,(req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    //console.log(token)
    if (token === null) return next(customError('Authentication tidak ditemukan',401))
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    response(res, true, user, 'Get User Success', 200)
})


module.exports = router;
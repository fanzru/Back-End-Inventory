const jwt = require('jsonwebtoken')
const {customError} = require('../controllers/response');

require('dotenv').config()

function signUser(user) {
    return jwt.sign({_id: user}, process.env.ACCESS_TOKEN_SECRET) // 60detik * 30 = 30 menit
}

async function authenticateToken(req,res,next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    
    if (token === null) return next(customError('Authentication tidak ditemukan',401))

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user) => {
        if (err) return next(customError('Authentication Error',419))
        req.user = user
        next()
    })
}


module.exports = {
    signUser,
    authenticateToken
}
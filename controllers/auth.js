const jwt = require('jsonwebtoken')


require('dotenv').config()

function signUser(user) {
    return jwt.sign({_id: user}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 60*30}) // 60detik * 30 = 30 menit
}

async function authenticateToken(req,res,next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    console.log(token)
    if (token == null) return next(customError('Authentication tidak ditemukan',401))

    jwt.verify(token, process.env.tokenSecret, (err,user) => {
        if (err) return next(customError('Authentication has expired',419))
        req.user = user
        next()
    })
}



module.exports = {
    signUser,
    authenticateToken
}
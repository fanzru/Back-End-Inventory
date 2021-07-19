const express  = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
//const mongoDBsession = require('connect-mongodb-session')(session)
const authRoute = require('./routes/Auth');

const app = express();

require('dotenv').config();

const port = process.env.PORT || 5000

/* 
  Body parser in express and enable to use urlencode in postman
*/
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// midleware route
//app.use(
//  session({
//    secret: 'key that will sign cookie',
//    resave: false,
//    saveUnitializied: false
//  })
//)

app.use('/user',authRoute);

// Database Access
mongoose.connect(process.env.DATABASE,{useNewUrlParser: true, useUnifiedTopology: true},()=>
  console.log('Database Connected')
);
// Port Connected
app.listen(port,()=>console.log(`Server is Runing in Port ${port}`))

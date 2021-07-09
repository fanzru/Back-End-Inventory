const express  = require('express');
const mongoose = require('mongoose')

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
app.use('/api/user',authRoute);

// Database Access
mongoose.connect(process.env.DATABASE,{useNewUrlParser: true, useUnifiedTopology: true},()=>
  console.log('Database Connected')
);
// Port Connected
app.listen(5000,()=>console.log(`Server is Runing in Port ${port}`))
const mongoose = require('mongoose');
//const Sequelize = require('sequelize');
const newSchema = new mongoose.Schema({
    //_id: false,
    //userId: {
    //    type: String,
    //    unique: true,
    //    required: true
    //},
    fullname:{
        type: String,
        required: true
    },
    NIM:{
        type: String,
        required: true,
        length: 10
    },
    major:{
        type: String,
        required: true
    },
    faculty:{
        type: String,
        required: true
    },
    year:{
        type: String,
        required: true
    },
    phoneNumber:{
        type: String,
        required: true,
        min: 9,
        max: 13
    },
    homeAddress:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    aslab:{
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User',newSchema);
const mongoose = require('mongoose');

const newSchema = new mongoose.Schema({
    fullname:{
        type: String,
        required: true
    },
    NIM:{
        type: String,
        required: true
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
        required: true
    },
    homeAddress:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User',newSchema);
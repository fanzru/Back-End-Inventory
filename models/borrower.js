const mongoose = require('mongoose');

//const Sequelize = require('sequelize');
const newSchema = new mongoose.Schema({
    borrowId:{
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    itemId: {
        type: String ,
        required: true,
    },
    itemBorrow:{
        type: Number,
        required: true
    },
    dateBorrow: {
        type: String,
        required: true
    },
    dateReturn: {
        type: String,
        required: true
    },
    guarantee: {
        type: String,
        required: true
    },
    guaranteePicture:{
        type: String,
        require: true
    },
    dateRequest: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('borrower',newSchema);
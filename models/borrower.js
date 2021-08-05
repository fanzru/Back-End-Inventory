const mongoose = require('mongoose');

//const Sequelize = require('sequelize');
const newSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        uppercase: true
    },
    itemId: {
        type: String ,
        required: true,
    },
    itemInBorrow:{
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
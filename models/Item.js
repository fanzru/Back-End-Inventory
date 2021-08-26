const mongoose = require('mongoose');

//const Sequelize = require('sequelize');
const newSchema = new mongoose.Schema({
    categoryId: {
        type: String,
        required: true
    },
    itemCode: {
        type: String,
        require: true
    },
    itemName: {
        type: String,
        required: true,
        uppercase: true
    },
    itemAmount: {
        type: Number ,
        required: true,
        
    },
    itemInBorrow:{
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Item',newSchema
);
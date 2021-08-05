const mongoose = require('mongoose');

//const Sequelize = require('sequelize');
const newSchema = new mongoose.Schema({
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

module.exports = mongoose.model('Item',newSchema);
const mongoose = require('mongoose');
//const Sequelize = require('sequelize');
const newSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true
    },
    amountItems: {
        type: Number,
        required: true,
    },
    status:{
        type: Boolean,
        required: true
    },
    imagesItem:{
        type: String,
        required: true
    }
});
module.exports = mongoose.model('Item',newSchema);
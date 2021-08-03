const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const SchemaTypes = mongoose.Schema.Types;

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
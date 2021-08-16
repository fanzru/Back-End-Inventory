const mongoose = require('mongoose');

const newSchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,     
        uppercase: true   
    }
});

module.exports = mongoose.model('Category',newSchema)
const mongoose = require('mongoose');

const newSchema = new mongoose.Schema({
    namefile: {
        type: String,
        required: true
    },
    itemPicture: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('File',newSchema)
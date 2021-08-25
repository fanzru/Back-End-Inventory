const multer = require('multer');
const router = require('express').Router();
const MULTER = require('../models/tesmulter');
const upload = require('../middleware/upload');

router.post('upload/',upload.single('itemPicture'),(req,res)=> {

})


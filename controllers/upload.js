const path = require('path');
const multer = require('multer');
const cloudinaryStorage = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinary')
const fs = require('fs');



const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'uploads/')
    },
    filename: function(req,file,cb){
        let ext = path.extname(file.originalname)
        cb(null,Date.now()+ext)
    }
})
const upload = multer ({
    storage: storage,
    fileFilter: function(req,file,callback){
        if ((file.mimetype == 'image/jpg')|| (file.mimetype == "image/png")){
            callback(null,true)
        } else {
            console.log('Only jpg & png file supported!')
            callback(null,false)
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 2
    }
})

async function uploadImage(file,name) {
    const url = await cloudinary.v2.uploader.upload(file, {public_id: 'RPL_Inventory/barcode/'+name});
    
    let paths = __dirname.split("/controllers")[0];

    fs.unlink(`${paths}/uploads/${name}`, (err) => {
        if(err) return null
    });
    console.log(url.url,'=================')
    return url.url
}

module.exports = {
  uploadImage, upload
} 
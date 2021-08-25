const path = require('path');
const multer = require('multer');

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
    }
})

module.exports = upload 
const router = require('express').Router();
const MULTER = require('../models/tesmulter');
const { response } = require('../controllers/response')
const error = null
const {uploadImage,upload } = require('../controllers/upload')
router.get('/',async (req,res)=>{
    try {
        const items = await MULTER.find()
        response(res, true, items, 'Get All Items Success', 200)
    } catch {
        response(res, false, items, 'Get All Items Failed', 400)
    }
})
router.post('/upload',upload.single('itemPicture'), async (req,res,next)=> {
    
    let name = (req.file.path).split('/')
    
    const url = await uploadImage(req.file.path,name[1])
    
    const file = new MULTER({
        namefile: req.body.namefile,
        itemPicture: req.file.path,
        url: url
    })
    console.log(file)
    const saveFile = await file.save()
    console.log(saveFile)
    try {
        
        response(res, true, saveFile, 'Alhamdulillah bisa tidur', 200)
    } catch {
        response(res, false, error, 'Add Item Failed', 400) 
    }
})

module.exports = router

const router = require('express').Router();
const MULTER = require('../models/tesmulter');
const upload = require('../controllers/upload');
const { response } = require('../controllers/response')
const error = null
router.get('/',async (req,res)=>{
    try {
        const items = await MULTER.find()
        response(res, true, items, 'Get All Items Success', 200)
    } catch {
        response(res, false, items, 'Get All Items Failed', 400)
    }
})
router.post('/upload',upload.single('itemPicture'), async (req,res)=> {
    const file = new MULTER ({
        namefile: req.body.namefile
    })
    
    if(req.file){
        file.path = req.file.path
    }
    const saveFile = await file.save()
    console.log(saveFile)
    try {
        
        response(res, true, saveFile, 'Alhamdulillah bisa tidur', 200)
    } catch {
        response(res, false, error, 'Add Item Failed', 400)
    }
})

module.exports = router
const router = require('express').Router();
const CATEGORY = require('../models/category');
const error = null
const {response} = require('../controllers/response')
// Add Category

router.get('/', async (req,res)=> {
    try {
        const category = await CATEGORY.find();
        response(res,true,category,'Get All Category Succes',200)
    } catch {
        response(res,false,error,'Get All Category Failed',400)
    }
})
router.post('/addCategory',async (req,res)=>{
    const categoryExist = await CATEGORY.findOne({categoryName: req.body.categoryName});
    if (categoryExist){
        return response(res,false,categoryExist,'Category Exist',400)
    };
    
    const newCategory = new CATEGORY({
        categoryName: req.body.categoryName
    })
    try {
        const savedCategory = await newCategory.save();
        response(res,true,savedCategory,'add category succes',200)
    } catch{
        response(res,false,error,'add category failed',400)
    }
});

router.get('/searchCategory/:categoryId',async (req,res)=> {
    try {
        const Category = await CATEGORY.findOne({_id: req.params.categoryId});
        if (Category != null) return response(res,true,Category,'Category Already',200)
    } catch {
        response(res,false,error,'Category Not Found',400)
    }
})

router.delete('/deleteCategory/:categoryId')
//router.delete()
module.exports = router;

const router = require('express').Router();
const CATEGORY = require('../models/category');


// Add Category
router.post('/addCategory',async (req,res)=>{
    const categoryExist = await CATEGORY.findOne({categoryName: req.body.categoryName});
    if (categoryExist){
        return res.status(400).json({
            status:400,
            message: 'Category Exist',
            error: categoryExist
        });
    };
    
    const newCategory = new CATEGORY({
        categoryName: req.body.categoryName
    })
    try {
        const savedCategory = await newCategory.save();
        res.status(200).json({
            status: 200,
            message: 'add category success',
            details: savedCategory
        });
    } catch{
        res.status(400).json({
            status: 400,
            message: 'add category failed',
        });
    }
});

module.exports = router;

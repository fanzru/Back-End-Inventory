const router = require('express').Router();
const ITEMS   = require('../models/Item');

router.get('/',async (req,res)=>{
    try {
        const items = await ITEMS.find();
        res.status(200).json({
            status: 200,
            message: 'Get All Items Succes',
            items: items
        })
    } catch{
        res.status(400).json({
            status: 400,
            message: 'Item Not Found'
        })
    }
})

router.post('/inputnewItem',async (req,res)=>{
    const itemExist = await ITEMS.findOne({itemName: req.body.itemName});
    if (itemExist) return res.status(400).json({
        status:400,
        message: 'Item Already Exist'
    })
    const newItem = new ITEMS({
        itemName: req.body.itemName,
        itemAmount: req.body.itemAmount,
        itemInBorrow: 0,
    })
    try{
        const savedItem = await newItem.save();
        res.status(200).json({
            status:200,
            message: 'Input Item Succes',
            details: savedItem
        })
    } catch(err) {
        res.status(400).json({
            status: 400,
            message: 'Input Item Failed'
        })
    }
    
})

router.get('/findItemByName/:itemName',async (req,res)=>{
    const Item = await ITEMS.findOne({itemName: req.params.itemName});
    if (Item != null) return res.status(200).json({
        status:200,
        massage: 'Search Data Succes',
        details: Item
    });
        
    res.status(400).json({
        status:400,
        massage: `${req.params.itemName} Not Found`
    })
})
module.exports = router;
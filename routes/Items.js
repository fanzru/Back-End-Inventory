const router = require('express').Router();
const ITEMS   = require('../models/Item');
// Get all Data
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
// Input New item
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
// get item using id item
router.get('/findItem/:itemid',async (req,res)=>{
    try {
        const Item = await ITEMS.findOne({_id: req.params.itemid});
        if (Item != null) return res.status(200).json({
            status:200,
            massage: 'Search Data Succes',
            details: Item
        });
    } catch {
        res.status(400).json({
            status:400,
            massage: `${req.params.itemid} Not Found`
        })
    }
    
})
// rename item using item id
router.patch('/renameItem/:itemid',async (req,res)=>{
    try {
        const updateItem = await ITEMS.updateOne(
            {_id: req.params.itemid}, 
            {$set: req.body.itemName}
        );
        res.status(400).json({
            status:200,
            message: 'Update Success',
            details: updateItem
        })
    } catch {
        res.status(400).json({
            status:400,
            massage: `${req.params.itemid} Not Found`
        })
    }
})
// delete item using item id
router.delete('/deleteItem/:itemid', async (req,res)=>{
    try{
        const deleteItem = await ITEMS.remove({_id: req.params.itemid});
        res.status(200).json({
            status: 200,
            message: 'delete item success',
            details: deleteItem
        })
    } catch{
        res.status(400).json({
            status: 400,
            message: 'delete item failed'
        })
    }
})

router.post('/returnItem/:itemid/:amountitem', async (req,res)=> {
    try{
        const item = await ITEMS.findOne({_id: req.params.itemid});
        if ( (item!= null) &&  (item.itemAmount >= req.params.amountitem) && ((parseInt(item.itemInBorrow) - parseInt(req.params.amountitem)) >= 0)){
            item.itemAmount   -= parseInt(req.params.amountitem)
            item.itemInBorrow += parseInt(req.params.amountitem)
            const savedItem = await item.save();
            res.status(200).json({
                status: 200,
                message: 'Return Item Succes',
                details: savedItem
            })
        } else if (item!= null){
            res.status(400).json({
                status: 400,
                message: 'item not enough'
            })
        }
    } catch {
        res.status(400).json({
            status: 400,
            message: 'item not found'
        })
    }
})
module.exports = router;
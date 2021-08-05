const router = require('express').Router();
const ITEMS   = require('../models/Item');
const {response} = require('../controllers/response')
// Get all Data
router.get('/',async (req,res)=>{
    try {
        const items = await ITEMS.find();
        response(res,true,items,'Get All Items Succes',200)
    } catch{
        response(res,false,items,'Item Not Found',400)
    }
})
// Input New item
router.post('/inputnewItem',async (req,res)=>{
    const itemExist = await ITEMS.findOne({itemName: req.body.itemName});
    if (itemExist) return response(res,false,itemExist,'Item Already Exist',400)
    const newItem = new ITEMS({
        itemName: req.body.itemName,
        itemAmount: req.body.itemAmount,
        itemInBorrow: 0,
    })
    try{
        const savedItem = await newItem.save();
        response(res,true,savedItem,'Input Item Succes',200)
    } catch {
        response(res,false,savedItem,'Input Item Failed',400)
    }
    
})
// get item using id item
router.get('/findItem/:itemid',async (req,res)=>{
    try {
        const Item = await ITEMS.findOne({_id: req.params.itemid});
        if (Item != null) return response(res,true,Item,'Search Data Succes',200)
    } catch {
        response(res,false,Item,`${req.params.itemid} Not Found`,400)
    }
})
// rename item using item id
router.patch('/renameItem/:itemid',async (req,res)=>{
    try {
        const updateItem = await ITEMS.updateOne(
            {_id: req.params.itemid}, 
            {$set:{itemName: req.body.itemName}
        });
        response(res,true,updateItem,'Update Success',200)
    } catch {
        response(res,false,updateItem,`${req.params.itemid} Not Found`,400)
    }
})
// delete item using item id
router.delete('/deleteItem/:itemid', async (req,res)=>{
    try{
        const deleteItem = await ITEMS.remove({_id: req.params.itemid});
        response(res,true,deleteItem,'delete item success',200)
    } catch{
        response(res,false,deleteItem,'delete item failed',400)
    }
})

router.post('/minItem/:itemid/:amountitem', async (req,res)=> {
    try{
        const item = await ITEMS.findOne({_id: req.params.itemid});
        if ( (item!= null) &&  (item.itemAmount >= req.params.amountitem) && ((parseInt(item.itemInBorrow) - parseInt(req.params.amountitem)) >= 0)){
            item.itemAmount   += parseInt(req.params.amountitem)
            item.itemInBorrow -= parseInt(req.params.amountitem)
            const savedItem = await item.save();
            response(res,true,savedItem,'Return Item Succes',200)
        } else if (item!= null){
            response(res,false,savedItem,'item not enough',400)
        }
    } catch {
        response(res,false,savedItem,'item not found',400)
    }
})

router.post('/addItem/:itemid/:amountitem', async (req,res)=> {
    try{
        const item = await ITEMS.findOne({_id: req.params.itemid});
        if ( (item!= null) &&  (item.itemAmount >= req.params.amountitem) && ((parseInt(item.itemInBorrow) - parseInt(req.params.amountitem)) >= 0)){
            item.itemAmount   -= parseInt(req.params.amountitem)
            item.itemInBorrow += parseInt(req.params.amountitem)
            const savedItem = await item.save();
            response(res,true,savedItem,'Return Item Succes',200)
        } else if (item!= null){
            response(res,false,savedItem,'item not enough',400)
        }
    } catch {
        response(res,false,savedItem,'item not found',400)
    }
})

module.exports = router;
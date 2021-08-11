const router = require('express').Router();
const BORROWER   = require('../models/borrower');
const USER = require('../models/user');
const ITEMS = require('../models/Item');
const {response} = require('../controllers/response');


router.post('/requestItem',(req,res)=>{
    
    const item = await ITEMS.findOne({_id: req.body.itemId})
    const user = await USER.findOne({_id: req.body.userId})
    
    if (item === null) {
        return response(res,false,item,'item not found',400)
    } else if (user === null) {
        return response(res,false,user,'user not found',400)
    } else if (item.itemAmount < req.body.itemBorrow) {
        return response(res,false,item,'item not available',400)
    }

    const newRequest = new BORROWER({
        userId: req.body.userId,
        itemId: req.body.itemId,
        itemBorrow: req.body.itemBorrow,
        dateBorrow: '-',
        dateReturn: '-',
        guarantee: req.body.guarantee,
        dateRequest: Date.now,
        status: req.body.status
    })
})
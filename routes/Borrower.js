const router = require('express').Router();
const BORROWER   = require('../models/borrower');
const USER = require('../models/user');
const ITEMS = require('../models/Item');
const {response} = require('../controllers/response');
const error = null

router.get('/',async (req,res)=>{
    const listborrower = await BORROWER.find();
    try {
        response(res,true,listborrower,'Get All Borrower Request Succes',200)
    } catch {
        response(res,false,error,'Faild Get Data',400)
    }
})

router.post('/requestItem', async (req,res)=>{
    const date = new Date().toISOString().split('T')[0];
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
        dateRequest: date,
        status: "in process"
    })
    try {
        const savedRequestBorrow = await newRequest.save();
        response(res,true,savedRequestBorrow,'Add Request Success',200)
    } catch {
        response(res,false,newRequest,'Add Request Failed',400)
    }
})

router.post('/changeStatus/:borrowId',async (req,res)=> {})


module.exports = router;

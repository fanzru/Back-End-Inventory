const router = require('express').Router();
const BORROWER   = require('../models/borrower');
const USER = require('../models/user');
const ITEMS = require('../models/Item');
const {response} = require('../controllers/response');
const error = null
const {uploadImage,upload } = require('../controllers/upload')
const {authenticateToken} = require('../controllers/auth')
router.get('/',async (req,res)=>{
    const listborrower = await BORROWER.aggregate([
        {
          $lookup: {
            from: USER.collection.name ,
            let: {
              userId: { $toObjectId: '$userId' },
            },
            as: 'detailUser',
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$$userId','$_id' ], 
                  },
                },
              },
            ],
          },
        },
        {
            $lookup: {
              from: ITEMS.collection.name ,
              let: {
                itemId: { $toObjectId: '$itemId' },
              },
              as: 'detailItem',
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ['$_id','$$itemId' ], 
                    },
                  },
                },
              ],
            },
          },
      ])
    try {
        
        response(res,true,listborrower,'Get All Borrower Request Succes',200)
    } catch {
        response(res,false,error,'Faild Get Data',400)
    }
})

router.post('/requestItem',upload.single('guaranteePicture'),authenticateToken, async (req,res)=>{
    const date = new Date().toISOString().split('T')[0];
    const item = await ITEMS.findOne({_id: req.body.itemId})
    const user = await USER.findOne({_id: req.body.userId})
   
    let kode = 'PNJ-'
    let itemCode = kode + 0
    var lastDoc = await BORROWER.find().sort({ _id: -1 }).limit(1)
    if (lastDoc.length != 0) {
        var code = lastDoc[0].borrowId.split('-')
        var noid = parseInt(code[1]) + 1
        itemCode = kode + noid
    }

    if (item === null) {
        return response(res,false,item,'item not found',400)
    } else if (user === null) {
        return response(res,false,user,'user not found',400)
    } else if (item.itemAmount < req.body.itemBorrow) {
        return response(res,false,item,'item not available',400)
    }
    let name = (req.file.path).split('/')
    const url = await uploadImage(req.file.path,name[1])

    const newRequest = new BORROWER({
        borrowId: itemCode,
        userId: req.body.userId,
        itemId: req.body.itemId,
        itemBorrow: req.body.itemBorrow,
        dateBorrow: '-',
        dateReturn: '-',
        guarantee: req.body.guarantee,
        guaranteePicture: url, 
        dateRequest: date,
        status: "in process",
        dateBorrowUser: req.body.dateBorrowUser,
        dateReturnUser: req.body.dateReturnUser
    })
    try {
        const savedRequestBorrow = await newRequest.save();
        response(res,true,savedRequestBorrow,'Add Request Success',200)
    } catch {
        response(res,false,newRequest,'Add Request Failed',400)
    }
})

router.post('/changeStatus/:borrowId',authenticateToken,async (req,res)=> {
    const borrower = await BORROWER.findOne({_id: req.params.borrowId})
    if (borrower.length != 0) {
        const item = await ITEMS.findOne({_id: borrower.itemId})
        try {
            if ((req.body.status === 'Accepted') && (item.itemAmount >= borrower.itemBorrow) && (borrower.status == 'in process') ){
                item.itemAmount -= parseInt(borrower.itemBorrow)
                item.itemInBorrow += parseInt(borrower.itemBorrow)
                let date = new Date().toISOString().split('T')[0];
                borrower.dateBorrow = date
                borrower.status = 'Accepted'
                const savedItem = await item.save();
                const savedBorrower = await borrower.save();
                return response(res,true,item,'Change Status Success',200)
            } else if ((req.body.status === 'Returned') && (borrower.status == 'Accepted')){
                item.itemAmount += parseInt(borrower.itemBorrow)
                item.itemInBorrow -= parseInt(borrower.itemBorrow)
                let date = new Date().toISOString().split('T')[0];
                borrower.dateReturn = date
                borrower.status = 'Returned'
                const savedItem = await item.save();
                const savedBorrower = await borrower.save();
                return response(res,true,item,'Change Status Success',200)
            } else if ((req.body.status === 'Rejected') && (borrower.status == 'in process') ){
                borrower.status = 'Rejected'
                const savedBorrower = await borrower.save();
                return response(res,true,savedBorrower,'Rejected Success',200)
            } else {
                return response(res,false,error,'Status Not Compatible',400)
            }
        } catch {
            response(res,false,error,'Change Status Failed',400)
        }
    } else {
        response(res,false,error,'Change Status Failed',400)
    }
})
const mongoose = require("mongoose");
router.get('/user/:id',authenticateToken, async (req,res)=> {
  
  const borrow = await BORROWER
  .aggregate([
    {
      $lookup: {
        from: ITEMS.collection.name,
        let: {
          itemId: { $toObjectId: '$itemId' },
        },
        as: 'detailItem',
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$$itemId', '$_id'],
              },
            },
          },
        ],
      },
    },
  ])
  console.log(borrow)
  try {
    //const borrow = await BORROWER.find({userId: req.params.id})
    response(res,true,borrow,'Get Item Borrow User Success',200)
  } catch {
    response(res,false,error,'Get Item Borrow User Failed',400)
  }

})
router.delete('/delete/:borrowID')

module.exports = router;

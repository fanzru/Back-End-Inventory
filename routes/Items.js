const router = require('express').Router()
const ITEMS = require('../models/Item')
const Category = require('../models/category')
const BORROWER = require('../models/borrower')
const { response } = require('../controllers/response')
// Get all Data
const error = null
router.get('/', async (req, res) => {
  try {
    const items = await ITEMS.aggregate([
      {
        $lookup: {
          from: Category.collection.name,
          let: {
            categoryId: { $toObjectId: '$categoryId' },
          },
          as: 'detailCategory',
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$$categoryId', '$_id'],
                },
              },
            },
          ],
        },
      },
    ])

    response(res, true, items, 'Get All Items Succes', 200)
  } catch (err) {
    console.log(err)
    response(res, false, error, 'Item Not Found', 400)
  }
})
// Input New item
router.post('/inputnewItem', async (req, res) => {
  let kode = 'BRG-'
  let itemCode = kode + 0
  var lastDoc = await ITEMS.find().sort({ _id: -1 }).limit(1)

  if (lastDoc.length != 0) {
    var code = lastDoc[0].itemCode.split('-')
    var noid = parseInt(code[1]) + 1
    itemCode = kode + noid
  }

  const itemExist = await ITEMS.findOne({ itemName: req.body.itemName })
  if (itemExist) return response(res, false, lastDoc, 'Item Already Exist', 400)

  const newItem = new ITEMS({
    categoryId: req.body.categoryId,
    itemName: req.body.itemName,
    itemCode: itemCode,
    itemAmount: req.body.itemAmount,
    itemInBorrow: 0,
  })

  try {
    const savedItem = await newItem.save()
    response(res, true, savedItem, 'Input Item Succes', 200)
  } catch {
    response(res, false, error, 'Input Item Failed', 400)
  }
})
// get item using id item
router.get('/findItem/:itemid', async (req, res) => {
  try {
    const Item = await ITEMS.findOne({ _id: req.params.itemid })
    if (Item != null)
      return response(res, true, Item, 'Search Data Succes', 200)
  } catch {
    response(res, false, Item, `${req.params.itemid} Not Found`, 400)
  }
})
// rename item using item id
router.post('/updateItem/:itemid', async (req, res) => {
  try {
    const updateItem = await ITEMS.findOne({ _id: req.params.itemid })
    if (updateItem == null) return response(res, false, error, `item Not Found`, 400)
    updateItem.categoryId = req.body.categoryId
    updateItem.itemName   = req.body.itemName
    response(res, true, updateItem, 'Update Success', 200)
  } catch {
    response(res, false, error, `item Not Found`, 400)
  }
})
// delete item using item id
router.delete('/deleteItem/:itemid', async (req, res) => {
  try {
    const dataBorrower = await BORROWER.findOne({ itemId: req.params.itemid })

    if (dataBorrower != null) return response(res, false, error, 'delete item failed', 400)

    const deleteItem = await ITEMS.remove({ _id: req.params.itemid })
    response(res, true, deleteItem, 'delete item success', 200)
  } catch {
    response(res, false, error, 'delete item failed', 400)
  }
})

router.post('/minItem/:itemid/:amountitem', async (req, res) => {
  try {
    const item = await ITEMS.findOne({ _id: req.params.itemid })
    console.log(typeof item.itemAmount, typeof itemAmount)
    if (item.length != 0 && item.itemAmount >= itemAmount) {
      item.itemAmount -= parseInt(req.params.amountitem)
      const savedItem = await item.save()
      response(res, true, savedItem, 'Min Item Succes', 200)
    }
  } catch {
    response(res, false, error, 'Min Item Failed', 400)
  }
})

router.post('/addItem/:itemid/:amountitem', async (req, res) => {
  try {
    const item = await ITEMS.findOne({ _id: req.params.itemid })
    if (item.length != 0 && 1 <= req.params.amountitem) {
      item.itemAmount += parseInt(req.params.amountitem)
      const savedItem = await item.save()
      response(res, true, savedItem, 'Return Item Succes', 200)
    }
  } catch {
    response(res, false, error, 'item not found', 400)
  }
})

module.exports = router

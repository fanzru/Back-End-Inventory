const router = require('express').Router();
const ITEMS   = require('../models/Item');

router.get('/',(req,res)=>{
    res.send('Helloo')
})

module.exports = router;
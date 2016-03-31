var express = require('express');
var router = express.Router();

var productsUpdateHandler = require('./update/productsUpdateHandler');

router.post('/update', productsUpdateHandler);

module.exports = router;

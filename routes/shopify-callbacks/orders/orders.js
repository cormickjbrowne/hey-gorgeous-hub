var express = require('express');
var router = express.Router();

var ordersCreateHandler = require('./create/ordersCreateHandler');

router.post('/create', ordersCreateHandler);

module.exports = router;

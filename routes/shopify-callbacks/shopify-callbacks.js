var express = require('express');
var router = express.Router();

var productsRoute = require('./products/products');
var ordersRoute = require('./orders/orders');

router.post('/products', productsRoute);
router.post('/orders', ordersRoute);

module.exports = router;

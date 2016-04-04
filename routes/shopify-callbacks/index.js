var express = require('express');
var router = express.Router();

var ordersCreateHandler = require('./orders-create');
var productsUpdateHandler = require('./products-update');

router.post('/', function (req, res) {
    if (!req.fromShopify()) {
      return res.status(401).send('Unauthorized')
    }
    switch (req.get('X-Shopify-Topic')) {
        case 'orders/create':
            ordersCreateHandler(req, res);
            break;
        case 'products/update':
            productsUpdateHandler(req, res);
            break;
        default:
            return res.status(404).send('Handler not found');
    }
})

module.exports = router;

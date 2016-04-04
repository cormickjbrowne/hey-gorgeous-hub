/*jslint node: true */
'use strict';

var express = require('express');
var expressWinston = require('express-winston');
var winston = require('winston');
var app = express();
var bodyParser = require('body-parser');
var shopifyCallbacksRoute = require('./routes/shopify-callbacks');
var ShopifyCallbackValidator = require('shopify-validate');
var shopifySecret = process.env.SHOPIFY_SECRET;
var shopifyCallbackValidator = new ShopifyCallbackValidator(shopifySecret)
var requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({
        filename: 'request.log',
        json: true,
        eol: 'n',
        colorize: true
    })
  ]
});

var middleware = [
    shopifyCallbackValidator,
    bodyParser.json(),
    bodyParser.urlencoded({ extended: false }),
    requestLogger
];

app.use('/shopify-callbacks', middleware, shopifyCallbacksRoute);

app.use(function (req,res) {
    res.status(404);
    res.send('Not Found');
});

// Place the express-winston errorLogger after the router.
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.File({
        filename: 'error.log',
        json: true,
        eol: 'n',
        colorize: true
    })
  ]
}));

module.exports = app;

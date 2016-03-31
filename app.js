/*jslint node: true */
'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var shopifyCallbacksRoute = require('./routes/shopify-callbacks');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/shopify-callbacks', shopifyCallbacksRoute);

app.use(function (req,res) {
    res.status(404);
    res.send('Not Found');
});

module.exports = app;

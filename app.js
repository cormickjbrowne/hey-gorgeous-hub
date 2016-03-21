/*jslint node: true */
'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var ordersRoute = require('./routes/orders');
var productsRoute = require('./routes/products');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/orders', ordersRoute);
app.use('/products', productsRoute);

module.exports = app;
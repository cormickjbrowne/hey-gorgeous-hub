"use strict";

var chai = require("chai");
chai.should();

var request = require('supertest');

describe('Express server', function () {
    var http, server;
    this.timeout(15000);
    beforeEach(function () {
        server = require('../app').listen(3000);
    });

    afterEach(function () {
        server.close();
    });

    describe('Sending a POST to /products/update', function () {
        var product;

        beforeEach(function () {
            product = require('../test/data/product.json')
        });

        it('should return \'products\'', function (done) {
            request(server)
              .post('/products/update')
              .send(product)
              .expect(200, done);
        });
    });

    describe('Sending a POST to /orders/create', function () {
        var order;

        beforeEach(function () {
            order = require('../test/data/order.json');
        });

        it('should return an array of product_ids', function (done) {
            request(server)
              .post('/orders/create')
              .send(order)
              .expect(200, done);
        });
    });
});

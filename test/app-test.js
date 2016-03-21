"use strict";

var chai = require("chai");
chai.should();

var request = require('supertest');

describe('Express server', function () {
    var http, server;

    beforeEach(function () {
        server = require('../app').listen(3000);
    });

    afterEach(function () {
        server.close();
    });

    describe('Sending a POST to /products', function () {
        it('should return \'products\'', function (done) {
            request(server)
              .post('/products')
              .expect(200, "products", done);
        });
    });

    describe('Sending a POST to /orders', function () {
        var order;

        beforeEach(function () {
            order = require('../test/data/order.json');
        });

        it('should return an array of product_ids', function (done) {
            request(server)
              .post('/orders')
              .send(order)
              .expect(200, [
                [
                    6442792001,
                    6442792065,
                    6442792129,
                    6442792193,
                    6442792257,
                    6442792321
                ],[
                    6442717249,
                    6442717313,
                    6442717377,
                    6442717441,
                    6442717505,
                    6442717569
                ],[
                    6442321089,
                    6442321217,
                    6442321345,
                    6442321473,
                    6442321601,
                    6442321665,
                    6442321729
                ]], done);
        });
    });
});

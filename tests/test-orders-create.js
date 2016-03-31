"use strict";

var chai = require('chai'),
    expect = chai.expect;

describe('ordersCreateHandler', function () {
    var sinon = require('sinon'),
        rewire = require('rewire'),
        Q = require('q'),
        Graph = require('graph').Graph,
        ordersCreateHandler = rewire('../routes/shopify-callbacks/orders/create/ordersCreateHandler'),
        ShopifyMock = require('./shopify-api-mock'),
        ShopifyObject = require('./data/shopify-object'),
        Product = ShopifyObject.Product,
        Variant = ShopifyObject.Variant,
        Order = ShopifyObject.Order,
        LineItem = ShopifyObject.LineItem,
        Metafield = ShopifyObject.Metafield,
        utils = require('./testing-utils'),
        connect = utils.connect;

    var graph, map, shopifyMock, req, res, ordersCreateHandler, statusSpy, sendSpy;

    beforeEach(function () {
        statusSpy = sinon.spy();
        sendSpy = sinon.spy();

        graph = new Graph({
            'o1': ['li1'],
            'p1': ['v1', 'li1'],
            'v1': ['m1', 'li1']
        });

        map = {
            // 'v1': extend(true, {}, new Variant()),
            // 'm1': extend(true, {}, new Metafield()),
            // 'p1': extend(true, {}, new Product()),
            // 'li1': extend(true, {}, new LineItem()),
            // 'o1': extend(true, {}, new Order())
            'v1': new Variant(),
            'm1': new Metafield(),
            'p1': new Product(),
            'li1': new LineItem(),
            'o1': new Order()
        };

        res = {
            'status': statusSpy,
            'send': sendSpy
        };

        req = {
            body: map['o1']
        };

        connect(map, graph);
        shopifyMock = new ShopifyMock(map);
    });

    it('should respond with a response to the client', function (done) {

        ordersCreateHandler.__set__({
            'shopify': shopifyMock
        });

        ordersCreateHandler(req, res, function (err, data) {
            expect(statusSpy.calledWith(200)).to.equal(true);
            expect(sendSpy.called).to.equal(true);
            done();
        });

    });

    it('should respond with a 400 Bad Request if an order is not sent in request body', function (done) {
        req.body = undefined;

        ordersCreateHandler.__set__({
            'shopify': shopifyMock
        });

        ordersCreateHandler(req, res, function (err, data) {
            expect(statusSpy.calledWith(400)).to.equal(true);
            expect(sendSpy.called).to.equal(true);
            done();
        });
    });

    it('should respond with a 400 Bad Request if the order does not contain any line_items', function (done) {
        req.body.line_items = undefined;

        ordersCreateHandler.__set__({
            'shopify': shopifyMock
        });

        ordersCreateHandler(req, res, function (err, data) {
            expect(statusSpy.calledWith(400)).to.equal(true);
            expect(sendSpy.called).to.equal(true);
            done();
        });
    });

    it('should respond with a 400 Bad Request if any line_items are missing a product_id', function (done) {
        req.body.line_items[0].product_id = undefined;

        ordersCreateHandler.__set__({
            'shopify': shopifyMock
        });

        ordersCreateHandler(req, res, function (err, data) {
            expect(statusSpy.calledWith(400)).to.equal(true);
            expect(sendSpy.called).to.equal(true);
            done();
        });
    });

    it('should respond with a 400 Bad Request if any line_items are missing a variant_id', function (done) {
        req.body.line_items[0].variant_id = undefined;

        ordersCreateHandler.__set__({
            'shopify': shopifyMock
        });

        ordersCreateHandler(req, res, function (err, data) {
            expect(statusSpy.calledWith(400)).to.equal(true);
            expect(sendSpy.called).to.equal(true);
            done();
        });
    });

    it('should respond with a 404 Not Found if any of the line_item\'s product_ids are not in Shopify', function (done) {
        req.body.line_items[0].product_id = 9999999;

        ordersCreateHandler.__set__({
            'shopify': shopifyMock
        });

        ordersCreateHandler(req, res, function (err, data) {
            expect(statusSpy.calledWith(404)).to.equal(true);
            expect(sendSpy.called).to.equal(true);
            done();
        });
    });

    it('should respond with a 404 Not Found if any of the line_item\'s variant_ids are not in Shopify', function (done) {
        map['p1'].variants[0].id = 1111111111;

        ordersCreateHandler.__set__({
            'shopify': shopifyMock
        });

        ordersCreateHandler(req, res, function (err, data) {
            expect(statusSpy.calledWith(404)).to.equal(true);
            expect(sendSpy.called).to.equal(true);
            done();
        });
    });

    it('should respond with a 200 Size metafields Not Found if sizes metafield is not found', function (done) {
        map['m1'].owner_id = 11111111;

        ordersCreateHandler.__set__({
            'shopify': shopifyMock
        });

        ordersCreateHandler(req, res, function (err, data) {
            expect(statusSpy.calledWith(200)).to.equal(true);
            expect(sendSpy.called).to.equal(true);
            done();
        });
    });
});

describe('Variant is single-sized, inventory_policy is \'continue\', inventory_quantity > 0' ,function () {

});
describe('Variant is single-sized, inventory_policy is \'continue\', inventory_quantity <= 0' ,function () {

});
describe('Variant is single-sized, inventory_policy is \'deny\', inventory_quantity > 0' ,function () {

});
describe('Variant is single-sized, inventory_policy is \'deny\', inventory_quantity <= 0' ,function () {

});
describe('Variant is single-sized, inventory_policy is \'continue\', inventory_quantity > 0' ,function () {

});
describe('Variant is single-sized, inventory_policy is \'continue\', inventory_quantity <= 0' ,function () {

});
describe('Variant is single-sized, inventory_policy is \'deny\', inventory_quantity > 0' ,function () {

});
describe('Variant is single-sized, inventory_policy is \'deny\', inventory_quantity <= 0' ,function () {

});

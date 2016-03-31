'use strict';

var sinon, g, extend, ShopifyObject, Variant, Product, Order, LineItem, Metafield, ShopifyMock;

sinon = require('sinon');
g = require('graph');
extend = require('extend');
ShopifyObject = require('./data/shopify-object');

Variant = ShopifyObject.Variant;
Product = ShopifyObject.Product;
Order = ShopifyObject.Order;
LineItem = ShopifyObject.LineItem;
Metafield = ShopifyObject.Metafield;

ShopifyMock = function (map) {
    var key, obj;
    this.products = [];
    this.variants = [];
    this.orders = [];
    this.line_items = [];
    this.metafields = [];

    for (key in map) {
        obj = map[key];
        if (obj instanceof Product) {
            this.products.push(obj);
        } else if (obj instanceof Variant) {
            this.variants.push(obj);
        } else if (obj instanceof Metafield) {
            this.metafields.push(obj)
        } else if (obj instanceof Order) {
            this.orders.push(obj);
        } else if (obj instanceof LineItem) {
            this.line_items.push(obj);
        }
    }
}

ShopifyMock.prototype.getProducts = function () {
    return this.products;
}

ShopifyMock.prototype.getProduct = function (id) {
    var index = this.products.map(x => x.id).indexOf(id);
    if (index === -1) return {"errors":"Not Found"};
    return this.products[index];
};

ShopifyMock.prototype.putProduct = function (product) {
    var index = this.products.map(x => x.id).indexOf(product.id);
    if (index === -1) return {"errors":"Not Found"};
    this.products[index] = product;
    return product;
};

ShopifyMock.prototype.getMetafields = function (options) {
    if (!options) return this.metafields;
    return this.metafields.filter(function (metafield) {
        return Object.keys(options).reduce(function (prev, key) {
            return prev && (metafield[key] === options[key]);
        }, true);
    });
};

ShopifyMock.prototype.callShopify = function (method, path, options, data) {
    var calls = {
        "get": {
            "metafields": this.getMetafields
        }
    }
    return calls[method][path[0]].bind(this, options)();
};

module.exports = ShopifyMock;

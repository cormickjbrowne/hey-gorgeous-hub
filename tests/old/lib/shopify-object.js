'use strict';

var extend = require('extend');

var makeConstructor = function (type) {
    var template = require('./templates/'+type+'.json');

    return function () {
        var extensions = Array.prototype.slice.call(arguments);
        template.id++;
        extend.apply(this, [this, template].concat(extensions));
    }
}

exports.Product = makeConstructor('product');
exports.Variant = makeConstructor('variant');
exports.Order = makeConstructor('order');
exports.LineItem = makeConstructor('line-item');
exports.Metafield = makeConstructor('metafield');

/* jshint node: true */

var Q = require('q');
var ShopifyAPI = require('shopify-node-api');

module.exports = function (config) {
    "use strict";

    var shopifyApi = new ShopifyAPI(config);

    var pluralizeProductTypes = function (str) {
        switch (str) {
            case 'product':
                return 'products';
            case 'variant':
                return 'variants';
            case 'metafield':
                return 'metafields';
            default:
                return str;
        }
    };

    var buildShopifyPath = function (arr, options) {
        var option, path, params = [];

        path = '/admin/' +
            arr.filter(function (x) {
                return x !== undefined;
            })
            .map(pluralizeProductTypes)
            .join('/') + '.json';

        if (options) {
            for (option in options) {
                params.push('metafield[' + option + ']=' + options[option]);
            }
            path += '?' + params.join('&');
        }

        return path;
    };

    var callShopify = function (requestType, shopifyPathArr, options, objectData) {
        var wrapper, deferred, path, type;

        deferred = Q.defer();
        path = buildShopifyPath(shopifyPathArr, options);
        type = shopifyPathArr[2] || shopifyPathArr[0];

        if (objectData) {
            wrapper = {};
            wrapper[type] = objectData;
            objectData = wrapper;
        }
        console.log('calling...', path);
        shopifyApi[requestType](path, objectData, function (err, data) {
            if (err || !data || data.errors || data.error) {
                deferred.reject(err || data);
            } else {
                deferred.resolve(data[type]);
            }
        });

        return deferred.promise;
    };

    var getProduct = function (productId) {
        return callShopify("get", ["product", productId]);
    };

    var putProduct = function (productId, productData) {
        return callShopify("put", ["product", productId], undefined, productData);
    };

    var getMetafield = function (metafieldId, options) {
        if (objectId) {
            return callShopify("get", ["metafield", metafieldId]);
        } else {
            return callShopify("get", ["metafield"], options)
        }
    };

    var getMetafields = function (objectType, objectId) {
        return callShopify("get", [objectType, objectId, "metafields"]);
    };

    var putMetafield = function (metafield) {
        return callShopify("put", ["metafield", metafield.id], undefined, metafield);
    };

    var postMetafield = function (parentType, parentId, metafieldData) {
        return callShopify("post", [parentType, parentId, "metafield"], undefined, metafieldData);
    };

    return {
        getProduct: getProduct,
        putProduct: putProduct,
        getMetafield: getMetafield,
        getMetafields: getMetafields,
        putMetafield: putMetafield,
        postMetafield: postMetafield,
        callShopify: callShopify
    };
};

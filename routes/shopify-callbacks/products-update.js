var Q = require('q');

var config = require('../../config.js');
var shopifyAPI = require('../../shopify-api.js');
var shopify = shopifyAPI(config);
var utils = require('../../lib/utils.js');

function loadDatafromShopify (variant) {
    var options, deferred = Q.defer();

    options = {
        owner_resource: 'variant',
        owner_id: variant.id,
        namespace: 'Variant',
        key: 'sizes'
    };

    shopify.callShopify('get', ['metafields'], options)
    .then(function (metafields) {
        variant.metafields = metafields;
        deferred.resolve(variant);
    })
    .catch(function (err) {
        deferred.reject(err);
    });

    return deferred.promise;
}

function productsUpdateHandler (req, res) {
    var product, variants;
    console.log("HANDLING PRODUCTS UPDATE!");
    product = req.body;

    variants = product.variants.map(loadDatafromShopify);

    Q.all(variants)
    .then(function (variants) {
        var tags, sizeTags, sizeTagsToAdd, productCondensed;

        product.variants = variants;

        product = utils.removeAllSizeTags(product);

        console.log('product without size tags:', product);

        product = utils.addInStockSizeTags(product);

        console.log('product with size tags added back:', product);

        product = {
            id: product.id,
            tags: product.tags
        };

        return shopify.putProduct(product.id, product);
    })
    .then(function (product) {

        product = {
            id: product.id,
            tags: product.tags
        };

        res.status(200);
        res.send(product);
    })
    .catch(function (err) {
        res.status(500);
        res.send(err);
    });
}

module.exports = productsUpdateHandler;

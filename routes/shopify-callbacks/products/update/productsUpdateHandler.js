var Q = require('q');

var config = require('../config.js');
var shopifyAPI = require('../shopify-api');
var shopify = shopifyAPI(config);

var productsUpdateHandler = function (req, res) {
    var product, variants;

    product = req.body;

    variants = product.variants.map(function (variant){
        var options, deferred = Q.defer();

        options = {
            owner_resource: 'variant',
            owner_id: variant.id,
            namespace: 'Variant',
            key: 'sizes'
        };

        shopify.callShopify('get', ['metafields'], options)
        .then(function (metafields) {
            var sizes, variantCondensed;

            if (metafields.length) {
                sizes = metafields[0].value
                    .split(',')
                    .map(function (size) {
                        return size.trim();
                    });
            }

            variantCondensed = {
                id: variant.id,
                inventory_policy: variant.inventory_policy,
                inventory_quantity: variant.inventory_quantity,
                sizes: sizes
            };

            deferred.resolve(variantCondensed);
        })
        .catch(function (err) {
            deferred.reject(err);
        });

        return deferred.promise;
    });

    Q.all(variants)
    .then(function (variants) {
        var tags, sizeTags, sizeTagsToAdd, productCondensed;

        sizeTags = variants.map(function (variant) {
                return variant.sizes;
            }).filter(function (sizes) {
                return sizes !== undefined;
            }).map(function (tag) {
                return '{size:' + tag + '}';
            }).reduce(function (sizeTags, sizes) {
                return sizeTags.concat(sizes);
            }, []);

        tags = product.tags
            .split(',')
            .map(function (tag) {
                return tag.trim();
            }).filter(function (tag) {
                return sizeTags.indexOf(tag) === -1;
            });

        sizeTagsToAdd = variants.filter(function (variant) {
                return variant.inventory_quantity > 0
                    || variant.inventory_policy === 'continue';
            }).map(function (variant) {
                return variant.sizes;
            }).filter(function (sizes) {
                return sizes !== undefined;
            }).map(function (tag) {
                return '{size:' + tag + '}';
            }).reduce(function (sizeTags, sizes) {
                return sizeTags.concat(sizes);
            }, []);

        tags = tags.concat(sizeTagsToAdd);

        productCondensed = {
            id: product.id,
            tags: tags
        };

        shopify.putProduct(productCondensed.id, productCondensed)
        .then(function (product) {

            var productCondensed = {
                id: product.id,
                tags: product.tags
            };
            res.status(200);
            res.send(productCondensed);
        })
        .catch(function (err) {
            console.log('Received error, sending to client');
            res.status(500);
            res.send(err);
        });
    });
}

module.exports = productsUpdateHandler;

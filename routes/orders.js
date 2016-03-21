var express = require('express');
var router = express.Router();
var Q = require('q');

var config = require('../config.json')[process.env.NODE_ENV || 'development'];
var shopifyAPI = require('../shopify-api');
var shopify = shopifyAPI(config);

router.post('/create', function (req, res) {
    var products;

    products = req.body.line_items.map(function (lineItem) {
        return {
            id: lineItem.product_id,
            variants: [
                {
                    id: lineItem.variant_id
                }
            ]
        };
    });

    products = products.map(function (productPartial) {
        var deferred = Q.defer();

        options = {
            owner_resource: 'variant',
            owner_id: productPartial.variants[0].id,
            namespace: 'Variant',
            key: 'sizes'
        };

        Q.all([
            shopify.getProduct(productPartial.id),
            shopify.callShopify('get', ['metafields'], options)
        ])
        .spread(function (product, metafields) {
            var i, sizes, variant, productCondensed;

            variant = {
                id: productPartial.variants[0].id,
            }

            for (i = 0; i < product.variants.length; i++) {
                if (product.variants[i].id === variant.id) {
                    variant.inventory_policy = product.variants[i].inventory_policy;
                    variant.inventory_quantity = product.variants[i].inventory_quantity;
                }
            }

            if (metafields.length) {
                variant.sizes = metafields[0].value
                    .split(',')
                    .map(function (size) {
                        return size.trim();
                    });
            }

            productCondensed = {
                id: productPartial.id,
                tags: product.tags,
                variants: [variant]
            };

            deferred.resolve(productCondensed);
        })
        .catch(function (err) {
            console.error('Received error at creating productCondensed');
            deferred.reject(err);
        });

        return deferred.promise;
    });

    Q.all(products)
    .then(function (products) {
        return Q.all(products.map(function (product) {
            var tags, sizeTagsToRemove, sizeTagsToKeep, productPartial;

            sizeTagsToRemove = product.variants
                .filter(function (variant) {
                    return variant.inventory_quantity <= 0
                        && variant.inventory_policy === 'deny';
                })
                .map(function (variant) {
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
                    return sizeTagsToRemove.indexOf(tag) === -1;
                });

            productPartial = {
                id: product.id,
                tags: tags
            };

            return shopify.putProduct(productPartial.id, productPartial);
        }));
    })
    .then(function (products) {
        var productPartials;

        productPartials = products.map(function (product) {
            return {
                id: product.id,
                tags: product.tags
            }
        })
        res.status(200);
        res.send(productPartials);
    })
    .catch(function (err) {
        console.error('Receiving error, sending to client');
        console.error(err);
        res.status(500);
        res.send(err);
    });
});

module.exports = router;

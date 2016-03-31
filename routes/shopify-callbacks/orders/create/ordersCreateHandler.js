var Q = require('q');

var config = require('../../../../config.js');
var shopifyAPI = require('../../../../shopify-api');
var shopify = shopifyAPI(config);

var ordersCreateHandler = function (req, res, next) {
    var err, products, i, line_items;

    if (!req.body) { err = 'Reqest body is missing'; res.status(400); res.send(err); return next(err, null); }
    if (!req.body.line_items) { err = 'Request body is missing line_items'; res.status(400); res.send(err); return next(err, null); }

    line_items = req.body.line_items;

    if (!Array.isArray(line_items)) { err = 'Line_items is not an array'; res.status(400); res.send(err); return  next(err, null); }

    for (i = 0; i < line_items.length; i++) {
        if (!line_items[i].product_id) {
            err = 'Line item is missing product_id';
            res.status(400);
            res.send(err);
            return next(err, null);
        } else if (!line_items[i].variant_id) {
            err = 'Line item is missing variant_id';
            res.status(400);
            res.send(err);
            return next(err, null);
        }
    }

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
            if (!metafields.length) {
                deferred.reject({
                    error: 'Size Metafield Not Found',
                    code: 200
                });
            }
            
            var i, sizes, variant, productCondensed;

            variant = {
                id: productPartial.variants[0].id,
            }

            variant.sizes = metafields[0].value
                .split(',')
                .map(function (size) {
                    return size.trim();
                });

            for (i = 0; i < product.variants.length; i++) {
                if (product.variants[i].id === variant.id) {
                    variant.inventory_policy = product.variants[i].inventory_policy;
                    variant.inventory_quantity = product.variants[i].inventory_quantity;
                }
            }

            productCondensed = {
                id: productPartial.id,
                tags: product.tags,
                variants: [variant]
            };

            deferred.resolve(productCondensed);
        })
        .catch(function (err) {
            //console.error('Received error at creating productCondensed');
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
        next(null, productPartials);
    })
    .catch(function (err) {
        //console.error('Receiving error, sending to client');
        //console.error(JSON.stringify(err, null, 2));
        res.status(err.code);
        res.send(err.error);
        next(err, null);
    });
}

module.exports = ordersCreateHandler;

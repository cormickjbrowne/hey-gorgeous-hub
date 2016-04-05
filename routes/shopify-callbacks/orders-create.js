var Q = require('q');

var config = require('../../config.js');
var shopifyAPI = require('../../lib/shopify-api.js');
var shopify = shopifyAPI(config);
var utils = require('../../lib/utils.js');

function buildEmptyProductVariant (lineItem) {
    return {
        id: lineItem.product_id,
        variants: [
            {
                id: lineItem.variant_id
            }
        ]
    };
};

function loadDatafromShopify (product) {
    var deferred = Q.defer();

    options = {
        owner_resource: 'variant',
        owner_id: product.variants[0].id,
        namespace: 'Variant',
        key: 'sizes'
    };

    Q.all([
        shopify.getProduct(product.id),
        shopify.callShopify('get', ['metafields'], options)
    ])
    .spread(function (productData, metafieldsData) {

        variantsDataHashed = utils.hashArray(productData.variants);
        metafieldsDataHashed = utils.hashArray(metafieldsData, 'owner_id');

        product.tags = productData.tags;

        product.variants.forEach(function (variant) {
            var id = variant.id;

            variant.inventory_policy = variantsDataHashed[id].inventory_policy;
            variant.inventory_quantity = variantsDataHashed[id].inventory_quantity;

            if (!variant.metafields) { variant.metafields = []; }
            if (metafieldsDataHashed[id]) { variant.metafields.push(metafieldsDataHashed[id]); }
        });

        deferred.resolve(product);
    })
    .catch(function (err) {
        deferred.reject(err);
    });

    return deferred.promise;
}

function ordersCreateHandler (req, res, next) {
    var order, products;

    order = req.body;

    products = order.line_items
                .map(buildEmptyProductVariant)
                .map(loadDatafromShopify);

    Q.all(products)
    .then(function (products) {
        return Q.all(products
            .map(utils.removeSoldOutSizeTags)
            .map(function (product) {
                return shopify.putProduct(product.id, {
                    id: product.id,
                    tags: product.tags
                });
        }));
    })
    .then(function (products) {
        products = products.map(function (product) {
            return {
                id: product.id,
                tags: product.tags
            }
        });

        res.status(200);
        res.send(products);
    })
    .catch(function (err) {
        console.log(err);
        res.status(500);
        res.send(err);
    });
}

module.exports = ordersCreateHandler;

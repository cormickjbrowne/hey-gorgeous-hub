function isAvailable (variant) {
    return variant.inventory_quantity <= 0
        && variant.inventory_policy === 'deny';
}

function variantToVariantMetafields (variant) {
    console.log('variant:', variant);
    return variant.metafields;
}

function isSizesMetafield (metafield) {
    return metafield.namespace === 'Variant'
        && metafield.key === 'sizes';
}

function metafieldsToSizesMetafield (metafields) {
    return metafields.filter(isSizesMetafield);
}

function arrNotEmpty (arr) {
    return arr.length > 0;
}

function sizesMetafieldToSizeTags (metafield) {
    return metafield.value
        .split(',')
        .map(function (tag) {
            return tag.trim();
        })
        .map(function (tag) {
            return '{size:' + tag + '}';
        });
}

function mapVariantsToSizeTags (variants) {
    return variants
        .map(variantToVariantMetafields)
        .map(metafieldsToSizesMetafield)
        .reduce(function (agg, currArr) {
            if (currArr.length === 1) {
                agg.concat(currArr);
            }
            return agg;
        }, [])
        .map(sizesMetafieldToSizeTags)
        .reduce(function (agg, sizeTags) {
            return agg.concat(sizeTags);
        }, []);
}

exports.removeSoldOutSizeTags = function removeSoldOutSizeTags (product) {
    var sizeTagsToRemove;

    sizeTagsToRemove = mapVariantsToSizeTags(product.variants.filter(isAvailable))

    product.tags = product.tags
        .split(',')
        .map(function (tag) {
            return tag.trim();
        }).filter(function (tag) {
            return sizeTagsToRemove.indexOf(tag) === -1;
        });

    return product;
};

exports.removeAllSizeTags = function removeAllSizeTags (product) {
    var sizeTagsToRemove;

    sizeTagsToRemove = mapVariantsToSizeTags(product.variants);

    product.tags = product.tags
        .split(',')
        .map(function (tag) {
            return tag.trim();
        })
        .filter(function (tag) {
            return sizeTagsToRemove.indexOf(tag) === -1;
        })
        .join(', ');

    return product;
};

exports.addInStockSizeTags = function removeAllSizeTags (product) {
    var sizeTagsToAdd;

    sizeTagsToAdd = mapVariantsToSizeTags(product.variants.filter(isAvailable));

    product.tags = product.tags
        .split(',')
        .map(function (tag) {
            return tag.trim();
        })
        .concat(sizeTagsToAdd)
        .join(', ');

    return product;
};

exports.hashArray = function hashArray (arr, idPropName) {
    var hash = {};
    arr.forEach(function (el) {
        hash[ el[idPropName] || el.id ] = el;
    });
    return hash;
}

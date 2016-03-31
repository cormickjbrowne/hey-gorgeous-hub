var ShopifyObject = require('./data/shopify-object'),
    Product = ShopifyObject.Product,
    Variant = ShopifyObject.Variant,
    Order = ShopifyObject.Order,
    LineItem = ShopifyObject.LineItem,
    Metafield = ShopifyObject.Metafield;

var combinations, connect, connectNodes;

exports.combinations = combinations = function (variations, map) {
    if(!variations.length) {
        return [ map ];
    }

    return variations[0].options.reduce(function (agg, option, index, options) {
        var newMap, extension, key;

        newMap = extend(true, {}, map);

        extension = {};
        extension[variations[0].property] = option;

        key = variations[0].owner_key;
        extend(true, newMap[key], extension);

        return agg.concat(combinations(variations.slice(1), newMap));
    }, []);
};

exports.connect = connect = function (map, graph) {
    var n1, n2;

    for (node1 in graph._graph) {
        for (node2 in graph._graph[node1]) {
            n1 = map[node1];
            n2 = map[node2];
            connectNodes(n1, n2);
        }
    }

    return map;
};

connectNodes = function (n1, n2) {
    if (n1 instanceof Product && n2 instanceof Variant) {
        n1.variants.push(n2);
    } else if (n1 instanceof Product && n2 instanceof Metafield) {
        // Do nothing. Metafields point at Products.
    } else if (n1 instanceof Product && n2 instanceof LineItem) {
        // Do nothing. LineItems point at Products.
    } else if (n1 instanceof Variant && n2 instanceof Product) {
        n1.product_id = n2.id;
    } else if (n1 instanceof Variant && n2 instanceof Metafield) {
        // Do nothing. Metafields point at Variants.
    } else if (n1 instanceof Variant && n2 instanceof LineItem) {
        // Do nothing. LineItems point at Variants.
    } else if (n1 instanceof Metafield && n2 instanceof Product) {
        n1.owner_id = n2.id;
        n1.owner_resource = 'product';
    } else if (n1 instanceof Metafield && n2 instanceof Variant) {
        n1.owner_id = n2.id;
        n1.owner_resource = 'variant';
    } else if (n1 instanceof LineItem && n2 instanceof Order) {
        // Do nothing. Orders point at the LineItem.
    } else if (n1 instanceof LineItem && n2 instanceof Product) {
        n1.product_id = n2.id;
    } else if (n1 instanceof LineItem && n2 instanceof Variant) {
        n1.variant_id = n2.id;
    } else if (n1 instanceof Order && n2 instanceof LineItem) {
        n1.line_items.push(n2);
    }
};

var variations = [
    {
        "owner_key": "v1",
        "property": "inventory_policy",
        "options": ['continue', 'deny']
    },
    {
        "owner_key": "v1",
        "property": "inventory_quantity",
        "options": [1, -1, 0]
    },
    {
        "owner_key": "m1",
        "property": "value",
        "options": ['22', '22, 24']
    }
];

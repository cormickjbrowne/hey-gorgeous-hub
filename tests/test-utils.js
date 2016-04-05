"use strict";

var chai = require("chai");
chai.should();

var utils = require('../lib/utils');

describe('#removeAllSizeTags()', function () {
    it('it should remove all size tags', function () {
        var product, tags;

        product = {
            tags: '{size:12}, {size:14}, ShowOnHG',
            variants: [
                {
                    id: 6442490753,
                    inventory_policy: 'deny',
                    inventory_quantity: 1,
                    metafields: [
                        {
                            "id":19704969479,
                            "namespace":"Variant",
                            "key":"sizes",
                            "value":"12",
                            "value_type":"string",
                            "description":null,
                            "owner_id":6442490753,
                            "created_at":"2016-04-04T16:46:04-04:00",
                            "updated_at":"2016-04-04T16:46:04-04:00",
                            "owner_resource":"variant"
                        },
                        {
                            "id":16509199558,
                            "namespace":"Variant",
                            "key":"first_available",
                            "value":"2014-011-11T00:00:0-04:2104",
                            "value_type":"string",
                            "description":null,
                            "owner_id":6442490753,
                            "created_at":"2016-01-04T17:06:57-05:00",
                            "updated_at":"2016-03-22T11:47:00-04:00",
                            "owner_resource":"variant"
                        }
                    ]
                },
                {
                    id: 6442490754,
                    inventory_policy: 'deny',
                    inventory_quantity: 1,
                    metafields: [
                        {
                            "id":19704969480,
                            "namespace":"Variant",
                            "key":"sizes",
                            "value":"14",
                            "value_type":"string",
                            "description":null,
                            "owner_id":6442490754,
                            "created_at":"2016-04-04T16:46:04-04:00",
                            "updated_at":"2016-04-04T16:46:04-04:00",
                            "owner_resource":"variant"
                        }
                    ]
                },
                {
                    id: 6442490755,
                    inventory_policy: 'deny',
                    inventory_quantity: 1,
                    metafields: [
                        {
                            "id":16509199559,
                            "namespace":"Variant",
                            "key":"first_available",
                            "value":"2014-011-11T00:00:0-04:2104",
                            "value_type":"string",
                            "description":null,
                            "owner_id":6442490755,
                            "created_at":"2016-01-04T17:06:57-05:00",
                            "updated_at":"2016-03-22T11:47:00-04:00",
                            "owner_resource":"variant"
                        }
                    ]
                }
            ]
        };

        tags = utils.removeAllSizeTags(product).tags;
        tags.should.not.contain('{size:12}');
        tags.should.not.contain('{size:14}');
    })
});

describe('#addInStockSizeTags()', function () {
    it('it should all size tags for variants that are sellable', function () {
        var product, tags;

        product = {
            tags: 'ShowOnHG',
            variants: [
                {
                    id: 6442490753,
                    inventory_policy: 'deny',
                    inventory_quantity: 1,
                    metafields: [
                        {
                            "id":19704969479,
                            "namespace":"Variant",
                            "key":"sizes",
                            "value":"12",
                            "value_type":"string",
                            "description":null,
                            "owner_id":6442490753,
                            "created_at":"2016-04-04T16:46:04-04:00",
                            "updated_at":"2016-04-04T16:46:04-04:00",
                            "owner_resource":"variant"
                        },
                        {
                            "id":16509199558,
                            "namespace":"Variant",
                            "key":"first_available",
                            "value":"2014-011-11T00:00:0-04:2104",
                            "value_type":"string",
                            "description":null,
                            "owner_id":6442490753,
                            "created_at":"2016-01-04T17:06:57-05:00",
                            "updated_at":"2016-03-22T11:47:00-04:00",
                            "owner_resource":"variant"
                        }
                    ]
                },
                {
                    id: 6442490754,
                    inventory_policy: 'deny',
                    inventory_quantity: 1,
                    metafields: [
                        {
                            "id":19704969480,
                            "namespace":"Variant",
                            "key":"sizes",
                            "value":"14",
                            "value_type":"string",
                            "description":null,
                            "owner_id":6442490754,
                            "created_at":"2016-04-04T16:46:04-04:00",
                            "updated_at":"2016-04-04T16:46:04-04:00",
                            "owner_resource":"variant"
                        }
                    ]
                },
                {
                    id: 6442490755,
                    inventory_policy: 'deny',
                    inventory_quantity: 1,
                    metafields: [
                        {
                            "id":16509199559,
                            "namespace":"Variant",
                            "key":"first_available",
                            "value":"2014-011-11T00:00:0-04:2104",
                            "value_type":"string",
                            "description":null,
                            "owner_id":6442490755,
                            "created_at":"2016-01-04T17:06:57-05:00",
                            "updated_at":"2016-03-22T11:47:00-04:00",
                            "owner_resource":"variant"
                        }
                    ]
                }
            ]
        };

        tags = utils.addInStockSizeTags(product).tags;
        tags.should.contain('{size:12}');
        tags.should.contain('{size:14}');
    })
});

describe('#removeSoldOutSizeTags()', function () {
    it('it should remove size tags for variants that are not sellable', function () {
        var product, tags;

        product = {
            tags: '{size:12}, {size:14}, ShowOnHG',
            variants: [
                {
                    id: 6442490753,
                    inventory_policy: 'deny',
                    inventory_quantity: -1,
                    metafields: [
                        {
                            "id":19704969479,
                            "namespace":"Variant",
                            "key":"sizes",
                            "value":"12",
                            "value_type":"string",
                            "description":null,
                            "owner_id":6442490753,
                            "created_at":"2016-04-04T16:46:04-04:00",
                            "updated_at":"2016-04-04T16:46:04-04:00",
                            "owner_resource":"variant"
                        },
                        {
                            "id":16509199558,
                            "namespace":"Variant",
                            "key":"first_available",
                            "value":"2014-011-11T00:00:0-04:2104",
                            "value_type":"string",
                            "description":null,
                            "owner_id":6442490753,
                            "created_at":"2016-01-04T17:06:57-05:00",
                            "updated_at":"2016-03-22T11:47:00-04:00",
                            "owner_resource":"variant"
                        }
                    ]
                },
                {
                    id: 6442490754,
                    inventory_policy: 'deny',
                    inventory_quantity: 1,
                    metafields: [
                        {
                            "id":19704969480,
                            "namespace":"Variant",
                            "key":"sizes",
                            "value":"14",
                            "value_type":"string",
                            "description":null,
                            "owner_id":6442490754,
                            "created_at":"2016-04-04T16:46:04-04:00",
                            "updated_at":"2016-04-04T16:46:04-04:00",
                            "owner_resource":"variant"
                        }
                    ]
                },
                {
                    id: 6442490755,
                    inventory_policy: 'deny',
                    inventory_quantity: 1,
                    metafields: [
                        {
                            "id":16509199559,
                            "namespace":"Variant",
                            "key":"first_available",
                            "value":"2014-011-11T00:00:0-04:2104",
                            "value_type":"string",
                            "description":null,
                            "owner_id":6442490755,
                            "created_at":"2016-01-04T17:06:57-05:00",
                            "updated_at":"2016-03-22T11:47:00-04:00",
                            "owner_resource":"variant"
                        }
                    ]
                }
            ]
        };

        tags = utils.removeSoldOutSizeTags(product).tags;
        tags.should.not.contain('{size:12}');
        tags.should.contain('{size:14}');
    });
    it('it should handle case where no metafields exist', function () {
        var product, tags;

        product = {
            tags: '{size:12}, {size:14}, ShowOnHG',
            variants: [
                {
                    id: 6442490753,
                    inventory_policy: 'deny',
                    inventory_quantity: -1,
                    metafields: []
                },
                {
                    id: 6442490754,
                    inventory_policy: 'deny',
                    inventory_quantity: 1,
                    metafields: []
                },
                {
                    id: 6442490755,
                    inventory_policy: 'deny',
                    inventory_quantity: 1,
                    metafields: []
                }
            ]
        };

        tags = utils.removeSoldOutSizeTags(product).tags;
        tags.should.contain('{size:12}');
        tags.should.contain('{size:14}');
    });
    it('it should handle the case where all variants are sold out', function () {
        var product, tags;

        product = {
            tags: '{size:12}, {size:14}, ShowOnHG',
            variants: [
                {
                    id: 6442490755,
                    inventory_policy: 'deny',
                    inventory_quantity: 0,
                    metafields: [
                        {
                            "id":19704969480,
                            "namespace":"Variant",
                            "key":"sizes",
                            "value":"14",
                            "value_type":"string",
                            "description":null,
                            "owner_id":6442490754,
                            "created_at":"2016-04-04T16:46:04-04:00",
                            "updated_at":"2016-04-04T16:46:04-04:00",
                            "owner_resource":"variant"
                        }
                    ]
                }
            ]
        };

        tags = utils.removeSoldOutSizeTags(product).tags;
        tags.should.contain('{size:12}');
    })
});
describe('#hashArray', function () {
    it('it should be return an empty object if array is empty', function () {
        var result = utils.hashArray([]);
        console.log("result:", result);
        console.log("result[123]:", result[123]);
    });
});

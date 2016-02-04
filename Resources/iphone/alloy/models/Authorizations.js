var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        columns: {
            id: "INTEGER PRIMARY KEY",
            type: "String",
            name: "String",
            shareRequested: "Boolean",
            readRequested: "Boolean",
            shareEnabled: "Boolean",
            readEnabled: "Boolean"
        },
        adapter: {
            type: "properties",
            collection_name: "authorizations",
            idAttribute: "id"
        }
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {});
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {});
        return Collection;
    }
};

model = Alloy.M("authorizations", exports.definition, []);

collection = Alloy.C("authorizations", exports.definition, model);

exports.Model = model;

exports.Collection = collection;
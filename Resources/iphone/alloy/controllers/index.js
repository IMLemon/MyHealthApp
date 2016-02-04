function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function __alloyId19(e) {
        if (e && e.fromAdapter) return;
        __alloyId19.opts || {};
        var models = __alloyId18.models;
        var len = models.length;
        var rows = [];
        for (var i = 0; len > i; i++) {
            var __alloyId9 = models[i];
            __alloyId9.__transform = {};
            var __alloyId11 = Ti.UI.createTableViewRow({
                height: "40"
            });
            rows.push(__alloyId11);
            var __alloyId13 = Ti.UI.createLabel({
                width: "60%",
                height: Ti.UI.SIZE,
                color: "#000",
                font: {
                    fontSize: 20,
                    fontFamily: "Helvetica Neue"
                },
                textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
                text: "undefined" != typeof __alloyId9.__transform["name"] ? __alloyId9.__transform["name"] : __alloyId9.get("name"),
                left: "10"
            });
            __alloyId11.add(__alloyId13);
            var __alloyId15 = Ti.UI.createSwitch({
                left: "60%",
                auth_id: "undefined" != typeof __alloyId9.__transform["id"] ? __alloyId9.__transform["id"] : __alloyId9.get("id"),
                value: "undefined" != typeof __alloyId9.__transform["shareRequested"] ? __alloyId9.__transform["shareRequested"] : __alloyId9.get("shareRequested"),
                enabled: "undefined" != typeof __alloyId9.__transform["shareEnabled"] ? __alloyId9.__transform["shareEnabled"] : __alloyId9.get("shareEnabled")
            });
            __alloyId11.add(__alloyId15);
            shareChanged ? $.addListener(__alloyId15, "change", shareChanged) : __defers["__alloyId15!change!shareChanged"] = true;
            var __alloyId17 = Ti.UI.createSwitch({
                right: "5",
                auth_id: "undefined" != typeof __alloyId9.__transform["id"] ? __alloyId9.__transform["id"] : __alloyId9.get("id"),
                value: "undefined" != typeof __alloyId9.__transform["readRequested"] ? __alloyId9.__transform["readRequested"] : __alloyId9.get("readRequested"),
                enabled: "undefined" != typeof __alloyId9.__transform["readEnabled"] ? __alloyId9.__transform["readEnabled"] : __alloyId9.get("readEnabled")
            });
            __alloyId11.add(__alloyId17);
            readChanged ? $.addListener(__alloyId17, "change", readChanged) : __defers["__alloyId17!change!readChanged"] = true;
        }
        $.__views.__alloyId8.setData(rows);
    }
    function shareChanged(e) {
        var auth = Alloy.Collections.authorizations.get(e.source.auth_id);
        auth.set({
            shareRequested: e.source.value
        });
        auth.save();
    }
    function readChanged(e) {
        var auth = Alloy.Collections.authorizations.get(e.source.auth_id);
        auth.set({
            readRequested: e.source.value
        });
        auth.save();
    }
    function onRequestAuthClick() {
        var typesToShare = [], typesToRead = [];
        var types = Alloy.Collections.authorizations.where({
            shareRequested: true
        });
        types.forEach(function(type) {
            typesToShare.push(type.get("type"));
            type.set({
                shareEnabled: false
            });
            type.save();
        });
        var types = Alloy.Collections.authorizations.where({
            readRequested: true
        });
        types.forEach(function(type) {
            typesToRead.push(type.get("type"));
            type.set({
                readEnabled: false
            });
            type.save();
        });
        TiHealthkit.requestAuthorization({
            typesToRead: typesToRead,
            typesToShare: typesToShare,
            onCompletion: function(e) {
                e.success ? console.log("Do nothing!!") : alert("Failed to request authorizations!");
            }
        });
    }
    function onAddEventButtonClick() {
        switch ($.typePicker.getSelectedRow(0).title) {
          case "Running":
            type = TiHealthkit.WORKOUT_ACTIVITY_TYPE_RUNNING;
            break;

          case "Soccer":
            type = TiHealthkit.WORKOUT_ACTIVITY_TYPE_SOCCER;
            break;

          case "Tennis":
            type = TiHealthkit.WORKOUT_ACTIVITY_TYPE_TENNIS;
            break;

          case "Yoga":
            type = TiHealthkit.WORKOUT_ACTIVITY_TYPE_YOGA;
        }
        workout = TiHealthkit.createWorkout({
            type: type,
            startDate: $.startPicker.value,
            endDate: $.endPicker.value
        });
        TiHealthkit.saveObjects({
            objects: [ workout ],
            onCompletion: function(e) {
                e.success && console.log("Success!");
                if (type == TiHealthkit.WORKOUT_ACTIVITY_TYPE_RUNNING) {
                    sample = TiHealthkit.createQuantitySample({
                        type: TiHealthkit.OBJECT_TYPE_DISTANCE_WALKING_RUNNING,
                        quantity: TiHealthkit.createQuantity(10, TiHealthkit.createUnit("km")),
                        startDate: $.startPicker.value,
                        endDate: $.endPicker.value
                    });
                    TiHealthkit.addSamplesToWorkout({
                        samples: [ sample ],
                        workout: workout,
                        onCompletion: function(e) {
                            console.log(e.success ? "Adding of workout samples succeeded." : e);
                        }
                    });
                }
            }
        });
    }
    function bmiClick() {
        var observerQuery = TiHealthkit.createObserverQuery({
            type: TiHealthkit.OBJECT_TYPE_BODY_MASS_INDEX,
            onUpdate: function(e) {
                if (void 0 !== e.errorCode) {
                    console.log(e);
                    return;
                }
                retrieveSamples();
            }
        });
        TiHealthkit.executeQuery(observerQuery);
    }
    function retrieveSamples() {
        TiHealthkit.executeQuery(TiHealthkit.createAnchoredObjectQuery({
            type: TiHealthkit.OBJECT_TYPE_BODY_MASS_INDEX,
            anchor: anchor,
            onCompletion: function(e) {
                console.log("Retrieved " + e.results.length + " new entries.");
                if (0 === e.results.length && void 0 !== anchor) {
                    anchor = void 0;
                    retrieveSamples();
                } else {
                    anchor = e.anchor;
                    e.results.forEach(function(sample) {
                        var value = sample.quantity.valueForUnit(unit).toString();
                        $.bmi_label.text = "Latest BMI is " + value;
                    });
                }
            }
        }));
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    this.args = arguments[0] || {};
    if (arguments[0]) {
        {
            __processArg(arguments[0], "__parentSymbol");
        }
        {
            __processArg(arguments[0], "$model");
        }
        {
            __processArg(arguments[0], "__itemTemplate");
        }
    }
    var $ = this;
    var exports = {};
    var __defers = {};
    Alloy.Collections.instance("authorizations");
    var __alloyId2 = [];
    $.__views.__alloyId4 = Ti.UI.createWindow({
        backgroundColor: "#fff",
        title: "Authorizations",
        id: "__alloyId4"
    });
    $.__views.__alloyId5 = Ti.UI.createView({
        top: "0",
        height: "20",
        id: "__alloyId5"
    });
    $.__views.__alloyId4.add($.__views.__alloyId5);
    $.__views.__alloyId6 = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        font: {
            fontSize: 20,
            fontFamily: "Helvetica Neue"
        },
        textAlign: "center",
        text: "Share",
        left: "60%",
        id: "__alloyId6"
    });
    $.__views.__alloyId5.add($.__views.__alloyId6);
    $.__views.__alloyId7 = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        font: {
            fontSize: 20,
            fontFamily: "Helvetica Neue"
        },
        textAlign: "center",
        text: "Read",
        right: "5",
        id: "__alloyId7"
    });
    $.__views.__alloyId5.add($.__views.__alloyId7);
    $.__views.__alloyId8 = Ti.UI.createTableView({
        top: "20",
        bottom: "40",
        id: "__alloyId8"
    });
    $.__views.__alloyId4.add($.__views.__alloyId8);
    var __alloyId18 = Alloy.Collections["authorizations"] || authorizations;
    __alloyId18.on("fetch destroy change add remove reset", __alloyId19);
    $.__views.__alloyId20 = Ti.UI.createButton({
        title: "Request Authorization",
        bottom: "0",
        id: "__alloyId20"
    });
    $.__views.__alloyId4.add($.__views.__alloyId20);
    onRequestAuthClick ? $.addListener($.__views.__alloyId20, "click", onRequestAuthClick) : __defers["$.__views.__alloyId20!click!onRequestAuthClick"] = true;
    $.__views.__alloyId3 = Ti.UI.createTab({
        window: $.__views.__alloyId4,
        title: "Authorizations",
        icon: "KS_nav_ui.png",
        id: "__alloyId3"
    });
    __alloyId2.push($.__views.__alloyId3);
    $.__views.__alloyId22 = Ti.UI.createWindow({
        backgroundColor: "#fff",
        title: "Workout",
        layout: "vertical",
        id: "__alloyId22"
    });
    $.__views.__alloyId23 = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        font: {
            fontSize: 20,
            fontFamily: "Helvetica Neue"
        },
        textAlign: "center",
        text: "Choose workout type",
        id: "__alloyId23"
    });
    $.__views.__alloyId22.add($.__views.__alloyId23);
    $.__views.typePicker = Ti.UI.createPicker({
        id: "typePicker",
        selectionIndicator: "true",
        height: "200"
    });
    $.__views.__alloyId22.add($.__views.typePicker);
    var __alloyId24 = [];
    $.__views.__alloyId25 = Ti.UI.createPickerRow({
        title: "Running",
        id: "__alloyId25"
    });
    __alloyId24.push($.__views.__alloyId25);
    $.__views.__alloyId26 = Ti.UI.createPickerRow({
        title: "Soccer",
        id: "__alloyId26"
    });
    __alloyId24.push($.__views.__alloyId26);
    $.__views.__alloyId27 = Ti.UI.createPickerRow({
        title: "Tennis",
        id: "__alloyId27"
    });
    __alloyId24.push($.__views.__alloyId27);
    $.__views.__alloyId28 = Ti.UI.createPickerRow({
        title: "Yoga",
        id: "__alloyId28"
    });
    __alloyId24.push($.__views.__alloyId28);
    $.__views.typePicker.add(__alloyId24);
    $.__views.__alloyId29 = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        font: {
            fontSize: 20,
            fontFamily: "Helvetica Neue"
        },
        textAlign: "center",
        text: "Start Time",
        id: "__alloyId29"
    });
    $.__views.__alloyId22.add($.__views.__alloyId29);
    $.__views.startPicker = Ti.UI.createPicker({
        format24: false,
        calendarViewShown: false,
        id: "startPicker",
        selectionIndicator: "true",
        height: "100",
        type: Ti.UI.PICKER_TYPE_TIME
    });
    $.__views.__alloyId22.add($.__views.startPicker);
    $.__views.__alloyId30 = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        font: {
            fontSize: 20,
            fontFamily: "Helvetica Neue"
        },
        textAlign: "center",
        text: "End Time",
        id: "__alloyId30"
    });
    $.__views.__alloyId22.add($.__views.__alloyId30);
    $.__views.endPicker = Ti.UI.createPicker({
        format24: false,
        calendarViewShown: false,
        id: "endPicker",
        selectionIndicator: "true",
        top: "10",
        height: "100",
        type: Ti.UI.PICKER_TYPE_TIME
    });
    $.__views.__alloyId22.add($.__views.endPicker);
    $.__views.addEventButton = Ti.UI.createButton({
        id: "addEventButton",
        title: "Add Event",
        bottom: "10"
    });
    $.__views.__alloyId22.add($.__views.addEventButton);
    onAddEventButtonClick ? $.addListener($.__views.addEventButton, "click", onAddEventButtonClick) : __defers["$.__views.addEventButton!click!onAddEventButtonClick"] = true;
    $.__views.__alloyId21 = Ti.UI.createTab({
        window: $.__views.__alloyId22,
        title: "Workout",
        icon: "KS_nav_views.png",
        id: "__alloyId21"
    });
    __alloyId2.push($.__views.__alloyId21);
    $.__views.__alloyId32 = Ti.UI.createWindow({
        backgroundColor: "#fff",
        title: "BMI",
        id: "__alloyId32"
    });
    $.__views.__alloyId33 = Ti.UI.createButton({
        title: "Read latest BMI data",
        top: "100",
        id: "__alloyId33"
    });
    $.__views.__alloyId32.add($.__views.__alloyId33);
    bmiClick ? $.addListener($.__views.__alloyId33, "click", bmiClick) : __defers["$.__views.__alloyId33!click!bmiClick"] = true;
    $.__views.bmi_label = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        font: {
            fontSize: 20,
            fontFamily: "Helvetica Neue"
        },
        textAlign: "center",
        id: "bmi_label"
    });
    $.__views.__alloyId32.add($.__views.bmi_label);
    $.__views.__alloyId31 = Ti.UI.createTab({
        window: $.__views.__alloyId32,
        title: "BMI",
        icon: "KS_nav_views.png",
        id: "__alloyId31"
    });
    __alloyId2.push($.__views.__alloyId31);
    $.__views.index = Ti.UI.createTabGroup({
        tabs: __alloyId2,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    exports.destroy = function() {
        __alloyId18.off("fetch destroy change add remove reset", __alloyId19);
    };
    _.extend($, $.__views);
    $.index.open();
    Alloy.Collections.authorizations.create({
        id: 1,
        type: TiHealthkit.OBJECT_TYPE_BODY_FAT_PERCENTAGE,
        name: "Body Fat Percentage",
        shareRequested: false,
        readRequested: false,
        shareEnabled: true,
        readEnabled: true
    });
    Alloy.Collections.authorizations.create({
        id: 2,
        type: TiHealthkit.OBJECT_TYPE_BODY_MASS_INDEX,
        name: "Body Mass Index",
        shareRequested: false,
        readRequested: false,
        shareEnabled: true,
        readEnabled: true
    });
    Alloy.Collections.authorizations.create({
        id: 3,
        type: TiHealthkit.OBJECT_TYPE_WORKOUT,
        name: "Workout",
        shareRequested: false,
        readRequested: false,
        shareEnabled: true,
        readEnabled: true
    });
    Alloy.Collections.authorizations.create({
        id: 4,
        type: TiHealthkit.OBJECT_TYPE_DISTANCE_WALKING_RUNNING,
        name: "Distance Walking Running",
        shareRequested: false,
        readRequested: false,
        shareEnabled: true,
        readEnabled: true
    });
    var anchor = void 0;
    var unit = TiHealthkit.createUnit("count");
    __defers["__alloyId15!change!shareChanged"] && $.addListener(__alloyId15, "change", shareChanged);
    __defers["__alloyId17!change!readChanged"] && $.addListener(__alloyId17, "change", readChanged);
    __defers["$.__views.__alloyId20!click!onRequestAuthClick"] && $.addListener($.__views.__alloyId20, "click", onRequestAuthClick);
    __defers["$.__views.addEventButton!click!onAddEventButtonClick"] && $.addListener($.__views.addEventButton, "click", onAddEventButtonClick);
    __defers["$.__views.__alloyId33!click!bmiClick"] && $.addListener($.__views.__alloyId33, "click", bmiClick);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;
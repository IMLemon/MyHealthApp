$.index.open();
Alloy.Collections.authorizations.create({
    id : 1,
    type : TiHealthkit.OBJECT_TYPE_BODY_FAT_PERCENTAGE,
    name : 'Body Fat Percentage',
    shareRequested : false,
    readRequested : false,
    shareEnabled : true,
    readEnabled : true
});

Alloy.Collections.authorizations.create({
    id : 2,
    type : TiHealthkit.OBJECT_TYPE_BODY_MASS_INDEX,
    name : 'Body Mass Index',
    shareRequested : false,
    readRequested : false,
    shareEnabled : true,
    readEnabled : true
});

Alloy.Collections.authorizations.create({
    id : 3,
    type : TiHealthkit.OBJECT_TYPE_WORKOUT,
    name : 'Workout',
    shareRequested : false,
    readRequested : false,
    shareEnabled : true,
    readEnabled : true
});

Alloy.Collections.authorizations.create({
    id : 4,
    type : TiHealthkit.OBJECT_TYPE_DISTANCE_WALKING_RUNNING,
    name : 'Distance Walking Running',
    shareRequested : false,
    readRequested : false,
    shareEnabled : true,
    readEnabled : true
});
function shareChanged(e) {
    var auth = Alloy.Collections.authorizations.get(e.source.auth_id);
    auth.set({
        shareRequested : e.source.value
    });
    auth.save();
}

function readChanged(e) {
    var auth = Alloy.Collections.authorizations.get(e.source.auth_id);
    auth.set({
        readRequested : e.source.value
    });
    auth.save();
}
function onRequestAuthClick() {
    var typesToShare = [],
        typesToRead = [];

    var types = Alloy.Collections.authorizations.where({
        shareRequested : true
    });

    types.forEach(function(type) {
        typesToShare.push(type.get("type"));
        type.set({
            "shareEnabled" : false
        });
        type.save();
    });

    var types = Alloy.Collections.authorizations.where({
        readRequested : true
    });

    types.forEach(function(type) {
        typesToRead.push(type.get("type"));
        type.set({
            "readEnabled" : false
        });
        type.save();
    });

    TiHealthkit.requestAuthorization({
        typesToRead : typesToRead,
        typesToShare : typesToShare,

        onCompletion : function(e) {
            if (e.success) {
                console.log("Do nothing!!");
            } else {
                alert('Failed to request authorizations!');
            }
        }
    });
}
function onAddEventButtonClick() {

    switch ($.typePicker.getSelectedRow(0).title) {
    case "Running" :
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
        break;
    }

    workout = TiHealthkit.createWorkout({
        type : type,
        startDate : $.startPicker.value,
        endDate : $.endPicker.value
    });

    TiHealthkit.saveObjects({
        objects : [workout],
        onCompletion : function(e) {
            if (e.success)
                console.log("Success!");

            if (type == TiHealthkit.WORKOUT_ACTIVITY_TYPE_RUNNING) {
                sample = TiHealthkit.createQuantitySample({
                    type : TiHealthkit.OBJECT_TYPE_DISTANCE_WALKING_RUNNING,
                    quantity : TiHealthkit.createQuantity(10, TiHealthkit.createUnit('km')),
                    startDate : $.startPicker.value,
                    endDate : $.endPicker.value
                });

                TiHealthkit.addSamplesToWorkout({
                    samples : [sample],
                    workout : workout,
                    onCompletion : function(e) {
                        if (e.success) {
                            console.log('Adding of workout samples succeeded.');
                        } else {
                            console.log(e);
                        }
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
                
            if (e.errorCode !== undefined) {
                console.log(e);
                return;
            }
     
            retrieveSamples();
        }
    });

    TiHealthkit.executeQuery(observerQuery);
}
var anchor = undefined;
var unit = TiHealthkit.createUnit('count');

function retrieveSamples() {
    TiHealthkit.executeQuery(TiHealthkit.createAnchoredObjectQuery({
        type: TiHealthkit.OBJECT_TYPE_BODY_MASS_INDEX,
        // Anchor will be undefined the first time around, which means all
        // the entries up to that point will be returned.
        anchor: anchor,
        onCompletion: function(e) {
            console.log('Retrieved ' + e.results.length + ' new entries.');
            
            if (e.results.length === 0 && anchor !== undefined) {
                // No new entry -- this means the update is due to a
                // deletion. We'll have to query all the entries again
                // by resetting the anchor. 
                anchor = undefined;
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
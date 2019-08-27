var express = require('express');
var router = express.Router();

var Activity = require('../models/activity');
var ActivityTag = require('../models/activityTag');
var Tag = require('../models/tag');

// Create new Activity
router.post('/create', function(req, res) {
    var description = req.body.description;
    var tags = req.body.tags.split(',');
    
    for (var i = tags.length - 1; i >= 0; i--) {
        tags[i] = tags[i].trim();
    };

    // Validation
    req.checkBody('description', 'Description is required').notEmpty();

    var errors = req.validationErrors();

    if(errors){
        res.render('index', {
            errors: errors
        });
    } else {
        var newActivity = {
            description: description,
            userId: req.user.id
        };

        Tag.createNewAndFindTagsByName(tags, function(err, persistedTags){
            if(err) throw err;

            Activity.createActivity(newActivity, function(err, activity) {
                if(err) throw err;

                ActivityTag.createActivityTagAssociations(activity, persistedTags, function(err, activityTags) {
                    if(err) throw err;
                    console.log('Successfully create Activity and Tags');
                    
                    req.flash('success_msg', 'Your activity has been created');

                    res.redirect('back');
                });
            });
        });
    }
});

module.exports = router;
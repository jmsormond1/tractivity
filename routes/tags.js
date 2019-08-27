var express = require('express');
var router = express.Router();
var utilities = require('./utilities');

var Tag = require('../models/tag');
var Activity = require('../models/activity');

router.get('/:tagId', function(req, res) {
    Tag.getTagById(req.params.tagId, function(err, tag) {
        if(err) throw err;

        Activity.getActivitiesByUserIdAndTagName(req.user.id, tag.name, function(err, activities) {
            if(err) throw err;
            var orderedActivities = utilities.groupActivitiesByDate(activities);
            res.render('tag', {tag: tag, days: orderedActivities});
        });
    });
});

router.post('/:tagId/update', function(req, res) {
    var name = req.body.name;
    var description = req.body.description;
    var id = req.params.tagId;

    // Validation
    req.checkBody('name', 'Name is required').notEmpty();

    var errors = req.validationErrors();

    if(errors){
        res.render('tag', {
            errors: errors
        });
    } else {
        var tag = {
            name: name,
            description: description,
            id: id
        };

        Tag.updateTag(tag, function(err, updatedTag) {
            if(err) throw err;

            Activity.getActivitiesByUserIdAndTagName(req.user.id, updatedTag.name, function(err, activities) {
                if(err) throw err;

                req.flash('success_msg', 'You succesfully update this tag');

                res.redirect('/tags/' + updatedTag.id);
            });
        })
    }
});

module.exports = router;
var express = require('express');
var router = express.Router();
var utilities = require('./utilities');

var Activity = require('../models/activity');

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
    Activity.getActivitiesByUserId(req.user.id, function(err, activities){
        var orderedActivities = utilities.groupActivitiesByDate(activities);
        res.render('index', {days: orderedActivities});
    });
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('error_msg', 'You are not logged in');
        res.redirect('/users/login');
    }
}

module.exports = router;
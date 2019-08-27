module.exports.groupActivitiesByDate = function(activities) {
    var orderedActivities = [];
    var currentDateArray = [];
    for (var i = activities.length - 1; i >= 0; i--) {
        var activity = activities[i];
        if (currentDateArray.length == 0) {
            currentDateArray.push(activity);
        } else {
            if (currentDateArray[0].formatted_date == activity.formatted_date) {
                currentDateArray.push(activity);
            } else {
                orderedActivities.push(currentDateArray);
                currentDateArray = [activity];
            }
        }
    };
    if (currentDateArray.length > 0) {
        orderedActivities.push(currentDateArray);
    }
    return orderedActivities.reverse();
}
var pg = require('pg');

var config = {
    user: 'james',
    database: 'tractivity',
    password: 'Trapnumber2!',
    port: 5432
};
var pool = new pg.Pool(config);

module.exports.createActivityTagAssociations = function(activity, tags, callback) {
    // PG Connect
    pool.connect(function(err, client, done) {
        if(err) {
            callback(err);
        }
        
        var sqlNames = "";
        for (var i = tags.length - 1; i >= 0; i--) {
            sqlNames += "(" + activity.id + ", " + tags[i].id + "), ";
        };
        sqlNames = sqlNames.slice(0, -2);

        client.query('INSERT INTO public.activity_tag(activity_id, tag_id) VALUES ' + sqlNames, [], function(err, result){
            if(err) callback(err);
            callback(null, result.rows);
            done();
        });
    });
}
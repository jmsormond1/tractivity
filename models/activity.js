var pg = require('pg');

var config = {
    user: 'james',
    database: 'tractivity',
    password: 'Trapnumber2!',
    port: 5432
};
var pool = new pg.Pool(config);

module.exports.createActivity = function(newActivity, callback) {
    // PG Connect
    pool.connect(function(err, client, done) {
        if(err) {
            callback(err);
        }
        client.query("INSERT INTO public.activity(description, user_id) VALUES($1, $2) RETURNING *", [newActivity.description, newActivity.userId], function(err, result){
            if(err) {
                callback(err);
            } else {
                callback(null, result.rows[0]);
            }
            done();
        });
    });
}

module.exports.getActivitiesByUserId = function(userId, callback) {
    // PG Connect
    pool.connect(function(err, client, done) {
        if(err) {
            callback(err);
        }
        var query = "SELECT id, a.date, to_char(a.date, 'MON DD, YYYY') as formatted_date, a.description, t.tag_array " +
                    "FROM public.activity a " +
                    "LEFT JOIN ( " +
                    "   SELECT at.activity_id AS id, array_to_json(array_agg(t)) AS tag_array " +
                    "   FROM public.activity_tag at " +
                    "   JOIN public.tag t " +
                    "   ON t.id = at.tag_id " +
                    "   GROUP BY at.activity_id " +
                    ") t USING (id) " +
                    "WHERE a.user_id = $1 " +
                    "ORDER BY a.date DESC";
        client.query(query, [userId], function(err, result){
            if(err) {
                callback(err);
            } else {
                callback(null, result.rows)
            }
            done();
        });
    });
}

module.exports.getActivitiesByUserIdAndTagName = function(userId, tagName, callback) {
    // PG Connect
    pool.connect(function(err, client, done) {
        if(err) {
            callback(err);
        }
        var query = "SELECT id, a.date, to_char(a.date, 'MON DD, YYYY') as formatted_date, a.description, t.tag_array " +
                    "FROM public.activity a " +
                    "LEFT JOIN ( " +
                    "   SELECT at.activity_id AS id, array_to_json(array_agg(t)) AS tag_array, array_agg(t.name) AS tag_name_array " +
                    "   FROM public.activity_tag at " +
                    "   JOIN public.tag t " +
                    "   ON t.id = at.tag_id " +
                    "   GROUP BY at.activity_id " +
                    ") t USING (id) " +
                    "WHERE a.user_id = $1 " +
                    "AND $2 = ANY(t.tag_name_array) " +
                    "ORDER BY a.date DESC";
        client.query(query, [userId, tagName], function(err, result){
            if(err) {
                callback(err);
            } else {
                callback(null, result.rows)
            }
            done();
        });
    });
}
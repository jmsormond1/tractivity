var pg = require('pg');

var config = {
    user: 'james',
    database: 'tractivity',
    password: 'Trapnumber2!',
    port: 5432
};
var pool = new pg.Pool(config);

module.exports.createNewAndFindTagsByName = function(names, callback) {
    // PG Connect
    pool.connect(function(err, client, done) {
        if(err) {
            callback(err);
        }
        var sqlNames = "";
        for (var i = names.length - 1; i >= 0; i--) {
            sqlNames += "($" + (i + 1) + "), ";
        };
        sqlNames = sqlNames.slice(0, -2);

        client.query('INSERT INTO public.tag(name) VALUES ' + sqlNames + ' ON CONFLICT(name) DO UPDATE SET name=EXCLUDED.name RETURNING *', names, function(err, result){
            if(err) callback(err);
            callback(null, result.rows);
            done();
        });
    });
}

module.exports.getTagById = function(id, callback) {
    // PG Connect
    pool.connect(function(err, client, done) {
        if(err) {
            callback(err);
        }

        client.query('SELECT * FROM public.tag WHERE id = $1 LIMIT 1', [id], function(err, result){
            if(err) callback(err);
            if(result.rows.count == 0) callback('Tag does not exist');
            callback(null, result.rows[0]);
            done();
        });
    });
}

module.exports.updateTag = function(tag, callback) {
    // PG Connect
    pool.connect(function(err, client, done) {
        if(err) {
            callback(err);
        }

        client.query('UPDATE public.tag SET name = $1, description = $2 WHERE id = $3 RETURNING *', [tag.name, tag.description, tag.id], function(err, result){
            if(err) callback(err);
            if(result.rows.count == 0) callback('Tag does not exist');
            callback(null, result.rows[0]);
            done();
        });
    });
}
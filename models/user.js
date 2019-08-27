var bcrypt = require('bcryptjs');
var pg = require('pg');

var config = {
    user: 'james',
    database: 'tractivity',
    password: 'Trapnumber2!',
    port: 5432
};
var pool = new pg.Pool(config);

module.exports.createUser = function(newUser, callback) {
    bcrypt.genSalt(10, function(err, salt) { 
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;

            // PG Connect
            pool.connect(function(err, client, done) {
                if(err) {
                    callback(err);
                }
                client.query("INSERT INTO public.user(username, password, name, email) VALUES($1, $2, $3, $4)", [newUser.username, newUser.password, newUser.name, newUser.email], function(err, result){
                    if(err) {
                        callback(err);
                    } else {
                        callback(null, result)
                    }
                    done();
                });
            });
        });
    });
}

module.exports.getUserByUsername = function(username, callback) {
    // PG Connect
    pool.connect(function(err, client, done) {
        if(err) {
            callback(err);
        }
        client.query('SELECT * FROM public.user WHERE username = $1 LIMIT 1', [username], function(err, result){
            if(err) callback(err);
            if(result.rows.count == 0) callback("User does not exist");
            callback(null, result.rows[0]);
            done();
        });
    });
}

module.exports.getUserById = function(id, callback) {
    // PG Connect
    pool.connect(function(err, client, done) {
        if(err) {
            callback(err);
        }
        client.query('SELECT * FROM public.user WHERE id = $1 LIMIT 1', [id], function(err, result){
            if(err) callback(err);
            if(result.rows.count == 0) callback("User does not exist");
            callback(null, result.rows[0]);
            done();
        });
    });
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
}
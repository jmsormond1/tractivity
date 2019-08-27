var express = require('express'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    exphbs = require('express-handlebars'),
    expressValidator = require('express-validator'),
    flash = require('connect-flash'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStategy = require('passport-local').Strategy,
    cons = require('consolidate'),
    dust = require('dustjs-helpers'),
    pg = require('pg'),
    app = express();

var routes = require('./routes/index');
var users = require('./routes/users');
var activities = require('./routes/activities');
var tags = require('./routes/tags');

// DB Connect String
var config = {
    user: 'james',
    database: 'tractivity',
    password: 'Trapnumber2!',
    port: 5432
};
var connect = "postgres://james:Trapnumber2!@loaclhost/tractivity";
var pool = new pg.Pool(config);

// Assign Dust Engine To .dust Files
app.engine('dust', cons.dust);

// Set Default Ext .dust
// app.set('view engine', 'dust');
app.set('views', __dirname + '/views');
app.engine('handlebars', exphbs({defaultLayout: 'layout', partialsDir: __dirname + '/views/partials'}));
app.set('view engine', 'handlebars');

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value){
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/activities', activities);
app.use('/tags', tags);

// app.get('/', function(req, res){
//     // PG Connect
//     pool.connect(function(err, client, done) {
//         if(err) {
//             return console.error('error fetching client from pool', err);
//         }
//         client.query('SELECT * FROM activity', [], function(err, result){
//             if(err) {
//                 return console.error('error running query', err);
//             }
//             res.render('index', {activities: result.rows});
//             done();
//         });
//     });
// });

// app.post('/add', function(req, res){
//     // PG Connect
//     pool.connect(function(err, client, done) {
//         if(err) {
//             return console.error('error fetching client from pool', err);
//         }
//         client.query("INSERT INTO activity(description) VALUES($1)", [req.body.description]);
//         done();
//         res.redirect('/');
//     });
// });

// app.delete('/delete/:id', function(req, res){
//     // PG Connect
//     pool.connect(function(err, client, done) {
//         if(err) {
//             return console.error('error fetching client from pool', err);
//         }
//         client.query("DELETE FROM activity WHERE id = $1", [req.params.id]);
//         done();
//         res.sendStatus(200);
//     });
// });

// app.post('/edit', function(req, res) {
//     // PG Connect
//     pool.connect(function(err, client, done) {
//         if(err) {
//             return console.error('error fetching client from pool', err);
//         }
//         client.query("UPDATE activity SET description = $1 WHERE id = $2", [req.body.description, req.body.id]);
//         done();
//         res.redirect('/');
//     });
// });

// Set Port
app.set('port', (process.env.PORT || 3000));

// Server
app.listen(app.get('port'), function(){
    console.log('Server Started On Port ' + app.get('port'));
});

var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var sequelize = require('sequelize');
var passport = require('passport');
var jwt = require('jsonwebtoken');

var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');

// App related modules
var hookJWTStrategy = require('./services/passportStrategy');

// Initializations
var app = express();

// Parse as urlencoded and json.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Hook up the HTTP logger
app.use(morgan('dev'));

// Hook up Passport.js
app.use(passport.initialize());

// Hook the passport JWT strategy
hookJWTStrategy(passport);

// Set the static files location
// app.use(express.static(path.join(__dirname, 'public')));

// Add cookie parser middleware
app.use(cookieParser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// enable CORS from any (*)
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.use('/api', require('./routes/api')(passport));
app.use('/sandbox', require('./routes/sandbox'));
//can replace with app.get('/', func..);
// app.get('*', function(req, res) {
//   res.sendFile(path.join(__dirname, '../client/build/', 'index.html'));
// });

// serve react app
app.use(express.static("client/build"));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err.message);
  res.render('error');
});

module.exports = app;

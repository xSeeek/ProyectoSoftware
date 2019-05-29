var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cargosRouter = require('./routes/cargos');
var rolesRouter = require('./routes/roles');
var areasRouter = require('./routes/areas');
var beneficiosRouter = require('./routes/beneficios');
var noticiasRouter = require('./routes/noticias');

var app = express();

/**
 * Cors
 */
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json({
  type:"application/json"
}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Headers Accept
 */
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.disable('x-powered-by');

app.use('/api', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/cargos', cargosRouter);
app.use('/api/roles', rolesRouter);
app.use('/api/areas', areasRouter);
app.use('/api/beneficios', beneficiosRouter);
app.use('/api/noticias', noticiasRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

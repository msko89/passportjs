const createError = require('http-errors');
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const configureSession = require('./config/session');
configureSession(app);

const configurePassport = require('./config/passport');
configurePassport(app);

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);

const passport = require('passport');
app.get(
  '/oauth',
  passport.authenticate('kakao', {
    failureRedirect: '#!/login',
  }),
  function (request, response, done) {
    console.log(request.user);

    // let user = {
    //   name: profile.username,
    //   username: profile.id,
    //   roles: ['authenticated'],
    //   provider: 'kakao',
    //   kakao: profile._json,
    // };

    // console.log('user', user);
    // // User.findOrCreate(..., (err, user) => {
    // //   if (err) { return done(err) }
    // return done(null, request.user);
  }
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

const session = require('express-session');
require('dotenv').config();

module.exports = (app) => {
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      cookie: { maxAge: 60 * 60 * 1000 },
      resave: false,
      saveUninitialized: true,
    })
  );
};

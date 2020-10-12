module.exports = function (app) {
  const passport = require('passport');
  const KakaoStrategy = require('passport-kakao').Strategy;

  require('dotenv').config();

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function (user, done) {
    console.log('serializeUser', user);
    done(null, user.username);
  });

  passport.deserializeUser(function (id, done) {
    console.log('deserializeUser', id);
    done(null, id);
  });

  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_CLINET_ID,
        clientSecret: process.env.KAKAO_CLIENT_SECRET,
        callbackURL: process.env.KAKAO_CALLBACK,
      },
      (accessToken, refreshToken, profile, done) => {
        let user = {
          name: profile.username,
          username: profile.id,
          roles: ['authenticated'],
          provider: 'kakao',
          kakao: profile._json,
        };

        console.log('user', user);
        // User.findOrCreate(..., (err, user) => {
        //   if (err) { return done(err) }
        return done(null, user);
        // })
      }
    )
  );
  return passport;
};

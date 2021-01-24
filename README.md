# passportjs
oauth integration with passport.js

const passport = require('passport');
const passportJwt = require('passport-jwt');
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const config = require('./index');
const UserModel = require('../models/User');

module.exports = () => {
  // serialize & deserialize User
  // serialize - 로그인 성공 시, 한번만 호출. 세션에 user 정보 저장(req.session.passport.user)
  passport.serializeUser((user, done) => {
    //user 정보 세션에 저장
    done(null, user);
  });

  // deserializeUser - 클라이언트 측에서 다른 요청이 있을 때, 세션에 담긴 유저 정보를 다시 알려주는 역할
  // 정상적으로 deserializeUser 작동 시, req.isAuthenticated() true 반환. req.user 객체 생성
  passport.deserializeUser(async (user, done) => {
    if (await UserModel.findById({ _id: user._id })) {
      done(null, user);
    } else {
      done(null, false);
    }
  });

  /**
   * Local Strategy
   */
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      (email, password, done) => {
        return UserModal.findOne({ where: { email, password } })
          .then((user) => {
            if (!user) {
              return done(null, false, { message: 'Incorrect email or password' });
            }
            return done(null, user, { message: 'Login Successfully' });
          })
          .catch((err) => done(err));
      }
    )
  );

  /**
   * JWT Strategy
   */
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'jwt-secret-123',
      },
      (payload, done) => {
        return UserModel.findOneById(payload.id)
          .then((user) => {
            return done(null, user);
          })
          .catch((err) => {
            return done(err);
          });
      }
    )
  );
};


--------------------------------------------------------------------------------------------------------------------------

export const userLogin = async (req, res, next) => {
  //passport-local 인증 시도
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(500).json({ ...info, success: false });

    // customCallback 사용시 req.logIn()메서드 필수
    // 로그인에 성공한 경우, passport에서 user정보를 session에 저장하고 req.user으로 접근 가능
    // customCallback에서는 user 인자와 req.user와 동일
    req.logIn(user, function (err) {
      if (err) return next(err);

      return res.status(200).send({ success: true });
    });
  })(req, res, next);
};

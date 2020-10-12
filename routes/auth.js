const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/kakao', passport.authenticate('kakao'), (request, response) => {
  console.log('auth kakao callback');
});

router.get('/oauth', passport.authenticate('kakao'));

module.exports = router;

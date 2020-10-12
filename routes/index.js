var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.user) {
    res.send(`
        <h3>Login Success</h3>
        <a href="/auth/logout">Logout</a>
        <p>
            ${JSON.stringify(req.user, null, 2)}
        </p>
      `);
  } else {
    res.send(`
        <h3>Node Passport Social Login</h3>
        <a href="/auth/google">Login with Google+</a>
        <a href="/auth/facebook">Login with Facebook</a>
        <a href="/auth/naver">Login with Naver</a>
        <a href="/auth/kakao">Login with Kakao</a>
    `);
  }
});

module.exports = router;

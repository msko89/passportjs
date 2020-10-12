var express = require('express');
var router = express.Router();
/* GET users listing. */
router.get('/', function (req, res, next) {
  const data = {
    userName: 'msko',
    email: 'msko@mcnc.co.kr',
  };

  res.json(data);
});

module.exports = router;

var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  var data = {
    person: {
      name: "Caleb",
      other: "confused"
    }
  };
  res.render('template', data);
});

module.exports = router;
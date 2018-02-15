var express = require('express');
var mongojs = require('mongojs');
var dbconfig = require('../config/dbconfig.js');

// add mongo database

///CURRENT WORKING AREA
var db = mongojs(dbconfig.username + ":" + dbconfig.password + "@ds021989.mlab.com/mr-worldwide", ["guessTable"]);
var router = express.Router();

db.on('error', function(err) {
  console.log('database error', err)
})

db.on('connect', function() {
  console.log('database connected')
})

router.post('/', function(req, res, next) {
  db.guessTable.save({
    "attribute_to_save": "value_to_save"
  }, function(err, saved) {
    if (err || !saved) console.log("Not saved");
    else console.log("Saved");
  });
  var data = {
    person: {
      name: "Caleb",
      other: dbconfig.username
    }
  };
  res.render('results', data);
});

router.get('/', function(req, res, next) {
  var data = {
    person: {
      name: "Caleb",
      other: "less confusted than before"
    }
  };
  res.render('results', data);
});

module.exports = router;
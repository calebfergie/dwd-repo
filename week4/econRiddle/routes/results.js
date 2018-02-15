var express = require('express');
var fs = require('fs');
var mongojs = require('mongojs');
var dbconfig = require('../config/dbconfig.js');
var responseList = [];

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

router.post('/', function(request, respond, next) {
  var textValue = request.body.submitted_answer;

  //visual confirmation
  console.log("A user just submitted: " + textValue);

  // Add responses to csv file
  var fileAddition = numberValue + ","
  filePath = __dirname + 'data.csv';
  fs.appendFile(filePath, fileAddition, function(err) {
    if (err) throw err;
  });

  // define the new average that includes the new submission
  var numberValue = parseInt(textValue);
  responseList.push(numberValue);
  console.log(textValue + "added to the list of responses");
  var subTotal = 0;
  for (i = 0; i < responseList.length; i++) {
    subTotal = subTotal + responseList[i];
  }
  console.log("Subtotal: " + subTotal);
  var average = subTotal / responseList.length;
  console.log("The current average is: " + average);
  var data = {
    answer: {
      submission: textValue,
      avg: average
    }
  }
  respond.render('results', data);
  respond.end();

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
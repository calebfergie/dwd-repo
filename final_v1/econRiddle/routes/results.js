var express = require('express');
var fs = require('fs');
var mongojs = require('mongojs');
var dbconfig = require('../config/dbconfig.js');
var responseList = [];
var dataSet = [];
var tempSet = [];

//Setup
var db = mongojs(dbconfig.username + ":" + dbconfig.password + "@ds239128.mlab.com:39128/mr-worldwide", ["guessTable"]);
var router = express.Router();

//Confirm database is connected
db.on('error', function(err) {
  console.log('database error', err)
})
db.on('connect', function() {
  console.log('database connected')
})

//Copy a version of the whole db as "responseList" and "dataset" as the array of guesses
db.guessTable.find({}, function(err, saved) {
  if (err || !saved) {
    console.log("No results");
  } else {
    saved.forEach(function(record) {
      responseList.push(record);
    });
    for (i = 0; i < responseList.length; i++) {
      dataSet.push(responseList[i].guess);
    };
    console.log("DB Contains: " + dataSet);
  }

});

//Act when a POST request occurs
router.post('/', function(request, respond, next) {

  // Process the data the user submitted
  var textValue = request.body.submitted_answer;
  var numberValue = parseInt(textValue);
  console.log("A user just submitted: " + numberValue);

  //Check to see if the user has been here before with COOKIES YUM
  var visits = 1;
  if (request.cookies.visits) {
    visits = Number(request.cookies.visits) + 1;
  }
  if (visits > 1) {
    repeatVisit = "yes";
  } else {
    repeatVisit = "no"
  }
  respond.cookie('visits', visits, {}); // Set the new or updated cookie
  var userInfo = {
    repeatVisitor: repeatVisit
  };

  // skip the submission if its the same cookie, otherwise add it to the db
  // if (userInfo.repeatVisitor === "yes") {
  //   var submission = "an answer already!";
  // } else {
  console.log(textValue + " added to the list of responses");
  var submission = numberValue;

  //add it the the local array
  dataSet.push(numberValue);

  // add repsonse to the database
  db.guessTable.save({
    "guess": numberValue,
    "time": "tbd"
  }, function(err, saved) {
    if (err || !saved) console.log("Not saved");
    else console.log("Saved");
  });
  // }

  //DO MATHS
  //    1. GET THE MEAN
  var subTotal = 0;
  for (i = 0; i < dataSet.length; i++) {
    subTotal = subTotal + dataSet[i];
  }
  var average = (subTotal / dataSet.length).toFixed(1);
  console.log("average: " + average);

  //    2. GET THE MEDIAN -  thx caseyjustus: https://gist.github.com/caseyjustus/1166258
  dataSet.sort(function(a, b) {
    return a - b
  });



  var half = Math.floor(dataSet.length / 2);

  if (dataSet.length % 2 === 0) {
    var median = dataSet[half]
    console.log("single median: " + median + ", the" + half + "th/rd value in the array");
  } else {
    median = (dataSet[half - 1] + dataSet[half]) / 2;
    console.log("split median: " + median + ", the " + half + "th/rd value in the array");
  }

  //    3. determine the percentile
  var tempData = []

  ///compare distance of all items to median
  for (i = 0; i < dataSet.length; i++) {
    var dist = Math.abs(dataSet[i] - median);
    tempData.push([dataSet[i], dist]);
  }

  // determine which position the submitted value is in
  var subPos = dataSet.indexOf(numberValue);

  // create counters
  var farther = 0;
  var equal = 0;
  var closer = 0;

  // compare the values
  for (i = 0; i < tempData.length; i++) {
    if (tempData[subPos][1] < tempData[i][1]) {
      farther = farther + 1;
    } else if (tempData[subPos][1] == tempData[i][1]) {
      equal = equal + 1;
    } else {
      closer = closer + 1;
    }
  }
  console.log(farther + " numbers farther from the med, " + equal + " numbers equally close to it, " + closer + " numbers even closer to it");

  var percentage = ((farther / dataSet.length) * 100).toFixed(1);

  ///END MATH

  //pack it up 4 rendering
  var data = {
    sub: submission,
    avg: average,
    per: percentage
  }

  respond.render('results', data);
  respond.end();
});

// Just in case someone does a GET request,  do nothing
router.get('/', function(req, res, next) {
  console.log("why GET request tho?");
});

module.exports = router;
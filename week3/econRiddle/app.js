// made with the help of stack overflow, google, and especially DWD class notes: https://itp.nyu.edu/~sve204/dwd_spring2018/ and mozilla https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/skeleton_website

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs')
var url = require('url'); //necessary?

var index = require('./routes/index');
var users = require('./routes/users');

var responseList = [];

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

app.post('/process-response', function(request, respond) {
  var textValue = request.body.submitted_answer;

  //visual confirmation
  console.log("A user just submitted: " + textValue);

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


  // Add responses to csv file
  var fileAddition = numberValue + ","
  filePath = __dirname + '/public/data.csv';
  fs.appendFile(filePath, fileAddition, function(err) {
    if (err) throw err;
  });
  respond.send("You submitted: " + textValue + "    |     Thanks for participating.     |     The current average is: " + average);
  respond.end();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
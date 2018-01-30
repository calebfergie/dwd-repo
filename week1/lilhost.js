/* modified from https://itp.nyu.edu/~sve204/dwd_spring2018/node_vps_basics.html */

// HTTP Portion
var http = require('http');
var fs = require('fs'); // Using the filesystem module
var lilserv = http.createServer(requestHandler);
var url = require('url');


function requestHandler(req, res) {

	var parsedUrl = url.parse(req.url);
	console.log("The Request is: " + parsedUrl.pathname);
		
	fs.readFile(__dirname + parsedUrl.pathname, 
		// Callback function for reading
		function (err, data) {
			// if there is an error
			if (err) {
				res.writeHead(500);
				return res.end('Error loading ' + parsedUrl.pathname);
			}
			// Otherwise, send the data, the contents of the file
			res.writeHead(200);
			res.end(data);
  		}
  	);
}

/* var submissionButton
submitButton.addEventListener('click', logSubmission);
{
   submissionButton = document.getElementById('submitButton');
}*/

function init() {
	submissionButton = document.getElementById('submitButton');
    alert(submissionButton.innerHTML);
}
window.addEventListener('load', init);	

lilserv.listen(8080);
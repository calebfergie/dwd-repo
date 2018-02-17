HELP! I can't seem to connect to the DB with mongoJS. When I use:

var db = mongojs(dbconfig.username + ":" + dbconfig.password + "@ds021989.mlab.com:021989/mr-worldwide", ["guessTable"]);

... I get an authentication error. Alternatively, when I use:

var db = mongojs(dbconfig.username + ":" + dbconfig.password + "@ds021989.mlab.com/mr-worldwide", ["guessTable"]);

...  it hangs for a little bit, then I get the following error "...database error { MongoError: failed to connect to server..."


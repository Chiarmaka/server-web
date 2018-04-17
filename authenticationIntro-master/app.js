var express = require('express');
var app = new express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var router = express.Router();
var logger = require('morgan');
var http = require("http").Server(app);
var io = require("socket.io")(http);

//connect to MongoDB
mongoose.connect('mongodb://localhost/testForAuth');
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));


// serve static files from template
app.use(express.static(__dirname + '/templateLogReg'));

// include routes
var routes = require('./routes/router');
app.use('/', routes);

require('./routes/routes')(router);
app.use('/api/v1', router);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

var Log = require('log'),
log = new Log('debug')

var port = process.env.PORT || 3000;

io.on('connection',function(socket){
  socket.on('stream',function(image){
      socket.broadcast.emit('stream',image);
  });
});
// listen on port 3000
http.listen(port, function(){
  log.info('Server Connected',port)
});
var express = require('express');
var app = new express();
var http = require('http').Server(app);
//var server = http.createServer();
var io =  require('socket.io')(http);
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var router = express.Router();
var logger = require('morgan');
var port = process.env.PORT || 5555;

//connect to MongoDB
mongoose.connect('mongodb://localhost:27017/testForAuth');
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

//app.use(express.static(public));


// include routes
var routes = require('./routes/router');
app.use('/', routes);

require('./routes/routes')(router);
app.use('/api', router);

app.get('/stream', function(req, res){
  res.sendFile(path.join(__dirname+'/templateLogReg/stream.html'));
  
});
/*app.get('/chatting', function(req, res){
  res.sendfile(__dirname + '/templateLogReg/chat.html'); 
});

io.sockets.on('connection', function(socket){
  socket.on('send message', function(data){
    io.sockets.emit('new message', data);
    
  });
});
*/

app.get('/video', function(req, res){
  res.sendFile(path.join(__dirname+'/video.html'));
  
});

app.get('/chatapp', function(req, res){
  res.sendFile(__dirname + '/chatapp.html');
});

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



/*
io.on('connection',function(socket){
 
  socket.on('stream',function(image){
    var clientIp = socket.request.connection.remoteAddress;
    socket.emit()
      socket.broadcast.emit('stream',image);

  });
}); */

var usr = [];
io.on('connection', function(socket){

  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

	socket.emit('myId', usr.length);
	usr.push(usr.length);
	
	io.emit('createUsuarios', usr);
	

	socket.on('part', function(data){
		socket.emit('part', data);
	});

	socket.on('updateImage', function(data){
		socket.broadcast.emit('updateImage',data);
	});

	socket.on('disconnect', function () {
    	
  	});
});



// listen on port 3000
http.listen(port, function(){
  console.log('listening on *:' + port);
});


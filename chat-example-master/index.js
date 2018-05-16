var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var router = express.Router();
var logger = require('morgan');
var selfEasyrtcid = "";


var Log = require('log'),
log = new Log('debug')

var port = process.env.PORT || 3000;

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

app.get('/staffview', function(req, res){
  res.sendFile(__dirname + '/staffvisualizar.html');
});
app.get('/staffsee', function(req, res){
  res.sendFile(__dirname + '/emitir.html');
});

app.get('/userview', function(req, res){
  res.sendFile(__dirname + '/visualizar.html');
});
app.get('/usersee', function(req, res){
  res.sendFile(__dirname + '/useremitir.html');
});
app.get('/chatapp', function(req, res){
  res.sendFile(__dirname + '/tryvideo.html');
});
app.get('/chatapp2', function(req, res){
  res.sendFile(__dirname + '/chatting.html');
});


//io.on('connection', function(socket){
  //socket.on('chat message', function(msg){
   // io.emit('chat message', msg);
 // });
//});

//var usr = [];
io.on('connection', function(socket){

  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  socket.on('stream',function(image){
    socket.broadcast.emit('stream',image);
  
  });


  socket.on('video2',function(image2){
    socket.broadcast.emit('stream',image2);
  
  });
  socket.on('video2',function(image2){
    socket.emit('stream',image2);
  });
  socket.on('play2',function(image2){
    socket.broadcast.emit('stream',image2);
  
  });
  socket.on('play2',function(image2){
    socket.emit('stream',image);
  });
  //
  socket.on('video',function(image){
    socket.broadcast.emit('stream',image);
  
  });
  socket.on('video',function(image){
    socket.emit('stream',image);
  });
  socket.on('play',function(image){
    socket.broadcast.emit('stream',image);
  
  });
  socket.on('play',function(image){
    socket.emit('stream',image);
  });
});
//

http.listen(port, function(){
  console.log('listening on *:' + port);
});
//var socketServer = io.listen(http);
//var easyrtcServer = easyrtc.listen(app, socketServer);

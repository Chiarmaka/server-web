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
var easyrtc = require("easyrtc");

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
app.use(express.static(__dirname + '/templateLogReg'));

//app.use(express.static(public));


// include routes
var routes = require('./routes/router');
app.use('/', routes);

require('./routes/routes')(router);
app.use('/api', router);

app.get('/staffview', function(req, res){
  res.sendFile(__dirname + '/staffvisualizar.html');
});
app.get('/staffsee', function(req, res){
  res.sendFile(__dirname + '/staffemitir.html');
});

app.get('/userview', function(req, res){
  res.sendFile(__dirname + '/uservisualizar.html');
});
app.get('/usersee', function(req, res){
  res.sendFile(__dirname + '/useremitir.html');
});
app.get('/chatapp', function(req, res){
  res.sendFile(__dirname + '/tryvideo.html');
});
app.get('/chatapp2', function(req, res){
  res.sendFile(__dirname + '/tryvideo2.html');
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
app.use(express.static(__dirname + '/easyrtc.html'));
 
 
function connect() {
  easyrtc.setVideoDims(640,480);
  easyrtc.setRoomOccupantListener(convertListToButtons);
  easyrtc.easyApp("easyrtc.audioVideoSimple", "selfVideo", ["callerVideo"], loginSuccess, loginFailure);
 }
 
 
function clearConnectList() {
  var otherClientDiv = document.getElementById("otherClients");
  while (otherClientDiv.hasChildNodes()) {
    otherClientDiv.removeChild(otherClientDiv.lastChild);
  }
}
 
 
function convertListToButtons (roomName, data, isPrimary) {
  clearConnectList();
  var otherClientDiv = document.getElementById("otherClients");
  for(var easyrtcid in data) {
    var button = document.createElement("button");
    button.onclick = function(easyrtcid) {
      return function() {
        performCall(easyrtcid);
      };
    }(easyrtcid);
 
    var label = document.createTextNode(easyrtc.idToName(easyrtcid));
    button.appendChild(label);
    otherClientDiv.appendChild(button);
  }
}
 
 
function performCall(otherEasyrtcid) {
  easyrtc.hangupAll();
 
  var successCB = function() {};
  var failureCB = function() {};
  easyrtc.call(otherEasyrtcid, successCB, failureCB);
}
 
 
function loginSuccess(easyrtcid) {
  selfEasyrtcid = easyrtcid;
  document.getElementById("iam").innerHTML = "I am " + easyrtc.cleanId(easyrtcid);
}
 
 
function loginFailure(errorCode, message) {
  easyrtc.showError(errorCode, message);
}

app.use('/easy', function(req, res){
  res.sendFile(__dirname + '/easyrtc.html');
});
//

http.listen(port, function(){
  console.log('listening on *:' + port);
});
//var socketServer = io.listen(http);
//var easyrtcServer = easyrtc.listen(app, socketServer);

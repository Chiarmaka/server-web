var express = require("express");  
var app = require('express')();  
var http    = require("http");        // web framework external module
var serveStatic = require('serve-static');  // serve static files
var socketIo = require("socket.io");        // web socket external module
var easyrtc = require("../");               // EasyRTC external module
var io = require('socket.io')(http);
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var router = express.Router();
var logger = require('morgan');
//var app = express();
var Log = require('log'),
log = new Log('debug') 

//connect to MongoDB
mongoose.connect('mongodb://localhost:27017/testForAuth');
var db = mongoose.connection;// EasyRTC external module

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

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


// Set process name
process.title = "node-easyrtc";

// Setup and configure Express http server. Expect a subfolder called "static" to be the web root.

app.use(serveStatic('static', {'index2': ['index2.html']}));
//app.use(serveStatic(__dirname + '/static'));
app.get('/chatapp', function(req, res){
   res.sendFile(__dirname + '/visualizar.html');
 });

 app.get('/chatapp2', function(req, res){
    res.sendFile(__dirname + '/liveandchatuser.html');
  });

// Start Express http server on port 8080
var webServer = http.createServer(app);

// Start Socket.io so it attaches itself to Express server
var socketServer = socketIo.listen(webServer, {"log level":1});

easyrtc.setOption("logLevel", "debug");

// Overriding the default easyrtcAuth listener, only so we can directly access its callback
easyrtc.events.on("easyrtcAuth", function(socket, easyrtcid, msg, socketCallback, callback) {
    easyrtc.events.defaultListeners.easyrtcAuth(socket, easyrtcid, msg, socketCallback, function(err, connectionObj){
        if (err || !msg.msgData || !msg.msgData.credential || !connectionObj) {
            callback(err, connectionObj);
            return;
        }

        connectionObj.setField("credential", msg.msgData.credential, {"isShared":false});

        console.log("["+easyrtcid+"] Credential saved!", connectionObj.getFieldValueSync("credential"));

        callback(err, connectionObj);
    });
});

// To test, lets print the credential to the console for every room join!
easyrtc.events.on("roomJoin", function(connectionObj, roomName, roomParameter, callback) {
    console.log("["+connectionObj.getEasyrtcid()+"] Credential retrieved!", connectionObj.getFieldValueSync("credential"));
    easyrtc.events.defaultListeners.roomJoin(connectionObj, roomName, roomParameter, callback);
});

// Start EasyRTC server
var rtc = easyrtc.listen(app, socketServer, null, function(err, rtcRef) {
    console.log("Initiated");

    rtcRef.events.on("roomCreate", function(appObj, creatorConnectionObj, roomName, roomOptions, callback) {
        console.log("roomCreate fired! Trying to create: " + roomName);

        appObj.events.defaultListeners.roomCreate(appObj, creatorConnectionObj, roomName, roomOptions, callback);
    });
});


//listen on port 8080
webServer.listen(5555, function () {
    console.log('listening on http://localhost:5555');
});

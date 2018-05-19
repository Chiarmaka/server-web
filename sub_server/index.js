var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var session = require('express-session');
var router = express.Router();

var port = process.env.PORT || 3000;

// serve static files from template

app.get('/staffview', function(req, res){
  res.sendFile(__dirname + '/staffview.html');
});
app.get('/userview', function(req, res){
  res.sendFile(__dirname + '/userview.html');
});

//var usr = [];
io.on('connection', function(socket){

  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  socket.on('stream',function(image){
    socket.broadcast.emit('stream',image);
  
  });

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

http.listen(port, function(){
  console.log('server listening on *:' + port);
});

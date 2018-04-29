var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var Log = require('log'),
log = new Log('debug')

var port = process.env.PORT || 5555;


app.get('/view', function(req, res){
  res.sendFile(__dirname + '/visualizar.html');
});

app.get('/chatapp', function(req, res){
  res.sendFile(__dirname + '/emitir.html');
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
  socket.on('stream',function(image){
    socket.emit('stream',image);
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
  console.log('listening on *:' + port);
});

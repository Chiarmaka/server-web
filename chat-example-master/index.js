var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var Log = require('log'),
log = new Log('debug')

var port = process.env.PORT || 5555;


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

http.listen(port, function(){
  console.log('listening on *:' + port);
});

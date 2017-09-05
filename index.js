var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
    
  socket.on('joinGame', function(username){
      console.log("Player: " + username + " has connected");
      socket.on('joinGame', function(username){
      io.emit('joinGame', username);          
      });
});
});
http.listen(port, function(){
  console.log('listening on *:' + port);
});

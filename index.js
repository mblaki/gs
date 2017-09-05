var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 8010;
var clients=[];
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log("user connected")
    clients.push(socket);
  socket.on('chat message', function(msg){
    clients[1].emit('chat message', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 8020;
//client[0] is the server GUIfor the Instructor, all other clients are Players
var clients=[];
app.get('/', function(req, res){
  res.sendFile(__dirname + '/www/index.html');
});
io.on('connection', function(socket){
    console.log("clients[] length= " + clients.length);
    if (clients.length == 0){
        clients.push(socket);
        socket.on('instructor join', function(){
            console.log("the instructor has started the simulation");
            io.emit('instructor join');
        });
        
    } else {
        clients.push(socket);
        socket.on('user join', function(){
            console.log("a user has joined");
            io.emit('user join');
        });
    }
    
  socket.on('chat message', function(msg){
    console.log("chat msg sents");
    io.emit('chat message', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});

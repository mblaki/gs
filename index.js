var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 8020;
//client["Instructor"] is the webpage for the Instructor, all other clients are Players
var clients=[];
app.get('/', function(req, res){
  res.sendFile(__dirname + '/www/index.html');
});
io.on('connection', function(socket){
    console.log("clients[] length= " + Object.keys(clients).length);
        socket.on('instructor join', function(){
            console.log("the instructor has started the simulation");
            clients["Instructor"]= socket;
            io.emit('instructor join');
        });
        socket.on('user join', function(name){       
            clients[name]= socket;
            console.log(name + " has joined");
            io.emit('user join', name);
        });
    
    socket.on('chat message', function(msg, name){
    console.log(name+ " sent a chat msg, bitch");
    if ( name == "Instructor") {
        io.emit('chat message', msg, name);
    } else {
        clients["Instructor"].emit('chat message', msg, name);
        clients["marco"].emit('chat message', msg, name);
    }
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});

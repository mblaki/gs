var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 8020;
//client["Instructor"] is the webpage for the Instructor, all other clients are Players
var clients=[];
app.get('/', function(req, res){
    res.sendFile(__dirname + '/www/mario1.wav');
});
app.get('/', function(req, res){
    res.sendFile(__dirname + '/www/index.html');
});

io.on('connection', function(socket){
    console.log("clients[] length= " + Object.keys(clients).length);
        socket.on("disconnect", function(){
            console.log("user disconnected");
        });
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
        socket.on('chat message', function(msg, name, dest){
            console.log(name+ " sent a chat msg to " + dest);
            if ( name == "Instructor") {
                clients[dest].emit('chat message', msg, name, dest);
                clients["Instructor"].emit('chat message', msg, name, dest);
            } else {
                clients["Instructor"].emit('chat message', msg, name, dest);
                clients[name].emit('chat message', msg, name, dest);
            }
        });
        socket.on('all broadcast', function(warningList){
            console.log("the instructor has made an alllll broadcast");
            io.emit('all broadcast', warningList);
        });
        socket.on('select broadcast', function(selected, warningList){
            console.log("the instructor has made a selected broadcast");
            selected.forEach(function(value){
                console.log("selected: "+value);
                clients[value].emit('select broadcast', selected, warningList);
            });
        });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});

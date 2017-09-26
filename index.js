//var app = require('express')();
//var http = require('http').Server(app);
//var io = require('socket.io')(http);
var express = require('express');
var app = express();
var port = process.env.PORT || 8005;

//client["Instructor"] is the webpage for the Instructor, all other clients are Players
var clients=[];
var instrX = 0;
var instrY = 10;
var currently_selected="";
var curr_x= -1;
var curr_y= -1;
var game_start = false;
//app.get('/', function(req, res){
  //  res.sendFile(__dirname + '/www/index.html');
//});
app.use(express.static(__dirname + '/www'));
var server = app.listen(process.env.PORT || 8005, function () {
	var port = server.address().port;
	console.log('Server running at port %s', port);
});
var io = require('socket.io')(server);
io.on('connection', function(socket){
    console.log("clients[] length= " + Object.keys(clients).length);
        socket.on("disconnect", function(){
            console.log("user disconnected");
        });
        socket.on('instructor join', function(){
            console.log("the instructor has started the simulation");
            clients["Instructor"]= socket;
            io.emit('instructor join');
            game_start = true;
        });
        socket.on('user join', function(name){       
            clients[name]= socket;
            console.log(name + " has joined");
            io.emit('user join', name);
        });   
        socket.on('chat message', function(msg, name, dest){
            console.log(name+ " sent a chat msg to " + dest);
            if ( name == "Instructor") {
                if (dest == "all"){
                    io.emit('chat message', msg, name, dest);
                } else {
                    clients[dest].emit('chat message', msg, name, dest);
                    clients["Instructor"].emit('chat message', msg, name, dest);
                }
            } else {
                clients["Instructor"].emit('chat message', msg, name, dest);
                clients[name].emit('chat message', msg, name, dest);
            }
        });
        socket.on('broadcast', function(selected, warningList){
            console.log(selected+" broadcast");
            if (selected == "all"){
                io.emit('abroadcast', warningList);
                 console.log("the instructor has made an all broadcast");
            } else {
                clients[selected].emit('sbroadcast', selected, warningList);
                 console.log("the instructor has made a selected bcast: " + selected);
            }
        });
        socket.on('paint canvas',function(imgData){
            clients["Instructor"].emit('paint canvas', imgData);
            console.log("paint canvas with img data");
        });
        socket.on('give update',function(selected){
            currently_selected = selected;
            clients[selected].emit('give update', selected);
            console.log("get update from: " + selected );
        });
        socket.on('update line', function(selected, x, y){
            if (currently_selected == selected) {
                curr_x = x;
                curr_y = y;
            }
        })
        function gameLoop(){
            io.emit("game loop", instrX, instrY);
            if (game_start){
                clients["Instructor"].emit("update line", currently_selected,curr_x, curr_y);
            }
        }
        setInterval(gameLoop, 500);
});

//http.listen(port, function(){
  //console.log('listening on *:' + port);
//});

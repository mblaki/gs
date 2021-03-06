/**
 * @author Marco de Freitas (19050739@sun.ac.za)
 * Function:  Connect to clients, and make emits to clients 
 * 			  
 * Purpose:   The server that communicates with all clients, identifies the Instructor and Players
 *
 */
var express = require('express');
var app = express();
var port = process.env.PORT || 8020;

var clients=[];
var instrX = 0; // default X velocity
var instrY = 5; // default Y velocity
var speed = 5; //speed in any direction
var curr_angl = 0;
var currently_selected="";
var curr_x= -1;
var curr_y= -1;
var bgX = 0;
var bgY = 0;

var MAX_ANGLE = 5; // max angle, increase by one to increase max angle by 9 degrees
var game_start = false;
app.use(express.static(__dirname + '/www'));
var server = app.listen(port, function () {
	var port = server.address().port;
	console.log('Server running at port %s', port);
});
var io = require('socket.io')(server);

io.on('connection', function(socket){
        socket.on("disconnect", function(){
            console.log("user disconnected ");
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
        });
        socket.on('give update',function(selected){
            currently_selected = selected;
            clients[selected].emit('give update', selected);
        });
        socket.on('update line', function(selected, x, y, angle, bg_x, bg_y){
            if (currently_selected == selected) {
                curr_x = x;
                curr_y = y;
                curr_angl = angle;
                bgX= bg_x;
                bgY= bg_y
            }
        });
        socket.on('change increment', function(x,y,s,p){
                instrX = x;
                instrY = y;
                speed = s;
                if (p == 'all'){
                    io.emit('special change', instrX, instrY, speed, p);
                } else {
                    clients[p].emit('special change', instrX, instrY, speed, p);
                }
        });
       socket.on('dock', function(gname,type){
                clients["Instructor"].emit('dock', gname, type);
        });
        function gameLoop(){
            io.emit("game loop");
            if (game_start){
                clients["Instructor"].emit("update line", currently_selected,curr_x, curr_y, curr_angl, bgX, bgY);
            }
        }
        /*
        * change second argument below to change the game clock (time interval the player position is updated) 
        */
        setInterval(gameLoop, 500);
});
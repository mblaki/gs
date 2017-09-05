var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.get('/', function(req, res){
    res.sendFile(__dirname + '/www/index.html');
});
io.on('connection', function(socket){
    console.log('user has  connected');
    socket.on('chat message'), function(msg){
        io.emit('chat message', msg);
    }
    socket.on("disconnect", function(){
        console.log("user disconnected");
    });
});

http.listen(8000, function(){
    console.log('listening on 8000 brah');
});

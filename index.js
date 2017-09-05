var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.get('/', function(req, res){
    res.sendFiel(__dirname + '/index.html');
});
io.on('connection', function(socket){
    console.log('user has  connected');
    socket.on("disconnect", function(){
        console.log("user disconnected");
    });
});

http.listen(8000, function(){
    console.log('listening on 8000 brah');
});
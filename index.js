var app = require('express')();
var http = require('http').Server(app);

app.get('/', function(req, res){
    res.sendFiel(__dirname + '/index.html');
});

http.listen(8000, function(){
    console.log('listening on 8000 brah');
});
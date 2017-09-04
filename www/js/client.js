var WIDTH = "60%";
var HEIGHT = "100vh";
// This IP is hardcoded to my server, replace with your own
var socket = io.connect('http://139.59.179.121:8082');
var game = new Game('#arena', WIDTH, HEIGHT, socket);
var selectedTank = 1;
var tankName = '';

socket.on('addTank', function(tank){
	game.addTank(tank.id, tank.type, tank.isLocal, tank.x, tank.y);
});

$(document).ready( function(){

	$('#join').click( function(){
		tankName = $('#tank-name').val();
		joinGame(tankName, selectedTank, socket);
	});
});

function joinGame(tankName, tankType, socket){
		$('#prompt').hide();
        $('#command').append("New Tank:" + tankName);
		socket.emit('joinGame', {id: tankName, type: tankType});
}
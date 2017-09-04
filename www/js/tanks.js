var INTERVAL = 50;
var ROTATION_SPEED = 100;
var ARENA_MARGIN = 30;
var baseAngle=0;

function Game(arenaId, w, h, socket){
	this.tanks = [];
	this.width = w;
	this.height = h;
	this.$arena = $(arenaId);
	this.$arena.css('width', w);
	this.$arena.css('height', h);
	this.socket = socket;
    
    var g = this;
    setInterval(function(){
        g.mainLoop();
    }, INTERVAL);
}
    
Game.prototype = {
	addTank: function(id, type, isLocal, x, y){
		var t = new Tank(id, type, this.$arena, this, isLocal, x, y);
		if(isLocal){
			this.localTank = t;
		}else{
			this.tanks.push(t);
		}
	},
    
    mainLoop: function() {
        if(this.localTank != undefined) {
            this.sendData();
            this.localTank.move();
        }
    }
}

Tank.prototype = {
    materialize: function(){
        this.$arena.append('<div class = "ship"> </div>');
        this.$
    }
}

    var canvasHeight = 2010; // change this to change map image
    var canvasWidth = 3468; // change this to change map image
    var initX =  3468;
    var initY = 1005;
    var cx = 50;
    var cy = canvasHeight;
    var bg_increment=10;
    var line_increment = 10;
    var l=document.getElementById("list");
    var ctx=l.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(cx,cy);
    socket.on('game loop', function(){
        if(gname != "Instructor") {
            initY += bg_increment;
            cy -= line_increment;
            document.getElementById('map').style.backgroundPositionY = initY+ "px";
        }
    });

    $(document).keydown(function(e){
    if(e.keyCode == 38) {//up
      initY += bg_increment;
      cy -= line_increment;
        if(initY >canvasHeight+1005){
            initY = 1005;
            cy = canvasHeight;
        }
        if (initX > canvasWidth){
            initX = 0;
            cx = canvasWidth;
        }
        if(initY < 0){
            initY = canvasHeigh;
            cy = 0;
        }
        if (initX < 0){
            initX = canvasWidth;
            cx = 0;
        }
        /*
        if(cy >canvasHeight){
            cy = 0;
        }
        if (cx > canvasWidth){
            cx = 0;
        }
        if(cy < 0){
            cy = canvasHeight;
        }
        if (cx < 0){
            cx = canvasWidth;
        }
        */
        detectCollision(cx,cy);
        document.getElementById('map').style.backgroundPositionY = initY+ "px";
    }
    else if(e.keyCode == 40) {//down
      initY -= bg_increment;
      cy +=line_increment;
        if(initY >canvasHeight+1005){
            initY = 1005;
            cy = canvasHeight;
        }
        if (initX > canvasWidth){
            initX = 0;
            cx = canvasWidth;
        }
        if(initY < 0){
            initY = canvasHeight;
            cy = 0;
        }
        if (initX < 0){
            initX = canvasWidth;
            cx = 0;
        }
        
        detectCollision(cx,cy);
      document.getElementById('map').style.backgroundPositionY = initY+ "px";
    }
    else if(e.keyCode == 37) {//left
      initX += bg_increment;
       cx -= line_increment;
        if(initY >canvasHeight+1005){
            initY = 1005;
            cy = canvasHeight;
        }
        if (initX > canvasWidth){
            initX = 0;
            cx = canvasWidth;
        }
        if(initY < 0){
            initY = canvasHeight;
            cy = 0;
        }
        if (initX < 0){
            initX = canvasWidth;
            cx = 0;
        }
        
        detectCollision(cx,cy);
        document.getElementById('map').style.backgroundPositionX = initX + "px";
    }
    else if(e.keyCode == 39) {//right
      initX -= bg_increment;
      cx += line_increment;
        if(initY >canvasHeight+1005){
            initY = 1005;
            cy = canvasHeight;
        }
        if (initX > canvasWidth){
            initX = 0;
            cx = canvasWidth;
        }
        if(initY < 0){
            initY = canvasHeight;
            cy = 0;
        }
        if (initX < 0){
            initX = canvasWidth;
            cx = 0;
        }
        detectCollision(cx,cy);
        document.getElementById('map').style.backgroundPositionX = initX + "px";
    }
});

function detectCollision(x,y){
    
    //ctx.moveTo(x-60,y-210);
    ctx.lineTo(x-50,y-200);
    ctx.lineWidth = 10;
    ctx.strokeStyle = "rgb(0, 0, 222)";
    ctx.stroke();
    var e=document.getElementById("list");
    var c = e.getContext('2d');
    var p = c.getImageData(x-50, y-200, 1, 1).data; 
    if (p[2] < 200 && p[2] != 0 && p[0] != 255){
        console.log("CRASH "+ "\np0: " + p[0] + " \np1: " + p[1] + " \np2: " + p[2]);
    }
}
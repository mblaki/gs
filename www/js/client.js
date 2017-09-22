    var initX = 0;
    var initY = 0;
    var cx = 0;
    var cy = 0;
    var canvasHeight = 2010; // change this to change map image
    var canvasWidth = 3468; // change this to change map image

   
    socket.on('game loop', function(){
        if(gname != "Instructor") {
            initY += 10;
            cy -= 10;
            document.getElementById('map').style.backgroundPositionY = initY + "px";
        }
    });

    $(document).keydown(function(e){
    if(e.keyCode == 38) {//up
            var l=document.getElementById("list");
    var ctx=l.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(300,300);
    ctx.lineWidth = 100;
    ctx.strokeStyle = '#ffff00';
    ctx.stroke();
      initY += 10;
      cy -= 10;
        if(initY >canvasHeight){
            initY = 0;
            cy = canvasHeight;
        }
        if (initX > canvasWidth){
            initX= 0;
            cx= canvasWidth;
        }
        if(initY < -1){
            initY = canvasHeight;
            cy = 0;
        }
        if (initX < -1){
            initX= canvasWidth;
            cx= 0;
        }
        /*
        if(cy >canvasHeight){
            cy = 0;
        }
        if (cx > canvasWidth){
            cx= 0;
        }
        if(cy < -1){
            cy = canvasHeight;
        }
        if (cx < -1){
            cx= canvasWidth;
        }
        */
        detectCollision(cx,cy);
        document.getElementById('map').style.backgroundPositionY = initY + "px";
    }
    else if(e.keyCode == 40) {//down
      initY -= 10;
      cy +=10;
        if(initY >canvasHeight){
            initY = 0;
            cy = canvasHeight;
        }
        if (initX > canvasWidth){
            initX= 0;
            cx= canvasWidth;
        }
        if(initY < -1){
            initY = canvasHeight;
            cy = 0;
        }
        if (initX < -1){
            initX= canvasWidth;
            cx= 0;
        }
        /*
        if(initY >canvasHeight){
            initY = 0;
        }
        if (initX > canvasWidth){
            initX= 0;
        }
        if(initY < -1){
            initY = canvasHeight;
        }
        if (initX < -1){
            initX= canvasWidth;
        }
        if(cy >canvasHeight){
            cy = 0;
        }
        if (cx > canvasWidth){
            cx= 0;
        }
        if(cy < -1){
            cy = canvasHeight;
        }
        if (cx < -1){
            cx= canvasWidth;
        }
        */
        detectCollision(cx,cy);
      document.getElementById('map').style.backgroundPositionY = initY + "px";
    }
    else if(e.keyCode == 37) {//left
      initX += 10;
       cx -= 10;
        if(initY >canvasHeight){
            initY = 0;
            cy = canvasHeight;
        }
        if (initX > canvasWidth){
            initX= 0;
            cx= canvasWidth;
        }
        if(initY < -1){
            initY = canvasHeight;
            cy = 0;
        }
        if (initX < -1){
            initX= canvasWidth;
            cx= 0;
        }
        detectCollision(cx,cy);
        document.getElementById('map').style.backgroundPositionX = initX + "px";
    }
    else if(e.keyCode == 39) {//right
      initX -= 10;
      cx += 10;
        if(initY >canvasHeight){
            initY = 0;
            cy = canvasHeight;
        }
        if (initX > canvasWidth){
            initX= 0;
            cx= canvasWidth;
        }
        if(initY < -1){
            initY = canvasHeight;
            cy = 0;
        }
        if (initX < -1){
            initX= canvasWidth;
            cx= 0;
        }
        detectCollision(cx,cy);
        document.getElementById('map').style.backgroundPositionX = initX + "px";
    }
});

function detectCollision(x,y){
    var l=document.getElementById("list");
    var ctx=l.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x-60,y-60);
    ctx.lineTo(x-50,y-50);
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#ff0000';
    ctx.stroke();
    var e=document.getElementById("list");
    var c = e.getContext('2d');
    var p = c.getImageData(x-50, y-50, 1, 1).data; 
    if (p[2] < 200 && p[2] != 0){
        console.log("CRASH "+ "\np0: " + p[0] + " \np1: " + p[1] + " \np2: " + p[2]);
    }
}
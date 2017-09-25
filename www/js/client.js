
    var canvasHeight = 3456; // change this to change map image
    var canvasWidth = 3736; // change this to change map image
    var initX =  0;
    var initY = screen.height;
    var cx = 0;
    var cy = canvasHeight;
    var increment=0;
    var line_increment = 0;
    var angle = 0.0;
    var offset = screen.width *0.55*0.5;
    var l=document.getElementById("list");
    var ctx=l.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(cx,cy);

    socket.on('game loop', function(iX, iY){
        if(gname != "Instructor") {
            initY += iY+increment;
            cy -= iY+increment;
            initX += increment;
            cx -= increment;
            document.getElementById('map').style.backgroundPositionY = initY+ "px";
            document.getElementById('map').style.backgroundPositionX = initX+ "px";
            if(initY >canvasHeight+screen.height){
                initY = screen.height
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
            detectCollision(cx,cy);
        }
    });

    $("#l_but").click(function(){
        if (increment < 10) {
            increment +=2;
            angle-=4.5;
            $("#avatar").rotate(angle);
        }
        
    });

    $("#r_but").click(function(){
        if (increment > -10) {
            increment -=2;
            angle += 4.5;
            $("#avatar").rotate(angle);
        }
        
    });

    $(document).keydown(function(e){
    if(e.keyCode == 38) {//up
      initY += 10+increment;
      cy -= 10+increment;
        if(initY >canvasHeight+screen.height){
            initY = screen.height;
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
        if(initY >canvasHeight+1080){
            initY = 1080;
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
        if(initY >canvasHeight+1080){
            initY = 1080;
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
        if(initY >canvasHeight+1080){
            initY = 1080;
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
    if (x!=0 || y != 0){
    ctx.lineTo(x+50+offset,y-300);
    ctx.lineWidth = 10;
    ctx.strokeStyle = "rgb(0, 0, 222)";
    ctx.stroke();
    }
  
    var e=document.getElementById("list");
    var c = e.getContext('2d');
    var p = c.getImageData(x+offset, y-310, 1, 1).data;
    console.log("\np0: " + p[0] + " \np1: " + p[1] + " \np2: " + p[2]);
    if (p[0]==62 || p[1]== 117 || p[2] == 198){
        console.log("CRASH "+ "\np0: " + p[0] + " \np1: " + p[1] + " \np2: " + p[2]);
    }
}
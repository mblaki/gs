
    var canvasHeight = 3456; // change this to change map image
    var canvasWidth = 3736; // change this to change map image
    var initX =  0;
    var initY = screen.height;
    var cx = 0;
    var cy = canvasHeight;
    var Xincrement=0;
    var Yincrement=0;
    var line_increment = 0;
    var angle = 0.0;
    var out_of_bounds = 0;
   // var offset = screen.width *0.55*0.5;
    var updateClient = "none";
    var ctx_l = [];
    var stopper = 0;
    console.log("client: + " + screen.width *0.55*0.5);

    var l=document.getElementById("list");
    var ctx=l.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(cx+offset+50,cy-400);
    socket.on('game loop', function(iX, iY){
        if(gname != "Instructor") {
            Yincrement = iY;
            initY += iY;
            cy    -= iY;
            initX += (Xincrement + iX);
            if (Xincrement == 0){
                
            } else if (Xincrement<0){
                cx += Math.abs(Xincrement + iX);
            }else if (Xincrement >0){
                cx -= Math.abs(Xincrement + iX);          
            }
            
            if(cy >canvasHeight){
                alert("TOP BORDER");
            }
            if (cx > canvasWidth){
                alert("RIGHT BORDER");
            }
            if(initY < 0){
                alert("BOTTOM BORDER");
            }
            if (cx +offset+50 < 0){
                alert("LEFT BORDER");
            }
            document.getElementById('map').style.backgroundPositionY = initY+ "px";
            document.getElementById('map').style.backgroundPositionX = initX+ "px";
            detectCollision(cx,cy);
            socket.emit('update line', gname, cx, cy, angle, initX, initY);
        }
    });
    socket.on('give update', function(selected){
       if (gname == selected) {
           var my_c=document.getElementById("list");
           var my_data= my_c.toDataURL();
           socket.emit('paint canvas', my_data);
       } 
    });

    $("#l_but").click(function(){
        if (stopper < 5){
            Xincrement += (Yincrement*0.2);
            angle -= 9;
            $("#avatar").rotate(angle);
            $("#needle").rotate(angle);
            stopper +=1;
        }
    });

    $("#r_but").click(function(){
        if (stopper > -5) {
            Xincrement -= (Yincrement*0.2);
            angle += 9;
            $("#avatar").rotate(angle);
            $("#needle").rotate(angle);
            stopper -= 1;
        }
        
    });


function detectCollision(x,y){
    
    //ctx.moveTo(x-60,y-210);

    ctx.lineTo(x+offset+50,y-400);
    ctx.lineWidth = 10;
    ctx.strokeStyle = "rgb(0, 0, 222)";
    ctx.stroke();
  
    var e=document.getElementById("list");
    var c = e.getContext('2d');
    var p = c.getImageData(x+offset+60, y-410, 1, 1).data;
    console.log("\np0: " + p[0] + " \np1: " + p[1] + " \np2: " + p[2]);
    if (p[0]==62 || p[1]== 117 || p[2] == 198 || p[0]==24 || p[1]== 119 || p[2] == 192){
        alert("GAMEOVER. YOU CRASHED");
    } else if (p[1]== 0 && game_start){
        out_of_bounds +=1;
    }
    if (out_of_bounds > 10 && game_start){
        alert("GAMEOVER. OUT OF BOUNDS");
    }
}
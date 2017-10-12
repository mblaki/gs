/**
 * @author Marco de Freitas (19050739@sun.ac.za)
 * Function:  Detect collision,  move background, draw canvas, and take user input
 * 			  
 * Purpose:   Communicate game logic to server
 *
 */
    var initX =  0;
    var initY = 772; //vertical offset for device
    var cx = 491;//position line on avatar
    var cy = canvasHeight-286;//position line on avatar
    var Xincrement=0;
    var Yincrement=0;
    var angle = 0.0;
    var out_of_bounds = 0;
    var MAX_ANGLE = 5;
    var stopper = 0;
    var END = false;
    var l=document.getElementById("list");
    var ctx=l.getContext("2d");
    ctx.beginPath();
    ctx.moveTo((cx+offset)*ratio,(cy) * ratio);
    socket.on('game loop', function(iX, iY, iA){
        if(gname != "Instructor" ) {
            if(!END) {
                Yincrement = iY;
                MAX_ANGLE = iA;
                if (dock_ON){
                    initY += (iY)/2;
                    cy -= (iY)/2;
                } else {
                    initY += (iY);
                    cy -= (iY);
                }
                if (Xincrement<0){
                    cx += Math.abs(Xincrement + iX);
                    initX -= Math.abs(Xincrement + iX);
                } else if (Xincrement >0){
                    cx -= Math.abs(Xincrement + iX);
                    initX += Math.abs(Xincrement + iX);
                } else {
                    if (iX <0){
                        cx += Math.abs(iX); 
                        initX -= Math.abs(iX);
                    } else {
                        cx -= Math.abs(iX);
                        initX += Math.abs(iX);
                    }
                }
            } else {
                $("#map").empty();
                $("#map").css("background","white");
                var ender = document.createElement("h1");
                ender.style.fontsize = "50%";
                ender.innerHTML = "END";
                $("#map").append(ender);
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
        if (stopper < MAX_ANGLE){
            stopper +=1;
            Xincrement += parseInt(5*(1/MAX_ANGLE));
            angle -= 9;
            $("#avatar").rotate(angle);
            $("#needle").rotate(angle);
        }
    });

    $("#r_but").click(function(){
        if (stopper > -MAX_ANGLE) {
            stopper -= 1;
            Xincrement -= parseInt(5*(1/MAX_ANGLE));
            angle += 9;
            $("#avatar").rotate(angle);
            $("#needle").rotate(angle);
        }
        
    });

function detectCollision(x,y){
    ctx.lineTo((x+offset)*ratio,(y)*ratio);
    ctx.lineWidth = 10;
    ctx.strokeStyle = "rgb(0, 0, 222)";
    ctx.stroke();
    var e=document.getElementById("list");
    var c = e.getContext('2d');
    var p = c.getImageData((x+offset)*ratio, (y-5)*ratio, 1, 1).data;
    console.log("\np0: " + p[0] + " \np1: " + p[1] + " \np2: " + p[2]);
   if ((p[0]==62 && p[1]== 117 && p[2] == 198) || (p[0]==24 && p[1]== 119 && p[2] == 192)){
        if(dock_ON){
            socket.emit('dock', gname, 0);
            END = true;
          //  alert("dead");
        } else {
            socket.emit('dock', gname, 4);
            END = true;
            
        }
    } else if (p[1]== 0 && p[2] == 0 && p[3] == 0 && game_start){
        out_of_bounds +=1;
    }
    if (out_of_bounds > 10 && game_start){
        socket.emit('dock', gname, 3);
        END = true;
        
    }
}
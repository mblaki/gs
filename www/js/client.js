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
    var cy = canvasHeight-686;//position line on avatar
    var Xincrement=0;
    var Yincrement=0;
    var my_speed = 5;
    var angle = 90.0;
    var rot_angle = 0.0;
    var out_of_bounds = 0;
    var MAX_ANGLE = 5;
    var stopper = 0;
    var END = false;
    var l=document.getElementById("list");
    var ctx=l.getContext("2d");
    ctx.beginPath();
    ctx.moveTo((cx+offset)*ratio,(cy) * ratio);
    socket.on('game loop', function(iX, speed, iA){
        if(gname != "Instructor" ) {
            my_speed = speed;
            if(!END) {
                Yincrement = my_speed* Math.sin((Math.PI/180) * angle);
                
                MAX_ANGLE = iA;
                if (dock_ON){
                    initY += (Yincrement)/2;
                    cy -= (Yincrement)/2;
                } else {
                    initY += (Yincrement);
                    cy -= (Yincrement);
                }

                cx += Xincrement;
                initX -= Xincrement;
                /*
                if (Xincrement<0){
                    cx += Xincrement + iX;
                    initX -= Xincrement + iX;
                    console.log("Xincr < 0");
                } else if (Xincrement >0){
                    cx -= Xincrement + iX;
                    initX += Xincrement + iX;
                    console.log("Xincr > 0");
                } else {
                   // if (iX <0){
                    //    cx += Math.abs(iX); 
                    //    initX -= Math.abs(iX);
                //    } else {
                  //      cx -= Math.abs(iX);
                    //    initX += Math.abs(iX);
                    console.log("Yaeji Xincr = 0");
                 //   }
                }*/
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
            socket.emit('update line', gname, cx, cy, rot_angle, initX, initY);
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
            stopper +=1;
            angle += 9;
            rot_angle -= 9;
            Xincrement -= my_speed * Math.cos((Math.PI/180) * angle);
            console.log("Xincrement: " + Xincrement + " cx: " + cx);
            console.log("Yincrement: " + Yincrement + " cy: " + cy);
            console.log("angle = " + angle);
            $("#avatar").rotate(rot_angle);
            $("#needle").rotate(rot_angle);
        
    });

    $("#r_but").click(function(){
            stopper -= 1;
            angle -= 9;
            rot_angle += 9;
            Xincrement += my_speed * Math.cos((Math.PI/180) * angle);
        /*
            if (angle%360 == 90 || angle%360 == 270) {
                Xincrement = 0;
                Yincrement = 5;
            }
            if (angle%360 == 0 || angle%360 == 180) {
                Xincrement = 5;
                Yincrement = 0;
            }
            */
            console.log("Xincrement: " + Xincrement + " cx: " + cx);
            console.log("Yincrement: " + Yincrement + " cy: " + cy);
            console.log("angle = " + angle);
            $("#avatar").rotate(rot_angle);
            $("#needle").rotate(rot_angle);
    });

function detectCollision(x,y){
    ctx.lineTo((x+offset)*ratio,(y)*ratio);
    ctx.lineWidth = 10;
    ctx.strokeStyle = "rgb(0, 0, 222)";
    ctx.stroke();
    var e=document.getElementById("list");
    var c = e.getContext('2d');
    var p = c.getImageData((x+offset)*ratio, (y-5)*ratio, 1, 1).data;
  //  console.log("\np0: " + p[0] + " \np1: " + p[1] + " \np2: " + p[2]);
   if ((p[0]==62 && p[1]== 117 && p[2] == 198) || (p[0]==24 && p[1]== 119 && p[2] == 192)){
        if(dock_ON){
        //    socket.emit('dock', gname, 0);
//            END = true;
          //  alert("dead");
        } else {
        //    socket.emit('dock', gname, 4);
        //   END = true;
            
        }
    } else if (p[1]== 0 && p[2] == 0 && p[3] == 0 && game_start){
        out_of_bounds +=1;
    }
    if (out_of_bounds > 10 && game_start){
   //     socket.emit('dock', gname, 3);
   //     END = true;
        
    }
}
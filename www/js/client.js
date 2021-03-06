/**
 * @author Marco de Freitas (19050739@sun.ac.za)
 * Function:  Detect collision,  move background, draw canvas, and take user input
 * 			  
 * Purpose:   Communicate game logic to server
 *
 */
    var MAX_ANGLE = 5;
    var stopper = 0;
    var END = false;
    var l=document.getElementById("list");
    var ctx=l.getContext("2d");
    ctx.beginPath();
    ctx.moveTo((cx+offset)*ratio,(cy) * ratio);
    socket.on('special change', function(newX, newY, newSpeed, selPlayer){
        if(gname != "Instructor"){
            if (selPlayer == 'all' || selPlayer == gname){
                my_speed = newSpeed;
                verticalDrift = newY;
                horizontalDrift = newX;
                wind_resultant = parseInt(Math.sqrt(Math.pow(verticalDrift,2) + Math.pow(horizontalDrift,2)) );
                dashstring = "<p>Speed: " + my_speed+ "</p>";
                $(".dashboard").empty();
                $(".dashboard").append("<p>Speed: " + my_speed+ " km/h</p>");
                if (horizontalDrift == 0 ){
                    wind_angle = 90;
                } else {
                    wind_angle = parseInt(Math.atan(verticalDrift/horizontalDrift)*180/Math.PI);
                    console.log("calculated angle " + wind_angle );
                }
                dashstring += "<p>Winds: " + wind_resultant +" km/h </p>";
                $(".dashboard").append("<p>Winds: " + wind_resultant +"km/h </p>");
                if (wind_resultant != 0){
                    dashstring += "<p>At: " + wind_angle + " degrees </p>";
                    $(".dashboard").append("<p>At: " + wind_angle + " degrees </p>");
                }
            }
        }
    });
    socket.on('game loop', function(){
        if(gname != "Instructor" ) {   
            if(!END) {
                Yincrement = my_speed* Math.sin((Math.PI/180) * angle);
                if (dock_ON){
                    initY += (Yincrement+verticalDrift)/2;
                    cy -= (Yincrement+verticalDrift)/2;
                } else {
                    initY += (Yincrement+verticalDrift);
                    cy -= (Yincrement+verticalDrift);
                }

                cx += (Xincrement + horizontalDrift);
                initX -= (Xincrement + horizontalDrift);
            } else {
                $("#map").empty();
                $("#map").css("background","white");
                var ender = document.createElement("h1");
                ender.style.fontsize = "50%";
                ender.innerHTML = "END";
                $("#map").append(ender);
            }
            document.getElementById('map').style.backgroundPositionY = initY+"px";
            document.getElementById('map').style.backgroundPositionX = initX+"px";
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
            Xincrement = my_speed * Math.cos((Math.PI/180) * angle);
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
            Xincrement = my_speed * Math.cos((Math.PI/180) * angle);
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
    var e=document.getElementById("list");
    var c = e.getContext('2d');
    var p = c.getImageData((x+offset)*ratio, (y)*ratio, 1, 1).data;
    console.log("\np0: " + p[0] + " \np1: " + p[1] + " \np2: " + p[2]);
   if ((p[0]==62 && p[1]== 117 && p[2] == 198) || (p[0]==24 && p[1]== 119 && p[2] == 192)){
        if(dock_ON){
            socket.emit('dock', gname, 0);
            END = true;
            alert("dead");
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
    ctx.stroke();
}
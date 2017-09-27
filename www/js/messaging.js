    var audio = new Audio('../sound/mario1.wav');
    var offset = screen.width *0.55*0.5+100;
    var gname="";
    var dest="Instructor";
    var clientList=[];
    var c_index=0;
    var socket = io();
    var warningList = [];
    var myWarningList = [];
    var selected = "all";
    var canvasHeight = 3456; // change this to change map image
    var canvasWidth = 3736; // change this to change map image
    var x_pos = -1;
    var y_pos = -1;
    var Y_INC = 0;
    var X_INC = 0;
    var game_start = false;
    var dock_ON= false;
    function changeMap(p){
        if (p == 0) {
            $("#avatar").show();
            $("#map").css("display","block");
            $("#list").css("display","none");
            $("#bigmap").css("display","block");
            $("#smallmap").css("display","none");
        } else {
            $("#map").css("display","none");
            $("#list").css("display","block");
            $("#smallmap").css("display","block");
            $("#bigmap").css("display","none");
            $("#avatar").hide();
        }
    }
        
      $(function () {
        $('form').submit(function(){
          socket.emit('chat message', $('#m').val(), gname, dest);
          $('#m').val('');
          return false;
        });
        socket.on('chat message', function(msg, name, dest){
            if (gname == 'Instructor'){
                if(name == "Instructor"){
                    $("#"+clientList.indexOf(dest)).append($('<p style="float:right;background-color:#ccffcc;">').text(msg));
                } else {
                    audio.play();
                    $("#"+clientList.indexOf(name)).append($('<p style="float:left;background-color:#f2f2f2;">').text(msg));
                }
            } else {
                    if (name == "Instructor"){
                        audio.play();
                        $("#0").append($('<p  style="float:left;background-color:#f2f2f2;">').text(msg));
                    } else {
                        $("#0").append($('<p style="float:right;background-color:#ccffcc;">').text(msg));
                        
                    }
            }
        });
      });
    $(document).ready( function () {
    $("#join").click(function(){
        gname = $("#username").val();
        $("#prompt").hide();
        $("#backscreen").hide();
        if (gname == "Instructor"){
            socket.emit('instructor join');
            $("#users").width("20%");
            $("#users").css("float","left");
            $("#map").width("55%");
            $("#map").css("float","left");
            $("#chat").width("25%");
            $("#chat").css("float","right");
            $("#avatar").css("margin-left", "20%");
            $("#avatar").css("left", screen.width*0.55*0.5 +50 +"px");
            $("#controls").css("left", screen.width*0.55*0.5 +"px");
            $(".c_but").css("visibility", "hidden");
            $(".dock").css("visibility", "hidden");
            $("#compass").css("display", "none");
            $("#needle").css("display", "none");
            game_start = true;
        } else {
            socket.emit('user join', gname);
            $("#users").css("display", "none");
            $("#map").width("75%");
            $("#map").css("float","left");
            $("#chat").width("25%");
            $("#chat").css("float","right");
            $("#avatar").css("left", screen.width*0.55*0.5 +50+"px");
            $("#controls").css("left", screen.width*0.55*0.5 +"px");
            game_start = true;
        }
    });

    $("#broadcast").click(function(){
        warningList.length = 0;
            $('#users :checked').each(function() {
                warningList.push($(this).val());
            });
            socket.emit('broadcast', selected, warningList);
    });
     $("#apply").click(function(){
            var nY = parseInt($("#Y_vel").val());
            var nX = parseInt($("#X_vel").val())*-1.0;
            socket.emit('change increment', nX, nY);
    });
    $(".dock").click(function(){
            if (dock_ON == true) {
                dock_ON = false;
                $(".dock").css("background-color", "lightgray");
                socket.emit('dock', gname, 1);
            } else {
                dock_ON = true;
                $(".dock").css("background-color", "blue");
                socket.emit('dock', gname, 2);
            }
    });
        
    });
        socket.on('instructor join', function(y_increment, x_increment){
            console.log("instructor join emit");
            if (gname == "Instructor"){
                console.log("instructor join emit gname = Instructor");
                $('#buts').append('<button class="tablinks" type = "button" id = "all" value = "all"  onclick="setDest(event,this.value)"> ALL </button>');
                document.getElementById("10").style.display = "block";
            } 
        });
        socket.on('user join', function(lname){
            if(gname == 'Instructor'){
                clientList[c_index]= lname;
                console.log("user join clientList " + c_index + " = " + lname);
                $("#" + c_index).append('<h3 style="clear:both;">'+ lname +'</h3>');
                $('#10').append('<button class="tablinks" type = "button" value="'+lname+'"onclick="setDest(event,this.value)"'+'id="but'+lname+'">'+lname+'</button>');             
                c_index += 1;
            } else if (gname == lname && gname != "Instructor"){
                $('#buts').css("display","none");
                $("#0").css("display","block");
                $("#list").css("background", "black");
                 var img = new Image();
                img.onload = function(){
                    var hidden_canvas = document.getElementById("list")
                    hidden_canvas.width = canvasWidth;
                    hidden_canvas.height = canvasHeight;
                    var hidden_context = hidden_canvas.getContext("2d");        
                    // draw the image on the hidden canvas
                    hidden_context.drawImage(img, 0, 0);
                };
                /*
                To change map change this path!
                */
                img.src = "../img/big.png"; 
              // console.log("w:"+img.width +"\nh " + img.height);
            }
        });

        socket.on('abroadcast', function(warningList){
             if (gname != "Instructor"){
              console.log("broadcast recieved to " + selected);
                $('#t').empty();
                myWarningList.length = 0;
                myWarningList = warningList;
                myWarningList.forEach(function(value){
                    $('#t').append($('<p>').text(value));
                });
            } else {
                console.log(" ALL BCast");
            }
        });
        socket.on('sbroadcast', function(select, warningList){
             if (gname != "Instructor"){
              console.log("broadcast recieved to " + selected);
              if (gname == select ) {
                $('#t').empty();
                myWarningList.length = 0;
                myWarningList = warningList;
                myWarningList.forEach(function(value){
                    $('#t').append($('<p>').text(value));
                });
              } 
            } else {
                console.log("instructor gnore server response but selected=" +select);
            }
        });
        socket.on('paint canvas', function(imgData, x, y){
            var canvas = document.getElementById('list');
            // load image from data url
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            var context = canvas.getContext("2d");
            var imageObj = new Image();
                imageObj.onload = function() {
                context.drawImage(this, 0, 0);
            };
            context.moveTo(x,y);
            context.font = "30px Arial";
            context.fillText(selected,10,50);
            imageObj.src = imgData;
        });
    socket.on('update line', function(s_selected, x, y,ang,bg_x, bg_y){
        if (s_selected != 'all' && gname == "Instructor" && x != -1){
            var canvas = document.getElementById('list');
            var ctx = canvas.getContext("2d");
            ctx.lineTo(x+offset+50,y-400);
            ctx.lineWidth = 10;
            ctx.strokeStyle = "rgb(0, 0, 222)";
            ctx.stroke();
            document.getElementById('map').style.backgroundPositionY = bg_y+ "px";
            document.getElementById('map').style.backgroundPositionX = bg_x+ "px";
            $("#avatar").rotate(ang);
        }
    });
 socket.on('dock', function(name, type){
     console.log("name: " + name + "type: " + type)
     if (type == 0){
         $("#but"+name).text(name + "- Successful Dock");
         console.log(gname+" win");
     } else if (type == 1) {
         $("#but"+name).text(name);
         console.log("type 1");
     } else if (type == 2 ){
        $("#but"+name).text(name + "- Docking");
         console.log(gname+" good dock");
     } else if (type == 3 ){
        $("#but"+name).text(name + "- Failed (Out of Bounds)");
         console.log(gname+" border");
     } else if (type == 4 ){
        $("#but"+name).text(name + "- Failed (Crash)");
         console.log(gname+" crash");
     }
    });
    function setDest(evt, val){
         var i, tabcontent, tablinks;
         this.dest = val;
         selected = val;
         console.log("Tab id= " + val);
         console.log("selected= " + selected);
         tabcontent = document.getElementsByClassName("tabcontent");
         for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
         }
         tablinks = document.getElementsByClassName("tablinks");
         for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
         }
            if (val == 'all'){
                document.getElementById("10").style.display = "block";
                $("#broadcast").text("Broadcast All");
            } else {
                document.getElementById(clientList.indexOf(val)).style.display = "block";
                $("#broadcast").text("Broadcast " + val);
                socket.emit('give update', selected);
            }
         evt.currentTarget.className += " active";
    }
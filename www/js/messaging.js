    var audio = new Audio('../sound/mario1.wav');
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
    function changeMap(p){
        if (p == 0) {
            $("#map").css("display","block");
            $("#list").css("display","none");
            $("#bigmap").css("display","block");
            $("#smallmap").css("display","none");
        } else {
            $("#map").css("display","none");
            $("#list").css("display","block");
            $("#smallmap").css("display","block");
            $("#bigmap").css("display","none");
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
        if (gname == "Instructor"){
            socket.emit('instructor join');
            $("#users").width("20%");
            $("#users").css("float","left");
            $("#map").width("55%");
            $("#map").css("float","left");
            $("#chat").width("25%");
            $("#chat").css("float","right");
        } else {
            socket.emit('user join', gname);
            $("#users").css("display", "none");
            $("#map").width("75%");
            $("#map").css("float","left");
            $("#chat").width("25%");
            $("#chat").css("float","right");
            $("#avatar").css("left", screen.width*0.55*0.5 +"px");
            $("#controls").css("left", screen.width*0.55*0.5 +"px");
        }
    });

    $("#broadcast").click(function(){
        warningList.length = 0;
            $('#users :checked').each(function() {
                warningList.push($(this).val());
            });
            socket.emit('broadcast', selected, warningList);
    });
    });
        socket.on('instructor join', function(){
            console.log("instructor join emit");
            if (gname == "Instructor"){
                console.log("instructor join emit gname = Instructor");
                $("#avatar").hide();
                $('#buts').append('<button class="tablinks" type = "button" id = "all" value = "all"  onclick="setDest(event,this.value)"> ALL </button>');
                document.getElementById("10").style.display = "block";
            }
        });
        socket.on('user join', function(lname){
            if(gname == 'Instructor'){
                clientList[c_index]= lname;
                console.log("user join clientList " + c_index + " = " + lname);
                $("#" + c_index).append('<h3 style="clear:both;">'+ lname +'</h3>');
                $('#10').append('<button class="tablinks" type = "button" value="'+lname+'"onclick="setDest(event,this.value)">'+lname+'</button>');
                
                /*
                var element = document.createElement("div");
                    element.setAttribute("id", lname);
                    element.innerHTML = lname;
                    element.onclick = function () {
                        if ($.inArray(lname, selected) == -1){
                            selected.push(lname);
                            console.log(lname + " deselected");
                            $(this).css("border-style", "solid");
                            $(this).css("border-width", "2px");
                            $(this).css("border-color", "white");
                        } else {
                            selected.splice($.inArray(lname, selected),1);
                            console.log(lname + " deselected");
                            $(this).css("border-style", "none");
                        }
                    }
                    $("#users").append(element);
                */
                
                c_index += 1;
            } else if (gname == lname && gname != "Instructor"){
                $('#map').append($('<h1> '+lname + 's SCREEN </h1>'));
                $('#buts').css("display","none");
                $("#0").css("display","block");
                 var img = new Image();
                img.onload = function(){
                    // create a hidden canvas, exactly the size of our small image
                  //  var hidden_canvas = document.createElement("canvas");
                    var hidden_canvas = document.getElementById("list")
                    hidden_canvas.width = canvasWidth;
                    hidden_canvas.height = canvasHeight;
                    var hidden_context = hidden_canvas.getContext("2d");        

                    // draw the image on the hidden canvas
                    hidden_context.drawImage(img, 0, 0);

                    // set up the visible canvas
                   // var visible_canvas = document.getElementById("list");
                 //   var visible_context = visible_canvas.getContext("2d");

                    // draw on the visible canvas using the image from the hidden canvas
                  //  visible_context.drawImage(hidden_canvas,0,0);    
                };
                /*
                
                To change map chang ethis path!
                
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
            }
         evt.currentTarget.className += " active";
    }
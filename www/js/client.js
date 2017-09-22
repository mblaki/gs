    var initX = 0;
    var initY = 0;
    var canvas;
    var positionInfo = 0;
    var canvasHeight = 0;
    var canvasWidth = 0;
    window.addEventListener('load', function() {
        canvas = document.getElementById('list');
        positionInfo = canvas.getBoundingClientRect();
        canvasHeight = positionInfo.height;
        canvasWidth = positionInfo.width;
        var w = canvas.width;
        var h = canvas.height;
        alert("canvasHeight: " + canvasHeight + " -- canvasWidth: " + canvasWidth + " w- " + w + " h- " + h);
    }, false);
   
    socket.on('game loop', function(){
        if(gname != "Instructor") {
            initY += 10;
            document.getElementById('map').style.backgroundPositionY = initY + "px";
        }
    });

    $(document).keydown(function(e){
    if(e.keyCode == 38) {//up
        
      initY += 10;
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
        document.getElementById('map').style.backgroundPositionY = initY + "px";
        var e=document.getElementById("list");
        var c = e.getContext('2d');
        var p = c.getImageData(initX-50, initY-50, 1, 1).data; 
        console.log("p0: " + p[0] + " \np1: " + p[1] + " \np2: " + p[2] + " \np3: " + p[3] + "\ninitX: " + initX + "\ninitY: " + initY);
        if (p[0] < 50 && p[0] != 0){
            alert("CRASH");
            console.log("CRASH at "+ initX + " , " + initY);
        }
    }
    else if(e.keyCode == 40) {//down
      initY -= 10;
        if(initY > canvasHeight){
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
      document.getElementById('map').style.backgroundPositionY = initY + "px";
    }
    else if(e.keyCode == 37) {//left
      initX += 10;
        if(initY > canvasHeight){
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
        document.getElementById('map').style.backgroundPositionX = initX + "px";
    }
    else if(e.keyCode == 39) {//right
      initX -= 10;
        if(initY > canvasHeight){
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
        document.getElementById('map').style.backgroundPositionX = initX + "px";
    }
});
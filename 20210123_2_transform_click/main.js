var pos = [0,0];
var offset_pos = [0,0];
var is_dragging = false;

$(document).ready(function(){
    $("#svg1").css("background-color", "#ccc");

    $("#rect1").click(function(e){
        console.log("----- rect1 cliked! -----");
        console.log("screen=" + e.screenX + "," + e.screenY);
        console.log("page=" + e.pageX + "," + e.pageY);
        console.log("client=" + e.clientX + "," + e.clientY);
        console.log("offset=" + e.offsetX + "," + e.offsetY);
    });
});

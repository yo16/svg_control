
$(document).ready(function(){
    draw_base($("#svg1"));

    $("#g1").click(function(e){
        console.log("----- g1 cliked! -----");
        console.log("screen=" + e.screenX + "," + e.screenY);
        console.log("page=" + e.pageX + "," + e.pageY);
        console.log("client=" + e.clientX + "," + e.clientY);
        console.log("offset=" + e.offsetX + "," + e.offsetY);
    });
});


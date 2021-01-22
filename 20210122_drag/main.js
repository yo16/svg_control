var pos = [0,0];
var offset_pos = [0,0];
var is_dragging = false;

$(document).ready(function(){
    $("#svg1").css("background-color", "#ccc");
    draw_elms();

    $("#svg1").mousemove(function(e){
        if( is_dragging ){
            // マウスの位置からoffset分、原点方向へ戻す
            pos[0] = e.clientX - offset_pos[0];
            pos[1] = e.clientY - offset_pos[1];

            draw_elms();
        }
    });
    $("#rect1").mousedown(function(e){
        // クリックした位置と(x,y)の距離をoffsetとする
        offset_pos[0] = e.clientX - $(this).attr("x");
        offset_pos[1] = e.clientY - $(this).attr("y");
        is_dragging = true;
    });
    $("#svg1").mouseup(function(e){
        is_dragging = false;
    });
});

function draw_elms(){
    /*
    $("#rect1")[0].setAttribute("x", pos[0]);
    $("#rect1")[0].setAttribute("y", pos[1]);
    */
    // jQueryでも動く
    $("#rect1").attr("x", pos[0]);
    $("#rect1").attr("y", pos[1]);
}


$(document).ready(function(){
    draw_base($("#svg1"));

    add_clicked_pos_event($("#svg1"));
});

// クリックした位置に点と座標値を描く、クリックイベントを追加
function add_clicked_pos_event(elm){
    elm.click(function(e){
        elm.append($(circle(
            e.offsetX, e.offsetY,
            5, "#f00",1, "#fcc"
        )));

        elm.append($(text(
            e.offsetX, e.offsetY,
            "("+e.offsetX+", "+e.offsetY+")",16
        )));
    });
}


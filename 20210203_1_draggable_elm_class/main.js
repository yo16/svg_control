var draggables = [];

$(document).ready(function(){
    draw_base($("#svg1"));

    // 要素を登録
    draggables.push(new DraggableBox("#rect1"));
    draggables.push(new DraggableBox("#rect2"));

    $("#svg1").mousemove(function(e){
        draggables.forEach(elm => elm.moving(e.clientX, e.clientY));
    });
    $("#svg1").mousedown(function(e){
        draggables.forEach(elm => elm.start_dragging(e.clientX, e.clientY));
    });
    $("#svg1").mouseup(function(e){
        draggables.forEach(elm => elm.finish_dragging());
    });
});

// draggableな要素クラス
class DraggableBox{
    constructor(elmId){
        /* コンストラクタ
        elmId: 要素ID. #付きで渡すこと
        */
        this.elm_id = elmId;
        this.elm = $(elmId);
        // 初期位置
        this.pos = [
            this.elm.attr("x"),
            this.elm.attr("y")
        ];
        // ドラッグ時のオフセット（ドラッグ移動距離）
        this.offset_pos = [0,0];
        this.is_dragging = false;
    }

    start_dragging(clicked_x, clicked_y){
        /* ドラッグ開始
        clicked_x: クリックしたx位置
        clicked_y: クリックしたy位置
        */
        this.offset_pos = [
            clicked_x - this.pos[0],
            clicked_y - this.pos[1]
        ];
        this.is_dragging = true;
    }

    finish_dragging(){
        this.is_dragging = false;
    }

    moving(mouse_x, mouse_y){
        /* 移動
        mouse_x: 今のマウスx位置
        mouse_y: 今のマウスy位置
        */
        if( !this.is_dragging ){ return; }

        // マウスの位置からoffset分、原点方向へ戻す
        this.pos[0] = mouse_x - this.offset_pos[0];
        this.pos[1] = mouse_y - this.offset_pos[1];
        
        // 属性を変更する
        this.elm.attr("x", this.pos[0]);
        this.elm.attr("y", this.pos[1]);
    }
}

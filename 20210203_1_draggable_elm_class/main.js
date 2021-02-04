var draggable_elms = null;

$(document).ready(function(){
    draw_base($("#svg1"));

    // 要素を登録
    draggable_elms = new DraggableElms("#svg1");
    draggable_elms.add_elm("#rect1");
    draggable_elms.add_elm("#rect2");
});

// draggableな要素をまとめるクラス
class DraggableElms{
    constructor(svg_elm_id){
        this.draggables = [];
        this.draggables_id2idx_map = {};
        this.svg_elm = $(svg_elm_id);
        this.cur_dragging_elm_idx = null;
        // イベントリスナーを登録
        // 各svg要素にmousemove、upを任せると、カーソルを速く動かした時に要素から外れてしまい、
        // mousemove、upをlistenできなくなってしまう。
        // そのため、svg要素でlistenして、子に伝える。
        // mousedownは、svg要素でlistenすると、どの子か判定する必要が生じてしまうので
        // 子に任せておいて、子から親へstart_dragging()で通知するようにした。
        this.svg_elm.mousemove(e => {
            if(this.cur_dragging_elm_idx === null){ return; }
            this.draggables[this.cur_dragging_elm_idx].moving(e.clientX, e.clientY);
        });
        this.svg_elm.mouseup(e => {
            if(this.cur_dragging_elm_id === null){ return; }
            this.draggables[this.cur_dragging_elm_idx].finish_dragging(e);
        })

    }
    start_dragging(elm_id){
        /* 各要素からドラッグが開始された旨の通知を受ける
        */
        // 要素idからidxを取得
        var cur_idx = this.draggables_id2idx_map[elm_id];
        this.cur_dragging_elm_idx = cur_idx;
    }
    add_elm(elm_id){
        // マップに追加
        this.draggables_id2idx_map[elm_id] = this.draggables.length;

        // box以外もできるといいな
        this.draggables.push(new DraggableBox(elm_id));
    }
}

// draggableな要素クラス
class DraggableBox{
    constructor(elm_id){
        /* コンストラクタ
        elm_id: 要素ID. #付きで渡すこと
        */
        this.elm_id = elm_id;
        this.elm = $(elm_id);
        // 初期位置
        this.pos = [
            this.elm.attr("x"),
            this.elm.attr("y")
        ];
        // ドラッグ時のオフセット（ドラッグ移動距離）
        this.offset_pos = [0,0];
        this.is_dragging = false;

        // イベントリスナーの登録
        this.elm.mousedown(e => {
            this.start_dragging(e.clientX, e.clientY);
            // ドラッグが始まったことをSVGへ通知
            draggable_elms.start_dragging(this.elm_id);
        });
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

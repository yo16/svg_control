var draggable_elms = null;
var timer = null;

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

        this.moving_elms = [];
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
        this.draggables.push(new DraggableBox_withInertia(elm_id));
    }
    add_moving_elm(elm_id){
        /* 動いている要素の登録
        Returns
        -------
        is_first_elm: bool
            １つ目の登録かどうか。
            １つ目の場合は、Timerを起動することを期待する。
        */
        if( this.moving_elms.indexOf(elm_id)<0 ){
            this.moving_elms.push(elm_id);
        }
        return (this.moving_elms.length==1);
    }
    remove_moving_elm(elm_id){
        /* 動いている要素の削除
        Returns
        -------
        empty_elms: bool
            削除した結果、空になったかどうか
        */
        this.moving_elms = this.moving_elms.filter(e => e!==elm_id);

        return (this.moving_elms.length==0);
    }
    tick(){
        /* moving_elmsを動かす
        */
        this.moving_elms.forEach(elm_id => {
            let cur_idx = this.draggables_id2idx_map[elm_id];
            this.draggables[cur_idx].tick();
        });
    }
}

// draggableな要素クラス慣性付き
class DraggableBox_withInertia{
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

        // 直近３点
        this.near_points = [];
        this.POINTS_NUM = 3;

        // 速度ベクトル
        this.vector = [0,0];
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
        // near_pointsが溜まっていたら慣性移動
        if(this.near_points.length>1){
            // 速度ベクトル算出
            let last_xy = this.near_points.pop();
            let first_xy = this.near_points.shift();
            this.vector = [last_xy[0]-first_xy[0], last_xy[1]-first_xy[1]];

            // タイマー起動
            start_timer(this.elm_id);
        }

        // 初期化
        this.is_dragging = false;
        this.near_points = [];
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

        // 位置を保存
        if( this.near_points.length>(this.POINTS_NUM-1) ){
            // 先頭を取り出す
            this.near_points.shift();
        }
        // 最後に追加
        this.near_points.push([this.pos[0], this.pos[1]]);
    }

    tick(){
        /* タイマーで実行される関数
        */
        // ベクトル値を座標値へ加える
        this.pos[0] += this.vector[0];
        this.pos[1] += this.vector[1];
        // 属性を変更する
        this.elm.attr("x", this.pos[0]);
        this.elm.attr("y", this.pos[1]);

        // 摩擦
        let friction = 0.3;
        this.vector[0] = this.vector[0]*(1 - friction);
        this.vector[1] = this.vector[1]*(1 - friction);

        // x,y両方とも成分が0になったら終了
        if( this.vector[0]<1 && this.vector[1]<1 ){
            this.vector[0] = 0;
            this.vector[1] = 0;
            stop_timer(this.elm_id);
        }
    }
}

// タイマーを起動させる
function start_timer(elm_id){
    // 稼働リストへ追加
    let is_first_elm = draggable_elms.add_moving_elm(elm_id);

    // 最初の登録の場合はタイマーを起動
    if( is_first_elm ){
        console.log("start!!");
        timer = setInterval(tick_all, 10);
    }
}

// タイマーを停止させる
function stop_timer(elm_id){
    // 要素を稼働リストから外す
    let empty_elms = draggable_elms.remove_moving_elm(elm_id);

    // 全部削除された場合は、タイマーを止める
    if( empty_elms ){
        console.log("stop!!");
        clearInterval(timer);
    }
}

// タイマーで実行される関数
function tick_all(){
    draggable_elms.tick();
}
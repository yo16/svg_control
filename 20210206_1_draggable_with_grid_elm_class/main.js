var draggable_elms = null;
var am = null;

$(document).ready(function(){
    draw_base($("#svg1"));

    // 要素を登録
    draggable_elms = new DraggableElms("#svg1");
    draggable_elms.add_elm("#rect1");
    draggable_elms.add_elm("#rect2");

    // 自動移動装置を起動
    am = new AutoMove();
});

// draggableな要素をまとめるクラス
class DraggableElms{
    constructor(svg_elm_id){
        this.draggables = [];
        this.draggables_id2idx_map = {};
        this.svg_elm = $(svg_elm_id);
        this.cur_dragging_elm_idx = null;

        // グリッド幅
        this.GRID_WIDTH = 50;

        // グリッド移動用タイマー
        this.grid_movement_timer = null;

        // イベントリスナーを登録
        // 各svg要素にmousemove、upを任せると、カーソルを速く動かした時に要素から外れてしまい、
        // mousemove、upをlistenできなくなってしまう。
        // そのため、svg要素でlistenして、子に伝える。
        // mousedownは、svg要素でlistenすると、どの子か判定する必要が生じてしまうので
        // 子に任せておいて、子から親へstart_dragging()で通知するようにした。
        this.svg_elm.mousemove(e => {
            if(this.cur_dragging_elm_idx === null){ return; }
            this.draggables[this.cur_dragging_elm_idx].dragging(e.clientX, e.clientY);
        });
        this.svg_elm.mouseup(e => {
            if(this.cur_dragging_elm_idx === null){ return; }
            let cur_elm = this.draggables[this.cur_dragging_elm_idx];
            // ドラッグ終了
            cur_elm.finish_dragging(e);

            // グリッド移動開始
            // 今の位置から一番近いgrid点を探し、そこへ移動させる
            let nearest_grid = this.get_nearest_grid_point(cur_elm.pos);
            am.regist_elm(cur_elm, nearest_grid);
        });

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

    get_nearest_grid_point(pos){
        /* 一番近いgrid点を返す
         */
        let ret_point = [0,0];
        // x,y座標各々で計算
        for( let i=0; i<2; i++ ){
            let div = Math.floor( pos[i] / this.GRID_WIDTH );
            let rem = pos[i] % this.GRID_WIDTH;

            if( rem < this.GRID_WIDTH/2 ){
                // divの点に近い
                ret_point[i] = div * this.GRID_WIDTH;
            } else {
                // 次の点に近い
                ret_point[i] = (div+1) * this.GRID_WIDTH;
            }
        }
        return ret_point;
    }
}


// 要素自動移動クラス
class AutoMove{
    constructor(){
        this.timer = null;
        this.elms = [];

        // 移動量係数（残距離にこの値を掛けた距離を移動する）
        this.MOVE_RATE = 0.2;
        // 最小移動距離
        this.MIN_DISTANCE = 5;
    }

    regist_elm(elm, pos){
        // 登録済みだったら取り出す
        // to_posが変わる可能性があるため
        this.elms = this.elms.filter(e => e['elm'].elm_id !== elm.elm_id);

        // 登録
        this.elms.push(
            {
                'elm': elm,
                'to_pos': pos
            }
        );
        // タイマー起動
        if(this.elms.length==1){
            this.timer = setInterval(AutoMove.tick, 10);
        }
    }

    static tick(){
        for(let i=(am.elms.length-1); i>=0; i--){
            let cur_elm_info = am.elms[i];
            // 移動
            let finished_moving = am.move_elm_to_target(cur_elm_info['elm'], cur_elm_info['to_pos']);
            if( finished_moving ){
                // ゴールに着いたら配列から取り出す
                am.elms = am.elms.filter(e => e!==cur_elm_info);
            }
        }

        // 要素が全部なくなったらタイマー停止
        if(am.elms.length==0){
            clearInterval(am.timer);
            am.timer = null;
            return;
        }
    }

    move_elm_to_target(elm, target_pos){
        /* 指定された要素をターゲット位置まで移動する
           指定位置に着いたらtrue、着いていない場合はfalseを返す。
         */
        // 残距離を計算
        let distance = Math.sqrt((target_pos[0]-elm.pos[0])**2 + (target_pos[1]-elm.pos[1])**2);

        let ret_val = false;
        if( distance < this.MIN_DISTANCE ){
            // 残距離が最小移動距離より小さかったら、直接ゴール
            elm.move_to(target_pos[0], target_pos[1]);
            ret_val = true;
        }else{
            // 移動量係数を掛けた距離だけ移動
            elm.move_to(
                elm.pos[0] + (target_pos[0]-elm.pos[0]) * this.MOVE_RATE,
                elm.pos[1] + (target_pos[1]-elm.pos[1]) * this.MOVE_RATE
            );
        }
        return ret_val;
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

    dragging(mouse_x, mouse_y){
        /* ドラッグ移動
        mouse_x: 今のマウスx位置
        mouse_y: 今のマウスy位置
         */
        if( !this.is_dragging ){ return; }

        // マウスの位置からoffset分、原点方向へ戻す
        let x = mouse_x - this.offset_pos[0];
        let y = mouse_y - this.offset_pos[1];
        
        // 移動
        this.move_to(x,y);
    }

    move_to(x,y){
        this.pos[0] = x;
        this.pos[1] = y;
        this.elm.attr("x", x);
        this.elm.attr("y", y);
    }
}

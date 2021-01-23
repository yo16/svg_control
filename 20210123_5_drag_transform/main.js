
$(document).ready(function(){
    draw_base($("#svg1"));
    $("#svg1").on('contextmenu',function(e){return false});

    add_drag_event($("#svg1"));
});

var initial_matrix = [1,0,0,1,0,0];
var pos_mousedown = [0,0];
var is_mousedown = -1;   // [-1:なし, 0:左, 1:中, 2:右]
const re = /matrix\(([0-9\.\-,]+)\)/;
function add_drag_event(elm_event){
    elm_event.mousemove(function(e){
        if(is_mousedown>=0){
            // mousedown位置から今の座標へのベクトル
            let diff = [
                e.offsetX-pos_mousedown[0],
                e.offsetY-pos_mousedown[1]
            ];
            // 新しいmatrixを作る
            let cur_matrix = [0,0,0,0,0,0];
            if(is_mousedown==0){
                // 平行移動は、足すだけ（拡大縮小->平行移動の順番だから、拡大縮小は考えなくていい）
                for(let i=0; i<4; i++){
                    cur_matrix[i] = initial_matrix[i];
                }
                cur_matrix[4] = initial_matrix[4] + diff[0];
                cur_matrix[5] = initial_matrix[5] + diff[1];
            }else if(is_mousedown==2){
                // z=x-yで線形にスケール
                let scale = Math.pow(1.01, diff[0]-diff[1]);
                // initial_matrixに対して、始点を中心とした拡大縮小を行う
                // 始点を中心とした拡大/縮小とは、下記の組み合わせ
                // 1. 始点->原点へ移動
                // 2. 拡大縮小
                // 3. 原点->始点へ移動
                cur_matrix = scale_matrix(
                    initial_matrix,
                    pos_mousedown,
                    scale
                );
            }
            // 新しいmatrixを適用
            let elm = $("#mtx1");
            elm.attr(
                "transform",
                "matrix("+cur_matrix.join(",")+")"
            );
        }
    });
    elm_event.mousedown(function(e){
        pos_mousedown = [e.offsetX, e.offsetY];
        console.log(e.button);
        if(e.button==1){
            $("#mtx1").attr("transform", "matrix(1,0,0,1,0,0)");
            return;
        }
        is_mousedown = e.button;
        let elm = $("#mtx1");
        let mtx_str = elm.attr("transform");
        let m = mtx_str.match(re);
        if(m){
            let mtx = m[1].split(",");
            for(let i=0; i<6; i++){
                initial_matrix[i] = mtx[i]-0;
            }
        }
    });
    elm_event.mouseup(function(){
        is_mousedown = -1;
    });
}

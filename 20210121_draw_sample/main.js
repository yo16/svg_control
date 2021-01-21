$(document).ready(function(){
    $("#svg1").css("background-color", "#ccc");

    draw_circle_scale([150,150],100);
    draw_circle_scale([150,350],100);
    draw_circle_scale([350,150],100);
    draw_circle_scale([350,350],100);
});

// 線を描画する
function draw_circle_scale(pos_center, r){
    // 初期値
    let rgb = [0,0,0];
    let rgb_direction = [0,0,0];
    for(let i=0; i<3; i++){
        rgb[i] = Math.floor(Math.random()*256);
        rgb_direction[i] = Math.random()*2-1;
    }

    // 中心から始点までのベクトル
    let r_vec = [r, 0]
    // 描画
    for(let i=0; i<360; i++){
        // 色をちょっと変化させる
        for(let j=0; j<3; j++){
            rgb[j] = rgb[j] + rgb_direction[j]*5;
            if(rgb[j]<0){
                rgb[j] = 1;
                rgb_direction[j] *= -1;
            }else if(rgb[j]>255){
                rgb[j] = 254;
                rgb_direction[j] *= -1;
            }
        }
        let col = "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";

        // 終点
        let pos2 = [
            pos_center[0] + r_vec[0]*Math.cos(i*Math.PI/180) - r_vec[1]*Math.sin(i*Math.PI/180),
            pos_center[1] + r_vec[0]*Math.sin(i*Math.PI/180) + r_vec[1]*Math.cos(i*Math.PI/180),
        ];

        // 要素作成
        $("#svg1").append(
            $(line(
                pos_center[0],
                pos_center[1],
                pos2[0],
                pos2[1],
                col
            ))
        );
    }
}

// line要素を作る
// jQueryで作ったline要素は認識してもらえないし、attributeを入れても無視される。
function line(x1, y1, x2, y2, col){
    let line =  document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', col);
    line.setAttribute('stroke-width', '1');

    return line;
}

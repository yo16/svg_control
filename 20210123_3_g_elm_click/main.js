
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





// svgの方眼線を描く
function draw_base(svg_elm){
    svg_elm.css("background-color", "#ccc");
    let g = $(document.createElementNS("http://www.w3.org/2000/svg", "g"));

    // 要素の幅
    let line_interval = 50;
    // 縦線
    for(let x=line_interval; x<svg_elm.width(); x+=line_interval){
        g.append(line(
            x, 0, x, svg_elm.height(), "#aac", 1
        ));
    }
    // 横線
    for(let y=line_interval; y<svg_elm.height(); y+=line_interval){
        g.append(line(
            0, y, svg_elm.width(), y, "#aac", 1
        ));
    }

    svg_elm.prepend(g);
}

// line要素を作る
// jQueryで作ったline要素は認識してもらえないし、attributeを入れても無視される。
function line(x1, y1, x2, y2, col, w){
    let line =  document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", col);
    line.setAttribute("stroke-width", w);

    return line;
}

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

// 円要素を作る
function circle(x, y, r, col, w, fill_col){
    let p = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    p.setAttribute("cx", x);
    p.setAttribute("cy", y);
    p.setAttribute("r", r);
    p.setAttribute("stroke", col);
    p.setAttribute("stroke-width", w);
    p.setAttribute("fill", fill_col);
    
    return p;
}

// text要素を作る
function text(x, y, t, font_size){
    let txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
    txt.setAttribute("x", x);
    txt.setAttribute("y", y);
    txt.setAttribute("font-size", font_size);
    txt.appendChild(document.createTextNode(t));

    return txt;
}

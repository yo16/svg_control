$(document).ready(function(){
    $("#svg1").css("background-color", "#ccc");

    let line1 = $(line(0,0,100,100, "#f00"));
    line1.click(function(e){
        console.log("----- line1 cliked! -----");
        console.log("screen=" + e.screenX + "," + e.screenY);
        console.log("page=" + e.pageX + "," + e.pageY);
        console.log("client=" + e.clientX + "," + e.clientY);
        console.log("offset=" + e.offsetX + "," + e.offsetY);
    });
    $("#svg1").append(line1);

    let rect1 = $(rect(100,100,200,200, "#0f0"));
    rect1.click(function(e){
        console.log("----- rect1 cliked! -----");
        console.log("screen=" + e.screenX + "," + e.screenY);
        console.log("page=" + e.pageX + "," + e.pageY);
        console.log("client=" + e.clientX + "," + e.clientY);
        console.log("offset=" + e.offsetX + "," + e.offsetY);
    });
    $("#svg1").append(rect1);

    let rect2 = $(rect(150,150,250,250, "#00f"));
    rect2.click(function(e){
        console.log("----- rect2 cliked! -----");
        console.log("screen=" + e.screenX + "," + e.screenY);
        console.log("page=" + e.pageX + "," + e.pageY);
        console.log("client=" + e.clientX + "," + e.clientY);
        console.log("offset=" + e.offsetX + "," + e.offsetY);
    });
    $("#svg1").append(rect2);

    $("#svg1").click(function(e){
        console.log("----- svg cliked! -----");
        console.log("screen=" + e.screenX + "," + e.screenY);
        console.log("page=" + e.pageX + "," + e.pageY);
        console.log("client=" + e.clientX + "," + e.clientY);
        console.log("offset=" + e.offsetX + "," + e.offsetY);
    });
});

// line要素を作る
// jQueryで作ったline要素は認識してもらえないし、attributeを入れても無視される。
function line(x1, y1, x2, y2, col){
    let line =  document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", col);
    line.setAttribute("stroke-width", "5");

    return line;
}

// rect要素を作る
function rect(x1, y1, x2, y2, col){
    let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", x1);
    rect.setAttribute("y", y1);
    rect.setAttribute("width", Math.abs(x1-x2));
    rect.setAttribute("height", Math.abs(y1-y2));
    rect.setAttribute("stroke", col);
    rect.setAttribute("fill", col);

    return rect;
}

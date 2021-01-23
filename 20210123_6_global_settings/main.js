
$(document).ready(function(){
    draw_base($("#svg1"));

    $("#num1").bind("keyup mouseup", function(){
        $("#g1").attr("stroke-width", $("#num1").val());
    });
});


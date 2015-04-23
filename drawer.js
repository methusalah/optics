
var lastRedraw = new Date().getTime();
redraw = function(){
    var time = new Date().getTime();
    var fps = 1000/(time-lastRedraw);
    var tps = fps*model.tickCount;
    model.tickCount = 0;
    lastRedraw = time;


    ctx.putImageData(img, 0, 0);

    // items
    ctx.strokeStyle = "rgba(100, 100, 150, 1)";
    for(var i=0; i<model.pool.length; i++)
        if(model.pool[i].shape instanceof Polyline2D)
            drawPolyline(model.pool[i].shape);



    // GUI
    ctx.fillStyle = "rgba(100, 100, 100, 0.5)";
    if(model.aimed)
        drawDisc(new Circle(model.aimed.coord, 20))

    ctx.fillStyle = "rgba(150, 100, 100, 0.5)";
    if(model.selected)
        drawDisc(new Circle(model.selected.coord, 20))

    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.font="11px Verdana";
    ctx.fillText("fps : "+parseInt(fps),10,300);
    ctx.fillText("tps : "+parseInt(tps),10,315);
    ctx.fillText("rays : "+model.rayCount,10,330);
    setTimeout(redraw, 30);
};

updateGUI = function(){
    if(model.selected){
        if(model.selected.type == "light"){
            $(".lightpanel").show();
            $(".surfacepanel").hide();
            var s = model.selected;
            $(".in_arc, .ran_arc").val(s.arc);
            $(".in_size, .ran_size").val(s.size);
        } else {
            $(".lightpanel").hide();
            $(".surfacepanel").show();
            var s = model.getCurrentSurface();
            if(s.ref>0)
                $(".inside_refraction_cursors").css('visibility', 'visible');
            else
                $(".inside_refraction_cursors").css('visibility', 'hidden');

            $(".in_specular, .ran_specular").val(s.spec);
            $(".in_diffusion, .ran_diffusion").val(s.diff);
            $(".in_refraction, .ran_refraction").val(s.ref);
            $(".in_minRef, .ran_minRef").val(s.minRef);
            $(".in_maxRef, .ran_maxRef").val(s.maxRef);
        }
    } else {
        $(".lightpanel").hide();
        $(".surfacepanel").hide();
    }
};




/* Drawing functions
*/
drawPoint = function(p, stroke){
    var c1 = p.getSub(stroke);
    var c2 = p.getAdd(stroke);

    ctx.fillRect(c1.x, c1.y, stroke*2, stroke*2);
}

drawPolyline = function(pl){
    for(var i=0; i<pl.lines.length; i++)
        drawLine(pl.lines[i]);
}
drawLine = function(l) {
    l = l.toFinite();
    ctx.beginPath();
    ctx.moveTo(l.start().x, l.start().y);
    ctx.lineTo(l.end().x, l.end().y);
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();
}

drawCircle = function(c){
    ctx.beginPath();
    ctx.arc(c.center.x, c.center.y, c.radius, 0, Angle.FULL);
    ctx.stroke();
    ctx.closePath();
}
drawDisc = function(c){
    ctx.beginPath();
    ctx.arc(c.center.x, c.center.y, c.radius, 0, Angle.FULL);
    ctx.fill();
    ctx.closePath();
}
function createPointLight(){
    i = new Item(new Point2D(10, 170), 0);
    i.type = "light";
    i.arc = 0.1;
    i.size = 1;
    i.act = function(){
        var res = [];
        for(var i=0; i<20; i++){
            var source = this.coord;
            if(this.size>1)
                source = source.getTranslated(Math.random()*Angle.FULL, this.size);
            var a = Angle.toRad(this.arc/2)+this.angle;
            a -= Math.random()*Angle.toRad(this.arc);
            var l = new Lightray(source, a);
            l.intensity = 0.05;
            res.push(l);
        }
        return res;
    }
    model.add(i);
}

function createMirror(){
    var extent = 100;
    var pl = new Polyline2D();
    pl.add(new Point2D(0, -extent));
    pl.add(new Point2D(0, extent));
    pl.add(new Point2D(-extent/2, 0));
    pl.add(new Point2D(0, -extent));

    var i = new Item(new Point2D(canvas.width/2, canvas.height/2), 0);
    i.outside.spec = 1;
    i.initialShape = pl;
    i.update();
    model.add(i);
};

function createCurvedMirror(){
    var pl = new Polyline2D(true);
    var arc = Angle.toRad(180);
    var faceCount = 20;
    var extent = 150;
    var p, pivot;
    if(arc < Angle.FLAT){
        p = new Point2D(0, -Math.sin(arc/2)*extent);
        pivot = new Point2D(-Math.cos(arc/2)*extent, 0);
    } else {
        p = new Point2D(Math.cos(arc/2)*extent, -Math.sin(arc/2)*extent);
        pivot = new Point2D(0, 0);
    }

    for(var i=0; i<=faceCount; i++){
        pl.add(p.getRotated(i*arc/faceCount, pivot));
    }

    var i = new Item(new Point2D(canvas.width/2, canvas.height/2), 0);
    i.inside.spec = 1;
    i.outside.spec = 1;

    i.initialShape = pl;
    i.update();
    model.add(i);
};

function createWall(){
    var extent = 100;
    var pl = new Polyline2D();
    pl.add(new Point2D(5, -extent));
    pl.add(new Point2D(5, extent));
    pl.add(new Point2D(-5, extent));
    pl.add(new Point2D(-5, -extent));
    pl.add(new Point2D(5, -extent));

    var i = new Item(new Point2D(canvas.width/2, canvas.height/2), 0);
    i.outside.diff = 1;
    i.initialShape = pl;
    i.update();
    model.add(i);
};

function createPrism(){
    var extent = 400;
    var pl = new Polyline2D();
    pl.add(new Point2D(0, -extent/2));
    pl.add(new Point2D(-extent/2, extent/2));
    pl.add(new Point2D(extent/2, extent/2));
    pl.add(new Point2D(0, -extent/2));

    var i = new Item(new Point2D(canvas.width/2, canvas.height/2), 0);
    i.inside.ref = 1;
    i.inside.minRef = 1.4;
    i.inside.maxRef = 1.5;

    i.outside.ref = 1;
    i.outside.minRef = 1.4;
    i.outside.maxRef = 1.5;

    i.initialShape = pl;
    i.update();
    model.add(i);
};

function createRaindrop(){
    var pl = new Polyline2D(true);
    var faceCount = 20;
    var extent = 300;
    var p = new Point2D(extent, 0);
    for(var i=0; i<=faceCount; i++){
        pl.add(p.getRotated(i*Angle.FULL/faceCount));
    }

    var i = new Item(new Point2D(canvas.width/2, canvas.height/2), 0);
    i.inside.ref = 1;
    i.inside.minRef = 1.05;
    i.inside.maxRef = 1.1;

    i.outside.ref = 1;
    i.outside.minRef = 1.05;
    i.outside.maxRef = 1.1;
    i.initialShape = pl;
    i.update();
    model.add(i);
};
function createMetalRing(){
    var pl = new Polyline2D(true);
    var faceCount = 20;
    var extent = 200;
    var p = new Point2D(extent, 0);
    for(var i=0; i<=faceCount; i++){
        pl.add(p.getRotated(i*Angle.FULL/faceCount));
    }

    var i = new Item(new Point2D(canvas.width/2, canvas.height/2), 0);
    i.inside.spec = 1;
    i.outside.spec = 1;

    i.initialShape = pl;
    i.update();
    model.add(i);
};

function createBox(){
    var pl = new Polyline2D();
    var extent = 100;
    pl.add(new Point2D(extent, -extent));
    pl.add(new Point2D(-extent, -extent));
    pl.add(new Point2D(-extent, extent));
    pl.add(new Point2D(extent, extent));
    pl.add(new Point2D(extent, -extent));

    var i = new Item(new Point2D(canvas.width/2, canvas.height/2), 0);
    i.inside.ref = 1;
    i.inside.minRef = 1;
    i.inside.maxRef = 1.05;

    i.outside.ref = 1;
    i.outside.minRef = 1;
    i.outside.maxRef = 1.05;

    i.initialShape = pl;
    i.update();
    model.add(i);
};

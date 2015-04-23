Lightmap = function(){
    map = new Uint32Array(800*800);
    map = [];
}

Lightmap.prototype = {
	clear: function(){
        if(img)
            img = ctx.createImageData(canvas.width, canvas.height);
		// for(var i=0; i<width*height; i++)
		// 	this.val[i] = {r:1,g:1, b:1, a:1};

		this.width = img.width;
		this.height = img.height;
	},


	draw: function(toDraw, color, glow){
		if(toDraw instanceof Point2D){
            if(!this.isInBounds(toDraw))
                return;
			var i = (Math.floor(toDraw.y)*this.width+Math.floor(toDraw.x))*4;
            if(img.data[i+3] == 0){
                map[i] = color.r;
                map[i+1] = color.g;
                map[i+2] = color.b;
                map[i+3] = color.a;
            } else {
                var r = color.r,
                    g = color.g,
                    b = color.b,
                    a = color.a,
                    br = map[i],
                    bg = map[i+1],
                    bb = map[i+2],
                    ba = map[i+3];

                var rr, rb, rg, ra;

                ra = 1-(1-a)*(1-ba);
                // ra = Math.max(a,ba);
                if (ra < 0.0001){
                    console.info("alpha so much little that we don't draw");
                    rr = rg = rb = 0;
                } else {
                    var nr = r*a/ra,
                        ng = g*a/ra,
                        nb = b*a/ra,
                        nbr = br*ba/ra,
                        nbg = bg*ba/ra,
                        nbb = bb*ba/ra;

                    // var nLum = nr+ng+nb,
                    //     nbLum = nbr+nbg+nbb;
                    // var rLum = 1-(1-nLum/3)*(1-nbLum/3);
                    // rr *= rLum;
                    // rg *= rLum;
                    // rb *= rLum;

                    rr = nr+nbr;
                    rg = ng+nbg;
                    rb = nb+nbb;

                    // rr = 1-(1-nr)*(1-nbr);
                    // rg = 1-(1-ng)*(1-nbg);
                    // rb = 1-(1-nb)*(1-nbb);
                }
                map[i] = rr;
                map[i+1] = rg;
                map[i+2] = rb;
                map[i+3] = ra;

                // Dodge screen
                // br = 1-(1-r)*(1-br);
                // bg = 1-(1-g)*(1-bg);
                // bb = 1-(1-b)*(1-bb);
                // ba = 1-(1-a)*(1-ba);

                // linear dodge
                // br += r;
                // bg += g;
                // bb += b;
                // ba += a;

                // color dodge
                // br = br/(1-r);
                // bg = bg/(1-g);
                // bb = bb/(1-b);
                // ba = ba/(1-a);

                // var max = Math.max(br, Math.max(bg, bb));
                // if(max>1){
                //     br-=max-1;
                //     bg-=max-1;
                //     bb-=max-1;
                // }
                // img.data[i] += color.r*255;
                // img.data[i+1] += color.g*255;
                // img.data[i+2] += color.b*255;
                // img.data[i+3] = color.a*255;
                // while(br>1 || bg>1 || bb>1){
                //     br-=0.001;
                //     bg-=0.001;
                //     bb-=0.001;
                // }
                // img.data[i] = br*255;
                // img.data[i+1] = bg*255;
                // img.data[i+2] = bb*255;
                // img.data[i+3] = ba*255;
            }
            img.data[i] = map[i]*255;
            img.data[i+1] = map[i+1]*255;
            img.data[i+2] = map[i+2]*255;
            img.data[i+3] = map[i+3]*255;
		} else if(toDraw instanceof Line2D){
			this.drawSampleLine(toDraw, color);
            // var i = 0.01;
            // var c1 = {
            //     r:color.r,
            //     g:color.g,
            //     b:color.b,
            //     a:color.a*i,
            // }
            // var tr = new Transform2D(new Point2D().getTranslated(toDraw.angle()+Angle.RIGHT, 1));
            // this.drawLine(toDraw.getTransformed(tr), c1);
            // tr = new Transform2D(new Point2D().getTranslated(toDraw.angle()+Angle.RIGHT, -1));
            // this.drawLine(toDraw.getTransformed(tr), c1);

            // var i = 0.005;
            // var c2 = {
            //     r:color.r,
            //     g:color.g,
            //     b:color.b,
            //     a:color.a*i,
            // }
            // var tr = new Transform2D(new Point2D().getTranslated(toDraw.angle()+Angle.RIGHT, 2));
            // this.drawLine(toDraw.getTransformed(tr), c2);
            // tr = new Transform2D(new Point2D().getTranslated(toDraw.angle()+Angle.RIGHT, -2));
            // this.drawLine(toDraw.getTransformed(tr), c2);
		}
	},

    drawSampleLine: function(l, color){
        var p = l.p0;
        var length = Math.min (2000, l.toFinite().length());
        var angle = l.angle();
        p = p.getTranslated(angle, Math.random()*10);
        while(p.dist(l.p0) <= length){
            if(!this.isInBounds(p))
                break;
            // for(var i=0; i<5; i++){
            //     var rate = Math.random();
            //     var c = {r:color.r*rate*rate,
            //                 g:color.g*rate*rate,
            //                 b:color.b*rate*rate,
            //                 a:color.a*rate*rate}
            this.draw(p, color);
            p = p.getTranslated(angle, Math.random()*10);
        } 
    },

	drawLine: function(l, color){
		// calculate the direction of the ray (linear algebra)
		var start = l.p0, end = l.p1;
        var dirX = end.x-start.x;
        var dirY = end.y-start.y;
        var length = Math.sqrt(dirX * dirX + dirY * dirY);
        dirX /= length; // normalize the direction vector
        dirY /= length;
        var tDeltaX = 1/Math.abs(dirX); // how far we must move in the ray direction before we encounter a new voxel in x-direction
        var tDeltaY = 1/Math.abs(dirY); // same but y-direction
 
        // start voxel coordinates
        var x = Math.floor(start.x);  // use your transformer function here
        var y = Math.floor(start.y);
 
        // end voxel coordinates
        var endX = Math.floor(end.x);
        var endY = Math.floor(end.y);
 
        // decide which direction to start walking in
        var stepX = Math.sign(dirX);
        var stepY = Math.sign(dirY);
 
        var tMaxX, tMaxY;
        // calculate distance to first intersection in the voxel we start from
        if(dirX < 0)
            tMaxX = (x-start.x)/dirX;
        else
            tMaxX = (x+1-start.x)/dirX;
 
        if(dirY < 0)
            tMaxY = (y-start.y)/dirY;
        else
            tMaxY = (y+1-start.y)/dirY;
 
        // check if first is occupied
        var entered = false;
        if(this.isInBounds(start)){
            this.draw(start, color);
            entered = true;
        }
        var i = 0;
        var reachedX = false, reachedY = false;
        while(!reachedX || !reachedY ){
            if(tMaxX < tMaxY){
                tMaxX += tDeltaX;
                x += stepX;
            }else{
                tMaxY += tDeltaY;
                y += stepY;
            }
            p = new Point2D(x, y);
            if(this.isInBounds(p)){
			    this.draw(p, color);
                entered = true;
            } else if(entered)
                return;
            
            if(stepX > 0){
                if (x >= endX)
                    reachedX = true;
            }else if (x <= endX)
                reachedX = true;
 
            if(stepY > 0){
                if (y >= endY)
                    reachedY = true;
            }else if (y <= endY)
                reachedY = true;
            if(i++>this.width*this.height)
                return;
        }
	},

    isInBounds: function(p){
        return !(p.x<0 || p.y<0 || p.x>=this.width || p.y>=this.height);
    }
}
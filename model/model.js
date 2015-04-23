var model = {
	pool: [],
	tickCount: 0,
	maxRays: 5000,
	rayCount: 0,
	lightmap: new Lightmap(),
};

model.tick = function(){
	model.tickCount++;
    var produced = [];

    // all item may do something before interacting with light
	for(var i=0; i<model.pool.length; i++){
		var lr = model.pool[i].act();
		if(lr)
			while(lr.length>0 && model.rayCount<model.maxRays){
				produced.push(lr.shift());
				model.rayCount++;
			}
	}

    while(produced.length>0){
        var lr = produced.shift();
        if(lr.isAttenuated())
            continue;
        var nearestItem = undefined;
        var minDist;
        for(var i=0; i<model.pool.length; i++){
        	var item = model.pool[i];
            item.intersect(lr.ray);
            if(item.collisionPoint){
            	var dist = item.collisionPoint.dist(lr.ray.start());
            	if(dist>0.001 && (!nearestItem || dist<minDist)){
            		nearestItem = model.pool[i];
            		minDist = dist;
            	}
            }
        }
        if(nearestItem){
        	var newlr = nearestItem.interact(lr);
        	while(newlr.length>0 && model.rayCount<model.maxRays){
	            produced.push(newlr.shift());
	            model.rayCount++;
	        }
	    }
        model.enlightMap(lr);
    }
	setTimeout(model.tick, 0);
}

model.add = function(item){
	model.pool.push(item);
	model.clearLight();
}

model.clearLight = function(){
	model.lightmap.clear();
	model.rayCount = 0;
}

model.enlightMap = function(lr){
	model.lightmap.draw(lr.ray.toFinite(), lr.getColor());
}

model.getCurrentSurface = function(){
	if(model.selected)
		if(model.surface == "inside")
			return model.selected.inside;
		else
			return model.selected.outside;
}








/* Item selection and manipulation
*/
model.aim = function(p){
	model.aimedCoord = p;

	// dragging
	if(model.drag){
		model.selected.move(p);
	    model.clearLight();

	// rotating	
	} else if (model.rotate){
		model.selected.setAngle(p.getSub(model.selected.coord).angle());
	    model.clearLight();

	// aiming	
	} else {
		var nearest = model.pool[0];
		for(var i=1; i<model.pool.length; i++)
			if(model.pool[i].coord.dist(p)<nearest.coord.dist(p))
				nearest = model.pool[i];
		if(nearest && nearest.coord.dist(p) < 20)
			model.aimed = nearest;
		else
			model.aimed = undefined;
	}
};

model.select = function(){
	if(model.aimed)
		model.selected = model.aimed;
	updateGUI();
	// else
	// 	model.selected = undefined;
};

model.pressed = function(button){
	model.select();
	if(model.selected && model.aimedCoord.dist(model.selected.coord)<20)
		if(button == 0)
			model.rotate = true;
		else if(button == 2)
			model.drag = true;
};

model.released = function(button){
	model.drag = false;
	model.rotate = false;
};

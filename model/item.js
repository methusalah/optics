Item = function(coord, angle){
	this.coord = coord;
	this.angle = angle;
	this.initialShape = new Point2D();
	this.update();
	this.thickness = 2;
	this.color = "#cccccc";

	this.inside = {
		spec: 0,
		diff: 0,
		ref: 0,
		minRef: 1.2,
		maxRef: 1.3,
	}
	this.outside = {
		spec: 0,
		diff: 0,
		ref: 0,
		minRef: 1.2,
		maxRef: 1.3,
	}
};

Item.prototype = {
	update: function(){
		this.shape = this.initialShape.getTransformed(new Transform2D(this.coord, this.angle));
	},

	move: function(p){
		this.coord = p;
		this.update();
	},

	setAngle: function(a){
		this.angle = a;
		this.update();
	},

	act: function(){

	},

	intersect: function(ray){
		var it = new Intersector(ray, this.shape);
		this.collisionPoint = it.getNearest(ray.start());
		if(this.collisionPoint == undefined)
			return;

		var f = it.nearestIntersected;

		var rate = this.collisionPoint.dist(f.p0)/f.length();
		var n0 = f.smoothNorm0.getNormalized().getMult(1-rate);
		var n1 = f.smoothNorm1.getNormalized().getMult(rate);

		this.collisionNormal = n0.getAdd(n1).angle();
		this.collisionSurface = "in";
		if(Angle.getTurn(f.start(), f.end(), ray.start()) == Angle.CLOCKWISE){
			this.collisionNormal += Angle.FLAT;
			this.collisionSurface = "out";
		}
	},

	interact: function(lightray){
		var surface;
		if(this.collisionSurface == "in"){
			surface = this.inside;
		} else {
			surface = this.outside;
		}


		lightray.collide(this.collisionPoint);
		var res = [];
		if(surface.spec > 0)
			res = res.concat(this.reflect(lightray, surface.spec));
		if(surface.diff > 0)
			res = res.concat(this.diffuse(lightray, surface.diff));
		if(surface.ref > 0)
			res = res.concat(this.refract(lightray, surface.ref, surface.minRef, surface.maxRef));
		return res;
	},


/* REFLEXION
*/
	reflect: function(lightray, ratio){
		var incident = Angle.getOrientedDifference(this.collisionNormal, lightray.ray.angle()+Angle.FLAT);
		var l = new Lightray(lightray, this.collisionNormal-incident);
		l.intensity *= ratio;
		return [l];
	},



/* REFRACTION
*/
	refract: function(lightray, ratio, min, max){
		lightray.collide(this.collisionPoint);

		var index, spectralRate = undefined;
		if(min == max) {
			// Here this is the same refraction index for all the color specter
			index = min;
		} else if(lightray.spectralRate != undefined) {
			// Here the lightray has already been through a refractor and a spectral rate has already been choosen.
			index = min+(max-min)*lightray.spectralRate;
		} else {
			// This lightray is refracted for the first time and a spectral rate must be choosen.
			spectralRate = Math.random();
			index = min+(max-min)*spectralRate;
		}

		var refractionResult = this.getRefracted(lightray, index);
		refractionResult.reflexion.intensity *= ratio;
		var res = [refractionResult.reflexion];
		if(refractionResult.refraction != undefined){
			if(refractionResult.refraction.spectralRate == undefined)
				refractionResult.refraction.spectralRate = spectralRate;
			refractionResult.refraction.intensity *= ratio;
			res.push(refractionResult.refraction);
		}
		return res;
	},

	getRefracted: function(lightray, index){
		// check if the lightray leaves
		var enters = true;
		if(this.shape instanceof Polyline2D &&
				(this.shape.hasOver(lightray.ray.p0) || false)){
//				this.shape.hasInside(lightray.ray.p0))){
			index = 1/index;
			enters = false;
		}

		var incident = Angle.getOrientedDifference(this.collisionNormal, lightray.ray.angle()+Angle.FLAT);

		var critical = Math.asin(index);
		var reflexionCoef, refractionCoef;
		var refractionAngle;
		if(index > 1 || Math.abs(incident) < critical){
			refractionAngle = Math.asin(Math.sin(incident)/index);
			var n1 = 1;
			var n2 = index;
			if(!enters){
				n1 = index;
				n2 = 1;
			}
			var cosI = Math.cos(incident);
			var cosT = Math.cos(refractionAngle);
			
			//var SPolarized = (n1*cosI-n2*cosT)/(n1*cosI+n2*cosT);
			var SPolarized = (n1*cosT-n2*cosI)/(n2*cosI+n1*cosT);
			SPolarized = SPolarized*SPolarized;

			//			var PPolarized = 2*n1*cosI/(n1*cosI+n2*cosT);
			var PPolarized = 2*n1*cosI/(n2*cosI+n1*cosT);
			//var PPolarized = (n1*cosT-n2*cosI)/(n1*cosT+n2*cosI);
			//var PPolarized = (n2*cosI-n1*cosT)/(n2*cosI+n1*cosT);
			PPolarized = PPolarized*PPolarized;
			
			reflexionCoef = Math.max(0, (SPolarized+PPolarized)/2);
			refractionCoef = 1-reflexionCoef;
		} else {
			reflexionCoef = 1;
			refractionCoef = 0;
		}

		var res={};
		reflexionCoef = Math.min(reflexionCoef*1.8, 0.9);
		res.reflexion = new Lightray(lightray, this.collisionNormal-incident);
		res.reflexion.intensity *= reflexionCoef;

		if(refractionCoef>0){
			res.refraction = new Lightray(lightray, this.collisionNormal+Angle.FLAT+refractionAngle);
			res.refraction.intensity *= refractionCoef*1.8;
		}
		return res;
	},	



/* DIFFUSION
*/
	diffuse: function(lightray, ratio){
		var randomAngle = Angle.normalize(this.collisionNormal+Angle.RIGHT*(Math.random()*2-1));
		var l = new Lightray(lightray, randomAngle);
		l.intensity *= ratio;
		return [l];
	},
};
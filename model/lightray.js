Lightray = function(source, angle){
	this.fade = 0.000;

	if(source instanceof Lightray){
		var p = source.ray.end();
		this.ray = new Line2D(p, p.getTranslated(angle, 1), "ray");
		this.fade = source.fade;
		this.color = source.color;
		this.intensity = source.intensity;
		if(this.intensity<0)
			this.intensity = 0;
		this.bounceCount = source.bounceCount+1;
		if(source.spectralRate != undefined)
			this.spectralRate = source.spectralRate;
	} else {
		this.ray = new Line2D(source, source.getTranslated(angle, 1), "ray");
		this.color = {r:1, g:1, b:1, a:1};
		this.intensity = 1;
		this.bounceCount = 0;
	}
};

Lightray.prototype = {
	toString: function(){
		return "this is a light ray !";
	},

	intensityAt: function(p){
		var dist = p.dist(ray.start());
		var interpolated = this.intensity-dist*this.fade;
		if(interpolated<0)
			interpolated = 0;
		return interpolated;
	},

	isAttenuated: function(){
		if(this.bounceCount > 20 || this.intensity < 0.01)
			return true;
		return false;
	},

	collide: function(p){
		this.ray.p1 = p;
		this.ray.type = "seg";
	},

	getColor: function(){
		this.color.a = this.intensity//*0.2;
		var rate = this.spectralRate;
		if(rate == undefined)
			return this.color;//"rgba(255, 255, 255, 0.1)";

		var i = 1275*rate;
		if(i>=0 && i<255){
			this.color.r = 1;
			this.color.g = i/255;
			this.color.b = 0;
		}
		if(i>=255 && i<510){
			this.color.r = (510-i)/255;
			this.color.g = 1;
			this.color.b = 0;
		}
		if(i>=510 && i<765){
			this.color.r = 0;
			this.color.g = 1;
			this.color.b = (i-510)/255;
		}
		if(i>=765 && i<1020){
			this.color.r = 0;
			this.color.g = (1020-i)/255;
			this.color.b = 1;
		}
		if(i>=1020 && i<=1275){
			this.color.r = (i-1020)/255;
			this.color.g = 0;
			this.color.b = 1;
		}

		// if(rate<1/6){
		// 	this.color.r = 1;
		// 	this.color.g = 0;
		// 	this.color.b = 0;
		// } else if(rate<2/6){
		// 	this.color.r = 0.5;
		// 	this.color.g = 0.5;
		// 	this.color.b = 0;
		// } else if(rate<3/6){
		// 	this.color.r = 0;
		// 	this.color.g = 1;
		// 	this.color.b = 0;
		// } else if(rate<4/6){
		// 	this.color.r = 0;
		// 	this.color.g = 0.5;
		// 	this.color.b = 0.5;
		// } else if(rate<5/6){
		// 	this.color.r = 0;
		// 	this.color.g = 0;
		// 	this.color.b = 1;
		// } else {
		// 	this.color.r = 0.5;
		// 	this.color.g = 0;
		// 	this.color.b = 0.5;
		// }

		// this.color.r *= this.intensity;
		// this.color.g *= this.intensity;
		// this.color.b *= this.intensity;
		return this.color;
	},
}
Transform2D = function(translation, angle, pivot, scale){
	if(!translation instanceof Point2D)
		throw "translation is invalid"+translation;
	if(pivot && !pivot instanceof Point2D)
		throw "pivot is invalid"+pivot;
	if(scale && !scale instanceof Point2D)
		throw "scale is invalid"+scale;

	this.translation = translation || new Point2D();
	this.angle = angle || 0;
	this.pivot = pivot || new Point2D(0, 0);
	this.scale = scale || new Point2D(1, 1);
};

Transform2D.prototype = {
	apply: function(p){
		var res = p.getMult(this.scale);
		res = res.getRotated(this.angle, this.pivot);
		res = res.getAdd(this.translation);
		return res;
	},

	restore: function(p){
		var res = p.getSub(this.translation);
		res = res.getRotated(-this.angle, this.pivot);
		res = res.getDiv(this.scale);
		return res;
	},

	getInverse: function(){
		return new Transform2D(this.translation.getNegation(),
								-angle,
								pivot,
								new Point2D(1, 1).getDiv(scale));
	}
};
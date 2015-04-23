Circle = function(center, radius){
	if(!center instanceof Point2D)
		throw "center is invalid "+center;
	if(!radius || radius <= 0)
		throw "radius is invalid "+radius;

	this.center = center;
	this.radius = radius;
}

Circle.prototype = {
	hasInside: function(p){
		return p.dist(this.center) < this.radius;
	},

	hasOnBound: function(p){
		return p.dist(this.center) == this.radius;

	},

	getTransformed: function(tr){
		return new Circle(this.center.getTransformed(tr), this.radius*tr.scale.x);
	},
}

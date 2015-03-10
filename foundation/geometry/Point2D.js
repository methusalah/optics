FND.Point2D = function (x, y) {
	if(x && !y)
		console.warn("Please specify both x and y, or none.");
	this.x = x || 0;
	this.y = y || 0;
}

FND.Point2D.prototype = {

//	constructor: FND.Point2D,

	// values
	dist: function(o){
		var dx = this.x - o.x;
		var dy = this.y - o.y;
		return Math.sqrt(dx * dx + dy * dy);
	},

	determinant: function(o){
		return this.x*o.y-this.y*o.x;
	},


	angle: function(){
		return Math.atan2(y, x);
	},

	equals: function(o){
		return this.x === o.x && this.y === o.y;
	},

	dotProduct: function(o){
		return this.x*o.x+this.y*o.y;
	},

	length: function(){
		return this.dist(new FND.Point2D());
	},



	// transformation
	getTranslated: function(angle, distance){
		return new FND.Point2D(this.x+Math.cos(angle)*distance, this.y+Math.sin(angle)*distance);
	},

	getRotated: function(angle, pivot){
		if(!pivot)
			pivot = new FND.Point2D();
		var newX = pivot.x + (this.x - pivot.x) * Math.cos(angle) - (this.y - pivot.y) * Math.sin(angle);
		var newY = pivot.y + (this.x - pivot.x) * Math.sin(angle) + (this.y - pivot.y) * Math.cos(angle);
		return new FND.Point2D(newX, newY);
	},

	getNeg: function(){
		return new FND.Point2D(-this.x, -this.y);
	},

	getNormalized: function(){
		var l = this.length;
		if(l == 0)
			return this.clone();
		return this.getDiv(l);
	},

	getScaled: function(val){
		return this.getNormalized().getMult(val);
	},

	getTruncated: function(val){
		if(this.length <= val)
			return this.clone();
		return getScaled(val);
	},








	// operations
	getSub: function(o){
		if(o instanceof FND.Point2D)
			return new FND.Point2D(this.x-o.x, this.y-o.y);
		else
			return new FND.Point2D(this.x-o, this.y-o);
	},

	getSub: function(x, y){
		return new FND.Point2D(this.x-x, this.y-y);
	},

	getAdd: function(o){
		if(o instanceof FND.Point2D)
			return new FND.Point2D(this.x+o.x, this.y+o.y);
		else
			return new FND.Point2D(this.x+o, this.y+o);
	},

	getAdd: function(x, y){
		return new FND.Point2D(this.x+x, this.y+y);
	},

	getMult: function(o){
		if(o instanceof FND.Point2D)
			return new FND.Point2D(this.x*o.x, this.y*o.y);
		else
			return new FND.Point2D(this.x*o, this.y*o);
	},

	getMult: function(x, y){
		return new FND.Point2D(this.x*x, this.y*y);
	},

	getDiv: function(o){
		if(o instanceof FND.Point2D)
			return new FND.Point2D(this.x/o.x, this.y/o.y);
		else
			return new FND.Point2D(this.x/o, this.y/o);
	},

	getDiv: function(x, y){
		return new FND.Point2D(this.x/x, this.y/y);
	},



	toString: function(){
		return "("+this.x+";"+this.y+")";
	},

	clone: function(){
		return new FND.Point2D(this.x, this.y);
	},
};
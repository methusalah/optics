Point2D = function (x, y) {
	if(x && y == undefined)
		throw "Point2D needs both x and y (or no arguement for 0;0) x="+x+", y="+y;
	this.x = x || 0;
	this.y = y || 0;
}

Point2D.prototype = {
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
		return Math.atan2(this.y, this.x);
	},

	equals: function(o){
		return this.x === o.x && this.y === o.y;
	},

	dotProduct: function(o){
		return this.x*o.x+this.y*o.y;
	},

	length: function(){
		return this.dist(new Point2D());
	},

	slope: function(p){
		if(p.x == this.x)
			return "infinite";
		return (p.y - this.y) / (p.x - this.x);
	},



	// transformation
	getTranslated: function(angle, distance){
		return new Point2D(this.x+Math.cos(angle)*distance, this.y+Math.sin(angle)*distance);
	},

	getRotated: function(angle, pivot){
		if(!pivot)
			pivot = new Point2D();
		var newX = pivot.x + (this.x - pivot.x) * Math.cos(angle) - (this.y - pivot.y) * Math.sin(angle);
		var newY = pivot.y + (this.x - pivot.x) * Math.sin(angle) + (this.y - pivot.y) * Math.cos(angle);
//		console.info("rotation : "+this.toString()+" angle "+angle+" pivot "+pivot.toString()+ "new "+new Point2D(newX, newY).toString());
		return new Point2D(newX, newY);
	},

	getTransformed: function(tr){
		return tr.apply(this);
	},

	getNeg: function(){
		return new Point2D(-this.x, -this.y);
	},

	getNormalized: function(){
		var l = this.length();
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
	getSub: function(arg1, arg2){
		if(arg1 instanceof Point2D)
			return new Point2D(this.x-arg1.x, this.y-arg1.y);
		else if(arg2 == undefined)
			return new Point2D(this.x-arg1, this.y-arg1);
		else
			return new Point2D(this.x-arg1, this.y-arg2);
	},

	getAdd: function(arg1, arg2){
		if(arg1 instanceof Point2D)
			return new Point2D(this.x+arg1.x, this.y+arg1.y);
		else if(arg2 == undefined)
			return new Point2D(this.x+arg1, this.y+arg1);
		else
			return new Point2D(this.x+arg1, this.y+arg2);
	},

	getMult: function(arg1, arg2){
		if(arg1 instanceof Point2D)
			return new Point2D(this.x*arg1.x, this.y*arg1.y);
		else if(arg2 == undefined)
			return new Point2D(this.x*arg1, this.y*arg1);
		else
			return new Point2D(this.x*arg1, this.y*arg2);
	},

	getDiv: function(arg1, arg2){
		if(arg1 instanceof Point2D)
			return new Point2D(this.x/arg1.x, this.y/arg1.y);
		else if(arg2 == undefined)
			return new Point2D(this.x/arg1, this.y/arg1);
		else
			return new Point2D(this.x/arg1, this.y/arg2);
	},



	toString: function(){
		return "("+this.x+";"+this.y+")";
	},

	clone: function(){
		return new Point2D(this.x, this.y);
	},
};
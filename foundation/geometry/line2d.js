Line2D = function(p0, p1, type) {
	if(!p0 || !p1 ||
		!(p0 instanceof Point2D) ||
		!(p1 instanceof Point2D))
		throw "Line2D needs two points. p0="+p0+", p1="+p1;

	if(p0.equals(p1))
		throw "Can't construct null length line "+p0+p1;

	this.SEG = "seg";
	this.RAY = "ray";
	this.LINE = "line";


	this.p0 = p0;
	this.p1 = p1;

	if(type == undefined)
		this.type = this.LINE;
	else if(type == this.LINE ||
				type == this.RAY ||
				type == this.SEG)
		this.type = type;
	else
		throw "invalid type '"+type+"'";
}

Line2D.prototype = {
	// values
	start: function(){
		return this.p0;
	},

	end: function(){
		return this.p1;
	},

	length: function(o){
		return this.p0.dist(this.p1);
	},

	angle: function(){
		return this.p1.getSub(this.p0).angle();
	},

	normalVector: function(){
		return new Point2D().getTranslated(this.angle()+Angle.RIGHT, 1);
	},

	slope: function(){
		return this.p1.getSub(p0).slope();
	},

	ordinate: function(){
		return this.p0.y - this.slope() * this.p0.x;
	},

	middle: function(){
		if(type != this.SEG)
			throw "Must be called on segment only."
		return new Point2D(this.p0.getAdd(this.p1.getSub(this.p0).getDiv(2)));
	},

	bissector: function(){
		if(type != this.SEG)
			throw "Must be called on segment only."
		var m = this.middle();
		var v = m.getTranslated(this.angle() + Angle.RIGHT, 1);
		return new Line2D(m, v);
	},



	// boolean
	equals: function(l){
		return this.p0.equals(l.p0) && this.p1.equals(l.p1);
	},

	hasOver: function(p){
		if(Angle.getTurn(this.p0, this.p1, p) != Angle.NONE)
			return false;
		return true;
		if(this.type == "line")
			return true;
		if(this.type == "seg")
			return p.dist(this.p0)+p.dist(this.p1) <= this.length()+0.0001;
		if(this.type == "ray")
			return p.dist(this.p0)+p.dist(this.p1) <= this.length()+0.0001 ||
					p.dist(this.p1) < p.dist(this.p0);
	},

	// isCollinear: function(l){
	// 	return contains(l.p0) && 
	// 			contains(l.p1) &&
	// 			l.contains(this.p0) &&
	// 			l.contains(this.p1);
	// },

	isBetween: function(q0, q1){
		var Pq0 = Angle.getTurn(this.p0, this.p1, q0);
		var Pq1 = Angle.getTurn(this.p0, this.p1, q1);
		return Pq0 <= 0 && Pq1 >= 0 || Pq0 >= 0 && Pq1 <= 0;
	},




	// transformation
	getTransformed: function(tr){
		var q0 = tr.apply(this.p0);
		var q1 = tr.apply(this.p1);
		return new Line2D(q0, q1, this.type);
	},




	toFinite: function(){
		var bound0 = this.p0;
		var bound1 = this.p1;
		if(this.type == "line"){
			bound0 = this.p0.getTranslated(this.angle(), -1000000);
			bound1 = this.p1.getTranslated(this.angle(), 1000000);
		} else if(this.type == "ray"){
			bound1 = this.p1.getTranslated(this.angle(), 1000000);
		}
		return new Line2D(bound0, bound1, this.type);
	},

	toVector: function(){
		return this.p1.getSubtraction(this.p0);
	},

	toString: function(){
		return "Line "+this.p0+" - "+this.p1+"; length="+this.length()+"; angle="+this.angle();
	},

	clone: function(){
		return new Lines2D(this.p0, this.p1);
	},
};
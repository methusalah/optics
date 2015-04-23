Intersector = function(arg1, arg2){
	this.points = [];
	this.segments = [];
	this.intersected = [];

	// line with line
	if(arg1 instanceof Line2D && arg2 instanceof Line2D)
		this.lineToLine(arg1, arg2);

	// line with polyline
	else if (arg1 instanceof Line2D && arg2 instanceof Polyline2D)
		this.lineToPolyline(arg1, arg2);
	else if (arg1 instanceof Polyline2D && arg2 instanceof Line2D)
		this.lineToPolyline(arg2, arg1);

	// line with circle
	else if (arg1 instanceof Circle && arg2 instanceof Line2D)
		this.lineToCircle(arg2, arg1);
	else if (arg1 instanceof Line2D && arg2 instanceof Circle)
		this.lineToCircle(arg1, arg2);
};

Intersector.prototype = {
	// states
	exist: function(){
		return this.isMultiple() || this.isUnique() || this.isZone();
	},

	isUnique: function(){
		return this.points.length == 1 && this.segment.length == 0;
	},

	isMultiple: function(){
		return this.points.length >1;
	},

	isZone: function(){
		return this.segments.length != 0;
	},



	// results
	getUnique: function(){
		if(!this.isUnique())
			throw "this intersection is not unique. Check before get.";
		return this.pointS[0];
	},

	getAllPoints: function(){
		return [].concat(points);
	},

	getNearest: function(p){
		var res = undefined, minDist;
		for(var i=0; i<this.points.length; i++){
			if(this.points[i].dist(p)<0.001)
				continue;
			if(!res){
				res = this.points[i];
				minDist = p.dist(res);
				if(this.intersected[i])
					this.nearestIntersected = this.intersected[i];
			} else {
				var d = p.dist(this.points[i]);
				if(d<minDist){
					res = this.points[i];
					minDist = d;
					if(this.intersected[i])
						this.nearestIntersected = this.intersected[i];
				}
			}
		}
		return res;
	},



	// specialized intersector calls
	lineToLine: function(l1, l2){
		var it = getLineLineIntersections(l1, l2);
		if(it)
			this.points.push(it);
	},

	lineToPolyline: function(l, pl){
		for(var i=0; i<pl.lines.length; i++){
			var it = getLineLineIntersections(l, pl.lines[i]);
			if(it){
				this.points.push(it);
				this.intersected.push(pl.lines[i]);
			}
		}
	},

	lineToCircle: function(l, c){
		this.points = getLineCircleIntersections(l, c);
	},
}



/* line to circle intersection
*/
getLineCircleIntersections = function(line, circle){
	line = line.toFinite();
	var p0 = line.start();
	var p1 = line.end();
	var res = [];

   	var i1 = undefined, i2 = undefined;
	
    // d = direction vector of the segment
    var d = p1.getSub(p0);
    // f = vector from center to ray start
    var f = p0.getSub(circle.center);
    
    var a = d.dotProduct(d);
    var b = 2*f.dotProduct(d);
    var c = f.dotProduct(f)-circle.radius*circle.radius;

    var discriminant = b*b-4*a*c;
    if(discriminant >= 0){
    	// ray didn't totally miss sphere,
    	// so there is a solution to
    	// the equation.
    	discriminant = Math.sqrt(discriminant);

    	// either solution may be on or off the ray so need to test both
    	// t1 is always the smaller value, because BOTH discriminant and
    	// a are nonnegative.
    	var t1 = (-b-discriminant)/(2*a);
    	var t2 = (-b+discriminant)/(2*a);

    	// 3x HIT cases:
    	//          -o->             --|-->  |            |  --|->
    	// Impale(t1 hit,t2 hit), Poke(t1 hit,t2>1), ExitWound(t1<0, t2 hit), 

    	// 3x MISS cases:
    	//       ->  o                     o ->              | -> |
    	// FallShort (t1>1,t2>1), Past (t1<0,t2<0), CompletelyInside(t1<0, t2>1)

    	var angle = p1.getSub(p0).angle();
    	if(t1 >= 0 && t1 <= 1)
    		// t1 is the intersection, and it's closer than t2
    		// (since t1 uses -b - discriminant)
    		// Impale, Poke
    		i1 = p0.getTranslated(angle, t1*p0.dist(p1));

    	// here t1 didn't intersect so we are either started
    	// inside the sphere or completely past it
    	if(t2 >= 0 && t2 <= 1)
    		// ExitWound
    		i2 = p0.getTranslated(angle, t2*p0.dist(p1));
    	// no intn: FallShort, Past, CompletelyInside
    }
    
    if(i1)
        res.push(i1)
	if(i2)
		res.push(i2);
	return res;
};



/* Line to line intersection
*/
getLineLineIntersections = function(l1, l2){
	l1 = l1.toFinite();
	l2 = l2.toFinite();

	var p0 = l1.start();
	var p1 = l1.end();
	var q0 = l2.start();
	var q1 = l2.end();
	var type;

	// for each end point, find the side of the other line.
	// if two end points lie on opposite sides of the other line, then the lines are crossing.
	// if all end points lie on opposite sides, then the segments are crossing.
	var Pq0 = Angle.getTurn(p0, p1, q0);
	var Pq1 = Angle.getTurn(p0, p1, q1);

	var Qp0 = Angle.getTurn(q0, q1, p0);
	var Qp1 = Angle.getTurn(q0, q1, p1);

	// check if all turn have none angle. In this case, lines are collinear.
	if (Pq0 == Angle.NONE && Pq1 == Angle.NONE || Qp0 == Angle.NONE && Qp1 == Angle.NONE) {
		// at this point, we know that lines are collinear.
		// we must check if they overlap for segments intersection
		type="collinear";
	}
	// check if q0 and q1 lie around P AND p0 and p1 lie around Q.
	// in this case, the two segments intersect
	else if (Pq0 * Pq1 <= 0 && Qp0 * Qp1 <= 0) {
		// else if(Pq0 <= 0 && Pq1 >= 0 && Qp0 <= 0 && Qp1 >= 0 ||
		// Pq0 >= 0 && Pq1 <= 0 && Qp0 >= 0 && Qp1 <= 0){
		type="intersect";
	} else
		type="parallel";

	var pSlope = p0.slope(p1);
	var qSlope = q0.slope(q1);

	if (type == "intersect") {
		/*
		 * Single point intersection
		 * 
		 * This calculation method needs divisions, which may cause approximation problems. The intersection point,
		 * once rounded to double precision, may be out the line bounding. If "on-the-line" intersection point is
		 * needed, you will have to use a more robust method.
		 */
		var x, y;

		var pOrdinate, qOrdinate;
		
		if (pSlope == "infinite") {
			x = p0.x;
			qOrdinate = q0.y - qSlope * q0.x;
			y = qSlope * x + qOrdinate;
		} else if (qSlope == "infinite") {
			x = q0.x;
			pOrdinate = p0.y - pSlope * p0.x;
			y = pSlope * x + pOrdinate;
		} else {
			pOrdinate = p0.y - pSlope * p0.x;
			qOrdinate = q0.y - qSlope * q0.x;
			x = (pOrdinate - qOrdinate) / (qSlope - pSlope);
			y = pSlope * x + pOrdinate;
		}
		return new Point2D(x, y);
		
	} else if (this.itType == "collinear") {
		/*
		 * Collinear intersection zone
		 * 
		 * At this point, we have to find the two points that enclose the intersection zone. We use distances to
		 * check if a segment's end is inside the other segment. The single intersection point is set to the middle
		 * of the intersection zone.
		 * 
		 * Note that if P and Q are not overlapping, then there is no intersection zone and all intersection points
		 * are set to "null". For segments, it means that there is no intersection. For lines, it means that
		 * intersection zone is infinite.
		 */
		var zoneStart, zoneEnd;
		if (q0.dist(p0) <= p0.dist(p1) && q0.dist(p1) <= p0.dist(p1)) {
			// then q0 is in P
			zoneStart = q0;
			if (q1.dist(p0) <= p0.dist(p1) && q1.dist(p1) <= p0.dist(p1))
				// then q0 and q1 are both in P
				zoneEnd = q1;
			else // then q0 is in P but q1 is out of P
			if (p0.dist(q0) <= q0.dist(q1) && q0.dist(p1) <= q0.dist(q1))
				// then q0 is in P and p0 is in Q
				zoneEnd = p0;
			else
				zoneEnd = p1;
		} else // then q0 is out of p
		if (q1.dist(p0) <= p0.dist(p1) && q1.dist(p1) <= p0.dist(p1)) {
			// then q0 is out of P and q1 is in P
			zoneStart = q1;
			if (p0.dist(q0) <= q0.dist(q1) && q0.dist(p1) <= q0.dist(q1))
				// then q1 is in P and p0 is in Q
				zoneEnd = p0;
			else
				zoneEnd = p1
		} else { // then q0 and q1 are both out of P
			if (p0.dist(q0) <= q0.dist(q1) && q0.dist(p1) <= q0.dist(q1)) {
				// then P is in Q
				zoneStart = p0;
				zoneEnd = p1;
			} else {
				return []
			}
		}
		return new Line2D(zoneStart, zoneEnd, "seg");

	} 
};
Polyline2D = function(smoothed){
	this.initialPoint = undefined;
	this.lines = [];
	this.smoothed = smoothed;
};

Polyline2D.prototype = {
	// construction
	add: function(p){
		if(!p instanceof Point2D)
			throw "point is invalid "+p;
		

		if(!this.initialPoint)
			this.initialPoint = p;
		else
			if(this.lines.length == 0){
				var l = new Line2D(this.initialPoint, p, "seg");
				l.smoothNorm0 = l.normalVector();
				l.smoothNorm1 = l.smoothNorm0;
				this.lines.push(l);
			}else{
				var last = this.lines[this.lines.length-1];
				var l = new Line2D(last.end(), p, "seg");

				if(this.smoothed){
					last.smoothNorm1 = last.normalVector().getAdd(l.normalVector());
					// smoothing back the first point
					if(last.smoothNorm0.equals(last.normalVector())){
						var nAngle = last.normalVector().angle();
						nAngle -= Angle.getOrientedDifference(nAngle, last.smoothNorm1.angle());
						last.smoothNorm0 = new Point2D().getTranslated(nAngle, 1);
					}

					l.smoothNorm0 = last.smoothNorm1;
					nAngle = l.normalVector().angle();
					nAngle -= Angle.getOrientedDifference(nAngle, l.smoothNorm0.angle());
					l.smoothNorm1 = new Point2D().getTranslated(nAngle, 1);
				}else{
					l.smoothNorm0 = l.normalVector();
					l.smoothNorm1 = l.smoothNorm0;
				}

				this.lines.push(l);
			}
	},

	// access
	firstPoint: function(){
		return this.lines[0].start();
	},

	lastPoint: function(){
		return this.lines[this.lines.length-1].end();
	},




	// boolean
	hasOver: function(p){
		for(var i=0; i<this.lines.length; i++)
			if(this.lines[i].hasOver(p))
				return true;
		return false;
	},

	hasInside: function(p){
		if(!this.isLoop())
			return false;
		var turn = Angle.NONE;
		for(var i=0; i<this.lines.length; i++){
			var l = this.lines[i];
			if(l.hasOver(p))
				return true;
			var localTurn = Angle.getTurn(l.p0, l.p1, p);
			if(turn == Angle.NONE)
				turn = localTurn;
			else if(turn != localTurn)
				return false;
		}
		return true;
	},

	isLoop: function(){
		return this.firstPoint().equals(this.lastPoint());
	},



	// tranformation
	getTransformed: function(tr){
		var res = new Polyline2D(this.smoothed);
		res.add(this.lines[0].p0.getTransformed(tr));
		for(var i=0; i<this.lines.length; i++){
			res.add(this.lines[i].p1.getTransformed(tr));
		}
		return res;
	},


};
function Angle(){};

Angle.NULL = 0;
Angle.FLAT = Math.PI;
Angle.RIGHT = Angle.FLAT/2;
Angle.FULL = Angle.FLAT*2;

Angle.COUNTERCLOCKWISE = 1;
Angle.CLOCKWISE = -1;
Angle.NONE = 0;

Angle.getTurn = function(p0, p1, q) {
	var turn = p1.getSub(p0).determinant(q.getSub(p1));
	
	if(turn > 0.00001)
		return Angle.COUNTERCLOCKWISE;
	else if(turn < -0.00001)
		return Angle.CLOCKWISE;
	else
		return Angle.NONE;
};

Angle.getOrientedDifference = function(ang1, ang2) {
	var na1 = Angle.normalize(ang1)+ Angle.FLAT*2;
	var na2 = Angle.normalize(ang2)+ Angle.FLAT*2;
	
	var diff = Math.abs(na1-na2);
	if(na1 < na2)
		return Angle.normalize(diff);
	else
		return Angle.normalize(-diff);
};

Angle.normalize = function(a) {
	while(a <= -Angle.FLAT)
		a += Angle.FULL;
	while(a > Angle.FLAT)
		a -= Angle.FULL;
	return a;
};

Angle.toDeg = function(rad) {
	return rad*180/Angle.FLAT;
}
Angle.toRad = function(deg) {
	return deg*Angle.FLAT/180;
}

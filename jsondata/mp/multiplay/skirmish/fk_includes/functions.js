function isAreaSafe(x, y, radius) {
	return enumRange(x, y, radius, ENEMIES, false).length <= 0;
}

function distanceToBase(loc) {
	return distance(loc, startPositions[me]);
}

function distance(obj1, obj2, obj3, obj4) {
	var x1, x2, y1, y2;
	if (defined(obj1.x)) {
		x1 = obj1.x;
		y1 = obj1.y;
		if (defined(obj2.x)) {
			x2 = obj2.x;
			y2 = obj2.y;
		} else {
			x2 = obj2;
			y2 = obj3;
		}
	} else {
		x1 = obj1;
		y1 = obj2;
		if (defined(obj3.x)) {
			x2 = obj3.x;
			y2 = obj3.y;
		} else {
			x2 = obj3;
			y2 = obj4;
		}
	}
	return distBetweenTwoPoints(x1, y1, x2, y2);
}

function defined(variable) {
	return typeof(variable) !== "undefined";
}

function random(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

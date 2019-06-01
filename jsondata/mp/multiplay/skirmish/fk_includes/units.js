var antiTankGroups = [newGroup()];
var antiCyborgGroups = [newGroup()];
var vtolGroups = [newGroup()];
var mixedGroups = [newGroup()];
var scouts = newGroup();
var ungrouped = newGroup();

function tankGroupSize() {
	return 10;
}

function cyborgGroupSize() {
	return 20;
}

function vtolGroupSize() {
	return 10;
}

function numScouts() {
	return 3;
}

function findAntiTankTarget() {
	var droids = [];
	//find enemy droids
	for (var i = 0; i < maxPlayers; i++) {
		if(i != me && !allianceExistsBetween(me,i)) {
			droids = droids.concat(enumDroid(i));
		}
	}
	droids = droids.filter(function(droid) {
		return droid.droidType != DROID_CYBORG && !droid.isVTOL;
	});
	return droids;
}

function findAntiCyborgTarget() {
	var droids = [];
	//find enemy droids
	for (var i = 0; i < maxPlayers; i++) {
		if(i != me && !allianceExistsBetween(me,i)) {
			droids = droids.concat(enumDroid(i));
		}
	}
	droids = droids.filter(function(droid) {
		return droid.droidType == DROID_CYBORG;
	});
	return droids;
}

function isAntiTank(unit) {
	if(!defined(unit)) return false;
	if(unit.type !== DROID) return false;
	if(unit.droidType !== DROID_WEAPON || unit.isVTOL) return false;
	if(
		unit.weapons[0].name == tankWeapons.railgun[0] || unit.weapons[0].name == tankWeapons.railgun[1] ||
		unit.weapons[0].name == tankWeapons.scourge[0] || unit.weapons[0].name == tankWeapons.scourge[1]
	) {
		return true;
	}
}

function isAntiCyborg(unit) {
	if(!defined(unit)) return false;
	if(unit.type !== DROID) return false;
	if(unit.droidType !== DROID_WEAPON || unit.isVTOL) return false;
	if(
		unit.weapons[0].name == tankWeapons.mg[0] || unit.weapons[0].name == tankWeapons.mg[1] || unit.weapons[0].name == tankWeapons.mg[2] ||
		unit.weapons[0].name == tankWeapons.grenade[0] || unit.weapons[0].name == tankWeapons.grenade[1] || unit.weapons[0].name == tankWeapons.grenade[2]
	) { 
		return true;
	}
}

function isUnitSafe(unit) {
	if(!defined(unit)) return true;
	var enemyUnits = enumRange(unit.x, unit.y, 15, ENEMIES, false);
	var friendlyUnits = enumRange(unit.x, unit.y, 15, ALLIES, false);
	return enemyUnits <= friendlyUnits;
}

// Main loop
function unitControl() {
	// Anti Tank
	for(var i = 0; i < antiTankGroups.length; i++) {
		var group = antiTankGroups[i];
		
		// Check if we need to add new units
		if(groupSize(group) < tankGroupSize()) {
			var freeUnits = enumGroup(ungrouped);
			for(var j = 0; j < freeUnits.length; j++) {
				var unit = freeUnits[j];
				if(isAntiTank(unit)) {
					groupAdd(group, unit);
					if(groupSize(group) >= tankGroupSize()) break;
				}
			}
		} 
		if(groupSize(group) >= tankGroupSize()) {
			// Check if group needs orders
			var units = enumGroup(group);
			if(
				units[0].order !== DORDER_ATTACK &&
				units[0].order !== DORDER_RTR &&
				units[0].order !== DORDER_SCOUT
			) {
				var target = findAntiTankTarget();
				target = target.filter(function(droid) {
					return droidCanReach(units[0], droid.x, droid.y);
				}).sort(function(a, b) {return distance(a,b)});
				if(target.length > 0) {
					for(var j = 0; j < units.length; j++) {
						orderDroidObj(units[j], DORDER_ATTACK, target[0]);
					}
				}
			}
		} else {
			// Send units back to base if unsafe
			var units = enumGroup(group);
			if(!isUnitSafe(units[0])) {
				for(var j = 0; j < units.length; j++) {
					orderDroidLoc(units[j], DORDER_MOVE, startPositions[me].x, startPositions[me].y);
				}
			}
		}
	}
	
	// Anti-Cyborg
	for(var i = 0; i < antiCyborgGroups.length; i++) {
		var group = antiCyborgGroups[i];
		
		// Check if we need to add new units
		if(groupSize(group) < tankGroupSize()) {
			var freeUnits = enumGroup(ungrouped);
			for(var j = 0; j < freeUnits.length; j++) {
				var unit = freeUnits[j];
				if(isAntiCyborg(unit)) {
					groupAdd(group, unit);
					if(groupSize(group) >= tankGroupSize()) break;
				}
			}
		} 
		if(groupSize(group) >= tankGroupSize()) {
			// Check if group needs orders
			var units = enumGroup(group);
			if(
				units[0].order !== DORDER_ATTACK &&
				units[0].order !== DORDER_RTR &&
				units[0].order !== DORDER_SCOUT
			) {
				var target = findAntiCyborgTarget();
				target = target.filter(function(droid) {
					return droidCanReach(units[0], droid.x, droid.y);
				}).sort(function(a, b) {return distance(a,b)});
				if(target.length > 0) {
					for(var j = 0; j < units.length; j++) {
						orderDroidObj(units[j], DORDER_ATTACK, target[0]);
					}
				}
			}
		} else {
			// Send units back to base if unsafe
			var units = enumGroup(group);
			if(!isUnitSafe(units[0])) {
				for(var j = 0; j < units.length; j++) {
					orderDroidLoc(units[j], DORDER_MOVE, startPositions[me].x, startPositions[me].y);
				}
			}
		}
	}
	
	// Mixed Groups
	for(var i = 0; i < mixedGroups.length; i++) {
		var group = mixedGroups[i];
		
		// Check if we need to add new units
		if(groupSize(group) < tankGroupSize()) {
			var freeUnits = enumGroup(ungrouped);
			var nrAntiTank = enumGroup(group).filter(isAntiTank).length;
			var nrAntiCyborg = enumGroup(group).filter(isAntiCyborg).length;
			for(var j = 0; j < freeUnits.length; j++) {
				var unit = freeUnits[j];
				if(isAntiCyborg(unit) && nrAntiTank >= nrAntiCyborg) {
					groupAdd(group, unit);
					if(groupSize(group) >= tankGroupSize()) break;
				}
				if(isAntiTank(unit) && nrAntiCyborg >= nrAntiTank) {
					groupAdd(group, unit);
					if(groupSize(group) >= tankGroupSize()) break;
				}
			}
		} 
		if(groupSize(group) >= tankGroupSize()) {
			// Check if group needs orders
			var units = enumGroup(group);
			if(
				units[0].order !== DORDER_ATTACK &&
				units[0].order !== DORDER_RTR &&
				units[0].order !== DORDER_SCOUT
			) {
				var target = findAntiCyborgTarget();
				target.concat(findAntiTankTarget());
				target = target.filter(function(droid) {
					return droidCanReach(units[0], droid.x, droid.y);
				}).sort(function(a, b) {return distance(a,b)});
				if(target.length > 0) {
					for(var j = 0; j < units.length; j++) {
						orderDroidObj(units[j], DORDER_ATTACK, target[0]);
					}
				}
			}
		} else {
			// Send units back to base if unsafe
			var units = enumGroup(group);
			if(!isUnitSafe(units[0])) {
				for(var j = 0; j < units.length; j++) {
					orderDroidLoc(units[j], DORDER_MOVE, startPositions[me].x, startPositions[me].y);
				}
			}
		}
	}
	
	// Scouts - they're not really doing anything
	var units = enumGroup(scouts);
	if(groupSize(scouts) < numScouts()) {
		var tank = scoutTank();
		if(defined(tank)) queueTank(tank);
	}
	for(var i = 0; i < groupSize(scouts); i++) {
		if(
			units[i].order !== DORDER_ATTACK &&
			units[i].order !== DORDER_RTR &&
			units[i].order !== DORDER_SCOUT
		) {
			var x = random(3, mapWidth - 3);
			var y = random(3, mapHeight - 3);
			orderDroidLoc(units[i], DORDER_SCOUT, x, y);
		}
	}
}

function defend(structure) {
	var enemyUnits = enumRange(unit.x, unit.y, 15, ENEMIES, false);
	var enemyTanks = enemyUnits.filter(function(droid) {
		return droid.droidType != DROID_CYBORG && !droid.isVTOL;
	}).length;
	var enemyCyborgs = enemyUnits.filter(function(droid) {
		return droid.droidType == DROID_CYBORG;
	}).length;
	var tankIndex = 0;
	var cyborgIndex = 0;
	var mixedIndex = 0;
	while(enemyTanks > 0 && enemyCyborgs > 0) {
		if(enemyTanks > tankGroupSize / 2 && tankIndex < antiTankGroups.length) {
			var units = enumgGroup(antiTankGroups[tankIndex]);
			for(var i = 0; i < units.length; i++) {
				orderDroidObj(units[j], DORDER_MOVE, structure);
			}
			tankIndex++;
			enemyTanks -= units.length;
			
		} else if(enemyCyborgs > tankGroupSize && cyborgIndex < antiCyborgGroups.length) {
			var units = enumgGroup(antiCyborgGroups[cyborgIndex]);
			for(var i = 0; i < units.length; i++) {
				orderDroidObj(units[j], DORDER_MOVE, structure);
			}
			cyborgIndex++;
			enemyCyborgs -= units.length * 2;
		} else if(mixedIndex < mixedGroups.length){
			var units = enumgGroup(mixedGroups[mixedIndex]);
			for(var i = 0; i < units.length; i++) {
				orderDroidObj(units[j], DORDER_MOVE, structure);
			}
			mixedIndex++;
			enemyTanks -= units.length / 2;
			enemyCyborgs -= units.length;
		}
	}
}


function switchTarget(unit, target) {
	if(unit.order != DORDER_ATTACK) return;
	if(distance(unit, target) < unit.range) orderDroidObj(unit, DORDER_ATTACK, target);
}

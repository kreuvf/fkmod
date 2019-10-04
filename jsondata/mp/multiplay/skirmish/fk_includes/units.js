var antiTankGroupsTank = [newGroup()];
var antiCyborgGroupsTank = [newGroup()];
var antiTankGroupsCyborg = [newGroup()];
var antiCyborgGroupsCyborg = [newGroup()];
var vtolGroups = [newGroup()];
var mixedGroupsTank = [newGroup()];
var mixedGroupsCyborg = [newGroup()];
var scouts = newGroup();
var ungrouped = newGroup();

function tankGroupSize() {
	var droids = [];
	//find enemy droids
	for (var i = 0; i < maxPlayers; i++) {
		if(i != me && !allianceExistsBetween(me,i)) {
			droids = droids.concat(enumDroid(i));
		}
	}
	return Math.min(3, Math.pow(droids.length, 0.5));
}

function cyborgGroupSize() {
	var droids = [];
	//find enemy droids
	for (var i = 0; i < maxPlayers; i++) {
		if(i != me && !allianceExistsBetween(me,i)) {
			droids = droids.concat(enumDroid(i));
		}
	}
	return Math.min(5, Math.pow(droids.length, 0.7));
}

function vtolGroupSize() {
	return 5;
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

function findGroundTarget() {
	var targets = [];
	//find enemy droids
	for (var i = 0; i < maxPlayers; i++) {
		if(i != me && !allianceExistsBetween(me,i)) {
			targets = targets.concat(enumDroid(i));
		}
	}
	targets = targets.filter(function(target) {
		return !target.isVTOL;
	});
	// find enemy structures
	for (var i = 0; i < maxPlayers; i++) {
		if(i != me && !allianceExistsBetween(me,i)) {
			targets = targets.concat(enumStruct(i));
		}
	}
	return targets;
}

function isAntiTank(unit) {
	if(!defined(unit)) return false;
	if(unit.type !== DROID) return false;
	if((unit.droidType !== DROID_WEAPON && unit.droidType !== DROID_CYBORG) || unit.isVTOL) return false;
	if(
		unit.weapons[0].name == tankWeapons.railgun[0] || unit.weapons[0].name == tankWeapons.railgun[1] ||
		unit.weapons[0].name == tankWeapons.scourge[0] || unit.weapons[0].name == tankWeapons.scourge[1] ||
		unit.weapons[0].name == cyborgWeapons.cannon[0] || unit.weapons[0].name == cyborgWeapons.cannon[1] || unit.weapons[0].name == cyborgWeapons.cannon[2] ||
		unit.weapons[0].name == cyborgWeapons.lancer[0] || unit.weapons[0].name == cyborgWeapons.lancer[0]
	) {
		return true;
	}
}

function isAntiCyborg(unit) {
	if(!defined(unit)) return false;
	if(unit.type !== DROID) return false;
	if((unit.droidType !== DROID_WEAPON && unit.droidType !== DROID_CYBORG)|| unit.isVTOL) return false;
	if(
		unit.weapons[0].name == tankWeapons.mg[0] || unit.weapons[0].name == tankWeapons.mg[1] || unit.weapons[0].name == tankWeapons.mg[2] ||
		unit.weapons[0].name == tankWeapons.laser[0] || unit.weapons[0].name == tankWeapons.laser[1] ||
		unit.weapons[0].name == tankWeapons.grenade[0] || unit.weapons[0].name == tankWeapons.grenade[1] || unit.weapons[0].name == tankWeapons.grenade[2] ||
		unit.weapons[0].name == cyborgWeapons.mg[0] || unit.weapons[0].name == cyborgWeapons.mg[1] || unit.weapons[0].name == cyborgWeapons.mg[2] ||
		unit.weapons[0].name == cyborgWeapons.grenade[0] || unit.weapons[0].name == cyborgWeapons.grenade[1] || unit.weapons[0].name == cyborgWeapons.grenade[2]
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
	// Tanks
	// Anti Tank
	for(var i = 0; i < antiTankGroupsTank.length; i++) {
		var group = antiTankGroupsTank[i];
		
		// Check if we need to add new units
		if(groupSize(group) < tankGroupSize()) {
			var freeUnits = enumGroup(ungrouped);
			for(var j = 0; j < freeUnits.length; j++) {
				var unit = freeUnits[j];
				if(isAntiTank(unit) && (unit.droidType !== DROID_CYBORG)) {
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
				});
				if(target.length == 0) {
					target = findGroundTarget();
					target = target.filter(function(droid) {
					return droidCanReach(units[0], droid.x, droid.y);
					});
				}
				target = target.sort(function(a, b) {return distance(a,b)});
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
	for(var i = 0; i < antiCyborgGroupsTank.length; i++) {
		var group = antiCyborgGroupsTank[i];
		
		// Check if we need to add new units
		if(groupSize(group) < tankGroupSize()) {
			var freeUnits = enumGroup(ungrouped);
			for(var j = 0; j < freeUnits.length; j++) {
				var unit = freeUnits[j];
				if(isAntiCyborg(unit) && (unit.droidType !== DROID_CYBORG)) {
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
				});
				if(target.length == 0) {
					target = findGroundTarget();
					target = target.filter(function(droid) {
					return droidCanReach(units[0], droid.x, droid.y);
					});
				}
				target = target.sort(function(a, b) {return distance(a,b)});
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
	for(var i = 0; i < mixedGroupsTank.length; i++) {
		var group = mixedGroupsTank[i];
		
		// Check if we need to add new units
		if(groupSize(group) < tankGroupSize()) {
			var freeUnits = enumGroup(ungrouped);
			var nrAntiTank = enumGroup(group).filter(isAntiTank).length;
			var nrAntiCyborg = enumGroup(group).filter(isAntiCyborg).length;
			for(var j = 0; j < freeUnits.length; j++) {
				var unit = freeUnits[j];
				if(unit.droidType == DROID_CYBORG) continue;
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
				target = findGroundTarget();
				target = target.filter(function(droid) {
				return droidCanReach(units[0], droid.x, droid.y);
				});
				target = target.sort(function(a, b) {return distance(a,b)});
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
	
	// create new groups if we have too many ungrouped units
	var tanks = enumGroup(ungrouped).filter(function(droid) {
		return droid.droidType != DROID_CYBORG && !droid.isVTOL;
	});
	var antiTank = tanks.filter(isAntiTank);
	var nrAntiTank = antiTank.length;
	var antiCyborg = tanks.filter(isAntiCyborg);
	var nrAntiCyborg = antiCyborg.length;
	if(nrAntiTank + nrAntiCyborg > tankGroupSize() * 0.75) {
		var group = newGroup();
		if(nrAntiTank > nrAntiCyborg * 2) {
			groupAddDroid(group, antiTank[0]);
			antiTankGroupsTank.push(group);
		} else if (nrAntiCyborg > nrAntiTank * 2) {
			groupAddDroid(group, antiCyborg[0]);
			antiCyborgGroupsTank.push(group);
		} else  {
			groupAddDroid(group, antiTank[0]);
			groupAddDroid(group, antiCyborg[0]);
			mixedGroupsTank.push(group);
		}
	}
	
	// Cyborgs
	// Anti Tank
	for(var i = 0; i < antiTankGroupsCyborg.length; i++) {
		var group = antiTankGroupsCyborg[i];
		
		// Check if we need to add new units
		if(groupSize(group) < cyborgGroupSize()) {
			var freeUnits = enumGroup(ungrouped);
			for(var j = 0; j < freeUnits.length; j++) {
				var unit = freeUnits[j];
				if(isAntiTank(unit) && (unit.droidType == DROID_CYBORG)) {
					groupAdd(group, unit);
					if(groupSize(group) >= cyborgGroupSize()) break;
				}
			}
		} 
		if(groupSize(group) >= cyborgGroupSize()) {
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
				});
				if(target.length == 0) {
					target = findGroundTarget();
					target = target.filter(function(droid) {
					return droidCanReach(units[0], droid.x, droid.y);
					});
				}
				target = target.sort(function(a, b) {return distance(a,b)});
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
	for(var i = 0; i < antiCyborgGroupsCyborg.length; i++) {
		var group = antiCyborgGroupsCyborg[i];
		if(groupSize(group) == 0) continue;
		
		// Check if we need to add new units
		if(groupSize(group) < cyborgGroupSize()) {
			var freeUnits = enumGroup(ungrouped);
			for(var j = 0; j < freeUnits.length; j++) {
				var unit = freeUnits[j];
				if(isAntiCyborg(unit) && (unit.droidType == DROID_CYBORG)) {
					groupAdd(group, unit);
					if(groupSize(group) >= cyborgGroupSize()) break;
				}
			}
		} 
		if(groupSize(group) >= cyborgGroupSize()) {
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
				});
				if(target.length == 0) {
					target = findGroundTarget();
					target = target.filter(function(droid) {
					return droidCanReach(units[0], droid.x, droid.y);
					});
				}
				target = target.sort(function(a, b) {return distance(a,b)});
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
	for(var i = 0; i < mixedGroupsCyborg.length; i++) {
		var group = mixedGroupsCyborg[i];
		
		// Check if we need to add new units
		if(groupSize(group) < cyborgGroupSize()) {
			var freeUnits = enumGroup(ungrouped);
			var nrAntiTank = enumGroup(group).filter(isAntiTank).length;
			var nrAntiCyborg = enumGroup(group).filter(isAntiCyborg).length;
			for(var j = 0; j < freeUnits.length; j++) {
				var unit = freeUnits[j];
				if((unit.droidType !== DROID_CYBORG)) continue;
				if(isAntiCyborg(unit) && nrAntiTank >= nrAntiCyborg) {
					groupAdd(group, unit);
					if(groupSize(group) >= cyborgGroupSize()) break;
				}
				if(isAntiTank(unit) && nrAntiCyborg >= nrAntiTank) {
					groupAdd(group, unit);
					if(groupSize(group) >= cyborgGroupSize()) break;
				}
			}
		} 
		if(groupSize(group) >= cyborgGroupSize()) {
			// Check if group needs orders
			var units = enumGroup(group);
			if(
				units[0].order !== DORDER_ATTACK &&
				units[0].order !== DORDER_RTR &&
				units[0].order !== DORDER_SCOUT
			) {
				target = findGroundTarget();
				target = target.filter(function(droid) {
				return droidCanReach(units[0], droid.x, droid.y);
				});
				target = target.sort(function(a, b) {return distance(a,b)});
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
	
	
	// create new groups if we have too many ungrouped units
	var cyborgs = enumGroup(ungrouped).filter(function(droid) {
		return droid.droidType == DROID_CYBORG;
	});
	var antiTank = cyborgs.filter(isAntiTank);
	var nrAntiTank = antiTank.length;
	var antiCyborg = cyborgs.filter(isAntiCyborg);
	var nrAntiCyborg = antiCyborg.length;
	if(nrAntiTank + nrAntiCyborg > cyborgGroupSize() * 0.75) {
		var group = newGroup();
		if(nrAntiTank > nrAntiCyborg * 2) {
			groupAddDroid(group, antiTank[0]);
			antiTankGroupsCyborg.push(group);
		} else if (nrAntiCyborg > nrAntiTank * 2) {
			groupAddDroid(group, antiCyborg[0]);
			antiCyborgGroupsCyborg.push(group);
		} else  {
			groupAddDroid(group, antiTank[0]);
			groupAddDroid(group, antiCyborg[0]);
			mixedGroupsCyborg.push(group);
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
	debug("defend");
	var enemyUnits = enumRange(unit.x, unit.y, 15, ENEMIES, false);
	var enemyTanks = enemyUnits.filter(function(droid) {
		return droid.droidType != DROID_CYBORG && !droid.isVTOL;
	}).length;
	var enemyCyborgs = enemyUnits.filter(function(droid) {
		return droid.droidType == DROID_CYBORG;
	}).length;
	var antiTankTankIndex = 0;
	var antiTankCyborgIndex = 0;
	var antiCyborgTankIndex = 0;
	var antiCyborgCyborgIndex = 0;
	var mixedTankIndex = 0;
	var mixedCyborgIndex = 0;
	while(enemyTanks > 0 || enemyCyborgs > 0) {
		if(
		(enemyTanks > tankGroupSize() / 2 || 
			(antiCyborgTankIndex >= antiCyborgGroupsTank.length && antiCyborgCyborgIndex >= antiCyborgGroupsTank.length &&  mixedTankIndex >= mixedGroupsTank.length && mixedCyborgIndex >= mixedGroupsCyborg.length)
		) && (antiTankTankIndex < antiTankGroupsTank.length || antiTankCyborgIndex < antiTankGroupsCyborg.length)) {
			if(antiTankTankIndex < antiTankGroupsTank.length) {
				var units = enumGroup(antiTankGroupsTank[antiTankTankIndex]);
				for(var i = 0; i < units.length; i++) {
					orderDroidLoc(units[i], DORDER_MOVE, structure.x, structure.y);
				}
				antiTankTankIndex++;
				enemyTanks -= units.length;
			}
			if(antiTankCyborgIndex < antiTankGroupsCyborg.length) {
				var units = enumGroup(antiTankGroupsCyborg[antiTankCyborgIndex]);
				for(var i = 0; i < units.length; i++) {
					orderDroidLoc(units[i], DORDER_MOVE, structure.x, structure.y);
				}
				antiTankCyborgIndex++;
				enemyTanks -= units.length / 2;
			}
			
		} else if(
			(enemyCyborgs > cyborgGroupSize() || 
				(mixedTankIndex >= mixedGroupsTank.length && mixedCyborgIndex >= mixedGroupsCyborg.length)
			) && (antiCyborgTankIndex < antiCyborgGroupsTank.length || antiCyborgCyborgIndex < antiCyborgGroupsTank.length)) {
			if(antiCyborgTankIndex < antiCyborgGroupsTank.length) {
				var units = enumGroup(antiCyborgGroupsTank[antiCyborgTankIndex]);
				for(var i = 0; i < units.length; i++) {
					orderDroidLoc(units[i], DORDER_MOVE, structure.x, structure.y);
				}
				antiCyborgTankIndex++;
				enemyCyborgs -= units.length * 2;
			}
			if(antiCyborgCyborgIndex < antiCyborgGroupsCyborg.length) {
				var units = enumGroup(antiCyborgGroupsCyborg[antiCyborgCyborgIndex]);
				for(var i = 0; i < units.length; i++) {
					orderDroidLoc(units[i], DORDER_MOVE, structure.x, structure.y);
				}
				antiCyborgCyborgIndex++;
				enemyCyborgs -= units.length;
			}
		} else if(mixedTankIndex < mixedGroupsTank.length || mixedCyborgIndex < mixedGroupsCyborg.length){
			if(mixedTankIndex < mixedGroupsTank.length) {
				var units = enumGroup(mixedGroupsTank[mixedTankIndex]);
				for(var i = 0; i < units.length; i++) {
					orderDroidLoc(units[i], DORDER_MOVE, structure.x, structure.y);
				}
				mixedTankIndex++;
				enemyTanks -= units.length;
				enemyCyborgs -= units.length * 2;
			}
			if(mixedCyborgIndex < mixedGroupsCyborg.length) {
				var units = enumGroup(mixedGroupsCyborg[mixedCyborgIndex]);
				for(var i = 0; i < units.length; i++) {
					orderDroidLoc(units[i], DORDER_MOVE, structure.x, structure.y);
				}
				mixedCyborgIndex++;
				enemyTanks -= units.length / 2;
				enemyCyborgs -= units.length;
			}
		}
	}
}


function switchTarget(unit, target) {
	if(unit.order != DORDER_ATTACK) return;
	if(distance(unit, target) < unit.range) orderDroidObj(unit, DORDER_ATTACK, target);
}

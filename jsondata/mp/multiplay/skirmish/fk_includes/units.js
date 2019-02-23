var antiTankGroups = [];
antiTankGroups.push(newGroup());
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
	if(droids.length > 0) return droids[0];
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
	if(droids.length > 0) return droids[0];
}

// Main loop
function unitControl() {
	// Anti Tank
	for(i = 0; i < antiTankGroups.length; i++) {
		var group = antiTankGroups[i];
		
		// Check if we need to add new units
		if(groupSize(group) < tankGroupSize()) {
			var freeUnits = enumGroup(ungrouped);
			for(j = 0; j < freeUnits.length; j++) {
				var unit = freeUnits[j];
				if(unit.type !== DROID) continue;
				if(unit.droidType !== DROID_WEAPON || unit.isVTOL) continue;
				if(
					unit.weapons[0].name == tankWeapons.railgun[0] || unit.weapons[0].name == tankWeapons.railgun[1] ||
					unit.weapons[0].name == tankWeapons.scourge[0] || unit.weapons[0].name == tankWeapons.scourge[1]
				) {
					groupAdd(group, unit);
					if(groupSize(group) >= tankGroupSize) break;
				}
			}
		} else {
			// Check if group needs orders
			var units = enumGroup(group);
			if(
				units[0].order !== DORDER_ATTACK &&
				units[0].order !== DORDER_RTR &&
				units[0].order !== DORDER_SCOUT
			) {
				var target = findAntiTankTarget();
				if(defined(target)) {
					for(j = 0; j < units.length; j++) {
					orderDroidObj(units[j], DORDER_ATTACK, target);
					}
				}
			}
		}
	}
	
	// Anti-Cyborg
	for(i = 0; i < antiCyborgGroups.length; i++) {
		var group = antiCyborgGroups[i];
		
		// Check if we need to add new units
		if(groupSize(group) < cyborgGroupSize()) {
			var freeUnits = enumGroup(ungrouped);
			for(j = 0; j < freeUnits.length; j++) {
				var unit = freeUnits[j];
				if(unit.type !== DROID) continue;
				if(unit.droidType !== DROID_WEAPON || unit.isVTOL) continue;
				if(
					unit.weapons[0].name == tankWeapons.mg[0] || unit.weapons[0].name == tankWeapons.mg[1] || unit.weapons[0].name == tankWeapons.mg[2] ||
					unit.weapons[0].name == tankWeapons.grenade[0] || unit.weapons[0].name == tankWeapons.grenade[1] || unit.weapons[0].name == tankWeapons.grenade[2]
				) {
					groupAdd(group, unit);
					if(groupSize(group) >= cyborgGroupSize) break;
				}
			}
		} else {
			// Check if group needs orders
			var units = enumGroup(group);
			if(
				units[0].order !== DORDER_ATTACK &&
				units[0].order !== DORDER_RTR &&
				units[0].order !== DORDER_SCOUT
			) {
				var target = findAntiCyborgTarget();
				if(defined(target)) {
					for(j = 0; j < units.length; j++) {
					orderDroidObj(units[j], DORDER_ATTACK, target);
					}
				}
			}
		}
	}
}

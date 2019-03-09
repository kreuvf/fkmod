/*
 * This file handles the construction of buildings
 */

const BaseStructs = {
	tankFac: [ "FKTankFactory", ],
	cybFac: [ "FKCyborgFactory", ],
	vtolFac: [ "FKVTOLFactory", ],
	labs: [ "FKResearchFacility", ],
	gens: [ "FKPowerGenerator", ],
	pads: [ "FKRearmPad", ],
	derricks: [ "A0ResourceExtractor", ],
	extras: [ "FKRepairFacility", ],
};

const DefStructs = {
	sensors: [ "FKTowerSurveilance", "FKTowerArtillery", "FKTowerCB", "FKTowerVTOL", ],
	hardpoints: ["FKHardpointMG", "FKHardpointCannon", "FKHardpointScourgeMissile",],
	bunkers: ["FKBunkerMG", "FKBunkerCannon", "FKBunkerScourgeMissile",],
	artillery: ["FKPitHowitzer", "FKPitRockets", "FKPitHowitzerIncendiary",],
	antiAir: ["FKAASiteHurricane", "FKAASiteCyclone", "FKAASiteAvengerSAM", "FKAASiteStormbringer",],
	walls: ["FKWall",],
};

function isBuilderIdle(droid) {
	if (droid.droidType !== DROID_CONSTRUCT) {
		//debug("no droid");
		return false;}
	if (droid.order === DORDER_BUILD) {
		//debug("build");
		return false;}
	if (droid.order === DORDER_HELPBUILD) {
		//debug("help");
		return false;}
	if (droid.order === DORDER_LINEBUILD) {
		//debug("linebuild");
		return false;}
	if (droid.order === DORDER_DEMOLISH) {
		//debug("demolish");
		return false;}
	//debug("idle")
	return true;
}

function findIdleBuilders() {
	return enumDroid(me, DROID_CONSTRUCT).filter(isBuilderIdle);
}

function findNearestIdleBuilder(x, y) {
	var builders = findIdleBuilders().filter(function(droid){
		return droidCanReach(droid, x, y);
	}).sort(function(one, two) {
		return distance(one, x, y) - distance(two, x, y);
	});
	if (builders.length > 0) return builders[0];
}



// Struct for building priority list
function potStructure(id, x, y, priority) {
	this.id = id;
	this.x = x;
	this.y = y;
	this.priority = priority;
}

// Try to have at least 1 oil derrick, 1 power generator and 1 factory
function buildEssentials() {
	var buildings = [];
		// Check oil derricks
	var numDerricks = enumStruct(me, BaseStructs.derricks[0]);
	if (numDerricks < 1) {
		var oil = enumFeature(-1).filter(function(feature) {
			return feature.stattype == OIL_RESOURCE;
		}).sort(function(one, two) {
			return distanceToBase(one) - distanceToBase(two);
		});
		var safeOil = oil.filter(function(feature){
			return isAreaSafe(feature.x, feature.y, 10);
		});
		if (oil.length > 0) {
			if (safeOil.length == 0) {
				buildings.push(new potStructure(BaseStructs.derricks[0], oil[0].x, oil[0].y, 0));
				if (oil.length > 1) {
					buildings.push(new potStructure(BaseStructs.derricks[0], oil[1].x, oil[1].y, 0));
				}
			} else {
				buildings.push(new potStructure(BaseStructs.derricks[0], safeOil[0].x, safeOil[0].y, 0));
				if (safeOil.length > 1) {
					buildings.push(new potStructure(BaseStructs.derricks[0], safeOil[1].x, safeOil[1].y, 0));
				} else if (oil.length > 1) {
					if (oil[0] != safeOil[0]) {
						buildings.push(new potStructure(BaseStructs.derricks[0], oil[0].x, oil[0].y, 0));
					} else {
						buildings.push(new potStructure(BaseStructs.derricks[0], oil[1].x, oil[1].y, 0));
					}
				}
			}
		}
	}
	
	// Check power generators
	var numGens = enumStruct(me, BaseStructs.gens[0]);
		if (numGens < 1) {
			buildings.push(new potStructure(BaseStructs.gens[0], startPositions[me].x, startPositions[me].y, 0));
		}
	
	// Check factories
	var numFacs = enumStruct(me, BaseStructs.tankFac[0]) + enumStruct(me, BaseStructs.cybFac[0]);
	if(numFacs < 1) {
		if(playerPower(me) < 300) {
			buildings.push(new potStructure(BaseStructs.cybFac[0], startPositions[me].x, startPositions[me].y, 0));
		} else {
			buildings.push(new potStructure(BaseStructs.tankFac[0], startPositions[me].x, startPositions[me].y, 0));
		}
	}
	
	return buildings;
}

// Build more oil derricks, if not enough power generation for existing buildings and there is safe oil
function buildOil() {
	var buildings = [];
	var numDerricks = enumStruct(me, BaseStructs.derricks[0]).length;
	var requiredOil = ( 4 +
		enumStruct(me, BaseStructs.cybFac[0]).length + 
		enumStruct(me, BaseStructs.tankFac[0]).length * 2 +
		enumStruct(me, BaseStructs.vtolFac[0]).length * 2 +
		enumStruct(me, BaseStructs.labs[0]).length * 2
	)
	if (numDerricks < requiredOil) {
		var oil = enumFeature(-1).filter(function(feature) {
			return feature.stattype == OIL_RESOURCE;
		}).sort(function(one, two) {
			return distanceToBase(one) - distanceToBase(two);
		});
		var safeOil = oil.filter(function(feature){
			return isAreaSafe(feature.x, feature.y, 10);
		});
		if (safeOil.length > 1) {
			buildings.push(new potStructure(BaseStructs.derricks[0], safeOil[0].x, safeOil[0].y, 1));
			buildings.push(new potStructure(BaseStructs.derricks[0], safeOil[1].x, safeOil[1].y, 1));
		} else {
			buildings.push(new potStructure(BaseStructs.derricks[0], safeOil[0].x, safeOil[0].y, 1));
		}
	}
	
	return buildings;
}

function buildBase() {
	var buildings = [];
	var numDerricks = enumStruct(me, BaseStructs.derricks[0]).length;
	var cybFacs = enumStruct(me, BaseStructs.cybFac[0]).length;
	var tankFacs = enumStruct(me, BaseStructs.tankFac[0]).length;
	var vtolFacs = enumStruct(me, BaseStructs.vtolFac[0]).length;
	var labs = enumStruct(me, BaseStructs.labs[0]).length;
	var gens = enumStruct(me, BaseStructs.gens[0]).length;
	
	if (numDerricks + 2 > gens * 4) {
		buildings.push(new potStructure(BaseStructs.gens[0], startPositions[me].x, startPositions[me].y, 0));
	}
	
	var requiredOil = (
		cybFacs + 
		tankFacs * 2 +
		vtolFacs * 2 +
		labs * 2
	)	
	if (numDerricks >= requiredOil) {
		if (labs == 0) {
			buildings.push(new potStructure(BaseStructs.labs[0], startPositions[me].x, startPositions[me].y, 0));
		} else if (cybFacs + tankFacs + vtolFacs < labs + 2 || labs == getStructureLimit(BaseStructs.labs[0], me)) {
			if((tankFacs <= cybFacs || !isStructureAvailable(BaseStructs.cybFac[0], me)) && (tankFacs <= vtolFacs || !isStructureAvailable(BaseStructs.vtolFac[0], me))) {
				buildings.push(new potStructure(BaseStructs.tankFac[0], startPositions[me].x, startPositions[me].y, 0));
			} else if((cybFacs < tankFacs || !isStructureAvailable(BaseStructs.tankFac[0], me)) && (cybFacs <= vtolFacs || !isStructureAvailable(BaseStructs.vtolFac[0], me))) {
				buildings.push(new potStructure(BaseStructs.cybFac[0], startPositions[me].x, startPositions[me].y, 0));
			} else if(isStructureAvailable(BaseStructs.vtolFac[0], me)) {
				buildings.push(new potStructure(BaseStructs.vtolFac[0], startPositions[me].x, startPositions[me].y, 0));
			}
		} else {
			buildings.push(new potStructure(BaseStructs.labs[0], startPositions[me].x, startPositions[me].y, 0));
		}
		
	}
	
	return buildings;
}

function buildDefense() {
	
}

function buildSomething() {
	var trucks = findIdleBuilders();
	if(trucks.length == 0) return;
	
	// Help build a started structure if near enough
	var unfinished = enumStruct(me).filter(function(struct) {
		return struct.status == BEING_BUILT;
	});
	if(unfinished.length > 0) {
		for(var i = 0; i < unfinished.length; i++) {
			if(distance(trucks[0], unfinished[0]) < 20) {
				orderDroidObj(trucks[0], DORDER_HELPBUILD, unfinished[0]);
				return;
			}
		}
	}
	
	var buildList = buildEssentials();
	buildList = buildList.concat(buildOil());
	buildList = buildList.concat(buildBase());
	if (buildList.length > 0) {
		for(var i = 0; i < buildList.length; i++) {
			var structure = buildList[i];
			var builder = findNearestIdleBuilder(structure.x, structure.y);
			if (!builder) return;
			if (!isStructureAvailable(structure.id, me)) continue;
			var pos = pickStructLocation(builder, structure.id, structure.x, structure.y);
			if (!pos) return;
			var status = orderDroidBuild(builder, DORDER_BUILD, structure.id, pos.x, pos.y);
			if(status) break;
		}
	}
}

// Initial build order at game start

var buildOrder= [
	new potStructure(BaseStructs.tankFac[0], startPositions[me].x, startPositions[me].y, 0),
	new potStructure(BaseStructs.gens[0], startPositions[me].x, startPositions[me].y, 0),
	new potStructure(BaseStructs.derricks[0], startPositions[me].x, startPositions[me].y, 0),
	new potStructure(BaseStructs.labs[0], startPositions[me].x, startPositions[me].y, 0),
	new potStructure(BaseStructs.derricks[0], startPositions[me].x, startPositions[me].y, 0),
	new potStructure(BaseStructs.gens[0], startPositions[me].x, startPositions[me].y, 0),
	new potStructure(BaseStructs.derricks[0], startPositions[me].x, startPositions[me].y, 0),
	new potStructure(BaseStructs.derricks[0], startPositions[me].x, startPositions[me].y, 0),
]

// Chekcs if ai has at least nr of type and orders an additinal structure built if not
function buildMin(type, nr) {
	var num = enumStruct(me, type).length;
	if(num < nr) {
		var structure = new potStructure(type, startPositions[me].x, startPositions[me].y, 0)
		var builder = findNearestIdleBuilder(structure.x, structure.y);
		if (!builder) return true;
		var pos = pickStructLocation(builder, structure.id, structure.x, structure.y);
		if (!pos) return true;
		orderDroidBuild(builder, DORDER_BUILD, structure.id, pos.x, pos.y);
		return true;
	}
	return false;
}

// Initial build order for game start, calls "buildsomething" when all required buildings are built
function buildStartup() {
	var trucks = findIdleBuilders();
	if(trucks.length == 0) return;
	
	// Help build a started structure if near enough
	var unfinished = enumStruct(me).filter(function(struct) {
		return struct.status == BEING_BUILT;
	});
	if(unfinished.length > 0) {
		for(var i = 0; i < unfinished.length; i++) {
			if(distance(trucks[0], unfinished[0]) < 20) {
				orderDroidObj(trucks[0], DORDER_HELPBUILD, unfinished[0]);
				return;
			}
		}
	}
	
	//build order
	if(buildMin(BaseStructs.tankFac[0], 1)) return;
	if(buildMin(BaseStructs.gens[0], 1)) return;
	if(buildMin(BaseStructs.derricks[0], 2)) return;
	if(buildMin(BaseStructs.labs[0], 1)) return;
	if(buildMin(BaseStructs.derricks[0], 4)) return;
	if(buildMin(BaseStructs.gens[0], 2)) return;
	if(buildMin(BaseStructs.derricks[0], 6)) return;
	
	removeTimer("buildStartup");
	setTimer("buildSomething", 1000); // start regular build routine
}

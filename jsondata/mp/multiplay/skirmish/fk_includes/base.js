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

function buildStructureAt(x, y, structure) {
	var builder = findNearestIdleBuilder(x, y);
	if (!isStructureAvailable(structure, me)) return;
	if (!builder) return;
	var pos = pickStructLocation(builder, structure, x, y);
	orderDroidBuild(builder, DORDER_BUILD, structure, pos.x, pos.y);
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
			} else {
				buildings.push(new potStructure(BaseStructs.derricks[0], safeOil[0].x, safeOil[0].y, 0));
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

function buildSomething() {
	var buildList = buildEssentials();
	var trucks = findIdleBuilders();
	if (buildList.length > 0 && trucks.length > 0) {
		buildStructureAt(buildList[0].x, buildList[0].y, buildList[0].id);
	}
}

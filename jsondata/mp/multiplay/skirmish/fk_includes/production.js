/*
 * This file handles the production of units
 */

var unitRequest = [];

const tankWeapons = {
	avenger: ["FK-MIS-AAAvengerSAM", "FK-MIS-AAAvengerSAM2",],
	cyclone: ["FK-SF-AACyclone", "FK-SF-AACyclone2", "FK-SF-AACyclone3"],
	grenade: ["FK-SPL-GrenadeLauncher-TankStructure", "FK-SPL-GrenadeLauncher-TankStructure2", "FK-SPL-GrenadeLauncher-TankStructure3"],
	hurricane: ["FK-FF-AAHurricane", "FK-FF-AAHurricane2", "FK-FF-AAHurricane3"],
	laser: ["FK-HOT-Laser", "FK-HOT-Laser2"],
	mg: ["FK-FF-Autocannon-Tank", "FK-FF-Autocannon-Tank2", "FK-FF-Autocannon-Tank3"],
	railgun: ["FK-SF-Railgun", "FK-SF-Railgun2"],
	scourge: ["FK-MIS-ScourgeMissile", "FK-MIS-ScourgeMissile2"],
	stormbringer: ["FK-HOT-AAStormbringer", "FK-HOT-AAStormbringer2"],
}

const vtolWeapons = {
	cluster: ["FK-SPL-BombCluster", "FK-SPL-BombCluster2", "FK-SPL-BombCluster3"],
	heavy: ["FK-SF-BombHeavy", "FK-SF-BombHeavy2", "FK-SF-BombHeavy3"],
	lancer: ["FK-MIS-LancerVTOL", "FK-MIS-LancerVTOL2"],
	mg: ["FK-FF-Autocannon-VTOL", "FK-FF-Autocannon-VTOL2", "FK-FF-Autocannon-VTOL3"],
	thermite: ["FK-HOT-BombThermite", "FK-HOT-BombThermite2", "FK-HOT-BombThermite3"],
}

const cyborgWeapons = {
	cannon: ["FK-SF-Cannon-Cyborg", "FK-SF-Cannon-Cyborg2", "FK-SF-Cannon-Cyborg3"],
	flame: ["FK-HOT-Flamethrower", "FK-HOT-Flamethrower2", "FK-HOT-Flamethrower3"],
	grenade: ["FK-SPL-GrenadeLauncher-Cyborg", "FK-SPL-GrenadeLauncher-Cyborg2", "FK-SPL-GrenadeLauncher-Cyborg3"],
	lancer : ["FK-MIS-Lancer-Cyborg", "FK-MIS-Lancer-Cyborg2"],
	mg: ["FK-FF-Machinegun-Cyborg", "FK-FF-Machinegun-Cyborg2", "FK-FF-Machinegun-Cyborg3"],
}

const systemTurrets = {
	commander: "FK-Commander",
	scout: "FKScoutSensor",
	repair: "FKTankRepair",
	truck: "FKTruck",
}

const bodies = {
	standard: ["FKTankStart"],
	thermal: ["FKTankHiThermal"],
	kinetic: ["FKTankHiKinetic"],
	fast: ["FKTankHiSpeed"],
}

const propulsions = {
	tracks: ["tracked01"],
	hover: ["hover01"],
	vtol: ["V-Tol"],
}

function idleTankFacs() {
	return enumStruct(me, BaseStructs.tankFac[0]).filter(function(struct) {
		return struct.status == BUILT && structureIdle(struct);
	});
}

function idleCybFacs() {
	return enumStruct(me, BaseStructs.cybFac[0]).filter(function(struct) {
		return struct.status == BUILT && structureIdle(struct);
	});
}

function idleVtolFacs() {
	return enumStruct(me, BaseStructs.vtolFac[0]).filter(function(struct) {
		return struct.status == BUILT && structureIdle(struct);
	});
}

function unit(name, body, propulsion, weapon) {
	this.name = name;
	this.body = body;
	this.propulsion = propulsion;
	this.weapon = weapon;
}

function production() {
	if (playerPower(me) <= 50) return;
	
	// Tanks
	var tankFacs = idleTankFacs();
	if(enumDroid(me, DROID_CONSTRUCT).length < 3) queueTank(new truck());
	if(tankFacs.length > 0) {
		var tank;
		if(unitRequest.length > 0) {
			tank = unitRequest.shift();
		} else {
			// choose tank type
			var enemyTanks = findAntiTankTarget().length;
			var enemyCyborgs = findAntiCyborgTarget().length;
			var ownAntiTank = enumDroid(me).filter(isAntiTank).length;
			var ownAntiCyborg = enumDroid(me).filter(isAntiCyborg).length;
			if((1+enemyTanks)/(1+ownAntiTank) > (1+enemyCyborgs)/(1+ownAntiCyborg)) {
				tank = railgunTank();
			} else {
				if(enemyCyborgs > 20 && enemyCyborgs / enemyCyborgs + enemyTanks > 0.7 && componentAvailable(tankWeapons.grenade[0])) {
					tank = grenadeTank();
				} else {
					tank = mgTank();
				}
			}
		}
		if(defined(tank)) {
			buildDroid(tankFacs[0], tank.name, tank.body, tank.propulsion, null, null, tank.weapon);
		}
	}
	
	// Cyborgs
	var cyborgFacs = idleCybFacs();
	if(cyborgFacs.length > 0) {
		// choose cyborg type
		var cyborg;
		var enemyTanks = findAntiTankTarget().length;
		var enemyCyborgs = findAntiCyborgTarget().length;
		var ownAntiTank = enumDroid(me).filter(isAntiTank).length;
		var ownAntiCyborg = enumDroid(me).filter(isAntiCyborg).length;
		if((1+enemyTanks)/(1+ownAntiTank) > (1+enemyCyborgs)/(1+ownAntiCyborg)) {
			cyborg = cannonCyborg();
		} else {
			if(enemyCyborgs > 20 && enemyCyborgs / enemyCyborgs + enemyTanks > 0.7 && componentAvailable(cyborgWeapons.grenade[0])) {
				cyborg = grenadeCyborg();
			} else {
				cyborg = mgCyborg();
			}
		}
		if(defined(cyborg)) {
			buildDroid(cyborgFacs[0], cyborg.name, cyborg.body, cyborg.propulsion, null, null, cyborg.weapon);
		}
	}
}

// Add a tank to unitRequests, if it isn't in there already
function queueTank(tank) {
	var duplicate = false;
	for(var i=0; i < unitRequest.length; i++) {
		if(tank.name == unitRequest[i].name) duplicate = true;
	}
	if(!duplicate) unitRequest.push(tank);
}

/*
 * This file handles the production of units
 */

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

function mgTank() {
	var name = "MG-Tank";
	var weapon;
	if (componentAvailable(tankWeapons.mg[2])) {
		weapon = tankWeapons.mg[2];
	} else if (componentAvailable(tankWeapons.mg[1])) {
		weapon = tankWeapons.mg[1];
	} else if (componentAvailable(tankWeapons.mg[0])) {
		weapon = tankWeapons.mg[0];
	} else {
		return;
	}
	var body = bodies.standard[0];
	var propulsion = propulsions.tracks[0];
	return new unit(name, body, propulsion, weapon);
}

function railgunTank() {
	var name = "MG-Tank";
	var weapon;
	if (componentAvailable(tankWeapons.railgun[1])) {
		weapon = tankWeapons.railgun[1];
	} else if (componentAvailable(tankWeapons.railgun[0])) {
		weapon = tankWeapons.railgun[0];
	} else {
		return;
	}
	var body = bodies.standard[0];
	var propulsion = propulsions.tracks[0];
	return new unit(name, body, propulsion, weapon);
}

function production() {
	var tankFacs = idleTankFacs();
	if (tankFacs.length > 0) {
		var tank;
		// choose tank type
		var enemyTanks = findAntiTankTarget().length;
		var enemyCyborgs = findAntiCyborgTarget().length;
		var ownAntiTank = enumDroid(me).filter(isAntiTank).length;
		var ownAntiCyborg = enumDroid(me).filter(isAntiCyborg).length;
		if((1+enemyTanks)/(1+ownAntiTank) > (1+enemyCyborgs)/(1+ownAntiCyborg)) {
			tank = railgunTank();
		} else {
			tank = mgTank();
		}
		if(defined(tank)) {
			buildDroid(tankFacs[0], tank.name, tank.body, tank.propulsion, null, null, tank.weapon);
		}
	}
}

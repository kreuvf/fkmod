// Tanks
function avengerTank() {
	var name = "Avenger-Tank";
	var weapon;
	if (componentAvailable(tankWeapons.avenger[1])) {
		weapon = tankWeapons.avenger[1];
	} else if (componentAvailable(tankWeapons.avenger[0])) {
		weapon = tankWeapons.avenger[0];
	} else {
		return;
	}
	var body = bodies.standard[0];
	var propulsion = propulsions.tracks[0];
	return new unit(name, body, propulsion, weapon);
}

function cycloneTank() {
	var name = "Cyclone-Tank";
	var weapon;
	if (componentAvailable(tankWeapons.cyclone[2])) {
		weapon = tankWeapons.cyclone[2];
	} else if (componentAvailable(tankWeapons.cyclone[1])) {
		weapon = tankWeapons.cyclone[1];
	} else if (componentAvailable(tankWeapons.cyclone[0])) {
		weapon = tankWeapons.cyclone[0];
	} else {
		return;
	}
	var body = bodies.standard[0];
	var propulsion = propulsions.tracks[0];
	return new unit(name, body, propulsion, weapon);
}

function grenadeTank() {
	var name = "Grenade-Tank";
	var weapon;
	if (componentAvailable(tankWeapons.grenade[2])) {
		weapon = tankWeapons.grenade[2];
	} else if (componentAvailable(tankWeapons.grenade[1])) {
		weapon = tankWeapons.grenade[1];
	} else if (componentAvailable(tankWeapons.grenade[0])) {
		weapon = tankWeapons.grenade[0];
	} else {
		return;
	}
	var body = bodies.standard[0];
	var propulsion = propulsions.tracks[0];
	return new unit(name, body, propulsion, weapon);
}

function hurricaneTank() {
	var name = "Hurricane-Tank";
	var weapon;
	if (componentAvailable(tankWeapons.hurricane[2])) {
		weapon = tankWeapons.hurricane[2];
	} else if (componentAvailable(tankWeapons.hurricane[1])) {
		weapon = tankWeapons.hurricane[1];
	} else if (componentAvailable(tankWeapons.hurricane[0])) {
		weapon = tankWeapons.hurricane[0];
	} else {
		return;
	}
	var body = bodies.standard[0];
	var propulsion = propulsions.tracks[0];
	return new unit(name, body, propulsion, weapon);
}

function laserTank() {
	var name = "Laser-Tank";
	var weapon;
	if (componentAvailable(tankWeapons.laser[1])) {
		weapon = tankWeapons.laser[1];
	} else if (componentAvailable(tankWeapons.laser[0])) {
		weapon = tankWeapons.laser[0];
	} else {
		return;
	}
	var body = bodies.standard[0];
	var propulsion = propulsions.tracks[0];
	return new unit(name, body, propulsion, weapon);
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
	var name = "Railgun-Tank";
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

function scourgeTank() {
	var name = "Scourge-Tank";
	var weapon;
	if (componentAvailable(tankWeapons.scourge[1])) {
		weapon = tankWeapons.scourge[1];
	} else if (componentAvailable(tankWeapons.scourge[0])) {
		weapon = tankWeapons.scourge[0];
	} else {
		return;
	}
	var body = bodies.standard[0];
	var propulsion = propulsions.tracks[0];
	return new unit(name, body, propulsion, weapon);
} 

function stormbringerTank() {
	var name = "Stormbringer-Tank";
	var weapon;
	if (componentAvailable(tankWeapons.stormbringer[1])) {
		weapon = tankWeapons.stormbringer[1];
	} else if (componentAvailable(tankWeapons.stormbringer[0])) {
		weapon = tankWeapons.stormbringer[0];
	} else {
		return;
	}
	var body = bodies.standard[0];
	var propulsion = propulsions.tracks[0];
	return new unit(name, body, propulsion, weapon);
}

function scoutTank() {
	var name = "Scout-Tank";
	var weapon;
	if (componentAvailable(systemTurrets.scout)) {
		weapon = systemTurrets.scout;
	} else {
		return;
	}
	var body = bodies.standard[0];
	var propulsion = propulsions.tracks[0];
	return new unit(name, body, propulsion, weapon);
}

function truck() {
	var name = "Truck";
	var weapon = systemTurrets.truck;
	var body = bodies.standard[0];
	var propulsion = propulsions.tracks[0];
	return new unit(name, body, propulsion, weapon);
}

//Cyborgs
function cannonCyborg() {
	var name = "Cannon Cyborg Mk1";
	var weapon;
	var body;
	if (componentAvailable(cyborgWeapons.cannon[2])) {
		body = "FKCyborg-Cannon3";
		weapon = cyborgWeapons.cannon[2];
	} else if (componentAvailable("FKCyborg-Cannon2")) {
		body = "FKCyborg-Cannon2";
		weapon = cyborgWeapons.cannon[1];
	} else if (componentAvailable("FKCyborg-Cannon")) {
		body = "FKCyborg-Cannon";
		weapon = cyborgWeapons.cannon[0];
	} else {
		return;
	}
	var propulsion = "CyborgLegs";
	return new unit(name, body, propulsion, weapon);
}

function flamerCyborg() {
	var name = "Flamethrower Cyborg";
	var weapon;
	var body;
	if (componentAvailable("FKCyborg-Flamethrower3")) {
		body = "FKCyborg-Flamethrower3";
		weapon = cyborgWeapons.flame[2]
	} else if (componentAvailable("FKCyborg-Flamethrower2")) {
		body = "FKCyborg-Flamethrower2";
		weapon = cyborgWeapons.flame[1]
	} else if (componentAvailable("FKCyborg-Flamethrower")) {
		body = "FKCyborg-Flamethrower";
		weapon = cyborgWeapons.flame[0]
	} else {
		return;
	}
	var propulsion = "CyborgLegs";
	return new unit(name, body, propulsion, weapon);
}

function grenadeCyborg() {
	var name = "Grenade Launcher Cyborg";
	var weapon;
	var body;
	if (componentAvailable("FKCyborg-GrenadeLauncher3")) {
		body = "FKCyborg-GrenadeLauncher3";
		weapon = cyborgWeapons.grenade[2];
	} else if (componentAvailable("FKCyborg-GrenadeLauncher2")) {
		body = "FKCyborg-GrenadeLauncher2";
		weapon = cyborgWeapons.grenade[1];
	} else if (componentAvailable("FKCyborg-GrenadeLauncher")) {
		body = "FKCyborg-GrenadeLauncher";
		weapon = cyborgWeapons.grenade[0];
	} else {
		return;
	}
	var propulsion = "CyborgLegs";
	return new unit(name, body, propulsion, weapon);
}

function lancerCyborg() {
	var name = "Lancer Cyborg";
	var weapon;
	var body;
	if (componentAvailable("FKCyborg-Lancer")) {
		body = "FKCyborg-Lancer";
		weapon = cyborgWeapons.lancer[1];
	} else if (componentAvailable("FKCyborg-Lancer")) {
		body = "FKCyborg-Lancer";
		weapon = cyborgWeapons.lancer[0];
	} else {
		return;
	}
	var propulsion = "CyborgLegs";
	return new unit(name, body, propulsion, weapon);
}

function mgCyborg() {
	var name = "MG Cyborg";
	var weapon;
	var body;
	if (componentAvailable("FKCyborg-MG3")) {
		body = "FKCyborg-MG3";
		weapon = cyborgWeapons.mg[2];
	} else if (componentAvailable("FKCyborg-MG2")) {
		body = "FKCyborg-MG2";
		weapon = cyborgWeapons.mg[1];
	} else if (componentAvailable("FKCyborg-MG")) {
		body = "FKCyborg-MG";
		weapon = cyborgWeapons.mg[0];
	} else {
		return;
	}
	var propulsion = "CyborgLegs";
	return new unit(name, body, propulsion, weapon);
}

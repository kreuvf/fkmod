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

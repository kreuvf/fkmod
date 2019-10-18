var weaponFocus;
var researchQueue = [];

var antiTankWeaponTank;
var antiTankWeaponCyborg;
var antiCyborgWeaponTank;
var antiCyborgWeaponCyborg;
var antiAirWeapon;


const research = {
	autocannon: {
		base: ["R-W-FF-Autocannon"],
		dmg: ["R-WU-Autocannon-DMG1","R-WU-Autocannon-DMG2","R-WU-Autocannon-DMG3","R-WU-Autocannon-DMG4","R-WU-Autocannon-DMG5"],
		rof: ["R-WU-Autocannon-ROF1","R-WU-Autocannon-ROF2","R-WU-Autocannon-ROF3","R-WU-Autocannon-ROF4","R-WU-Autocannon-ROF5","R-WU-Autocannon-ROF6","R-WU-Autocannon-ROF7"],
		acc: ["R-WU-Autocannon-ACC1","R-WU-Autocannon-ACC2","R-WU-Autocannon-ACC3","R-WU-Autocannon-ACC4","R-WU-Autocannon-ACC5"],
		special: ["R-WU-Autocannon-SPE1","R-WU-Autocannon-SPE2"],
	},
	avenger: {
		base: ["R-W-MIS-AAAvengerSAM"],
		dmg: ["R-WU-AAAvengerSAM-DMG1","R-WU-AAAvengerSAM-DMG2","R-WU-AAAvengerSAM-DMG3","R-WU-AAAvengerSAM-DMG4","R-WU-AAAvengerSAM-DMG5"],
		rof: ["R-WU-AAAvengerSAM-ROF1","R-WU-AAAvengerSAM-ROF2","R-WU-AAAvengerSAM-ROF3","R-WU-AAAvengerSAM-ROF4","R-WU-AAAvengerSAM-ROF5"],
		acc: ["R-WU-AAAvengerSAM-ACC1","R-WU-AAAvengerSAM-ACC2","R-WU-AAAvengerSAM-ACC3","R-WU-AAAvengerSAM-ACC4","R-WU-AAAvengerSAM-ACC5","R-WU-AAAvengerSAM-ACC6","R-WU-AAAvengerSAM-ACC7"],
		special: ["R-WU-AAAvengerSAM-SPE1"],
	},
	cannon: {
		base: ["R-W-SF-Cannon"],
		dmg: ["R-WU-Cannon-DMG1", "R-WU-Cannon-DMG2", "R-WU-Cannon-DMG3", "R-WU-Cannon-DMG4", "R-WU-Cannon-DMG5", "R-WU-Cannon-DMG6", "R-WU-Cannon-DMG7"],
		rof: ["R-WU-Cannon-ROF1", "R-WU-Cannon-ROF2", "R-WU-Cannon-ROF3", "R-WU-Cannon-ROF4", "R-WU-Cannon-ROF5"],
		acc: ["R-WU-Cannon-ACC1", "R-WU-Cannon-ACC2", "R-WU-Cannon-ACC3", "R-WU-Cannon-ACC4", "R-WU-Cannon-ACC5"],
		special: ["R-WU-Cannon-Struc-SPE1", "R-WU-Cannon-Struc-SPE2", "R-WU-Cannon-Cyb-SPE1", "R-WU-Cannon-Cyb-SPE2"],
	},
	cyclone: {
		base: ["R-W-SF-AACyclone"],
		dmg: ["R-WU-AACyclone-DMG1","R-WU-AACyclone-DMG2","R-WU-AACyclone-DMG3","R-WU-AACyclone-DMG4","R-WU-AACyclone-DMG5","R-WU-AACyclone-DMG6","R-WU-AACyclone-DMG7"],
		rof: ["R-WU-AACyclone-ROF1","R-WU-AACyclone-ROF2","R-WU-AACyclone-ROF3","R-WU-AACyclone-ROF4","R-WU-AACyclone-ROF5"],
		acc: ["R-WU-AACyclone-ACC1","R-WU-AACyclone-ACC2","R-WU-AACyclone-ACC3","R-WU-AACyclone-ACC4","R-WU-AACyclone-ACC5"],
		special: ["R-WU-AACyclone-SPE1","R-WU-AACyclone-SPE2"],
	},
	grenade: {
		base: ["R-W-SPL-GrenadeLauncher"],
		dmg: ["R-WU-GrenadeLauncher-DMG1","R-WU-GrenadeLauncher-DMG2","R-WU-GrenadeLauncher-DMG3","R-WU-GrenadeLauncher-DMG4","R-WU-GrenadeLauncher-DMG5","R-WU-GrenadeLauncher-DMG6","R-WU-GrenadeLauncher-DMG7"],
		rof: ["R-WU-GrenadeLauncher-ROF1","R-WU-GrenadeLauncher-ROF2","R-WU-GrenadeLauncher-ROF3","R-WU-GrenadeLauncher-ROF4","R-WU-GrenadeLauncher-ROF5"],
		acc: ["R-WU-GrenadeLauncher-ACC1","R-WU-GrenadeLauncher-ACC2","R-WU-GrenadeLauncher-ACC3","R-WU-GrenadeLauncher-ACC4","R-WU-GrenadeLauncher-ACC5"],
		special: ["R-WU-GrenadeLauncher-SPE1","R-WU-GrenadeLauncher-SPE2"],
	},
	hurricane: {
		base: ["R-W-FF-AAHurricane"],
		dmg: ["R-WU-AAHurricane-DMG1","R-WU-AAHurricane-DMG2","R-WU-AAHurricane-DMG3","R-WU-AAHurricane-DMG4","R-WU-AAHurricane-DMG5"],
		rof: ["R-WU-AAHurricane-ROF1","R-WU-AAHurricane-ROF2","R-WU-AAHurricane-ROF3","R-WU-AAHurricane-ROF4","R-WU-AAHurricane-ROF5","R-WU-AAHurricane-ROF6","R-WU-AAHurricane-ROF7"],
		acc: ["R-WU-AAHurricane-ACC1","R-WU-AAHurricane-ACC2","R-WU-AAHurricane-ACC3","R-WU-AAHurricane-ACC4","R-WU-AAHurricane-ACC5"],
		special: ["R-WU-AAHurricane-SPE1","R-WU-AAHurricane-SPE2"],
	},
	lancer: {
		base: ["R-W-MIS-Lancer"],
		dmg: ["R-WU-Lancer-DMG1", "R-WU-Lancer-DMG2", "R-WU-Lancer-DMG3", "R-WU-Lancer-DMG4", "R-WU-Lancer-DMG5"],
		rof: ["R-WU-Lancer-ROF1", "R-WU-Lancer-ROF2", "R-WU-Lancer-ROF3", "R-WU-Lancer-ROF4", "R-WU-Lancer-ROF5"],
		acc: ["R-WU-Lancer-ACC1", "R-WU-Lancer-ACC2", "R-WU-Lancer-ACC3", "R-WU-Lancer-ACC4", "R-WU-Lancer-ACC5"],
		special: ["R-WU-Lancer-SPE1"],
	},
	laser: {
		base: ["R-W-HOT-Laser"],
		dmg: ["R-WU-Laser-DMG1","R-WU-Laser-DMG2","R-WU-Laser-DMG3","R-WU-Laser-DMG4","R-WU-Laser-DMG5","R-WU-Laser-DMG6","R-WU-Laser-DMG7"],
		rof: ["R-WU-Laser-ROF1","R-WU-Laser-ROF2","R-WU-Laser-ROF3","R-WU-Laser-ROF4","R-WU-Laser-ROF5"],
		acc: ["R-WU-Laser-ACC1","R-WU-Laser-ACC2","R-WU-Laser-ACC3","R-WU-Laser-ACC4","R-WU-Laser-ACC5"],
		special: ["R-WU-Laser-SPE1"],
	},
	mg: {
		base: ["R-W-FF-Machinegun"],
		dmg: ["R-WU-Machinegun-DMG1","R-WU-Machinegun-DMG2","R-WU-Machinegun-DMG3","R-WU-Machinegun-DMG4","R-WU-Machinegun-DMG5"],
		rof: ["R-WU-Machinegun-ROF1","R-WU-Machinegun-ROF2","R-WU-Machinegun-ROF3","R-WU-Machinegun-ROF4","R-WU-Machinegun-ROF5","R-WU-Machinegun-ROF6","R-WU-Machinegun-ROF7"],
		acc: ["R-WU-Machinegun-ACC1","R-WU-Machinegun-ACC2","R-WU-Machinegun-ACC3","R-WU-Machinegun-ACC4","R-WU-Machinegun-ACC5"],
		special: ["R-WU-Machinegun-SPE1","R-WU-Machinegun-SPE2"],
	},
	railgun: {
		base: ["R-W-SF-Railgun"],
		dmg: ["R-WU-Railgun-DMG1","R-WU-Railgun-DMG2","R-WU-Railgun-DMG3","R-WU-Railgun-DMG4","R-WU-Railgun-DMG5","R-WU-Railgun-DMG6","R-WU-Railgun-DMG7"],
		rof: ["R-WU-Railgun-ROF1","R-WU-Railgun-ROF2","R-WU-Railgun-ROF3","R-WU-Railgun-ROF4","R-WU-Railgun-ROF5"],
		acc: ["R-WU-Railgun-ACC1","R-WU-Railgun-ACC2","R-WU-Railgun-ACC3","R-WU-Railgun-ACC4","R-WU-Railgun-ACC5"],
		special: ["R-WU-Railgun-SPE1"],
	},
	scourge: {
		base: ["R-W-MIS-ScourgeMissile"],
		dmg: ["R-WU-ScourgeMissile-DMG1","R-WU-ScourgeMissile-DMG2","R-WU-ScourgeMissile-DMG3","R-WU-ScourgeMissile-DMG4","R-WU-ScourgeMissile-DMG5"],
		rof: ["R-WU-ScourgeMissile-ROF1","R-WU-ScourgeMissile-ROF2","R-WU-ScourgeMissile-ROF3","R-WU-ScourgeMissile-ROF4","R-WU-ScourgeMissile-ROF5"],
		acc: ["R-WU-ScourgeMissile-ACC1","R-WU-ScourgeMissile-ACC2","R-WU-ScourgeMissile-ACC3","R-WU-ScourgeMissile-ACC4","R-WU-ScourgeMissile-ACC5","R-WU-ScourgeMissile-ACC6","R-WU-ScourgeMissile-ACC7"],
		special: ["R-WU-ScourgeMissile-SPE1"],
	},
	stormbringer: {
		base: ["R-W-HOT-AAStormbringer"],
		dmg: ["R-WU-AAStormbringer-DMG1","R-WU-AAStormbringer-DMG2","R-WU-AAStormbringer-DMG3","R-WU-AAStormbringer-DMG4","R-WU-AAStormbringer-DMG5","R-WU-AAStormbringer-DMG6","R-WU-AAStormbringer-DMG7"],
		rof: ["R-WU-AAStormbringer-ROF1","R-WU-AAStormbringer-ROF2","R-WU-AAStormbringer-ROF3","R-WU-AAStormbringer-ROF4","R-WU-AAStormbringer-ROF5"],
		acc: ["R-WU-AAStormbringer-ACC1","R-WU-AAStormbringer-ACC2","R-WU-AAStormbringer-ACC3","R-WU-AAStormbringer-ACC4","R-WU-AAStormbringer-ACC5"],
		special: ["R-WU-AAStormbringer-SPE1"],
	},
	defensive: {
		kinetic: ["R-BU-KineticArmour1","R-BU-KineticArmour2","R-BU-KineticArmour3","R-BU-KineticArmour4","R-BU-KineticArmour5"],
		heat: ["R-BU-ThermalArmour1","R-BU-ThermalArmour2","R-BU-ThermalArmour3","R-BU-ThermalArmour4","R-BU-ThermalArmour5"],
		bp: ["R-BU-BodyPoints1","R-BU-BodyPoints2","R-BU-BodyPoints3","R-BU-BodyPoints4","R-BU-BodyPoints5"],
	},
	parts: {
		bodies: ["R-B-HiKin","R-B-HiSpeed","R-B-HiTherm"],
		propulsions: ["R-P-Hover","R-P-VTOL"],
		sensors: ["R-SensorArtillery","R-SensorCB","R-SensorSurveillance","R-SensorVTOL"],
	},
	misc: {
		hacks: ["R-HACK-Autorepair", "R-HACK-Bunker-Cannon", "R-HACK-Bunker-Cannon2", "R-HACK-Bunker-Cannon3", "R-HACK-Bunker-GrenadeLauncher", "R-HACK-Bunker-GrenadeLauncher2", "R-HACK-Bunker-GrenadeLauncher3", "R-HACK-Bunker-Machinegun", "R-HACK-Bunker-Machinegun2", "R-HACK-Bunker-Machinegun3", "R-HACK-Bunker-ScourgeMissile", "R-HACK-Bunker-ScourgeMissile2", "R-HACK-Hardpoint-Cannon", "R-HACK-Hardpoint-Cannon2", "R-HACK-Hardpoint-Cannon3", "R-HACK-Hardpoint-Machinegun", "R-HACK-Hardpoint-Machinegun2", "R-HACK-Hardpoint-Machinegun3", "R-HACK-Hardpoint-ScourgeMissile", "R-HACK-Hardpoint-ScourgeMissile2", "R-HACK-Site-AAAvengerSAM", "R-HACK-Site-AAAvengerSAM2", "R-HACK-Site-AACyclone", "R-HACK-Site-AACyclone2", "R-HACK-Site-AACyclone3", "R-HACK-Site-AAHurricane", "R-HACK-Site-AAHurricane2", "R-HACK-Site-AAHurricane3", "R-HACK-Site-AAStormbringer", "R-HACK-Site-AAStormbringer2"],
		researchSpeed: ["R-Res1", "R-Res2", "R-Res3", "R-Res4", "R-Res5"],
	},
}

function isLabIdle(lab) {
	return lab.status == BUILT && structureIdle(lab);
}

function idleLabs() {
	return enumStruct(me, BaseStructs.labs[0]).filter(function(struct) {
		return struct.status == BUILT && structureIdle(struct);
	});
}

function setWeaponFocus() {
	var enemyTanks = findAntiTankTarget().length;
	var enemyCyborgs = findAntiCyborgTarget().length;
	var ownTanks = enumDroid(me).filter(function(droid) {
		return droid.droidType == DROID_WEAPON && !isVTOL;
	}).length;
	var ownCyborgs = enumDroid(me).filter(function(droid) {
		return droid.droidType == DROID_CYBORG;
	}).length;
	if(enemyHasVTOL() && !getResearch(antiAirWeapon.base[0]).done) {
		weaponFocus = antiAirWeapon;
	} else if(enemyTanks >= enemyCyborgs) {
		if(ownTanks * 2 > ownCyborgs) {
			weaponFocus = antiTankWeaponTank;
		} else {
			weaponFocus = antiTankWeaponCyborg;
		}
	} else {
		if(enemyCyborgs > 20 && enemyCyborgs / enemyCyborgs + enemyTanks > 0.7) {
			weaponFocus = research.grenade;
		} else {
			if(ownTanks * 2 > ownCyborgs) {
				weaponFocus = antiCyborgWeaponTank;
			} else {
				weaponFocus = antiCyborgWeaponCyborg;
			}
		}
	}
}

function nextQueueItem() {
	if (researchQueue.length > 0) {
		return researchQueue.shift();
	}
	var weapontech = findResearch(weaponFocus.special[weaponFocus.special.length - 1]);
	if (weapontech.length > 0) {
		researchQueue.push(weapontech[0]);
		researchQueue.push(weapontech[0]);
		researchQueue.push(weapontech[0]);
	}
	var defensetech = findResearch(research.defensive.bp[research.defensive.bp.length - 1]);
	defensetech.concat(findResearch(research.defensive.kinetic[research.defensive.kinetic.length - 1]));
	defensetech.concat(findResearch(research.defensive.heat[research.defensive.heat.length - 1]));
	if (defensetech.length > 0) researchQueue.push(defensetech[0]);
	var researchtech = findResearch(research.misc.researchSpeed[research.misc.researchSpeed.length - 1]);
	if(researchtech.length > 0) researchQueue.push(researchtech[0]);
	for(var i = 0; i < research.misc.hacks.length; i++) {
		var hack = findResearch(research.misc.hacks[i]);
		if(hack.length == 1) researchQueue.push(hack[0]);
	}
	
	if(researchQueue.length > 0) {
		// Nothing suitable found, just research anything
		researchQueue.concat(enumResearch());
	}
}

function researchSomething() {
	if(playerPower(me) <= 50) return;
	var freeLabs = idleLabs();
	if(freeLabs.length == 0) return;
	
	
	// Check weapon focus
	setWeaponFocus();
	var next = nextQueueItem();
	if(defined(next)) {
		pursueResearch(freeLabs[0], next.name);
	}
}

function initResearch() {
	switch(random(0,1)) {
		case 0: antiTankWeaponTank = research.railgun; break;
		case 1: antiTankWeaponTank = research.scourge; break;
	}
	switch(random(0,1)) {
		case 0: antiTankWeaponCyborg = research.cannon; break;
		case 1: antiTankWeaponCyborg = research.lancer; break;
	}
	switch(random(0,1)) {
		case 0: antiCyborgWeaponTank = research.autocannon; break;
		case 1: antiCyborgWeaponTank = research.laser; break;
	}
	antiCyborgWeaponCyborg = research.mg;
	switch(random(0,3)) {
		case 0: antiAirWeapon = research.avenger; break;
		case 1: antiAirWeapon = research.cyclone; break;
		case 2: antiAirWeapon = research.hurricane; break;
		case 3: antiAirWeapon = research.stormbringer; break;
	}
}

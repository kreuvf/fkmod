const research = {
	mg: {
		base: ["R-W-FF-Machinegun"],
		dmg: ["R-WU-Machinegun-DMG1", "R-WU-Machinegun-DMG2", "R-WU-Machinegun-DMG3", "R-WU-Machinegun-DMG4", "R-WU-Machinegun-DMG5"],
		rof: ["R-WU-Machinegun-ROF1","R-WU-Machinegun-ROF2","R-WU-Machinegun-ROF3","R-WU-Machinegun-ROF4","R-WU-Machinegun-ROF5","R-WU-Machinegun-ROF6","R-WU-Machinegun-ROF7"],
		acc: ["R-WU-Machinegun-ACC1", "R-WU-Machinegun-ACC2", "R-WU-Machinegun-ACC3", "R-WU-Machinegun-ACC4", "R-WU-Machinegun-ACC5"],
		special: ["R-WU-Machinegun-SPE1","R-WU-Machinegun-SPE2"],
	}
}

function idleLabs() {
	return enumStruct(me, BaseStructs.labs[0]).filter(function(struct) {
		return struct.status == BUILT && structureIdle(struct);
	});
}

function researchSomething() {
	var available = enumResearch();
	var freeLabs = idleLabs();
	if (freeLabs.length > 0 && available.length > 0) {
		pursueResearch(freeLabs[0], available[0].name);
		
	}
}

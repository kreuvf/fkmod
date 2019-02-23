var weaponFocus;

const research = {
	mg: {
		base: ["R-W-FF-Machinegun"],
		dmg: ["R-WU-Machinegun-DMG1", "R-WU-Machinegun-DMG2", "R-WU-Machinegun-DMG3", "R-WU-Machinegun-DMG4", "R-WU-Machinegun-DMG5"],
		rof: ["R-WU-Machinegun-ROF1","R-WU-Machinegun-ROF2","R-WU-Machinegun-ROF3","R-WU-Machinegun-ROF4","R-WU-Machinegun-ROF5","R-WU-Machinegun-ROF6","R-WU-Machinegun-ROF7"],
		acc: ["R-WU-Machinegun-ACC1", "R-WU-Machinegun-ACC2", "R-WU-Machinegun-ACC3", "R-WU-Machinegun-ACC4", "R-WU-Machinegun-ACC5"],
		special: ["R-WU-Machinegun-SPE1","R-WU-Machinegun-SPE2"],
	}
}

function isLabIdle(lab) {
	return lab.status == BUILT && structureIdle(lab);
}

function idleLabs() {
	return enumStruct(me, BaseStructs.labs[0]).filter(function(struct) {
		return struct.status == BUILT && structureIdle(struct);
	});
}

function researchSomething() {
	var available = enumResearch();
	var freeLabs = idleLabs();
	if(available.length == 0 || freeLabs.length == 0) return;
	
	//TEST
	weaponFocus = research.mg;
	
	// Check weapon focus
	pursueResearch(freeLabs[0], weaponFocus.special[weaponFocus.special.length - 1]);
	if(isLabIdle(freeLabs[0])) return;
	
	// Nothing suitable found, just research anything
	pursueResearch(freeLabs[0], available[0].name);
}

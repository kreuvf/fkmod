function eventStartLevel() {
	setTimer("buildStartup", 1000); // build buildings
	setTimer("production", 1000); // build units
	setTimer("researchSomething", 1000); // research
	setTimer("unitControl", 1000);
}

function eventDroidBuilt(droid, structure) {
	if (droid.droidType !== DROID_CONSTRUCT && droid.droidType !== DROID_SENSOR) {
		groupAddDroid(ungrouped, droid);
	}
	if(droid.droidType == DROID_SENSOR) {
		groupAddDroid(scouts, droid);
	}
}

function eventAttacked(victim, attacker) {
	if(victim.type == STRUCTURE) {
		defend(victim);
	} else if(victim.type == DROID) {
		switchTarget(victim, attacker);
	}
}

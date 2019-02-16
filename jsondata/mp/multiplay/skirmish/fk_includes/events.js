function eventStartLevel() {
	setTimer("buildSomething", 1000); // build buildings
	setTimer("production", 1000); // build units
	setTimer("researchSomething", 1000); // research
	setTimer("unitControl", 1000);
}

function eventDroidBuilt(droid, structure) {
	if (droid.droidType !== DROID_CONSTRUCT) {
		groupAddDroid(ungrouped, droid);
	}
}

//
// Skirmish Base Script.
//
// contains the rules for starting and ending a game.
// as well as warning messages.
//
// /////////////////////////////////////////////////////////////////

var lastHitTime = 0;

function eventGameInit()
{
	hackNetOff();
	for (var playnum = 0; playnum < maxPlayers; playnum++)
	{
		enableStructure("A0ResourceExtractor", playnum);		// make structures available to build
		enableStructure("FKPowerGenerator", playnum);
		enableStructure("FKResearchFacility", playnum);
		enableStructure("FKTankFactory", playnum);
		enableStructure("FKCyborgFactory", playnum);

		// We need to enable these in order for scripts to be able to generate their templates.
		makeComponentAvailable("FKTankStart", playnum);
		makeComponentAvailable("FKTruck", playnum);
		makeComponentAvailable("FKCyborg-Engineer", playnum); // body
		makeComponentAvailable("FKCyborgEngineer", playnum); // constructor
		makeComponentAvailable("tracked01", playnum);
	 	//makeComponentAvailable("", playnum);

		enableResearch("R-W-FF-Machinegun", playnum);
		enableResearch("R-W-SF-Railgun", playnum);
		enableResearch("R-W-SF-Cannon", playnum);
		enableResearch("R-W-MIS-ScourgeMissile", playnum);
		enableResearch("R-W-MIS-Lancer", playnum);
		enableResearch("R-W-HOT-Flamethrower", playnum);
		enableResearch("R-W-HOT-Laser", playnum);
		enableResearch("R-Res1", playnum);
		enableResearch("R-NRG1", playnum);
		enableResearch("R-SensorSurveillance", playnum);
		enableResearch("R-Repair", playnum);
		enableResearch("R-BU-BodyPoints1", playnum);
		enableResearch("R-BU-Engine1", playnum);
		enableResearch("R-BU-KineticArmour1", playnum);
		enableResearch("R-BU-ThermalArmour1", playnum);
		enableResearch("R-StU-Armours1", playnum);
		enableResearch("R-StU-BodyPoints1", playnum);
		enableResearch("R-Def-Wall", playnum);

		// Needed for Autorepair from the start
		// Autorepair is defined in repair.txt
		// Autorepair is a research topic
		// Autorepair research results in the replacement of ZNULLREPAIR with autorepair
		completeResearch("R-HACK-Autorepair", playnum);

		// Enable cyborg production
		makeComponentAvailable("CyborgLegs", playnum);
		// Probably have to add all weapons also~
		
		setPower(1337, playnum);
		
		setStructureLimits("FKTankFactory", 5, playnum);	// set structure limits
		setStructureLimits("FKPowerGenerator", 8, playnum);
		setStructureLimits("FKResearchFacility", 5, playnum);
		setStructureLimits("FKCyborgFactory", 5, playnum);
		setStructureLimits("FKVTOLFactory", 5, playnum);
	}
	applyLimitSet();	// set limit options

	var res_components = new Array(
		"R-B-HiKin",
		"R-B-HiSpeed",
		"R-B-HiTherm",
		"R-Def-Bunker",
		"R-Def-Hardpoint",
		"R-Def-Site",
		"R-Def-Wall",
		"R-HACK-Bunker-Cannon",
		"R-HACK-Bunker-GrenadeLauncher",
		"R-HACK-Bunker-Machinegun",
		"R-HACK-Hardpoint-Cannon",
		"R-HACK-Hardpoint-Machinegun",
		"R-HACK-Site-AAAvengerSAM",
		"R-HACK-Site-AACyclone",
		"R-HACK-Site-AAHurricane",
		"R-HACK-Site-AAStormbringer",
		"R-P-Hover",
		"R-P-VTOL",
		"R-Repair",
		"R-SensorArtillery",
		"R-SensorCB",
		"R-SensorSurveillance",
		"R-SensorVTOL",
		"R-Commander",
		"R-St-RepairFacility",
		"R-U-CyborgTransport",
		"R-W-ART-Howitzer",
		"R-W-ART-RocketBattery",
		"R-W-FF-AAHurricane",
		"R-W-FF-Machinegun",
		"R-W-HOT-AAStormbringer",
		"R-W-HOT-BombThermite",
		"R-W-HOT-Flamethrower",
		"R-W-HOT-HowitzerIncendiary",
		"R-W-HOT-Laser",
		"R-W-MIS-AAAvengerSAM",
		"R-W-MIS-Lancer",
		"R-W-MIS-ScourgeMissile",
		"R-W-SF-AACyclone",
		"R-W-SF-BombHeavy",
		"R-W-SF-Cannon",
		"R-W-SF-Railgun",
		"R-W-SPL-BombCluster",
		"R-W-SPL-GrenadeLauncher");

	var res_upgrades = new Array(
		"R-BU-BodyPoints1",
		"R-BU-BodyPoints2",
		"R-BU-BodyPoints3",
		"R-BU-BodyPoints4",
		"R-BU-BodyPoints5",
		"R-BU-Engine1",
		"R-BU-Engine2",
		"R-BU-Engine3",
		"R-BU-Engine4",
		"R-BU-Engine5",
		"R-BU-KineticArmour1",
		"R-BU-KineticArmour2",
		"R-BU-KineticArmour3",
		"R-BU-KineticArmour4",
		"R-BU-KineticArmour5",
		"R-BU-ThermalArmour1",
		"R-BU-ThermalArmour2",
		"R-BU-ThermalArmour3",
		"R-BU-ThermalArmour4",
		"R-BU-ThermalArmour5",
		"R-HACK-Bunker-Cannon2",
		"R-HACK-Bunker-Cannon3",
		"R-HACK-Bunker-GrenadeLauncher2",
		"R-HACK-Bunker-GrenadeLauncher3",
		"R-HACK-Bunker-Machinegun2",
		"R-HACK-Bunker-Machinegun3",
		"R-HACK-Hardpoint-Cannon2",
		"R-HACK-Hardpoint-Cannon3",
		"R-HACK-Hardpoint-Machinegun2",
		"R-HACK-Hardpoint-Machinegun3",
		"R-HACK-Site-AAAvengerSAM2",
		"R-HACK-Site-AACyclone2",
		"R-HACK-Site-AACyclone3",
		"R-HACK-Site-AAHurricane2",
		"R-HACK-Site-AAHurricane3",
		"R-HACK-Site-AAStormbringer2",
		"R-NRG1",
		"R-NRG10",
		"R-NRG2",
		"R-NRG3",
		"R-NRG4",
		"R-NRG5",
		"R-NRG6",
		"R-NRG7",
		"R-NRG8",
		"R-NRG9",
		"R-RAU1",
		"R-RAU2",
		"R-RAU3",
		"R-Res1",
		"R-Res2",
		"R-Res3",
		"R-Res4",
		"R-Res5",
		"R-RpU1",
		"R-RpU2",
		"R-RpU3",
		"R-StU-Armours1",
		"R-StU-Armours2",
		"R-StU-Armours3",
		"R-StU-Armours4",
		"R-StU-Armours5",
		"R-StU-BodyPoints1",
		"R-StU-BodyPoints2",
		"R-StU-BodyPoints3",
		"R-StU-BodyPoints4",
		"R-StU-BodyPoints5",
		"R-WU-AAAvengerSAM-ACC1",
		"R-WU-AAAvengerSAM-ACC2",
		"R-WU-AAAvengerSAM-ACC3",
		"R-WU-AAAvengerSAM-ACC4",
		"R-WU-AAAvengerSAM-ACC5",
		"R-WU-AAAvengerSAM-ACC6",
		"R-WU-AAAvengerSAM-ACC7",
		"R-WU-AAAvengerSAM-DMG1",
		"R-WU-AAAvengerSAM-DMG2",
		"R-WU-AAAvengerSAM-DMG3",
		"R-WU-AAAvengerSAM-DMG4",
		"R-WU-AAAvengerSAM-DMG5",
		"R-WU-AAAvengerSAM-ROF1",
		"R-WU-AAAvengerSAM-ROF2",
		"R-WU-AAAvengerSAM-ROF3",
		"R-WU-AAAvengerSAM-ROF4",
		"R-WU-AAAvengerSAM-ROF5",
		"R-WU-AAAvengerSAM-SPE1",
		"R-WU-AACyclone-ACC1",
		"R-WU-AACyclone-ACC2",
		"R-WU-AACyclone-ACC3",
		"R-WU-AACyclone-ACC4",
		"R-WU-AACyclone-ACC5",
		"R-WU-AACyclone-DMG1",
		"R-WU-AACyclone-DMG2",
		"R-WU-AACyclone-DMG3",
		"R-WU-AACyclone-DMG4",
		"R-WU-AACyclone-DMG5",
		"R-WU-AACyclone-DMG6",
		"R-WU-AACyclone-DMG7",
		"R-WU-AACyclone-ROF1",
		"R-WU-AACyclone-ROF2",
		"R-WU-AACyclone-ROF3",
		"R-WU-AACyclone-ROF4",
		"R-WU-AACyclone-ROF5",
		"R-WU-AACyclone-SPE1",
		"R-WU-AACyclone-SPE2",
		"R-WU-AAHurricane-ACC1",
		"R-WU-AAHurricane-ACC2",
		"R-WU-AAHurricane-ACC3",
		"R-WU-AAHurricane-ACC4",
		"R-WU-AAHurricane-ACC5",
		"R-WU-AAHurricane-DMG1",
		"R-WU-AAHurricane-DMG2",
		"R-WU-AAHurricane-DMG3",
		"R-WU-AAHurricane-DMG4",
		"R-WU-AAHurricane-DMG5",
		"R-WU-AAHurricane-ROF1",
		"R-WU-AAHurricane-ROF2",
		"R-WU-AAHurricane-ROF3",
		"R-WU-AAHurricane-ROF4",
		"R-WU-AAHurricane-ROF5",
		"R-WU-AAHurricane-ROF6",
		"R-WU-AAHurricane-ROF7",
		"R-WU-AAHurricane-SPE1",
		"R-WU-AAHurricane-SPE2",
		"R-WU-AAStormbringer-ACC1",
		"R-WU-AAStormbringer-ACC2",
		"R-WU-AAStormbringer-ACC3",
		"R-WU-AAStormbringer-ACC4",
		"R-WU-AAStormbringer-ACC5",
		"R-WU-AAStormbringer-DMG1",
		"R-WU-AAStormbringer-DMG2",
		"R-WU-AAStormbringer-DMG3",
		"R-WU-AAStormbringer-DMG4",
		"R-WU-AAStormbringer-DMG5",
		"R-WU-AAStormbringer-DMG6",
		"R-WU-AAStormbringer-DMG7",
		"R-WU-AAStormbringer-ROF1",
		"R-WU-AAStormbringer-ROF2",
		"R-WU-AAStormbringer-ROF3",
		"R-WU-AAStormbringer-ROF4",
		"R-WU-AAStormbringer-ROF5",
		"R-WU-AAStormbringer-SPE1",
		"R-WU-BombCluster-ACC1",
		"R-WU-BombCluster-ACC2",
		"R-WU-BombCluster-ACC3",
		"R-WU-BombCluster-ACC4",
		"R-WU-BombCluster-ACC5",
		"R-WU-BombCluster-DMG1",
		"R-WU-BombCluster-DMG2",
		"R-WU-BombCluster-DMG3",
		"R-WU-BombCluster-DMG4",
		"R-WU-BombCluster-DMG5",
		"R-WU-BombCluster-DMG6",
		"R-WU-BombCluster-DMG7",
		"R-WU-BombCluster-ROF1",
		"R-WU-BombCluster-ROF2",
		"R-WU-BombCluster-ROF3",
		"R-WU-BombCluster-ROF4",
		"R-WU-BombCluster-ROF5",
		"R-WU-BombCluster-SPE1",
		"R-WU-BombCluster-SPE2",
		"R-WU-BombHeavy-ACC1",
		"R-WU-BombHeavy-ACC2",
		"R-WU-BombHeavy-ACC3",
		"R-WU-BombHeavy-ACC4",
		"R-WU-BombHeavy-ACC5",
		"R-WU-BombHeavy-DMG1",
		"R-WU-BombHeavy-DMG2",
		"R-WU-BombHeavy-DMG3",
		"R-WU-BombHeavy-DMG4",
		"R-WU-BombHeavy-DMG5",
		"R-WU-BombHeavy-DMG6",
		"R-WU-BombHeavy-DMG7",
		"R-WU-BombHeavy-ROF1",
		"R-WU-BombHeavy-ROF2",
		"R-WU-BombHeavy-ROF3",
		"R-WU-BombHeavy-ROF4",
		"R-WU-BombHeavy-ROF5",
		"R-WU-BombHeavy-SPE1",
		"R-WU-BombHeavy-SPE2",
		"R-WU-BombThermite-ACC1",
		"R-WU-BombThermite-ACC2",
		"R-WU-BombThermite-ACC3",
		"R-WU-BombThermite-ACC4",
		"R-WU-BombThermite-ACC5",
		"R-WU-BombThermite-DMG1",
		"R-WU-BombThermite-DMG2",
		"R-WU-BombThermite-DMG3",
		"R-WU-BombThermite-DMG4",
		"R-WU-BombThermite-DMG5",
		"R-WU-BombThermite-DMG6",
		"R-WU-BombThermite-DMG7",
		"R-WU-BombThermite-ROF1",
		"R-WU-BombThermite-ROF2",
		"R-WU-BombThermite-ROF3",
		"R-WU-BombThermite-ROF4",
		"R-WU-BombThermite-ROF5",
		"R-WU-BombThermite-SPE1",
		"R-WU-BombThermite-SPE2",
		"R-WU-Cannon-ACC1",
		"R-WU-Cannon-ACC2",
		"R-WU-Cannon-ACC3",
		"R-WU-Cannon-ACC4",
		"R-WU-Cannon-ACC5",
		"R-WU-Cannon-Cyb-SPE1",
		"R-WU-Cannon-Cyb-SPE2",
		"R-WU-Cannon-DMG1",
		"R-WU-Cannon-DMG2",
		"R-WU-Cannon-DMG3",
		"R-WU-Cannon-DMG4",
		"R-WU-Cannon-DMG5",
		"R-WU-Cannon-DMG6",
		"R-WU-Cannon-DMG7",
		"R-WU-Cannon-ROF1",
		"R-WU-Cannon-ROF2",
		"R-WU-Cannon-ROF3",
		"R-WU-Cannon-ROF4",
		"R-WU-Cannon-ROF5",
		"R-WU-Cannon-Struc-SPE1",
		"R-WU-Cannon-Struc-SPE2",
		"R-WU-Flamethrower-ACC1",
		"R-WU-Flamethrower-ACC2",
		"R-WU-Flamethrower-ACC3",
		"R-WU-Flamethrower-ACC4",
		"R-WU-Flamethrower-ACC5",
		"R-WU-Flamethrower-DMG1",
		"R-WU-Flamethrower-DMG2",
		"R-WU-Flamethrower-DMG3",
		"R-WU-Flamethrower-DMG4",
		"R-WU-Flamethrower-DMG5",
		"R-WU-Flamethrower-DMG6",
		"R-WU-Flamethrower-DMG7",
		"R-WU-Flamethrower-ROF1",
		"R-WU-Flamethrower-ROF2",
		"R-WU-Flamethrower-ROF3",
		"R-WU-Flamethrower-ROF4",
		"R-WU-Flamethrower-ROF5",
		"R-WU-Flamethrower-SPE1",
		"R-WU-Flamethrower-SPE2",
		"R-WU-GrenadeLauncher-ACC1",
		"R-WU-GrenadeLauncher-ACC2",
		"R-WU-GrenadeLauncher-ACC3",
		"R-WU-GrenadeLauncher-ACC4",
		"R-WU-GrenadeLauncher-ACC5",
		"R-WU-GrenadeLauncher-DMG1",
		"R-WU-GrenadeLauncher-DMG2",
		"R-WU-GrenadeLauncher-DMG3",
		"R-WU-GrenadeLauncher-DMG4",
		"R-WU-GrenadeLauncher-DMG5",
		"R-WU-GrenadeLauncher-DMG6",
		"R-WU-GrenadeLauncher-DMG7",
		"R-WU-GrenadeLauncher-ROF1",
		"R-WU-GrenadeLauncher-ROF2",
		"R-WU-GrenadeLauncher-ROF3",
		"R-WU-GrenadeLauncher-ROF4",
		"R-WU-GrenadeLauncher-ROF5",
		"R-WU-GrenadeLauncher-SPE1",
		"R-WU-GrenadeLauncher-SPE2",
		"R-WU-Howitzer-ACC1",
		"R-WU-Howitzer-ACC2",
		"R-WU-Howitzer-ACC3",
		"R-WU-Howitzer-ACC4",
		"R-WU-Howitzer-ACC5",
		"R-WU-Howitzer-DMG1",
		"R-WU-Howitzer-DMG2",
		"R-WU-Howitzer-DMG3",
		"R-WU-Howitzer-DMG4",
		"R-WU-Howitzer-DMG5",
		"R-WU-Howitzer-DMG6",
		"R-WU-Howitzer-DMG7",
		"R-WU-Howitzer-ROF1",
		"R-WU-Howitzer-ROF2",
		"R-WU-Howitzer-ROF3",
		"R-WU-Howitzer-ROF4",
		"R-WU-Howitzer-ROF5",
		"R-WU-Howitzer-SPE1",
		"R-WU-Howitzer-SPE2",
		"R-WU-HowitzerIncendiary-ACC1",
		"R-WU-HowitzerIncendiary-ACC2",
		"R-WU-HowitzerIncendiary-ACC3",
		"R-WU-HowitzerIncendiary-ACC4",
		"R-WU-HowitzerIncendiary-ACC5",
		"R-WU-HowitzerIncendiary-DMG1",
		"R-WU-HowitzerIncendiary-DMG2",
		"R-WU-HowitzerIncendiary-DMG3",
		"R-WU-HowitzerIncendiary-DMG4",
		"R-WU-HowitzerIncendiary-DMG5",
		"R-WU-HowitzerIncendiary-DMG6",
		"R-WU-HowitzerIncendiary-DMG7",
		"R-WU-HowitzerIncendiary-ROF1",
		"R-WU-HowitzerIncendiary-ROF2",
		"R-WU-HowitzerIncendiary-ROF3",
		"R-WU-HowitzerIncendiary-ROF4",
		"R-WU-HowitzerIncendiary-ROF5",
		"R-WU-HowitzerIncendiary-SPE1",
		"R-WU-HowitzerIncendiary-SPE2",
		"R-WU-Lancer-ACC1",
		"R-WU-Lancer-ACC2",
		"R-WU-Lancer-ACC3",
		"R-WU-Lancer-ACC4",
		"R-WU-Lancer-ACC5",
		"R-WU-Lancer-ACC6",
		"R-WU-Lancer-ACC7",
		"R-WU-Lancer-DMG1",
		"R-WU-Lancer-DMG2",
		"R-WU-Lancer-DMG3",
		"R-WU-Lancer-DMG4",
		"R-WU-Lancer-DMG5",
		"R-WU-Lancer-ROF1",
		"R-WU-Lancer-ROF2",
		"R-WU-Lancer-ROF3",
		"R-WU-Lancer-ROF4",
		"R-WU-Lancer-ROF5",
		"R-WU-Lancer-SPE1",
		"R-WU-Laser-ACC1",
		"R-WU-Laser-ACC2",
		"R-WU-Laser-ACC3",
		"R-WU-Laser-ACC4",
		"R-WU-Laser-ACC5",
		"R-WU-Laser-DMG1",
		"R-WU-Laser-DMG2",
		"R-WU-Laser-DMG3",
		"R-WU-Laser-DMG4",
		"R-WU-Laser-DMG5",
		"R-WU-Laser-DMG6",
		"R-WU-Laser-DMG7",
		"R-WU-Laser-ROF1",
		"R-WU-Laser-ROF2",
		"R-WU-Laser-ROF3",
		"R-WU-Laser-ROF4",
		"R-WU-Laser-ROF5",
		"R-WU-Laser-SPE1",
		"R-WU-Machinegun-ACC1",
		"R-WU-Machinegun-ACC2",
		"R-WU-Machinegun-ACC3",
		"R-WU-Machinegun-ACC4",
		"R-WU-Machinegun-ACC5",
		"R-WU-Machinegun-CybStruc-SPE1",
		"R-WU-Machinegun-CybStruc-SPE2",
		"R-WU-Machinegun-DMG1",
		"R-WU-Machinegun-DMG2",
		"R-WU-Machinegun-DMG3",
		"R-WU-Machinegun-DMG4",
		"R-WU-Machinegun-DMG5",
		"R-WU-Machinegun-ROF1",
		"R-WU-Machinegun-ROF2",
		"R-WU-Machinegun-ROF3",
		"R-WU-Machinegun-ROF4",
		"R-WU-Machinegun-ROF5",
		"R-WU-Machinegun-ROF6",
		"R-WU-Machinegun-ROF7",
		"R-WU-Machinegun-TankVTOL-SPE1",
		"R-WU-Machinegun-TankVTOL-SPE2",
		"R-WU-Railgun-ACC1",
		"R-WU-Railgun-ACC2",
		"R-WU-Railgun-ACC3",
		"R-WU-Railgun-ACC4",
		"R-WU-Railgun-ACC5",
		"R-WU-Railgun-DMG1",
		"R-WU-Railgun-DMG2",
		"R-WU-Railgun-DMG3",
		"R-WU-Railgun-DMG4",
		"R-WU-Railgun-DMG5",
		"R-WU-Railgun-DMG6",
		"R-WU-Railgun-DMG7",
		"R-WU-Railgun-ROF1",
		"R-WU-Railgun-ROF2",
		"R-WU-Railgun-ROF3",
		"R-WU-Railgun-ROF4",
		"R-WU-Railgun-ROF5",
		"R-WU-Railgun-SPE1",
		"R-WU-RocketBattery-ACC1",
		"R-WU-RocketBattery-ACC2",
		"R-WU-RocketBattery-ACC3",
		"R-WU-RocketBattery-ACC4",
		"R-WU-RocketBattery-ACC5",
		"R-WU-RocketBattery-ACC6",
		"R-WU-RocketBattery-ACC7",
		"R-WU-RocketBattery-DMG1",
		"R-WU-RocketBattery-DMG2",
		"R-WU-RocketBattery-DMG3",
		"R-WU-RocketBattery-DMG4",
		"R-WU-RocketBattery-DMG5",
		"R-WU-RocketBattery-ROF1",
		"R-WU-RocketBattery-ROF2",
		"R-WU-RocketBattery-ROF3",
		"R-WU-RocketBattery-ROF4",
		"R-WU-RocketBattery-ROF5",
		"R-WU-RocketBattery-SPE1",
		"R-WU-RocketBattery-SPE2",
		"R-WU-ScourgeMissile-ACC1",
		"R-WU-ScourgeMissile-ACC2",
		"R-WU-ScourgeMissile-ACC3",
		"R-WU-ScourgeMissile-ACC4",
		"R-WU-ScourgeMissile-ACC5",
		"R-WU-ScourgeMissile-ACC6",
		"R-WU-ScourgeMissile-ACC7",
		"R-WU-ScourgeMissile-DMG1",
		"R-WU-ScourgeMissile-DMG2",
		"R-WU-ScourgeMissile-DMG3",
		"R-WU-ScourgeMissile-DMG4",
		"R-WU-ScourgeMissile-DMG5",
		"R-WU-ScourgeMissile-ROF1",
		"R-WU-ScourgeMissile-ROF2",
		"R-WU-ScourgeMissile-ROF3",
		"R-WU-ScourgeMissile-ROF4",
		"R-WU-ScourgeMissile-ROF5",
		"R-WU-ScourgeMissile-SPE1");

	for (var playnum = 0; playnum < maxPlayers; playnum++)
	{
		if (baseType == CAMP_CLEAN)
		{
		}
		else if (baseType == CAMP_BASE)
		{
			for (var count = 0; count < res_components.length; count++)
			{
				completeResearch(res_components[count], playnum);
			}
		}
		else if (baseType == CAMP_WALLS)
		{
			for (var count = 0; count < res_components.length; count++)
			{
				completeResearch(res_components[count], playnum);
			}
			for (var count = 0; count < res_upgrades.length; count++)
			{
				completeResearch(res_upgrades[count], playnum);
			}
		}
	}

	var structlist = enumStruct(me, HQ);
	for (var i = 0; i < structlist.length; i++)
	{
		// Simulate build events to enable minimap/unit design when an HQ exists
		eventStructureBuilt(structlist[i]);
	}

	hackNetOn();
	setTimer("checkEndConditions", 100);
}

// /////////////////////////////////////////////////////////////////
// END CONDITIONS
function checkEndConditions()
{
	var factories = enumStruct(me, "FKTankFactory").length + enumStruct(me, "FKCyborgFactory").length + enumStruct(me, "FKVTOLFactory").length;
	var droids = enumDroid(me).length;

	// Losing Conditions
	if (droids == 0 && factories == 0)
	{
		var gameLost = true;

		/* If teams enabled check if all team members have lost  */
		if (alliancesType == ALLIANCES_TEAMS)
		{
			for (var playnum = 0; playnum < maxPlayers; playnum++)
			{
				if (playnum != me && allianceExistsBetween(me, playnum))
				{
					factories = enumStruct(playnum, "FKTankFactory").length + enumStruct(playnum, "FKCyborgFactory").length + enumStruct(playnum, "FKVTOLFactory").length;
					droids = enumDroid(playnum).length;
					if (droids > 0 || factories > 0)
					{
						gameLost = false;	// someone from our team still alive
						break;
					}
				}
			}
		}

		if (gameLost)
		{
			gameOverMessage(false);
			removeTimer("checkEndConditions");
			return;
		}
	}
	
	// Winning Conditions
	var gamewon = true;

	// check if all enemies defeated
	for (var playnum = 0; playnum < maxPlayers; playnum++)
	{
		if (playnum != me && !allianceExistsBetween(me, playnum))	// checking enemy player
		{
			factories = enumStruct(playnum, "FKTankFactory").length + enumStruct(playnum, "FKCyborgFactory").length + enumStruct(playnum, "FKVTOLFactory").length; // nope
			droids = enumDroid(playnum).length;
			if (droids > 0 || factories > 0)
			{
				gamewon = false;	//one of the enemies still alive
				break;
			}
		}
	}

	if (gamewon)
	{
		gameOverMessage(true);
		removeTimer("checkEndConditions");
	}
}

// /////////////////////////////////////////////////////////////////
// WARNING MESSAGES
// Base Under Attack
function eventAttacked(victimObj, attackerObj)
{
	if (gameTime > lastHitTime + 10)
	{
		lastHitTime = gameTime;
		if (victimObj.type == STRUCTURE)
		{
			playSound("pcv337.ogg", victimObj.x, victimObj.y, victimObj.z);	// show position if still alive
		}
		else
		{
			playSound("pcv399.ogg", victimObj.x, victimObj.y, victimObj.z);
		}
	}
}


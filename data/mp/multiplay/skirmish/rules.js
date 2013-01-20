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
		enableStructure("FKHeadquarter", playnum);		// make structures available to build
		enableStructure("A0ResourceExtractor", playnum);
		enableStructure("FKPowerGenerator", playnum);
		enableStructure("FKResearchFacility", playnum);
		enableStructure("FKTankFactory", playnum);
		enableStructure("FKCyborgFactory", playnum);

		// We need to enable these in order for scripts to be able to generate their templates.
		makeComponentAvailable("FKTankStart", playnum);
		makeComponentAvailable("FKTruck", playnum);
		makeComponentAvailable("FKCyborgEngineer", playnum);
		makeComponentAvailable("tracked01", playnum);
	 	//makeComponentAvailable("", playnum);

		enableResearch("R-W-FF-Machinegun", playnum);
		enableResearch("R-W-SF-Railgun", playnum);
		enableResearch("R-W-MIS-ScourgeMissile", playnum);
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
		setStructureLimits("FKHeadquarter", 1, playnum);
		setStructureLimits("FKCmdRelayCentre", 1, playnum);
		setStructureLimits("FKCyborgFactory", 5, playnum);
		setStructureLimits("FKVTOLFactory", 5, playnum);
	}
	applyLimitSet();	// set limit options

	/*const numCleanTech = 4;	// do x for clean	
	const numBaseTech = 18; // do x for base
	var techlist = new Array(
		"R-Vehicle-Prop-Wheels",
		"R-Sys-Spade1Mk1",
		"R-Vehicle-Body01",
		"R-Comp-SynapticLink",
		"R-Wpn-MG1Mk1",
		"R-Defense-HardcreteWall",
		"R-Vehicle-Prop-Wheels",
		"R-Sys-Spade1Mk1",
		"R-Struc-Factory-Cyborg",
		"R-Defense-Pillbox01",
		"R-Defense-Tower01",
		"R-Vehicle-Body01",
		"R-Sys-Engineering01",
		"R-Struc-CommandRelay",
		"R-Vehicle-Prop-Halftracks",
		"R-Comp-CommandTurret01",
		"R-Sys-Sensor-Turret01",
		"R-Wpn-Flamer01Mk1",
		"R-Vehicle-Body05",
		"R-Struc-Research-Module",
		"R-Struc-PowerModuleMk1",
		"R-Struc-Factory-Module",
		"R-Struc-RepairFacility",
		"R-Sys-MobileRepairTurret01",
		"R-Vehicle-Engine01",
		"R-Wpn-MG3Mk1",
		"R-Wpn-Cannon1Mk1",
		"R-Wpn-Mortar01Lt",
		"R-Defense-Pillbox05",
		"R-Defense-TankTrap01",
		"R-Defense-WallTower02",
		"R-Sys-Sensor-Tower01",
		"R-Defense-Pillbox04",
		"R-Wpn-MG2Mk1",
		"R-Wpn-Rocket05-MiniPod",
		"R-Wpn-MG-Damage01",
		"R-Wpn-Rocket-Damage01",
		"R-Defense-WallTower01");

	for (var playnum = 0; playnum < maxPlayers; playnum++)
	{
		enableResearch("R-Sys-Sensor-Turret01", playnum);
		enableResearch("R-Wpn-MG1Mk1", playnum);
		enableResearch("R-Sys-Engineering01", playnum);

		// enable cyborgs components that can't be enabled with research
		makeComponentAvailable("CyborgSpade", playnum);
		makeComponentAvailable("CyborgRepair", playnum);

		if (baseType == CAMP_CLEAN)
		{
			setPower(1300, playnum);
			for (var count = 0; count < numCleanTech; count++)
			{
				completeResearch(techlist[count], playnum);
			}
			// Keep only some structures for insane AI
			var structs = enumStruct(playnum);
			for (var i = 0; i < structs.length; i++)
			{
				var s = structs[i];
				if (playerData[playnum].difficulty != INSANE
				    || (s.stattype != WALL && s.stattype != DEFENSE && s.stattype != GATE
				        && s.stattype != RESOURCE_EXTRACTOR))
				{
					removeStruct(s);
				}
			}
		}
		else if (baseType == CAMP_BASE)
		{
			setPower(2500, playnum);
			for (var count = 0; count < numBaseTech; count++)
			{
				completeResearch(techlist[count], playnum);
			}
			// Keep only some structures
			var structs = enumStruct(playnum);
			for (var i = 0; i < structs.length; i++)
			{
				var s = structs[i];
				if ((playerData[playnum].difficulty != INSANE && (s.stattype == WALL || s.stattype == DEFENSE))
				    || s.stattype == GATE || s.stattype == CYBORG_FACTORY || s.stattype == COMMAND_CONTROL)
				{
					removeStruct(s);
				}
			}
		}
		else // CAMP_WALLS
		{
			setPower(2500, playnum);
			for (var count = 0; count < techlist.length; count++)
			{
				completeResearch(techlist[count], playnum);
			}
		}
	}

	// Disabled by default
	setMiniMap(false);
	setDesign(false);*/
	// This is the only template that should be enabled before design is allowed
	enableTemplate("ConstructorDroid");

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
	var factories = enumStruct(me, "A0LightFactory").length + enumStruct(me, "A0CyborgFactory").length;
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
					factories = enumStruct(playnum, "A0LightFactory").length + enumStruct(playnum, "A0CyborgFactory").length;
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
			factories = enumStruct(playnum, "A0LightFactory").length + enumStruct(playnum, "A0CyborgFactory").length; // nope
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

function eventStructureBuilt(struct)
{
	if (struct.player == selectedPlayer && struct.type == STRUCTURE && struct.stattype == HQ)
	{
		setMiniMap(true); // show minimap
		setDesign(true); // permit designs
	}
}

function eventDestroyed(victim)
{
	if (victim.player == selectedPlayer && victim.type == STRUCTURE && victim.stattype == HQ)
	{
		setMiniMap(false); // hide minimap if HQ is destroyed
		setDesign(false); // and disallow design
	}
}

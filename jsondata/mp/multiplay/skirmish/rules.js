//
// Skirmish Base Script.
//
// contains the rules for starting and ending a game.
// as well as warning messages.
//
// /////////////////////////////////////////////////////////////////

receiveAllEvents(true);  // If doing this in eventGameInit, it seems to be too late in T2/T3, due to some eventResearched events triggering first.

var lastHitTime = 0;
var cheatmode = false;
var maxOilDrums = 0;

function setupGame()
{
	if (tilesetType == "URBAN")
	{
		replaceTexture("page-8-player-buildings-bases.png", "page-8-player-buildings-bases-urban.png");
		replaceTexture("page-9-player-buildings-bases.png", "page-9-player-buildings-bases-urban.png");
		replaceTexture("page-7-barbarians-arizona.png", "page-7-barbarians-urban.png");
	}
	else if (tilesetType == "ROCKIES")
	{
		replaceTexture("page-8-player-buildings-bases.png", "page-8-player-buildings-bases-rockies.png");
		replaceTexture("page-9-player-buildings-bases.png", "page-9-player-buildings-bases-rockies.png");
		// for some reason rockies will use arizona babas
	}
	if (tilesetType != "ARIZONA")
	{
		setSky("texpages/page-25-sky-urban.png", 0.5, 10000.0);
	}
	setReticuleButton(0, _("Close"), "image_cancel_up.png", "image_cancel_down.png");
	setReticuleButton(1, _("Manufacture (F1)"), "image_manufacture_up.png", "image_manufacture_down.png");
	setReticuleButton(2, _("Research (F2)"), "image_research_up.png", "image_research_down.png");
	setReticuleButton(3, _("Build (F3)"), "image_build_up.png", "image_build_down.png");
	setReticuleButton(4, _("Design (F4)"), "image_design_up.png", "image_design_down.png");
	setReticuleButton(5, _("Intelligence Display (F5)"), "image_intelmap_up.png", "image_intelmap_down.png");
	setReticuleButton(6, _("Commanders (F6)"), "image_commanddroid_up.png", "image_commanddroid_down.png");
	showInterface();
}

function eventGameLoaded()
{
	setupGame();
}

function eventGameInit()
{
	setupGame();

	// always at least one oil drum, and one more for every 64x64 tiles of map area
	maxOilDrums = (mapWidth * mapHeight) >> 12; // replace float division with shift for sync-safety
	for (var i = 0; i < maxOilDrums; ++i)
	{
		queue("placeOilDrum", 10000 * i);
	}


	hackNetOff();
	makeComponentAvailable("B4body-sml-trike01", scavengerPlayer);
	makeComponentAvailable("B3body-sml-buggy01", scavengerPlayer);
	makeComponentAvailable("B2JeepBody", scavengerPlayer);
	makeComponentAvailable("BusBody", scavengerPlayer);
	makeComponentAvailable("FireBody", scavengerPlayer);
	makeComponentAvailable("B1BaBaPerson01", scavengerPlayer);
	makeComponentAvailable("BaBaProp", scavengerPlayer);
	makeComponentAvailable("BaBaLegs", scavengerPlayer);
	makeComponentAvailable("bTrikeMG", scavengerPlayer);
	makeComponentAvailable("BuggyMG", scavengerPlayer);
	makeComponentAvailable("BJeepMG", scavengerPlayer);
	makeComponentAvailable("BusCannon", scavengerPlayer);
	makeComponentAvailable("BabaFlame", scavengerPlayer);
	makeComponentAvailable("BaBaMG", scavengerPlayer);
	for (var playnum = 0; playnum < maxPlayers; playnum++)
	{
		if (powerType == 0)
		{
			setPowerModifier(85, playnum);
		}
		else if (powerType == 2)
		{
			setPowerModifier(125, playnum);
		}

		// insane difficulty is meant to be insane...
		if (playerData[playnum].difficulty == INSANE)
		{
			setPowerModifier(200 + 15 * powerType, playnum);
		}
		else if (playerData[playnum].difficulty == EASY)
		{
			setPowerModifier(70 + 5 * powerType, playnum);
		}

		setDroidLimit(playnum, 150, DROID_ANY);
		setDroidLimit(playnum, 10, DROID_COMMAND);
		setDroidLimit(playnum, 15, DROID_CONSTRUCT);

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

		enableResearch("R-W-FF-Autocannon", playnum);
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
		  setStructureLimits("FKRepairFacility", 25, playnum);
	}
	applyLimitSet();	// set limit options


	for (var playnum = 0; playnum < maxPlayers; playnum++)
	{
		if (baseType == CAMP_CLEAN)
		{
			var structs = enumStruct(playnum);
			for (var i = 0; i < structs.length; i++)
			{
				var s = structs[i];
				removeStruct(s);
			}
		}
		else if (baseType == CAMP_BASE)
		{
			var structs = enumStruct(playnum);
			for (var i = 0; i < structs.length; i++)
			{
				var s = structs[i];
				if (s.stattype == WALL || s.stattype == GATE || s.stattype == DEFENSE) 
				{
					removeStruct(s);
				}
			}
		}
	}

	var structlist = enumStruct(selectedPlayer, HQ);
	for (var i = 0; i < structlist.length; i++)
	{
		// Simulate build events to enable minimap/unit design when an HQ exists
		eventStructureBuilt(structlist[i]);
	}

	hackNetOn();
	setTimer("checkEndConditions", 3000);
}

// /////////////////////////////////////////////////////////////////
// END CONDITIONS
function checkEndConditions()
{
	var factories = countStruct("FKTankFactory") + countStruct("FKCyborgFactory") + countStruct("FKVTOLFactory");
	var droids = countDroid(DROID_ANY);

	// Losing Conditions
	if (droids == 0 && factories == 0)
	{
		var gameLost = true;

		/* If teams enabled check if all team members have lost  */
		if (alliancesType == ALLIANCES_TEAMS || alliancesType == ALLIANCES_UNSHARED)
		{
			for (var playnum = 0; playnum < maxPlayers; playnum++)
			{
				if (playnum != selectedPlayer && allianceExistsBetween(selectedPlayer, playnum))
				{
					factories = countStruct("FKTankFactory") + countStruct("FKCyborgFactory") + countStruct("FKVTOLFactory");
					droids = countDroid(DROID_ANY, playnum);
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
		if (playnum != selectedPlayer && !allianceExistsBetween(selectedPlayer, playnum))	// checking enemy player
		{
			factories = countStruct("FKTankFactory", playnum) + countStruct("FKCyborgFactory", playnum) + countStruct("FKVTOLFactory", playnum);
			droids = countDroid(DROID_ANY, playnum);
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
	if (gameTime > lastHitTime + 5000 && victimObj.player == selectedPlayer)
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

function eventResearched(research, structure, player)
{
	//debug("RESEARCH : " + research.fullname + "(" + research.name + ") for " + player);
	// iterate over all results
	for (var i = 0; i < research.results.length; i++)
	{
		var v = research.results[i];
		//debug("    RESULT : class=" + v['class'] + " parameter=" + v['parameter'] + " value=" + v['value'] + " filter=" + v['filterParameter'] + " filterparam=" + v['filterParameter']);
		for (var cname in Upgrades[player][v['class']]) // iterate over all components of this type
		{
			var parameter = v['parameter'];
			var ctype = v['class'];
			var filterparam = v['filterParameter'];
			if ('filterParameter' in v && Stats[ctype][cname][filterparam] != v['filterValue']) // more specific filter
			{
				continue;
			}
			if (Stats[ctype][cname][parameter] > 0) // only applies if stat has above zero value already
			{
				Upgrades[player][ctype][cname][parameter] += Math.ceil(Stats[ctype][cname][parameter] * v['value'] / 100);
				//debug("      upgraded " + cname + " to " + Upgrades[player][ctype][cname][parameter] + " by " + Math.ceil(Stats[ctype][cname][parameter] * v['value'] / 100));
			}
		}
	}
}

function eventCheatMode(entered)
{
	cheatmode = entered; // remember this setting
}

function eventChat(from, to, message)
{
	if (message == "makesuperior" && cheatmode)
	{
		for (var i in Upgrades[from].Body)
		{
			if (Upgrades[from].Body[i].bodyClass === 'Droids' || Upgrades[from].Body[i].bodyClass === 'Cyborgs')
			{
				Upgrades[from].Body[i].HitPoints += 500;
				Upgrades[from].Body[i].Armour += 500;
				Upgrades[from].Body[i].Thermal += 500;
				Upgrades[from].Body[i].Power += 500;
			}
		}
		console("Made player " + from + "'s units SUPERIOR!");
	}
}

function placeOilDrum()
{
	var drums = enumFeature(-1, "OilDrum").length;
	if (drums >= maxOilDrums)
	{
		return;
	}

	var x = syncRandom(mapWidth - 20) + 10;
	var y = syncRandom(mapHeight - 20) + 10;

	// see if the random position is valid
	var occupied = (enumRange(x, y, 2, ALL_PLAYERS, false).length > 0);
	var unreachable = true;
	for (var i = 0; i < maxPlayers; ++i)
	{
		if (propulsionCanReach("tracked01", x, y, startPositions[i].x, startPositions[i].y))
		{
			unreachable = false;
			break;
		}
	}
	var terrain = terrainType(x, y);
	if (terrain == TER_WATER || terrain == TER_CLIFFFACE)
	{
		unreachable = true;
	}
	if (occupied || unreachable)
	{
		// try again in a different position after 1 second
		queue("placeOilDrum", 1000);
		return;
	}

	addFeature("OilDrum", x, y);
}

function eventPickup(feature, droid)
{
	if (feature.stattype == OIL_DRUM)
	{
		var delay;
		// generate Geom(1/6) distribution for oil drum respawn delay
		for (delay = 0; ; ++delay)
		{
			if (syncRandom(6) == 0)
			{
				break;
			}
		}
		// amounts to 10 minutes average respawn time
		queue("placeOilDrum", delay * 120000);
	}
}

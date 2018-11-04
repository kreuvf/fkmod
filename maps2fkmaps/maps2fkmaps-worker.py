#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import os.path
import json

if not len(sys.argv) == 2:
	print("Error: Wrong number of arguments.\nThis script expects exactly one argument. The argument has to be a regular file. Exiting ...")
	sys.exit(1)

if not os.path.isfile(sys.argv[1]):
	print("Error: Argument not a regular file. Exiting ...")
	sys.exit(2)

with open(sys.argv[1]) as infile:
	data = json.load(infile)

# List of defined buildings (= will not be removed)
# For now generated using the following oneliner and pasted manually:
# grep -E '"[^"]+": \{' structure.json | sed -r -e 's/^[ \t]+//g' -e 's/[": {]//g' -e 's/^(.*)$/"\1",/g'
structures = (
	"A0ADemolishStructure",
	"A0BaBaBunker",
	"A0BaBaFactory",
	"A0BaBaFlameTower",
	"A0BaBaGunTower",
	"A0BaBaGunTowerEND",
	"A0BaBaHorizontalWall",
	"A0BaBaMortarPit",
	"A0BaBaPowerGenerator",
	"A0BaBaRocketPit",
	"A0BaBaRocketPitAT",
	"A0BabaCornerWall",
	"A0CannonTower",
	"A0ResourceExtractor",
	"FKAASiteAvengerSAM",
	"FKAASiteAvengerSAM2",
	"FKAASiteCyclone",
	"FKAASiteCyclone2",
	"FKAASiteCyclone3",
	"FKAASiteHurricane",
	"FKAASiteHurricane2",
	"FKAASiteHurricane3",
	"FKAASiteStormbringer",
	"FKAASiteStormbringer2",
	"FKBunkerCannon",
	"FKBunkerCannon2",
	"FKBunkerCannon3",
	"FKBunkerMG",
	"FKBunkerMG2",
	"FKBunkerMG3",
	"FKBunkerScourgeMissile",
	"FKBunkerScourgeMissile2",
	"FKCyborgFactory",
	"FKHardpointCannon",
	"FKHardpointCannon2",
	"FKHardpointCannon3",
	"FKHardpointMG",
	"FKHardpointMG2",
	"FKHardpointMG3",
	"FKHardpointScourgeMissile",
	"FKHardpointScourgeMissile2",
	"FKPitGrenadeLauncher",
	"FKPitGrenadeLauncher2",
	"FKPitGrenadeLauncher3",
	"FKPitHowitzer",
	"FKPitHowitzer2",
	"FKPitHowitzer3",
	"FKPitHowitzerIncendiary",
	"FKPitHowitzerIncendiary2",
	"FKPitHowitzerIncendiary3",
	"FKPitRockets",
	"FKPitRockets2",
	"FKPitRockets3",
	"FKPowerGenerator",
	"FKRearmPad",
	"FKRepairFacility",
	"FKResearchFacility",
	"FKTankFactory",
	"FKTowerArtillery",
	"FKTowerCB",
	"FKTowerSurveillance",
	"FKTowerVTOL",
	"FKVTOLFactory",
	"FKWall",
	"FKWallCorner",
	"FKWallGate",
	"LookOutTower"
	)

doomed = []
for key, value in data.items():
	# Removing items from a dictionary is costly, there is no way defined for removing all of them in one go
	# Gathering all of them in one place to be able have no side effects when accessing data.items()
	if not value["name"] in structures:
		doomed.append(key)

for structure in doomed:
	print("Removed '{}' named '{}'".format(structure, data[structure]["name"]))
	data.pop(structure)

with open(sys.argv[1], 'w') as outfile:
	json.dump(data, fp=outfile, indent=4, sort_keys=True)


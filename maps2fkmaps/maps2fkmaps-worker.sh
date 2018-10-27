#!/bin/bash

sed -i -r \
	-e 's/"modules": [12]/"modules": 0/g' \
	-e 's/A0LightFactory/FKTankFactory/g' \
	-e 's/A0PowerGenerator/FKPowerGenerator/g' \
	-e 's/A0HardcreteMk1CWall/FKWallCorner/g' \
	-e 's/A0HardcreteMk1Wall/FKWall/g' \
	-e 's/A0CyborgFactory/FKCyborgFactory/g' \
	-e 's/A0ResearchFacility/FKResearchFacility/g' \
	-e 's/AASite-QuadMg1/FKAASiteHurricane/g' \
	-e 's/GuardTower6/FKHardpointScourgeMissile/g' \
	-e 's/PillBox1/FKBunkerMG/g' \
	-e 's/PillBox3/FKBunkerMG/g' \
	-e 's/PillBox4/FKBunkerCannon/g' \
	-e 's/PillBox5/FKPitHowitzerIncendiary/g' \
	-e 's/Sys-SensoTower01/FKTowerArtillery/g' \
	-e 's/WallTower01/FKHardpointMG/g' \
	-e 's/WallTower02/FKHardpointCannon/g' \
	-e 's/GuardTower1/FKHardpointMG/g' \
	"$1"

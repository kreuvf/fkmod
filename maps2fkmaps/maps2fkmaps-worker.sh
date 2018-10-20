#!/bin/bash

sed -i -r \
	-e 's/"modules": [12]/"modules": 0/g' \
	-e 's/A0LightFactory/FKTankFactory/g' \
	-e 's/A0PowerGenerator/FKPowerGenerator/g' \
	-e 's/A0HardcreteMk1CWall/FKWallCorner/g' \
	-e 's/A0HardcreteMk1Wall/FKWall/g' \
	-e 's/A0CyborgFactory/FKCyborgFactory/g' \
	-e 's/A0ResearchFacility/FKResearchFacility/g' \
	-e 's/PillBox1/FKBunkerMG/g' \
	-e 's/WallTower01/FKHardpointMG/g' \
	-e 's/GuardTower1/FKHardpointMG/g' \
	"$1"

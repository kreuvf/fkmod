# -*- coding: utf-8 -*-

import csv
import json
import re

# Make utility functions available
exec(compile(open("util.py", "r").read(), "util.py", 'exec'))

#open needed files and copy their content into lists
with open('../data/mp/stats/weapons.txt', 'r') as file:
	reader = csv.reader(file, delimiter=',')
	weapons = list(reader)[1:]

with open('../data/mp/stats/weaponsounds.txt', 'r') as file:
	reader = csv.reader(file, delimiter=',')
	sounds = list(reader)
	
# Read file to populate names
with open("../data/mp/messages/strings/names.txt", 'r') as f:
	names = f.readlines()
	# Remove trailing \n
	names = [x.strip() for x in names]
	# Remove empty elements
	names = list(filter(None, names))
	
# Build dictionary for JSON
# Assignment of index to variable
# 0 -> id
# 1 -> unused/superfluous
# 2 -> buildPower
# 3 -> buildPoints
# 4 -> weight
# 5 -> unused/superfluous
# 6 -> unused/superfluous
# 7 -> hitpoints
# 8 -> model
# 9 -> mountModel
# 10 -> muzzleGfx
# 11 -> flightGfx
# 12 -> hitGfx
# 13 -> missGfx
# 14 -> waterGfx
# 15 -> unused/superfluous
# 16 -> unused/superfluous
# 17 -> longRange
# 18 -> unused/superfluous
# 19 -> longHit
# 20 -> firePause
# 21 -> numExplosions
# 22 -> numRounds
# 23 -> reloadTime
# 24 -> damage
# 25 -> radius
# 26 -> unused/superfluous
# 27 -> radiusDamage
# 28 -> periodicalDamageTime
# 29 -> periodicalDamage
# 30 -> periodicalDamageRadius
# 31 -> unused/superfluous
# 32 -> radiusLife
# 33 -> flightSpeed
# 34 -> unused/superfluous
# 35 -> fireOnMove
# 36 -> weaponClass
# 37 -> weaponSubClass
# 38 -> movement
# 39 -> weaponEffect
# 40 -> rotate
# 41 -> maxElevation
# 42 -> minElevation
# 43 -> facePlayer
# 44 -> faceInFlight
# 45 -> recoilValue
# 46 -> minRange
# 47 -> lightWorld
# 48 -> effectSize
# 49 -> surface to air - convert to flags
# 50 -> numAttackRuns
# 51 -> designable
# 52 -> penetrate
# 53 -> targeting
# 54 -> minimumDamage

obj = dict()		
for line in weapons:
	# Prepare list of string to integer tuples
	intlist = [
		('buildPoints', int(line[3])),
		('buildPower', int(line[2])),
		('damage', int(line[24])),
		('designable', int(line[51])),
		('effectSize', int(line[48])),
		('firePause', int(line[20])),
		('flightSpeed', int(line[33])),
		('hitpoints', int(line[7])),
		('longHit', int(line[19])),
		('longRange', int(line[17])),
		('maxElevation', int(line[41])),
		('minElevation', int(line[42])),
		('minimumDamage', int(line[54])),
		('minRange', int(line[46])),
		('numAttackRuns', int(line[50])),
		('numExplosions', int(line[21])),
		('numRound', int(line[22])),
		('penetrate', int(line[52])),
		('periodicalDamage', int(line[29])),
		('periodicalDamageRadius', int(line[30])),
		('periodicalDamageTime', int(line[28])),
		('radius', int(line[25])),
		('radiusDamage', int(line[27])),
		('radiusLife', int(line[32])),
		('recoilValue', int(line[45])),
		('rotate', int(line[40])),
		('targeting', int(line[53])),
		('weight', int(line[4])),
		]
	
	strlist = [
		('flightGfx', line[11]),
		('hitGfx', line[12]),
		('id', line[0]),
		('missGfx', line[13]),
		('model', line[8]),
		('mountModel', line[9]),
		('movement', line[38]),
		('muzzleGfx', line[10]),
		('waterGfx', line[14]),
		('weaponClass', line[36]),
		('weaponEffect', line[39]),
		('weaponSubClass', line[37]),
		]
	weapid = line[0]
	att = dict()
	feedints(intlist, att)
	feedstrs(strlist, att)
	
	if line[35] == "NO":
		att['fireOnMove'] = 0
	
	
	if line[43] == "YES":
		att['facePlayer'] = 1
	

	if line[47] == "YES":
		att['lightWorld'] = 1
	
	if line[49] == "1":
		att['flags'] = "ShootAir"
	if line[49] == "100":
		att['flags'] = "AirOnly"
	
	for sound in sounds:
		if weapid == sound[0]:
			if sound[1] != "-1":
				att['weaponWav'] = sound[1]
			if sound[2] != "-1":
				att['explosionWav'] = sound[1]
				
	att['name'] = id2name(weapid, names)
	obj[weapid] = att

with open('../jsondata/mp/stats/weapons.json', 'w') as f:
	f.write(json.dumps(obj, sort_keys=True, indent=4))

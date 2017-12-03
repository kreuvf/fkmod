# -*- coding: utf-8 -*-

import csv
import json
import re

# Make utility functions available
exec(compile(open("util.py", "r").read(), "util.py", 'exec'))

#open needed files and copy their content into lists
with open('../data/mp/stats/structures.txt', 'r') as file:
	reader = csv.reader(file, delimiter=',')
	structure = list(reader)[1:]
	
with open('../data/mp/stats/structureweapons.txt', 'r') as file:
	reader = csv.reader(file, delimiter=',')
	weapons = list(reader)[1:]

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
# 1 -> type
# 2 -> unused/superfluous
# 3 -> strength
# 4 -> unused/superfluous
# 5 -> width
# 6 -> breadth
# 7 -> unused/superfluous
# 8 -> buildPoints
# 9 -> height
# 10 -> armour
# 11 -> hitpoints
# 12 -> unused/superfluous
# 13 -> buildPower
# 14 -> unused/superfluous
# 15 -> resistance
# 16 -> unused/superfluous
# 17 -> unused/superfluous
# 18 -> ecmID
# 19 -> sensorID
# 20 -> WeaponSlots/unused
# 21 -> structureModel/separated by @
# 22 -> baseModel
# 23 -> functions/unused
# 24 -> weapons/loaded from structureweapons.txt instead
# 25 -> repairPoints
# 26 -> rearmPoints
# 27 -> researchPoints
# 28 -> constructionPoints
# 29 -> powerPoints
# structureweapons
# 0 -> id
# 1 -> Weapon 0
# 2 -> Weapon 1
# 3 -> Weapon 2
# 4 -> Weapon 3
# 5 -> unused/superfluous

obj = dict()		
for line in structure:
	# Prepare list of string to integer tuples
	intlist = [
		('armour', int(line[10])),
		('breadth', int(line[6])),
		('buildPoints', int(line[8])),
		('buildPower', int(line[13])),
		('productionPoints', int(line[28])),
		('height', int(line[9])),
		('hitpoints', int(line[11])),
		('powerPoints', int(line[29])),
		('rearmPoints', int(line[26])),
		('repairPoints', int(line[25])),
		('researchPoints', int(line[27])),
		('resistance', int(line[15])),
		('width', int(line[5]))
		]
	
	strlist = [
		('baseModel', line[22]),
		('ecmID', line[18]),
		('id', line[0]),
		('sensorID', line[19]),
		('strength', line[3]),
		('type', line[1]),
		]
	structid = line[0]
	att = dict()
	feedints(intlist, att)
	feedstrs(strlist, att)
	weaponList = []
	hasWeapon = False
	for weapon in weapons:
		if structid == weapon[0]:
			hasWeapon = True
			if weapon[1] != 'NULL':
				weaponList.append(weapon[1])
			if weapon[2] != 'NULL':
				weaponList.append(weapon[2])
			if weapon[3] != 'NULL':
				weaponList.append(weapon[3])
			if weapon[4] != 'NULL':
				weaponList.append(weapon[4])
	if hasWeapon:
		att['weapons'] = weaponList
	att['structureModel'] = line[21].split('@')
	att['name'] = id2name(structid, names)
	obj[structid] = att
	
with open('../jsondata/mp/stats/structure.json', 'w') as f:
	f.write(json.dumps(obj, sort_keys=True, indent=4))
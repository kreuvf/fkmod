# -*- coding: utf-8 -*-

import csv
import json
import re

# Make utility functions available
exec(compile(open("util.py", "r").read(), "util.py", 'exec'))

#open needed files and copy their content into lists
with open('../data/mp/stats/templates.txt', 'r') as file:
	reader = csv.reader(file, delimiter=',')
	templates = list(reader)
	
#open needed files and copy their content into lists
with open('../data/mp/stats/assignweapons.txt', 'r') as file:
	reader = csv.reader(file, delimiter=',')
	weapons = list(reader)

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
# 2 -> body
# 3 -> brain
# 4 -> construct
# 5 -> ecm/unused?
# 6 -> unused/superfluous
# 7 -> propulsion
# 8 -> repair
# 9 -> type
# 10 -> sensor
# 11 -> nrWeapons/unused
# assignweapons.txt
# 0 -> id
# 1 -> weapon 0
# 2 -> weapon 1
# 3 -> weapon 2
# 4 -> unused/superfluous

obj = dict()		
for line in templates:
	tempid = line[0]
	att = dict()
	att['id'] = line[0]
	att['body'] = line[2]
	if line[3] != 'ZNULLBRAIN':
		att['brain'] = line[3]
	if line[4] != 'ZNULLCONSTRUCT':
		att['construct'] = line[4]
	if line[5] != 'ZNULLECM':
		att['ecm'] = line[5]
	if line[7] != 'ZNULLPROP':
		att['propulsion'] = line[7]
	if line[8] != 'ZNULLREPAIR':
		att['repair'] = line[8]
	att['type'] = line[9]
	if (
		(line[10] != 'ZNULLSENSOR') and
		(line[10] != 'DefaultSensor1Mk1')
		):
		att['sensor'] = line[10]
	weaponList = []
	hasWeapon = False
	for weapon in weapons:
		if tempid == weapon[0]:
			hasWeapon = True
			if weapon[1] != 'NULL':
				weaponList.append(weapon[1])
			if weapon[2] != 'NULL':
				weaponList.append(weapon[2])
			if weapon[3] != 'NULL':
				weaponList.append(weapon[3])
	if hasWeapon:
		att['weapons'] = weaponList
	att['name'] = id2name(tempid, names)
	obj[tempid] = att
	
with open('../jsondata/mp/stats/templates.json', 'w') as f:
	f.write(json.dumps(obj, sort_keys=True, indent=4))

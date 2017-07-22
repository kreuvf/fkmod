# -*- coding: utf-8 -*-

import csv
import json
import re

# Make utility functions available
exec(compile(open("util.py", "r").read(), "util.py", 'exec'))


#open needed files and copy their content into lists
with open('../data/mp/stats/body.txt', 'r') as file:
	reader = csv.reader(file, delimiter=',')
	body = list(reader)[1:]
	
with open('../data/mp/stats/bodypropulsionimd.txt', 'r') as file:
	reader = csv.reader(file, delimiter=',')
	bodyimd = list(reader)
	
with open('../data/mp/stats/bodyAddInf.txt', 'r') as file:
	reader = csv.reader(file, delimiter=',')
	addInf = list(reader)[1:]

# Read file to populate names
with open("../data/mp/messages/strings/names.txt", 'r') as f:
	names = f.readlines()
	# Remove trailing \n
	names = [x.strip() for x in names]
	# Remove empty elements
	names = filter(None, names)

# Build dictionary for JSON
# Assignment of index to variable
# 0 -> id
# 1 -> unused/superfluous
# 2 -> size
# 3 -> buildPower
# 4 -> buildPoints
# 5 -> weight
# 6 -> bodyPoints
# 7 -> model
# 8 -> unused/superfluous
# 9 -> weaponSlots
# 10 -> powerOutput
# 11 -> armourKinetic
# 12 -> armoutHeat
# 13 -> unused/superfluous
# 14 -> unused/superfluous
# 15 -> unused/superfluous
# 16 -> unused/superfluous
# 17 -> unused/superfluous
# 18 -> unused/superfluous
# 19 -> unused/superfluous
# 20 -> unused/superfluous
# 21 -> unused/superfluous
# 22 -> unused/superfluous
# 23 -> unused/superfluous
# 24 -> designable
# bodypropulsionimd
# 0 -> body id
# 1 -> propulsion id
# 2 -> left model
# 3 -> right model
# bodyAddInf
# 0 -> id
# 1 -> class
# 2 -> droid type
obj = dict()		
for line in body:
	# Prepare list of string to integer tuples
	intlist = [
		('armourHeat', int(line[12])),
		('armourKinetic', int(line[11])),
		('buildPoints', int(line[4])),
		('buildPower', int(line[3])),
		('designable', int(line[24])),
		('hitpoints', int(line[6])),
		('powerOutput', int(line[10])),
		('weaponSlots', int(line[9])),
		('weight', int(line[5]))
		]
	# Prepare list of string to string tuples
	strlist = [
		('id', line[0]),
		('model', line[7]),
		('size', line[2])
		]
	bodyid = line[0]
	att = dict()
	feedints(intlist, att)
	feedstrs(strlist, att)
	propModels = dict()
	for lineimd in bodyimd:
		if bodyid == lineimd[0]:
			prop = lineimd[1]
			l = lineimd[2]
			r = lineimd[3]
			if r == '0':
				if prop == "V-Tol":
					if line[23] != '0':
						propModels[prop] = dict(left=l, still=line[23])
					else:
						propModels[prop] = dict(left=l)
				else:
					propModels[prop] = dict(left=l)
			else:
				if prop == "V-Tol":
					if line[23] != '0':
						propModels[prop] = dict(left=l, right=r, still=line[23])
					else:
						propModels[prop] = dict(left=l, right=r)
				else:
					propModels[prop] = dict(left=l, right=r)

	if propModels:
		att['propulsionExtraModels'] = propModels
		
	for lineAddInf in addInf:
		if bodyid == lineAddInf[0]:
			if lineAddInf[1] != '0':
				att['class'] = lineAddInf[1]
			if lineAddInf[2] != '0':
				att['droidType'] = lineAddInf[2]

	att['name'] = id2name(bodyid, names)
			
	obj[bodyid] = att
#print (json.dumps(obj, sort_keys=True, indent=4))
with open('../jsondata/mp/stats/body.json', 'w') as f:
	f.write(json.dumps(obj, sort_keys=True, indent=4))
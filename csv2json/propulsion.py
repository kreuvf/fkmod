# -*- coding: utf-8 -*-

import csv
import json
import re

# Make utility functions available
exec(compile(open("util.py", "r").read(), "util.py", 'exec'))

#open needed files and copy their content into lists
with open('../data/mp/stats/propulsion.txt', 'r') as file:
	reader = csv.reader(file, delimiter=',')
	propulsion = list(reader)
	
with open('../data/mp/stats/propulsionAddInf.txt', 'r') as file:
	reader = csv.reader(file, delimiter=',')
	addInf = list(reader)[1:]

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
# 9 -> type
# 10 -> speed
# 11 -> designable
# propulsionAddInf
# 0 -> id
# 1 -> spinAngle
# 2 -> spinSpeed
# 3 -> turnSpeed
# 4 -> acceleration
# 5 -> deceleration
# 6 -> skidDecelertaion

obj = dict()		
for line in propulsion:
	# Prepare list of string to integer tuples
	intlist = [
		('buildPoints', int(line[3])),
		('buildPower', int(line[2])),
		('designable', int(line[11])),
		('hitpoints', int(line[7])),
		('speed', int(line[10])),
		('weight', int(line[4]))
		]
	
	strlist = [
		('id', line[0]),
		('model', line[8]),
		('type', line[9])
		]
	propid = line[0]
	att = dict()
	feedints(intlist, att)
	feedstrs(strlist, att)
	
	for lineAddInf in addInf:
		if propid == lineAddInf[0]:
			if lineAddInf[1] != '0':
				att['spinAngle'] = lineAddInf[1]
			if lineAddInf[2] != '0':
				att['spinSpeed'] = lineAddInf[2]
			if lineAddInf[3] != '0':
				att['turnSpeed'] = lineAddInf[3]
			if lineAddInf[4] != '0':
				att['acceleration'] = lineAddInf[4]
			if lineAddInf[5] != '0':
				att['deceleration'] = lineAddInf[5]
			if lineAddInf[6] != '0':
				att['skidDecelertaion'] = lineAddInf[6]
				
	att['name'] = id2name(propid, names)
	obj[propid] = att
	
with open('../jsondata/mp/stats/propulsion.json', 'w') as f:
	f.write(json.dumps(obj, sort_keys=True, indent=4))
# -*- coding: utf-8 -*-

import csv
import json
import re

# Make utility functions available
exec(compile(open("util.py", "r").read(), "util.py", 'exec'))

#open needed files and copy their content into lists
with open('../data/mp/stats/sensor.txt', 'r') as file:
	reader = csv.reader(file, delimiter=',')
	sensor = list(reader)[1:]

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
# 8 -> sensorModel
# 9 -> mountModel
# 10 -> range
# 11 -> location
# 12 -> type
# 13 -> unused/superfluous
# 14 -> power
# 15 -> designable

obj = dict()		
for line in sensor:
	# Prepare list of string to integer tuples
	intlist = [
		('buildPoints', int(line[3])),
		('buildPower', int(line[2])),
		('designable', int(line[15])),
		('hitpoints', int(line[7])),
		('power', int(line[14])),
		('range', int(line[10])),
		('weight', int(line[4]))
		]
	
	strlist = [
		('id', line[0]),
		('location', line[11]),
		('mountModel', line[9]),
		('sensorModel', line[8]),
		('type', line[12])
		]
	sensid = line[0]
	att = dict()
	feedints(intlist, att)
	feedstrs(strlist, att)
	
	att['name'] = id2name(sensid, names)
	obj[sensid] = att

with open('../jsondata/mp/stats/sensor.json', 'w') as f:
	f.write(json.dumps(obj, sort_keys=True, indent=4))
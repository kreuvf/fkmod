# -*- coding: utf-8 -*-

import csv
import json
import re

# Make utility functions available
exec(compile(open("util.py", "r").read(), "util.py", 'exec'))

#open needed files and copy their content into lists
with open('../data/mp/stats/repair.txt', 'r') as file:
	reader = csv.reader(file, delimiter=',')
	repair = list(reader)

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
# 7 -> unused/superfluous
# 8 -> location
# 9 -> model
# 10 -> mountModel
# 11 -> repairPoints
# 12 -> time
# 13 -> designable

obj = dict()		
for line in repair:
	# Prepare list of string to integer tuples
	intlist = [
		('buildPoints', int(line[3])),
		('buildPower', int(line[2])),
		('designable', int(line[13])),
		('repairPoints', int(line[11])),
		('time', int(line[12])),
		('weight', int(line[4]))
		]
	
	strlist = [
		('id', line[0]),
		('location', line[8]),
		('model', line[9]),
		('mountModel', line[10])
		]
	repid = line[0]
	att = dict()
	feedints(intlist, att)
	feedstrs(strlist, att)
	
	att['name'] = id2name(repid, names)
	obj[repid] = att
	
with open('../jsondata/mp/stats/repair.json', 'w') as f:
	f.write(json.dumps(obj, sort_keys=True, indent=4))
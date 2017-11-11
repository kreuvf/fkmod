# -*- coding: utf-8 -*-
import json

# Make utility functions available
exec(compile(open("util.py", "r").read(), "util.py", 'exec'))

# Read file to populate ecm
with open("../data/mp/stats/ecm.txt", 'r') as f:
	reader = csv.reader(f, delimiter=",")
	ecmCSV = list(reader)

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
# 10 -> location
# 11 -> range
# 12 -> designable
ecmJSON = dict()

for line in range(len(ecmCSV)):
	# Prepare list of string to integer tuples
	intlist = [
		('buildPower', int(ecmCSV[line][2])),
		('buildPoints', int(ecmCSV[line][3])),
		('weight', int(ecmCSV[line][4])),
		('hitpoints', int(ecmCSV[line][7])),
		('range', int(ecmCSV[line][11])),
		('designable', int(ecmCSV[line][12]))
		]
	# Prepare list of string to string tuples
	strlist = [
		('sensorModel', ecmCSV[line][8]),
		('mountModel', ecmCSV[line][9]),
		('location', ecmCSV[line][10])
		]
	# id is used more than once, so give it a special name
	col_id = ecmCSV[line][0]
	# Add standard key value pairs
	ecmJSON[col_id] = {'id': col_id, 'name': id2name(col_id, names)}
	# Add all eligible key value pairs to the dictionary
	feedints(intlist, ecmJSON[col_id])
	feedstrs(strlist, ecmJSON[col_id])

# Save JSON dump
with open('../jsondata/mp/stats/ecm.json', 'w') as f:
	json.dump(ecmJSON, fp=f, indent=4, sort_keys=True)


# -*- coding: utf-8 -*-
import csv
import json
import re

# Make utility functions available
execfile("util.py")

# Read file to populate construction
with open("../data/mp/stats/construction.txt", 'r') as f:
	reader = csv.reader(f, delimiter=",")
	constCSV = list(reader)

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
# 2 -> buildPower
# 3 -> buildPoints
# 4 -> weight
# 5 -> unused/superfluous
# 6 -> unused/superfluous
# 7 -> hitpoints
# 8 -> sensorModel
# 9 -> mountModel
# 10 -> constructionPoints
# 11 -> designable
constJSON = dict()

for line in range(len(constCSV)):
	# Prepare list of string to integer tuples
	intlist = [
		('buildPower', int(constCSV[line][2])),
		('buildPoints', int(constCSV[line][3])),
		('weight', int(constCSV[line][4])),
		('hitpoints', int(constCSV[line][7])),
		('constructionPoints', int(constCSV[line][10])),
		('designable', int(constCSV[line][11]))
		]
	# Prepare list of string to string tuples
	strlist = [
		('sensorModel', constCSV[line][8]),
		('mountModel', constCSV[line][9])
		]
	# id is used more than once, so give it a special name
	col_id = constCSV[line][0]
	# Add standard key value pairs
	constJSON[col_id] = {'id': col_id, 'name': id2name(col_id, names)}
	# Add all eligible key value pairs to the dictionary
	feedints(intlist, constJSON[col_id])
	feedstrs(strlist, constJSON[col_id])

# Save JSON dump
with open('../jsondata/mp/stats/construction.json', 'w') as f:
	print >> f, json.dumps(constJSON, indent=4, sort_keys=True)


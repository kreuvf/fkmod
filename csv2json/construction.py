# -*- coding: utf-8 -*-
import csv
import json
import re

# Function to get name from id
# wzid: string
# names: list from readlines of names.txt
def id2name(wzid, names):
	for line in range(len(names)):
		result = re.match(wzid, names[line])
		if result:
			name = re.search('^\S+\s+(?:_\()?"([^"]+)"(?:\))?', result.string)
			return name.group(1)

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
	# id is used more than once, so give it a special name
	col_id = constCSV[line][0]
	constJSON[col_id] = {'id': col_id,
		'name': id2name(col_id, names)}
	# Add integers if not 0
	if int(constCSV[line][2]):
		constJSON[col_id]['buildPower'] = int(constCSV[line][2])
	if int(constCSV[line][3]):
		constJSON[col_id]['buildPoints'] = int(constCSV[line][3])
	if int(constCSV[line][4]):
		constJSON[col_id]['weight'] = int(constCSV[line][4])
	if int(constCSV[line][7]):
		constJSON[col_id]['hitpoints'] = int(constCSV[line][7])
	if int(constCSV[line][10]):
		constJSON[col_id]['constructionPoints'] = int(constCSV[line][10])
	if int(constCSV[line][11]):
		constJSON[col_id]['designable'] = int(constCSV[line][11])
	# Add strings if not "0"
	if constCSV[line][8] != "0":
		constJSON[col_id]['sensorModel'] = constCSV[line][8]
	if constCSV[line][9] != "0":
		constJSON[col_id]['mountModel'] = constCSV[line][9]

# Save JSON dump
with open('../jsondata/mp/stats/construction.json', 'w') as f:
	print >> f, json.dumps(constJSON, indent=4, sort_keys=True)


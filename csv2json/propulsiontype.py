# -*- coding: utf-8 -*-
import json

# Make utility functions available
exec(compile(open("util.py", "r").read(), "util.py", 'exec'))

# Read file to populate propulsiontype
with open("../data/mp/stats/propulsiontype.txt", 'r') as f:
	reader = csv.reader(f, delimiter=",")
	proptypeCSV = list(reader)

# Build dictionary for JSON
# Assignment of index to variable
# 0 -> id; not saved as "id"
# 1 -> flightName
# 2 -> multiplier
proptypeJSON = dict()

for line in range(len(proptypeCSV)):
	# Prepare list of string to integer tuples
	intlist = [
		('multiplier', int(proptypeCSV[line][2]))
		]
	# Prepare list of string to string tuples
	strlist = [
		('flightName', proptypeCSV[line][1])
		]
	# id is used more than once, so give it a special name
	col_id = proptypeCSV[line][0]
	proptypeJSON[col_id] = {}
	# Add all eligible key value pairs to the dictionary
	feedints(intlist, proptypeJSON[col_id])
	feedstrs(strlist, proptypeJSON[col_id])

# Save JSON dump
with open('../jsondata/mp/stats/propulsiontype.json', 'w') as f:
	json.dump(proptypeJSON, fp=f, indent=4, sort_keys=True)


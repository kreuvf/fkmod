# -*- coding: utf-8 -*-
import json

# Make utility functions available
exec(compile(open("util.py", "r").read(), "util.py", 'exec'))

# Special utility functions for this file
def strorint(value):
	if str(value) == "-1":
		return -1
	else:
		return str(value)

# Read file to populate propulsionsounds
with open("../data/mp/stats/propulsionsounds.txt", 'r') as f:
	reader = csv.reader(f, delimiter=",")
	propsndsCSV = list(reader)

# Build dictionary for JSON
# Assignment of index to variable
# 0 -> id; not saved as "id"
# 1 -> start sound
# 2 -> idle sound
# 3 -> move off sound
# 4 -> normal move sound
# 5 -> hiss (used to combine start and move sounds)
# 6 -> stop sound
# 7 -> unused/superfluous
propsndsJSON = dict()

for line in range(len(propsndsCSV)):
	# propulsionsounds needs extra treatment
	# every sound field can either be a string like "vtol-move.ogg"
	# or -1 meaning "unset"
	# -> usual approach does not work
	propsndsJSON[propsndsCSV[line][0]] = {
		'szStart': strorint(propsndsCSV[line][1]),
		'szIdle': strorint(propsndsCSV[line][2]),
		'szMoveOff': strorint(propsndsCSV[line][3]),
		'szMove': strorint(propsndsCSV[line][4]),
		'szHiss': strorint(propsndsCSV[line][5]),
		'szShutDown': strorint(propsndsCSV[line][6])
		}

# Save JSON dump
with open('../jsondata/mp/stats/propulsionsounds.json', 'w') as f:
	json.dump(propsndsJSON, fp=f, indent=4, sort_keys=True)


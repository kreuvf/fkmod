# -*- coding: utf-8 -*-

import csv
import json
import re

# Make utility functions available
exec(compile(open("util.py", "r").read(), "util.py", 'exec'))

#open needed files and copy their content into lists
with open('../data/mp/stats/structuremodifier.txt', 'r') as file:
	reader = csv.reader(file, delimiter=',')
	structure = list(reader)

# Build dictionary for JSON
# Assignment of index to variable
# 0 -> weapon effect
# 1 -> building type
# 2 -> modifier

obj = dict()		
for line in structure:
	if not line[0] in obj:
		obj[line[0]] = {line[1] : int(line[2])}
	att = obj[line[0]]
	att[line[1]] = int(line[2])
	obj[line[0]] = att
	
	
with open('../jsondata/mp/stats/structuremodifier.json', 'w') as f:
	f.write(json.dumps(obj, sort_keys=True, indent=4))
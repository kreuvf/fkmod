# -*- coding: utf-8 -*-

# Function to get name from id
# wzid: string
# names: list from readlines of names.txt
def id2name(wzid, names):
	for line in range(len(names)):
		result = re.match(wzid, names[line])
		if result:
			name = re.search('^\S+\s+(?:_\()?"([^"]+)"(?:\))?', result.string)
			return name.group(1)

# Function to add integers != 0 to a dictionary
# pairs: list of tuples (string, integer)
# pot: dictionary for adding new string to integer assignments
def feedints(pairs, pot):
	for pair in range(len(pairs)):
		if pairs[pair][1] != 0:
			pot[pairs[pair][0]] = pairs[pair][1]

# Function to add strings != "0" to a dictionary
# pairs: list of tuples (string, string)
# pot: dictionary for adding new string to string assignments
def feedstrs(pairs, pot):
	for pair in range(len(pairs)):
		if pairs[pair][1] != "0":
			pot[pairs[pair][0]] = pairs[pair][1]

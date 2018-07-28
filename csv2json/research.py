#class (Body, Building, Construct, Sensor, Weapon)
#filterParameter (BodyClass, ImpactClass, Type)
#filterValue (A-A GUN, BOMB, CANNON, Cyborgs, Droids, ECM, ENERGY, FLAME, GAUSS, HOWITZERS, MACHINE GUN, MISSILE, MORTARS, ROCKET, Structure, Wall)
#parameter (Armour, ConstructorPoints, Damage, FirePause, HitChance, HitPoints, HitPointPct, Power, PowerPoints, ProductionPoints, RadiusDamage, Range, RearmPoints, Reload, ReloadTime, RepairPoints, RepeatDamage, ResearchPoints, Resistance, Thermal)
#	results (container for blocks of (class, filterParameter, filterValue, parameter, value))
#techCode (1) -> 0 = major research (hat msgName associated), 1 = minor research (hat kein msgName associated)
#value

#DONE:
#o	iconID
#o	id
#o	imdName
#o	keyTopic
#o	msgName
#o	name
#o	redComponents
#o	redStructures
#o	replacedComponents
#o	requiredResearch
#o	researchPoints
#o	researchPower
#o	resultComponents
#o	resultStructures
#o	statID
#o	subgroupIconID

# -*- coding: utf-8 -*-
import json
import math
import copy

# Make utility functions available
exec(compile(open("util.py", "r").read(), "util.py", 'exec'))

# Research-specific helper function(s)
# Get weapon upgrade type from function line
# This works by looking at the seven parameters as bits
# Only the set bits determine the type
def getWUTFFL(WU):
	if WU[0] != "Weapon Upgrade":
		print("Not a weapon upgrade.")
		return
	WUT = 0
	counter = 0
	for field in WU[3:]:
		field = int(field)
		value = 0 if field == 0 else 1
		WUT += (2 ** counter) * value;
		counter += 1
	# Python doesn't have a switch, so we use the dictionary method
	# https://stackoverflow.com/a/103081
	return {
		1: "rof",
		6: "HitChance",
		40: "Damage"
	}.get(WUT, "unknown ({})".format(WUT))
	
# Get weapon upgrade type from function
# This works by looking at the seven parameters as bits
# Only the set bits determine the type
def getWUTFF(WUF):
	for func in funcCSV:
		if func[1] == WUF:
			WUT = 0
			counter = 0
			for field in func[3:]:
				field = int(field)
				value = 0 if field == 0 else 1
				WUT += (2 ** counter) * value;
				counter += 1
	# Python doesn't have a switch, so we use the dictionary method
	# https://stackoverflow.com/a/103081
	return {
		1: "rof",
		6: "HitChance",
		40: "Damage"
	}.get(WUT, "unknown ({})".format(WUT))

# Get research topic based on function (get Research From Function)
# Assumption: Each function is assigned to one and only one research topic
def getRFF(func, resfunc):
	for line in resfunc:
		if func == line[1]:
			return line[0]
	print("Function not found ({})".format(func))
	return 0

# Get function based on research topic (get Function From Research)
def getFFR(res, resfunc):
	results = []
	for line in resfunc:
		if res == line[0]:
			results.append(copy.deepcopy(line[1]))
	if len(results):
		return results
	else:
		print("Research not found ({})".format(res))
		return 0

# Is the function of an upgrade type?
def isFunctionUpgrade(function):
	return (
	function == "Power Upgrade" or
	function == "ReArm Upgrade" or
	function == "Repair Upgrade" or
	function == "Research Upgrade" or
	function == "Structure Upgrade" or
	function == "VehicleBody Upgrade" or
	function == "VehicleConst Upgrade" or
	function == "VehicleECM Upgrade" or
	function == "VehicleRepair Upgrade" or
	function == "WallDefence Upgrade" or
	function == "Weapon Upgrade")

# Return number of results from JSON
def ResultsFromResearch(resJSON, research):
	if not(research in resJSON):
		print("Error:", research, "not found in resJSON.")
		return -1
	if not('results' in resJSON[research]):
		print("Error:", research, "does not contain results at all.")
		return -1
	return len(resJSON[research]['results'])

# Read file to populate research
# Assignment of index to variable
# 0 -> id
# 1 -> techCode?; unused/superfluous
# 2 -> iconID
# 3 -> unused/superfluous?
# 4 -> subgroupIconID
# 5 -> imdName
# 6 -> unused/superfluous
# 7 -> msgName
# 8 -> statID (structure name used instead of imdName; can conflict with 9)
# 9 -> statID (component name used instead of imdName; can conflict with 8)
# 10 -> unused/superfluous (component type)
# 11 -> researchPoints
# 12 -> keyTopic
# 13 -> unused/superfluous (no. prereqs)
# 14 -> unused/superfluous (no. function results)
# 15 -> unused/superfluous (no. structure prereqs)
# 16 -> unused/superfluous (no. redundant structures)
# 17 -> unused/superfluous (no. result structures)
# 18 -> unused/superfluous (no. redundant components)
# 19 -> unused/superfluous (no. result components)
with open("../data/mp/stats/research/multiplayer/research.txt", 'r') as f:
	reader = csv.reader(f, delimiter=",")
	resCSV = list(reader)

# Read file to populate prresearch
# Assignment of index to variable
# 0 -> id
# 1 -> requiredResearch; id of prerequisite research
# 2 -> unused/superfluous
with open("../data/mp/stats/research/multiplayer/prresearch.txt", 'r') as f:
	reader = csv.reader(f, delimiter=",")
	prresCSV = list(reader)

# Read file to populate redcomponents
# Assignment of index to variable
# 0 -> id
# 1 -> redComponents; name/id of old component
# 2 -> component type (necessary for game to look up component in right file)
# 3 -> unused/superfluous
with open("../data/mp/stats/research/multiplayer/redcomponents.txt", 'r') as f:
	reader = csv.reader(f, delimiter=",")
	redcompCSV = list(reader)

# Read file to populate redstructure
# Assignment of index to variable
# 0 -> id
# 1 -> redStructures; name/id of old structure
# 2 -> unused/superfluous
with open("../data/mp/stats/research/multiplayer/redstructure.txt", 'r') as f:
	reader = csv.reader(f, delimiter=",")
	redstructCSV = list(reader)

# Read file to populate researchfunctions
# Assignment of index to variable
# 0 -> id
# 1 -> function id (functions.txt)
# 2 -> unused/superfluous
with open("../data/mp/stats/research/multiplayer/researchfunctions.txt", 'r') as f:
	reader = csv.reader(f, delimiter=",")
	resfuncCSV = list(reader)

# Read file to populate researchfunctions
# Assignment of index to variable
# 0 -> function type; probably used to guess "class" and "parameter"?
# 1 -> function id
# 1 to 8 other fields, dependent on the function type
# 	information for: class, filterParameter, filterValue, parameter, value
# details give in the code pieces handling the different function types
with open("../data/mp/stats/functions.txt", 'r') as f:
	reader = csv.reader(f, delimiter=",")
	funcCSV = list(reader)

# Read file to populate researchstruct
# Assignment of index to variable
# 0 -> id
# 1 -> id of prerequisite structure
# 2 -> unused/superfluous
with open("../data/mp/stats/research/multiplayer/researchstruct.txt", 'r') as f:
	reader = csv.reader(f, delimiter=",")
	resstructCSV = list(reader)

# Read file to populate resultcomponent
# Assignment of index to variable
# 0 -> id
# 1 -> resultComponents, replacedComponents (part of); name/id of component
# 2 -> component type (necessary for game to look up component in right file)
# 3 -> replacedComponents (part of); name/id of replace component
# 4 -> component type of replaced component (necessary for game to look up component in right file)
# 5 -> unused/superfluous
with open("../data/mp/stats/research/multiplayer/resultcomponent.txt", 'r') as f:
	reader = csv.reader(f, delimiter=",")
	rescompCSV = list(reader)

# Read file to populate resultstructure
# Assignment of index to variable
# 0 -> id
# 1 -> resultStructures; name/id of structure
# 2 -> name/id of replaced structure; unused/unavailable in JSON
# 3 -> unused/superfluous
with open("../data/mp/stats/research/multiplayer/resultstructure.txt", 'r') as f:
	reader = csv.reader(f, delimiter=",")
	resstructCSV = list(reader)

# Read file to populate names
with open("../data/mp/messages/strings/names.txt", 'r') as f:
	names = f.readlines()
	# Remove trailing \n
	names = [x.strip() for x in names]
	# Remove empty elements
	names = list(filter(None, names))

# Remove header lines
del resCSV[0]

# Build dictionary for JSON
resJSON = dict()

# Building research.json
# Every research contains at least the following variables:
# 	iconID
# 	id
# 	name
# 	researchPoints
# 
# Couples:
# 	filterParameter, filterValue
# 	class, parameter, value
for resline in resCSV:
	# id is used more than once, so give it a special name
	col_id = resline[0]
	# Add standard key value pairs
	resJSON[col_id] = {'id': col_id, 'name': id2name(col_id, names)}
	
	# Prepare list of string to integer tuples
	intlist = [
		('researchPoints', int(resline[11])),
		('keyTopic', int(resline[12]))
		]
	# Prepare list of string to string tuples
	# statID from [8] and [9] tested; nothing gets overwritten aka no duplicates
	strlist = [
		('iconID', resline[2]),
		('subgroupIconID', resline[4]),
		('imdName', resline[5]),
		('msgName', resline[7]),
		('statID', resline[8]),
		('statID', resline[9])
		]
	# Add all eligible key value pairs to the dictionary
	feedints(intlist, resJSON[col_id])
	feedstrs(strlist, resJSON[col_id])
	
	# Add researchPower
	# Cost was calculated as research points : 32 -> convert and add
	intlist = [('researchPower', math.floor(float(resline[11])/32))]
	feedints(intlist, resJSON[col_id])
	
	# Add requiredResearch
	prres = []
	for prresline in prresCSV:
		if prresline[0] == col_id:
			prres.append(prresline[1])
	if len(prres):
		feedstrs([('requiredResearch', prres)], resJSON[col_id])
	
	# Add redundant components
	redcomp = []
	for redcompline in redcompCSV:
		if redcompline[0] == col_id:
			redcomp.append(redcompline[1])
	if len(redcomp):
		feedstrs([('redComponents', redcomp)], resJSON[col_id])
	
	# Add redundant structures
	redstruct = []
	for redstructline in redstructCSV:
		if redstructline[0] == col_id:
			redstruct.append(redstructline[1])
	if len(redstruct):
		feedstrs([('redStructures', redstruct)], resJSON[col_id])
	
	# Add replaced components
	rescomp = []
	for rescompline in rescompCSV:
		if rescompline[0] == col_id:
			if rescompline[3] != "0" and rescompline[4] != "0":
				rescomp.append('{}:{}'.format(rescompline[3], rescompline[1]))
	if len(rescomp):
		feedstrs([('replacedComponents', rescomp)], resJSON[col_id])
	
	# Add result components
	rescomp = []
	for rescompline in rescompCSV:
		if rescompline[0] == col_id:
			rescomp.append(rescompline[1])
	if len(rescomp):
		feedstrs([('resultComponents', rescomp)], resJSON[col_id])
	
	# Add result structures
	resstruct = []
	for resstructline in resstructCSV:
		if resstructline[0] == col_id:
			resstruct.append(resstructline[1])
	if len(resstruct):
		feedstrs([('resultStructures', resstruct)], resJSON[col_id])

# Get data in functions.txt in a usable format
functions = {}
for funcline in funcCSV:
	tmp = {'type': funcline[0]}
	if funcline[0] == 'Power Generator':
		tmp.update({'NRGoutput': int(funcline[2]), 'NRGfactor': int(funcline[3])})
	elif funcline[0] == 'Power Upgrade':
		tmp.update({'NRGfactor': int(funcline[2])})
	elif funcline[0] == 'Production':
		tmp.update({'bodysize': funcline[2], 'productionoutput': int(funcline[3])})
	elif funcline[0] == 'ReArm':
		tmp.update({'rearmpoints': int(funcline[2]), 'repairpoints': int(funcline[3])})
	elif funcline[0] == 'ReArm Upgrade':
		# Same factor for both rearm pad tasks
		tmp.update({'rearmfactor': int(funcline[2]), 'repairfactor': int(funcline[2])})
	elif funcline[0] == 'Repair Droid':
		tmp.update({'repairpoints': int(funcline[2])})
	elif funcline[0] == 'Repair Upgrade':
		tmp.update({'repairfactor': int(funcline[2])})
	elif funcline[0] == 'Research':
		tmp.update({'researchpoints': int(funcline[2])})
	elif funcline[0] == 'Research Upgrade':
		tmp.update({'researchfactor': int(funcline[2])})
	elif funcline[0] == 'Resource':
		tmp.update({'resource': int(funcline[2])})
	elif funcline[0] == 'Structure Upgrade':
		tmp.update({'armourfactor': int(funcline[2]), 'bodypointsfactor': int(funcline[3]), 'nexusresistancefactor': int(funcline[4])})
	elif funcline[0] == 'VehicleBody Upgrade':
		tmp.update({'enginefactor': int(funcline[2]), 'bodypointsfactor': int(funcline[3]), 'kinarmourfactor': int(funcline[4]), 'heatarmourfactor': int(funcline[5]), 'forcyborgs': int(funcline[6]), 'fornoncyborgs': int(funcline[7])})
	elif funcline[0] == 'VehicleConst Upgrade':
		tmp.update({'constructionfactor': int(funcline[2])})
	elif funcline[0] == 'VehicleECM Upgrade':
		tmp.update({'nexusresistancefactor': int(funcline[2])})
	elif funcline[0] == 'VehicleRepair Upgrade':
		tmp.update({'repairfactor': int(funcline[2])})
	elif funcline[0] == 'VehicleSensor Upgrade':
		tmp.update({'sensorfactor': int(funcline[3])})
	elif funcline[0] == 'Wall Function':
		# funcline[3] unused?!
		tmp.update({'structureid': funcline[2]})
	elif funcline[0] == 'WallDefence Upgrade':
		tmp.update({'armourfactor': int(funcline[2]), 'bodypointsfactor': int(funcline[3])})
	elif funcline[0] == 'Weapon Upgrade':
		tmp.update({'subclass': funcline[2], 'firepausefactor': int(funcline[3]), 'hitchanceshortfactor': int(funcline[4]), 'hitchancelongfactor': int(funcline[5]), 'impactdamagefactor': int(funcline[6]), 'radiusdamagefactor': int(funcline[7]), 'repeatdamagefactor': int(funcline[8]), 'radiusdamagechancefactor': int(funcline[9])})
	functions[funcline[1]] = tmp

# Determine 'class'
# Used values: Body, Building, Construct, Sensor, Weapon
for funcline in funcCSV:
	if funcline[0] == 'Power Generator':
		print("Power Generator ignored:", funcline)
	elif funcline[0] == 'Power Upgrade':
		results = []
		results.append({"class": "Building", "parameter": "PowerPoints", "value": int(funcline[2])})
		# Merge with existing results
		if 'results' in resJSON[getRFF(funcline[1], resfuncCSV)]:
			results.extend(resJSON[getRFF(funcline[1], resfuncCSV)]['results'])
		resJSON[getRFF(funcline[1], resfuncCSV)].update({'results': results})
	elif funcline[0] == 'Production':
		print("Production ignored:", funcline)
	elif funcline[0] == 'ReArm':
		print("ReArm ignored:", funcline)
	elif funcline[0] == 'ReArm Upgrade':
		results = []
		results.append({"class": "Building", "parameter": "RearmPoints", "value": int(funcline[2])})
		# Merge with existing results
		if 'results' in resJSON[getRFF(funcline[1], resfuncCSV)]:
			results.extend(resJSON[getRFF(funcline[1], resfuncCSV)]['results'])
		# Merge with existing results
		if 'results' in resJSON[getRFF(funcline[1], resfuncCSV)]:
			results.extend(resJSON[getRFF(funcline[1], resfuncCSV)]['results'])
		resJSON[getRFF(funcline[1], resfuncCSV)].update({'results': results})
	elif funcline[0] == 'Repair Droid':
		print("Repair droid ignored:", funcline)
	elif funcline[0] == 'Repair Upgrade':
		results = []
		results.append({"class": "Building", "parameter": "RepairPoints", "value": int(funcline[2])})
		# Merge with existing results
		if 'results' in resJSON[getRFF(funcline[1], resfuncCSV)]:
			results.extend(resJSON[getRFF(funcline[1], resfuncCSV)]['results'])
		resJSON[getRFF(funcline[1], resfuncCSV)].update({'results': results})
	elif funcline[0] == 'Research':
		print("Research ignored:", funcline)
	elif funcline[0] == 'Research Upgrade':
		results = []
		results.append({"class": "Building", "parameter": "ResearchPoints", "value": int(funcline[2])})
		# Merge with existing results
		if 'results' in resJSON[getRFF(funcline[1], resfuncCSV)]:
			results.extend(resJSON[getRFF(funcline[1], resfuncCSV)]['results'])
		resJSON[getRFF(funcline[1], resfuncCSV)].update({'results': results})
	elif funcline[0] == 'Resource':
		print("Resource ignored:", funcline)
	elif funcline[0] == 'Structure Upgrade':
		tmp = {}
		results = []
		tmp['class'] = 'Building'
		tmp['filterParameter'] = 'Type'
		tmp['filterValue'] = 'Structure'
		if funcline[2] != '0':
			results.append(copy.deepcopy(tmp))
			results[-1]['parameter'] = 'Armour'
			results[-1]['value'] = int(funcline[2])
		if funcline[3] != '0':
			results.append(copy.deepcopy(tmp))
			results[-1]['parameter'] = 'HitPoints'
			results[-1]['value'] = int(funcline[3])
		if funcline[4] != '0':
			results.append(copy.deepcopy(tmp))
			results[-1]['parameter'] = 'Resistance'
			results[-1]['value'] = int(funcline[4])
		# Merge with existing results
		if 'results' in resJSON[getRFF(funcline[1], resfuncCSV)]:
			results.extend(resJSON[getRFF(funcline[1], resfuncCSV)]['results'])
		resJSON[getRFF(funcline[1], resfuncCSV)].update({'results': results})
	elif funcline[0] == 'VehicleBody Upgrade':
		tmp = {}
		results = []
		tmp['class'] = 'Body'
		tmp['filterParameter'] = 'BodyClass'
		if funcline[6] == '1':
			tmp['filterValue'] = 'Droids'
			if funcline[2] != '0':
				results.append(copy.deepcopy(tmp))
				results[-1]['parameter'] = 'Power'
				results[-1]['value'] = int(funcline[2])
			if funcline[3] != '0':
				results.append(copy.deepcopy(tmp))
				results[-1]['parameter'] = 'HitPoints'
				results[-1]['value'] = int(funcline[3])
			if funcline[4] != '0':
				results.append(copy.deepcopy(tmp))
				results[-1]['parameter'] = 'Armour'
				results[-1]['value'] = int(funcline[4])
			if funcline[5] != '0':
				results.append(copy.deepcopy(tmp))
				results[-1]['parameter'] = 'Thermal'
				results[-1]['value'] = int(funcline[5])
		if funcline[7] == '1':
			tmp['filterValue'] = 'Cyborgs'
			if funcline[2] != '0':
				results.append(copy.deepcopy(tmp))
				results[-1]['parameter'] = 'Power'
				results[-1]['value'] = int(funcline[2])
			if funcline[3] != '0':
				results.append(copy.deepcopy(tmp))
				results[-1]['parameter'] = 'HitPoints'
				results[-1]['value'] = int(funcline[3])
			if funcline[4] != '0':
				results.append(copy.deepcopy(tmp))
				results[-1]['parameter'] = 'Armour'
				results[-1]['value'] = int(funcline[4])
			if funcline[5] != '0':
				results.append(copy.deepcopy(tmp))
				results[-1]['parameter'] = 'Thermal'
				results[-1]['value'] = int(funcline[5])		
		# Merge with existing results
		if 'results' in resJSON[getRFF(funcline[1], resfuncCSV)]:
			results.extend(resJSON[getRFF(funcline[1], resfuncCSV)]['results'])
		resJSON[getRFF(funcline[1], resfuncCSV)].update({'results': results})
	elif funcline[0] == 'VehicleConst Upgrade':
		print("VehicleConst Upgrade ignored (not used in FKmod):", funcline)
	elif funcline[0] == 'VehicleECM Upgrade':
		print("VehicleECM Upgrade ignored (not used in FKmod):", funcline)
	elif funcline[0] == 'VehicleRepair Upgrade':
		print("VehicleRepair Upgrade ignored:", funcline)
	elif funcline[0] == 'Wall Function':
		print("Wall function ignored:", funcline)
	elif funcline[0] == 'WallDefence Upgrade':
		tmp = {}
		results = []
		tmp['class'] = 'Building'
		tmp['filterValue'] = 'Wall'
		tmp['filterParameter'] = 'Type'
		if funcline[2] != '0':
			results.append(copy.deepcopy(tmp))
			results[-1]['parameter'] = 'Armour'
			results[-1]['value'] = int(funcline[2])
		if funcline[3] != '0':
			results.append(copy.deepcopy(tmp))
			results[-1]['parameter'] = 'HitPoints'
			results[-1]['value'] = int(funcline[3])
		# Merge with existing results
		if 'results' in resJSON[getRFF(funcline[1], resfuncCSV)]:
			results.extend(resJSON[getRFF(funcline[1], resfuncCSV)]['results'])
		resJSON[getRFF(funcline[1], resfuncCSV)].update({'results': results})
	elif funcline[0] == 'Weapon Upgrade':
		tmp = {}
		tmp['class'] = 'Weapon'
		tmp['filterValue'] = funcline[2]
		tmp['filterParameter'] = 'ImpactClass'
		# Get the type of weapon upgrade
		upgradeType = getWUTFFL(funcline)
		results = []
		if upgradeType == "Damage":
			# Mimicking 3.2 data here
			# For MACHINE GUN add
			#	Damage
			# For A-A GUN, CANNON, ENERGY, GAUSS, MISSILE, ROCKET add
			#	Damage, RadiusDamage
			# For FLAME add
			#	Damage, RepeatDamage
			# For BOMB, HOWITZERS, MORTARS add
			#	Damage, RadiusDamage, RepeatDamage
			# If any of these is 0, use one of the others (hopefully non-zero)
			# For all others: unconditionally add every damage type != 0
			
			# Damage can be added for all of them
			if funcline[6] != "0":
				results.append(copy.deepcopy(tmp))
				results[-1]['parameter'] = "Damage"
				results[-1]['value'] = int(funcline[6])
			
			# RadiusDamage for almost all
			if (funcline[2] != "MACHINE GUN" and funcline[2] != "FLAME"):
				results.append(copy.deepcopy(tmp))
				results[-1]['parameter'] = "RadiusDamage"
				if funcline[7] != "0":
					results[-1]['value'] = int(funcline[7])
				else:
					results[-1]['value'] = int(funcline[6])
			
			# RepeatDamage for some
			if(funcline[2] != "MACHINE GUN" and
				funcline[2] != "A-A GUN" and
				funcline[2] != "CANNON" and
				funcline[2] != "ENERGY" and
				funcline[2] != "GAUSS" and
				funcline[2] != "MISSILE" and
				funcline[2] != "ROCKET"):
				results.append(copy.deepcopy(tmp))
				results[-1]['parameter'] = "RepeatDamage"
				if funcline[8] != "0":
					results[-1]['value'] = int(funcline[8])
				else:
					results[-1]['value'] = int(funcline[6])

			# Merge with existing results
			if 'results' in resJSON[getRFF(funcline[1], resfuncCSV)]:
				results.extend(resJSON[getRFF(funcline[1], resfuncCSV)]['results'])
			resJSON[getRFF(funcline[1], resfuncCSV)].update({'results': results})

		elif upgradeType == "HitChance":
			# No more short and long range modifier
			# Use average of both
			results.append(copy.deepcopy(tmp))
			results[-1]['parameter'] = "HitChance"
			results[-1]['value'] = int(round((float(funcline[4]) + float(funcline[5])) / 2))

			# Merge with existing results
			if 'results' in resJSON[getRFF(funcline[1], resfuncCSV)]:
				results.extend(resJSON[getRFF(funcline[1], resfuncCSV)]['results'])
			resJSON[getRFF(funcline[1], resfuncCSV)].update({'results': results})

		elif upgradeType == "rof":
			# Numbers are negative now ...
			results.append(copy.deepcopy(tmp))
			results[-1]['parameter'] = "FirePause"
			results[-1]['value'] = -int(funcline[3])
			results.append(copy.deepcopy(tmp))
			results[-1]['parameter'] = "ReloadTime"
			results[-1]['value'] = -int(funcline[3])

			# Merge with existing results
			if 'results' in resJSON[getRFF(funcline[1], resfuncCSV)]:
				results.extend(resJSON[getRFF(funcline[1], resfuncCSV)]['results'])
			resJSON[getRFF(funcline[1], resfuncCSV)].update({'results': results})
		else:
			print("Weapon Upgrade type unknown. Nothing done.")
	else:
		print("Function type unknown. Nothing done.")

		
# Numbers do NOT add to previous change anymore
# Therefore, we need a second run now that resJSON has been built
# Assumptions:
#	All required researches already in resJSON

# Step 1: Build consolidated research topics list as starting point for chain building
# Each list entry contains
# 	research topic
# 	associated functions
# 	associated function types
#	associated sub types (only weapon upgrades)
# 	associated prerequisites
upgradeResearch = {}
for research in resJSON:
	# Get all associated research functions of the research
	upgradeFunction = getFFR(research, resfuncCSV)
	
	# Weed out researches without entries in researchfunctions.txt
	if upgradeFunction != 0:
		upgradeFuncType = []
		for func in upgradeFunction:
			upgradeFuncType.append(functions[func]['type'])
	else:
		continue

	# Check function types
	# Upgrade functions are fine, all other are not
	# If only one function is no upgrade, warn and do not add at all
	# Hint: Did not happen with our data, so no extra code for adding only parts
	funcs = 0
	for funcType in upgradeFuncType:
		if(isFunctionUpgrade(funcType)):
			funcs += 1
	
	if(funcs == len(upgradeFuncType)):
		upgradeResearch[research] = ({'functions': upgradeFunction, 'function types': upgradeFuncType})
	else:
		print("Warning: Not all functions ({}) are upgrade functions.".format(upgradeFunction))
		continue
	
	# Add weapon upgrade sub-type, iff weapon upgrade
	for func in range(len(upgradeFuncType)):
		if(upgradeFuncType[func] == "Weapon Upgrade"):
			weaponUpgradeFuncType = getWUTFF(upgradeFunction[func])
			upgradeResearch[research].update({'weaponUpgradeFuncType': weaponUpgradeFuncType})

	# Add prerequisites of each research, iff available
	if 'requiredResearch' in resJSON[research]:
		upgradeResearch[research].update({'prerequisites': resJSON[research]['requiredResearch']})


# Step 2: Build one chain starting from research
def buildUpgradeChain(research, content, chain):
	chain.append(research)
	if 'prerequisites' in content:
		for prereq in content['prerequisites']:
			if prereq in upgradeResearch:
				buildUpgradeChain(prereq, upgradeResearch[prereq], chain)

# Step 3: Iterate over all researches and build chain
# Idea behind the algorithm:
# 	Build a chain of prerequisites until no prerequisite has a prerequisite
# 		We are not checking for circular references
# 		Save in the reversed order for easier comprehension
chains = []
for research, content in upgradeResearch.items():
	chain = []
	buildUpgradeChain(research, content, chain)
	chains.append(chain[::-1])

# Step 4: Length matters: Select the longest chains with the same 0th element
startStats = {}
for chain in range(len(chains)):
	start = chains[chain][0]
	if start in startStats:
		if len(chains[chain]) > len(chains[startStats[start]]):
			startStats[start] = chain
	else:
		startStats[start] = chain

# Step 5: Build final list of chains
upgrades = []
for start, chain in startStats.items():
	upgrades.append(chains[chain])

# Step 6: Subtract value of research n from research n-1
for chain in upgrades:
	for index in reversed(range(len(chain))):
		# Don't fuck with first item
		if index == 0:
			continue
		
		# Shorthand for chain[index] and chain[index-1]
		research = chain[index]
		prereq = chain[index-1]
		
		# Get number of results
		# None: Error
		# One and only one: easy
		# More than one: Find matching results in prerequisite
		resResults = ResultsFromResearch(resJSON, research)
		prereqResults = ResultsFromResearch(resJSON, prereq)
		if resResults == 0:
			print("Error:" , research, "does not have any results.")

		elif resResults == 1:
			if prereqResults == 0:
				print("Error:" , prereq, "does not have any results.")
			elif prereqResults == 1:
				resJSON[research]['results'][0]['value'] -= resJSON[prereq]['results'][0]['value']
			else:
				print("Error:", prereq, "has got more results than its successor.")

		elif resResults >= 2:
			if resResults != prereqResults:
				print("Error: Mismatch between the numbers of results of", research, "and", prereq)
			else:
				for result in range(len(resJSON[research]['results'])):
					resResult = resJSON[research]['results'][result]
					prereqResult = resJSON[prereq]['results'][result]
					if (
						'class' in resResult and 'class' in prereqResult
						and
						'filterValue' in resResult and 'filterValue' in prereqResult
						and
						'filterParameter' in resResult and 'filterParameter' in prereqResult
						and
						'parameter' in resResult and 'parameter' in prereqResult
						and
						'value' in resResult and 'value' in prereqResult
					):
						if (
							resResult['class'] == prereqResult['class']
							and
							resResult['filterValue'] == prereqResult['filterValue']
							and
							resResult['filterParameter'] == prereqResult['filterParameter']
							and
							resResult['parameter'] == prereqResult['parameter']
						):
							resJSON[research]['results'][result]['value'] -= resJSON[prereq]['results'][result]['value']
						else:
							print("'class', 'filterValue', 'filterParameter' and/or 'parameter' of", research, "and", prereq, "do not match.")
					else:
						print("'class', 'filterValue', 'filterParameter' and/or 'parameter' of", research, "and/or", prereq, "missing.")

# Step 7: Fix for hiding commander templates
resJSON['R-Commander']['resultComponents'] = [resJSON['R-Commander']['resultComponents'][0], 'FK-Commander' ]

# Save JSON dump
with open('../jsondata/mp/stats/research.json', 'w') as f:
	json.dump(resJSON, fp=f, indent=4, sort_keys=True)



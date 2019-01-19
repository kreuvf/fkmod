# -*- coding: utf-8 -*-
import json
import re

# Non-standard
from natsort import natsorted

# Research Message Generator
#
# Generating meaningful (= contain values) research messages by hand is cumbersome and error-prone.
# Therefore, this generator parses the tech-tree to look for successive upgrades (such as Rocket Battery Damage Mk1 through Rocket Battery Damage Mk5). When all successive upgrades have been identified, messages for them are prepared.
# Single researches such as weapons or VTOL will be handled at the end as most of the messages will need to be handcrafted.

with open("../jsondata/mp/stats/research.json", 'r') as f:
	research = json.load(fp=f)

# Heuristic to find singles and successions:
# 	Does the name end with a digit?
#		Yes: Succession.
# 		No: Single.

singles = []
nonsingles = []
successions = {}

# Tell singles and non-singles apart
for resID in research:
	if re.search('^.*[0-9]+$', resID):
		nonsingles.append(resID)
	else:
		singles.append(resID)

nonsingles = natsorted(nonsingles)

# Finding successions
for resID in nonsingles:
	# Get base name
	base = re.match('(.*?)([0-9]{1,2})$', resID)
	if base:
		if base.group(1) in successions:
			successions[base.group(1)].append(base.group(2))
		else:
			successions[base.group(1)] = [base.group(2)]


# Create research messages
resmsgs = {}

for single in singles:
	# Starting at 1 to get rid of the "R" in "R-[...]"
	resmsgname = 'RM' + single[1:]
	resmsgs[resmsgname] = {
		'id': resmsgname,
		'imdName': 'MICAPSUL.pie',
		'sequenceName': 'INVALID',
		'text': [
			'Line 0',
			'Line 1',
			'Line 2',
			'Line 3'
		]
	}

for succession in sorted(successions):
	for i in successions[succession]:
		# Starting at 1 to get rid of the "R" in "R-[...]"
		resmsgname = 'RM' + succession[1:] + str(i)
		resmsgs[resmsgname] = {
			'id': resmsgname,
			'imdName': 'MICAPSUL.pie',
			'sequenceName': 'INVALID',
			'text': [
				'Line 0',
				'Line 1',
				'Line 2',
				'Line 3'
			]
		}

# This is still quite hardcoded and would ideally use some external text file with all the text. For now (and probably ever), things stay in this file. ¯\_(ツ)_/¯


# Save JSON dump
with open('../jsondata/mp/messages/resmessagesall.json', 'w') as f:
	json.dump(research, fp=f, indent=4, sort_keys=True)



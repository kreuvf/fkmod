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

# Hard-coded stuff
#
# Six videos for computer research, droid research, power research, structure research, system research and weapon research exist.
# If the sequence is available it gets played in the intelligence screen
# Sort each research into a fitting category to show the correct video:
resvideotype = {}
resvideotype['res_com.ogg'] = [
	'RM-Res1',
	'RM-Res2',
	'RM-Res3',
	'RM-Res4',
	'RM-Res5'
]
resvideotype['res_droid.ogg'] = [
	'RM-B-HiKin',
	'RM-B-HiSpeed',
	'RM-B-HiTherm',
	'RM-BU-BodyPoints1',
	'RM-BU-BodyPoints2',
	'RM-BU-BodyPoints3',
	'RM-BU-BodyPoints4',
	'RM-BU-BodyPoints5',
	'RM-BU-Engine1',
	'RM-BU-Engine2',
	'RM-BU-Engine3',
	'RM-BU-Engine4',
	'RM-BU-Engine5',
	'RM-BU-KineticArmour1',
	'RM-BU-KineticArmour2',
	'RM-BU-KineticArmour3',
	'RM-BU-KineticArmour4',
	'RM-BU-KineticArmour5',
	'RM-BU-ThermalArmour1',
	'RM-BU-ThermalArmour2',
	'RM-BU-ThermalArmour3',
	'RM-BU-ThermalArmour4',
	'RM-BU-ThermalArmour5',
	'RM-P-Hover',
	'RM-P-VTOL',
	'RM-U-CyborgTransport',
]
resvideotype['res_pow.ogg'] = [
	'RM-NRG1',
	'RM-NRG2',
	'RM-NRG3',
	'RM-NRG4',
	'RM-NRG5',
	'RM-NRG6',
	'RM-NRG7',
	'RM-NRG8',
	'RM-NRG9',
	'RM-NRG10'
]
resvideotype['res_struttech.ogg'] = [
	'RM-Def-Bunker',
	'RM-Def-Hardpoint',
	'RM-Def-Site',
	'RM-Def-Wall',
	'RM-RAU1',
	'RM-RAU2',
	'RM-RAU3',
	'RM-St-RepairFacility',
	'RM-StU-Armours1',
	'RM-StU-Armours2',
	'RM-StU-Armours3',
	'RM-StU-Armours4',
	'RM-StU-Armours5',
	'RM-StU-BodyPoints1',
	'RM-StU-BodyPoints2',
	'RM-StU-BodyPoints3',
	'RM-StU-BodyPoints4',
	'RM-StU-BodyPoints5',
]
resvideotype['res_systech.ogg'] = [
	'RM-Commander',
	'RM-Repair',
	'RM-RpU1',
	'RM-RpU2',
	'RM-RpU3',
	'RM-SensorArtillery',
	'RM-SensorCB',
	'RM-SensorSurveillance',
	'RM-SensorVTOL'
]
resvideotype['res_weapons.ogg'] = [
	'RM-W-ART-Howitzer',
	'RM-W-ART-RocketBattery',
	'RM-W-FF-AAHurricane',
	'RM-W-FF-Autocannon',
	'RM-W-FF-Machinegun',
	'RM-W-HOT-AAStormbringer',
	'RM-W-HOT-BombThermite',
	'RM-W-HOT-Flamethrower',
	'RM-W-HOT-HowitzerIncendiary',
	'RM-W-HOT-Laser',
	'RM-W-MIS-AAAvengerSAM',
	'RM-W-MIS-Lancer',
	'RM-W-MIS-ScourgeMissile',
	'RM-W-SF-AACyclone',
	'RM-W-SF-BombHeavy',
	'RM-W-SF-Cannon',
	'RM-W-SF-Railgun',
	'RM-W-SPL-BombCluster',
	'RM-W-SPL-GrenadeLauncher',
	'RM-WU-AAAvengerSAM-ACC1',
	'RM-WU-AAAvengerSAM-ACC2',
	'RM-WU-AAAvengerSAM-ACC3',
	'RM-WU-AAAvengerSAM-ACC4',
	'RM-WU-AAAvengerSAM-ACC5',
	'RM-WU-AAAvengerSAM-ACC6',
	'RM-WU-AAAvengerSAM-ACC7',
	'RM-WU-AAAvengerSAM-DMG1',
	'RM-WU-AAAvengerSAM-DMG2',
	'RM-WU-AAAvengerSAM-DMG3',
	'RM-WU-AAAvengerSAM-DMG4',
	'RM-WU-AAAvengerSAM-DMG5',
	'RM-WU-AAAvengerSAM-ROF1',
	'RM-WU-AAAvengerSAM-ROF2',
	'RM-WU-AAAvengerSAM-ROF3',
	'RM-WU-AAAvengerSAM-ROF4',
	'RM-WU-AAAvengerSAM-ROF5',
	'RM-WU-AAAvengerSAM-SPE1',
	'RM-WU-AACyclone-ACC1',
	'RM-WU-AACyclone-ACC2',
	'RM-WU-AACyclone-ACC3',
	'RM-WU-AACyclone-ACC4',
	'RM-WU-AACyclone-ACC5',
	'RM-WU-AACyclone-DMG1',
	'RM-WU-AACyclone-DMG2',
	'RM-WU-AACyclone-DMG3',
	'RM-WU-AACyclone-DMG4',
	'RM-WU-AACyclone-DMG5',
	'RM-WU-AACyclone-DMG6',
	'RM-WU-AACyclone-DMG7',
	'RM-WU-AACyclone-ROF1',
	'RM-WU-AACyclone-ROF2',
	'RM-WU-AACyclone-ROF3',
	'RM-WU-AACyclone-ROF4',
	'RM-WU-AACyclone-ROF5',
	'RM-WU-AACyclone-SPE1',
	'RM-WU-AACyclone-SPE2',
	'RM-WU-AAHurricane-ACC1',
	'RM-WU-AAHurricane-ACC2',
	'RM-WU-AAHurricane-ACC3',
	'RM-WU-AAHurricane-ACC4',
	'RM-WU-AAHurricane-ACC5',
	'RM-WU-AAHurricane-DMG1',
	'RM-WU-AAHurricane-DMG2',
	'RM-WU-AAHurricane-DMG3',
	'RM-WU-AAHurricane-DMG4',
	'RM-WU-AAHurricane-DMG5',
	'RM-WU-AAHurricane-ROF1',
	'RM-WU-AAHurricane-ROF2',
	'RM-WU-AAHurricane-ROF3',
	'RM-WU-AAHurricane-ROF4',
	'RM-WU-AAHurricane-ROF5',
	'RM-WU-AAHurricane-ROF6',
	'RM-WU-AAHurricane-ROF7',
	'RM-WU-AAHurricane-SPE1',
	'RM-WU-AAHurricane-SPE2',
	'RM-WU-AAStormbringer-ACC1',
	'RM-WU-AAStormbringer-ACC2',
	'RM-WU-AAStormbringer-ACC3',
	'RM-WU-AAStormbringer-ACC4',
	'RM-WU-AAStormbringer-ACC5',
	'RM-WU-AAStormbringer-DMG1',
	'RM-WU-AAStormbringer-DMG2',
	'RM-WU-AAStormbringer-DMG3',
	'RM-WU-AAStormbringer-DMG4',
	'RM-WU-AAStormbringer-DMG5',
	'RM-WU-AAStormbringer-DMG6',
	'RM-WU-AAStormbringer-DMG7',
	'RM-WU-AAStormbringer-ROF1',
	'RM-WU-AAStormbringer-ROF2',
	'RM-WU-AAStormbringer-ROF3',
	'RM-WU-AAStormbringer-ROF4',
	'RM-WU-AAStormbringer-ROF5',
	'RM-WU-AAStormbringer-SPE1',
	'RM-WU-Autocannon-ACC1',
	'RM-WU-Autocannon-ACC2',
	'RM-WU-Autocannon-ACC3',
	'RM-WU-Autocannon-ACC4',
	'RM-WU-Autocannon-ACC5',
	'RM-WU-Autocannon-DMG1',
	'RM-WU-Autocannon-DMG2',
	'RM-WU-Autocannon-DMG3',
	'RM-WU-Autocannon-DMG4',
	'RM-WU-Autocannon-DMG5',
	'RM-WU-Autocannon-ROF1',
	'RM-WU-Autocannon-ROF2',
	'RM-WU-Autocannon-ROF3',
	'RM-WU-Autocannon-ROF4',
	'RM-WU-Autocannon-ROF5',
	'RM-WU-Autocannon-ROF6',
	'RM-WU-Autocannon-ROF7',
	'RM-WU-Autocannon-SPE1',
	'RM-WU-Autocannon-SPE2',
	'RM-WU-BombCluster-ACC1',
	'RM-WU-BombCluster-ACC2',
	'RM-WU-BombCluster-ACC3',
	'RM-WU-BombCluster-ACC4',
	'RM-WU-BombCluster-ACC5',
	'RM-WU-BombCluster-DMG1',
	'RM-WU-BombCluster-DMG2',
	'RM-WU-BombCluster-DMG3',
	'RM-WU-BombCluster-DMG4',
	'RM-WU-BombCluster-DMG5',
	'RM-WU-BombCluster-DMG6',
	'RM-WU-BombCluster-DMG7',
	'RM-WU-BombCluster-ROF1',
	'RM-WU-BombCluster-ROF2',
	'RM-WU-BombCluster-ROF3',
	'RM-WU-BombCluster-ROF4',
	'RM-WU-BombCluster-ROF5',
	'RM-WU-BombCluster-SPE1',
	'RM-WU-BombCluster-SPE2',
	'RM-WU-BombHeavy-ACC1',
	'RM-WU-BombHeavy-ACC2',
	'RM-WU-BombHeavy-ACC3',
	'RM-WU-BombHeavy-ACC4',
	'RM-WU-BombHeavy-ACC5',
	'RM-WU-BombHeavy-DMG1',
	'RM-WU-BombHeavy-DMG2',
	'RM-WU-BombHeavy-DMG3',
	'RM-WU-BombHeavy-DMG4',
	'RM-WU-BombHeavy-DMG5',
	'RM-WU-BombHeavy-DMG6',
	'RM-WU-BombHeavy-DMG7',
	'RM-WU-BombHeavy-ROF1',
	'RM-WU-BombHeavy-ROF2',
	'RM-WU-BombHeavy-ROF3',
	'RM-WU-BombHeavy-ROF4',
	'RM-WU-BombHeavy-ROF5',
	'RM-WU-BombHeavy-SPE1',
	'RM-WU-BombHeavy-SPE2',
	'RM-WU-BombThermite-ACC1',
	'RM-WU-BombThermite-ACC2',
	'RM-WU-BombThermite-ACC3',
	'RM-WU-BombThermite-ACC4',
	'RM-WU-BombThermite-ACC5',
	'RM-WU-BombThermite-DMG1',
	'RM-WU-BombThermite-DMG2',
	'RM-WU-BombThermite-DMG3',
	'RM-WU-BombThermite-DMG4',
	'RM-WU-BombThermite-DMG5',
	'RM-WU-BombThermite-DMG6',
	'RM-WU-BombThermite-DMG7',
	'RM-WU-BombThermite-ROF1',
	'RM-WU-BombThermite-ROF2',
	'RM-WU-BombThermite-ROF3',
	'RM-WU-BombThermite-ROF4',
	'RM-WU-BombThermite-ROF5',
	'RM-WU-BombThermite-SPE1',
	'RM-WU-BombThermite-SPE2',
	'RM-WU-Cannon-ACC1',
	'RM-WU-Cannon-ACC2',
	'RM-WU-Cannon-ACC3',
	'RM-WU-Cannon-ACC4',
	'RM-WU-Cannon-ACC5',
	'RM-WU-Cannon-Cyb-SPE1',
	'RM-WU-Cannon-Cyb-SPE2',
	'RM-WU-Cannon-DMG1',
	'RM-WU-Cannon-DMG2',
	'RM-WU-Cannon-DMG3',
	'RM-WU-Cannon-DMG4',
	'RM-WU-Cannon-DMG5',
	'RM-WU-Cannon-DMG6',
	'RM-WU-Cannon-DMG7',
	'RM-WU-Cannon-ROF1',
	'RM-WU-Cannon-ROF2',
	'RM-WU-Cannon-ROF3',
	'RM-WU-Cannon-ROF4',
	'RM-WU-Cannon-ROF5',
	'RM-WU-Cannon-Struc-SPE1',
	'RM-WU-Cannon-Struc-SPE2',
	'RM-WU-Flamethrower-ACC1',
	'RM-WU-Flamethrower-ACC2',
	'RM-WU-Flamethrower-ACC3',
	'RM-WU-Flamethrower-ACC4',
	'RM-WU-Flamethrower-ACC5',
	'RM-WU-Flamethrower-DMG1',
	'RM-WU-Flamethrower-DMG2',
	'RM-WU-Flamethrower-DMG3',
	'RM-WU-Flamethrower-DMG4',
	'RM-WU-Flamethrower-DMG5',
	'RM-WU-Flamethrower-DMG6',
	'RM-WU-Flamethrower-DMG7',
	'RM-WU-Flamethrower-ROF1',
	'RM-WU-Flamethrower-ROF2',
	'RM-WU-Flamethrower-ROF3',
	'RM-WU-Flamethrower-ROF4',
	'RM-WU-Flamethrower-ROF5',
	'RM-WU-Flamethrower-SPE1',
	'RM-WU-Flamethrower-SPE2',
	'RM-WU-GrenadeLauncher-ACC1',
	'RM-WU-GrenadeLauncher-ACC2',
	'RM-WU-GrenadeLauncher-ACC3',
	'RM-WU-GrenadeLauncher-ACC4',
	'RM-WU-GrenadeLauncher-ACC5',
	'RM-WU-GrenadeLauncher-DMG1',
	'RM-WU-GrenadeLauncher-DMG2',
	'RM-WU-GrenadeLauncher-DMG3',
	'RM-WU-GrenadeLauncher-DMG4',
	'RM-WU-GrenadeLauncher-DMG5',
	'RM-WU-GrenadeLauncher-DMG6',
	'RM-WU-GrenadeLauncher-DMG7',
	'RM-WU-GrenadeLauncher-ROF1',
	'RM-WU-GrenadeLauncher-ROF2',
	'RM-WU-GrenadeLauncher-ROF3',
	'RM-WU-GrenadeLauncher-ROF4',
	'RM-WU-GrenadeLauncher-ROF5',
	'RM-WU-GrenadeLauncher-SPE1',
	'RM-WU-GrenadeLauncher-SPE2',
	'RM-WU-Howitzer-ACC1',
	'RM-WU-Howitzer-ACC2',
	'RM-WU-Howitzer-ACC3',
	'RM-WU-Howitzer-ACC4',
	'RM-WU-Howitzer-ACC5',
	'RM-WU-Howitzer-DMG1',
	'RM-WU-Howitzer-DMG2',
	'RM-WU-Howitzer-DMG3',
	'RM-WU-Howitzer-DMG4',
	'RM-WU-Howitzer-DMG5',
	'RM-WU-Howitzer-DMG6',
	'RM-WU-Howitzer-DMG7',
	'RM-WU-Howitzer-ROF1',
	'RM-WU-Howitzer-ROF2',
	'RM-WU-Howitzer-ROF3',
	'RM-WU-Howitzer-ROF4',
	'RM-WU-Howitzer-ROF5',
	'RM-WU-Howitzer-SPE1',
	'RM-WU-Howitzer-SPE2',
	'RM-WU-HowitzerIncendiary-ACC1',
	'RM-WU-HowitzerIncendiary-ACC2',
	'RM-WU-HowitzerIncendiary-ACC3',
	'RM-WU-HowitzerIncendiary-ACC4',
	'RM-WU-HowitzerIncendiary-ACC5',
	'RM-WU-HowitzerIncendiary-DMG1',
	'RM-WU-HowitzerIncendiary-DMG2',
	'RM-WU-HowitzerIncendiary-DMG3',
	'RM-WU-HowitzerIncendiary-DMG4',
	'RM-WU-HowitzerIncendiary-DMG5',
	'RM-WU-HowitzerIncendiary-DMG6',
	'RM-WU-HowitzerIncendiary-DMG7',
	'RM-WU-HowitzerIncendiary-ROF1',
	'RM-WU-HowitzerIncendiary-ROF2',
	'RM-WU-HowitzerIncendiary-ROF3',
	'RM-WU-HowitzerIncendiary-ROF4',
	'RM-WU-HowitzerIncendiary-ROF5',
	'RM-WU-HowitzerIncendiary-SPE1',
	'RM-WU-HowitzerIncendiary-SPE2',
	'RM-WU-Lancer-ACC1',
	'RM-WU-Lancer-ACC2',
	'RM-WU-Lancer-ACC3',
	'RM-WU-Lancer-ACC4',
	'RM-WU-Lancer-ACC5',
	'RM-WU-Lancer-ACC6',
	'RM-WU-Lancer-ACC7',
	'RM-WU-Lancer-DMG1',
	'RM-WU-Lancer-DMG2',
	'RM-WU-Lancer-DMG3',
	'RM-WU-Lancer-DMG4',
	'RM-WU-Lancer-DMG5',
	'RM-WU-Lancer-ROF1',
	'RM-WU-Lancer-ROF2',
	'RM-WU-Lancer-ROF3',
	'RM-WU-Lancer-ROF4',
	'RM-WU-Lancer-ROF5',
	'RM-WU-Lancer-SPE1',
	'RM-WU-Laser-ACC1',
	'RM-WU-Laser-ACC2',
	'RM-WU-Laser-ACC3',
	'RM-WU-Laser-ACC4',
	'RM-WU-Laser-ACC5',
	'RM-WU-Laser-DMG1',
	'RM-WU-Laser-DMG2',
	'RM-WU-Laser-DMG3',
	'RM-WU-Laser-DMG4',
	'RM-WU-Laser-DMG5',
	'RM-WU-Laser-DMG6',
	'RM-WU-Laser-DMG7',
	'RM-WU-Laser-ROF1',
	'RM-WU-Laser-ROF2',
	'RM-WU-Laser-ROF3',
	'RM-WU-Laser-ROF4',
	'RM-WU-Laser-ROF5',
	'RM-WU-Laser-SPE1',
	'RM-WU-Machinegun-ACC1',
	'RM-WU-Machinegun-ACC2',
	'RM-WU-Machinegun-ACC3',
	'RM-WU-Machinegun-ACC4',
	'RM-WU-Machinegun-ACC5',
	'RM-WU-Machinegun-DMG1',
	'RM-WU-Machinegun-DMG2',
	'RM-WU-Machinegun-DMG3',
	'RM-WU-Machinegun-DMG4',
	'RM-WU-Machinegun-DMG5',
	'RM-WU-Machinegun-ROF1',
	'RM-WU-Machinegun-ROF2',
	'RM-WU-Machinegun-ROF3',
	'RM-WU-Machinegun-ROF4',
	'RM-WU-Machinegun-ROF5',
	'RM-WU-Machinegun-ROF6',
	'RM-WU-Machinegun-ROF7',
	'RM-WU-Machinegun-SPE1',
	'RM-WU-Machinegun-SPE2',
	'RM-WU-Railgun-ACC1',
	'RM-WU-Railgun-ACC2',
	'RM-WU-Railgun-ACC3',
	'RM-WU-Railgun-ACC4',
	'RM-WU-Railgun-ACC5',
	'RM-WU-Railgun-DMG1',
	'RM-WU-Railgun-DMG2',
	'RM-WU-Railgun-DMG3',
	'RM-WU-Railgun-DMG4',
	'RM-WU-Railgun-DMG5',
	'RM-WU-Railgun-DMG6',
	'RM-WU-Railgun-DMG7',
	'RM-WU-Railgun-ROF1',
	'RM-WU-Railgun-ROF2',
	'RM-WU-Railgun-ROF3',
	'RM-WU-Railgun-ROF4',
	'RM-WU-Railgun-ROF5',
	'RM-WU-Railgun-SPE1',
	'RM-WU-RocketBattery-ACC1',
	'RM-WU-RocketBattery-ACC2',
	'RM-WU-RocketBattery-ACC3',
	'RM-WU-RocketBattery-ACC4',
	'RM-WU-RocketBattery-ACC5',
	'RM-WU-RocketBattery-ACC6',
	'RM-WU-RocketBattery-ACC7',
	'RM-WU-RocketBattery-DMG1',
	'RM-WU-RocketBattery-DMG2',
	'RM-WU-RocketBattery-DMG3',
	'RM-WU-RocketBattery-DMG4',
	'RM-WU-RocketBattery-DMG5',
	'RM-WU-RocketBattery-ROF1',
	'RM-WU-RocketBattery-ROF2',
	'RM-WU-RocketBattery-ROF3',
	'RM-WU-RocketBattery-ROF4',
	'RM-WU-RocketBattery-ROF5',
	'RM-WU-RocketBattery-SPE1',
	'RM-WU-RocketBattery-SPE2',
	'RM-WU-ScourgeMissile-ACC1',
	'RM-WU-ScourgeMissile-ACC2',
	'RM-WU-ScourgeMissile-ACC3',
	'RM-WU-ScourgeMissile-ACC4',
	'RM-WU-ScourgeMissile-ACC5',
	'RM-WU-ScourgeMissile-ACC6',
	'RM-WU-ScourgeMissile-ACC7',
	'RM-WU-ScourgeMissile-DMG1',
	'RM-WU-ScourgeMissile-DMG2',
	'RM-WU-ScourgeMissile-DMG3',
	'RM-WU-ScourgeMissile-DMG4',
	'RM-WU-ScourgeMissile-DMG5',
	'RM-WU-ScourgeMissile-ROF1',
	'RM-WU-ScourgeMissile-ROF2',
	'RM-WU-ScourgeMissile-ROF3',
	'RM-WU-ScourgeMissile-ROF4',
	'RM-WU-ScourgeMissile-ROF5',
	'RM-WU-ScourgeMissile-SPE1',
]

with open("../jsondata/mp/stats/research.json", 'r') as f:
	research = json.load(fp=f)

with open("../jsondata/mp/stats/structure.json", 'r') as f:
	structures = json.load(fp=f)

with open("../jsondata/mp/stats/structuremodifier.json", 'r') as f:
	structuremodifier = json.load(fp=f)

with open("../jsondata/mp/stats/weapons.json", 'r') as f:
	weapons = json.load(fp=f)

# Heuristic to find singles and successions:
# 	Does the name end with a digit?
#		Yes: Succession.
# 		No: Single.

singles = []
nonsingles = []
successions = {}

# Tell singles and non-singles apart
for resID in research:
	# Hacks do not get research messages
	if re.match('R-HACK-', resID):
		continue

	# Catch quasi-singles (= need dedicated research messages): -SPE
	if re.search('^.*-SPE[12]$', resID):
		singles.append(resID)
		continue

	# Process the remaining ones
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

# Code deduplication \o/
def addmessage (resmsgs, resmsgname, sequencename):
	resmsgs[resmsgname] = {
		'id': resmsgname,
		'imdName': 'MICAPSUL.pie',
		'sequenceName': sequencename,
		'text': [
			'Line 0',
			'Line 1',
			'Line 2',
			'Line 3'
		]
	}

for single in singles:
	# Starting at 1 to get rid of the "R" in "R-[...]"
	resmsgname = 'RM' + single[1:]
	sequencename = 'INVALID'
	for videotype in resvideotype:
		if resmsgname in resvideotype[videotype]:
			sequencename = videotype
			break

	addmessage(resmsgs, resmsgname, sequencename)

for succession in sorted(successions):
	for i in successions[succession]:
		# Starting at 1 to get rid of the "R" in "R-[...]"
		resmsgname = 'RM' + succession[1:] + str(i)
		sequencename = 'INVALID'
		for videotype in resvideotype:
			if resmsgname in resvideotype[videotype]:
				sequencename = videotype
				break

		addmessage(resmsgs, resmsgname, sequencename)

# This is still quite hardcoded and would ideally use some external text file with all the text. For now (and probably ever), things stay in this file. ¯\_(ツ)_/¯
# Define standard messages
s = {}
s['nb'] = 'New body available'
s['nd'] = 'New defensive structure available'
s['np'] = 'New propulsion available'
s['ns'] = 'New system available'
s['nw'] = 'New weapon available'
s['su'] = 'Special upgrade unlocked'

s['AA1'] = 'Strong against VTOLs'
s['AA2'] = 'May also target ground units at the right elevation'
s['AT'] = 'Strong against tanks'
# weapon type "artillery"
s['tART1'] = 'Strong against hover units and cyborgs'
s['tART2'] = 'Artillery weapons need Artillery sensors to work'
# weapon type "fast fire"
s['tFF'] = 'Strong against cyborgs, weak against tanks and structures'
# weapon type "thermal weapons (HOT)"
s['tHOT1'] = 'Strong against cyborgs, hover units; weak against tanks, structures'
s['tHOT2'] = 'Burn effect continues at full strength after leaving fire'

# aerial only
s['ao'] = 'Can be used against aerial targets only'
# ground only
s['go'] = 'Can be used against ground targets only'

s['hard'] = 'Base armour: {}, reduced damage from some weapon types' #structure.json


# Define all the things o\ (singles only)
singlemsgs = {}
singlemsgs['RM-B-HiKin'] = [
	s['nb'],
	'Higher kinetic armour than the standard body',
	'Same speed and same thermal armour as standard body',
	'Comes in sleek 2095 turquoise',
]
singlemsgs['RM-B-HiSpeed'] = [
	s['nb'],
	'Higher speed than the standard body',
	'Same kinetic armour and same thermal armour as standard body',
	'Black is beautiful',
]
singlemsgs['RM-B-HiTherm'] = [
	s['nb'],
	'Higher thermal armour than the standard body',
	'Same speed and same kinetic armour as standard body',
	'Designed to conceal bigbonedness of the drivers',
]
singlemsgs['RM-Commander'] = [
	s['ns'],
	'Commanders concentrate the fire of attached units',
	'Assign units, factories and/or artillery to commanders',
	'Damaged units are sent to repair and return automatically',
]
singlemsgs['RM-Def-Bunker'] = [
	s['nd'],
	'Bunkers are well-protected, but cannot fire over walls',
	'Base armour: {}, reduced damage from many weapon types'.format(
		structures['FKBunkerCannon']['armour']
	),
	'Weakness: Heavy Bomb ({}% damage)'.format(
		structuremodifier['BUNKER BUSTER']['BUNKER']
	),
]
singlemsgs['RM-Def-Hardpoint'] = [
	s['nd'],
	'Hardpoints can fire over walls and other hardpoints',
	s['hard'].format(
		structures['FKHardpointCannon']['armour']
	),
	'Build behind walls for enhanced durability',
]
singlemsgs['RM-Def-Site'] = [
	s['nd'],
	'Sites carry mainly indirect and anti-air weapons',
	s['hard'].format(
		structures['FKAASiteAvengerSAM']['armour']
	),
	'Combine with other defensive structures',
]
singlemsgs['RM-Def-Wall'] = [
	s['nd'],
	'Walls and automatic gates keep intruders out',
	s['hard'].format(
		structures['FKWall']['armour']
	),
	'Weak against graffiti sprayers',
]
singlemsgs['RM-P-Hover'] = [
	s['np'],
	'Hover propulsion allows travel on land and water',
	'Generally weaker than tracked tanks',
	'Hovercraft have been in use since ancient times',
]
singlemsgs['RM-P-VTOL'] = [
	s['np'],
	'Vertical Take Off and Landing (VTOL) allows aircraft',
	'Weak against anti-air weapons',
	'Units must be rearmed on rearming pads',
]
singlemsgs['RM-Repair'] = [
	s['ns'],
	'Repair turret automatically repairs damaged units nearby',
	'Cyborg and tank turrets available',
	'Repair all the things',
]
singlemsgs['RM-SensorArtillery'] = [
	s['ns'],
	'Artillery sensor scans for targets',
	'Mandatory for artillery to work',
	'Destroy enemy sensors to shut down artillery',
]
singlemsgs['RM-SensorCB'] = [
	s['ns'],
	'Counter Battery (CB) sensors scan for enemy artillery fire',
	'Assigned artillery tries to destroy enemy artillery',
	'Stay out of CB vs. CB fights',
]
singlemsgs['RM-SensorSurveillance'] = [
	s['ns'],
	'Surveillance sensors give visibility for surrounding area',
	'Extends unit field of view',
	'Cannot be used for artillery',
]
singlemsgs['RM-SensorVTOL'] = [
	s['ns'],
	'Send assigned VTOLs to engage targets',
	'VTOL attacks are fully automated',
	'Caution: Attacks only start if all VTOLs are repaired and rearmed',
]
singlemsgs['RM-St-RepairFacility'] = [
	'New structure available',
	'Repair facilities provide stationary repairs',
	'Faster repair rate than mobile repair turrets',
	'Automatically repair damaged units in range',
]
singlemsgs['RM-U-CyborgTransport'] = [
	'New unit available',
	'Cyborg Transport transports up to 10 cyborgs',
	'VTOL without weapons',
	'Units inside are lost when the transport is destroyed',
]
singlemsgs['RM-W-ART-Howitzer'] = [
	s['nw'],
	'Howitzers fire explosive shells',
	s['tART1'],
	s['tART2'],
]
singlemsgs['RM-W-ART-RocketBattery'] = [
	s['nw'],
	'Rocket batteries have the longest range',
	s['tART1'],
	s['tART2'],
]
singlemsgs['RM-W-FF-AAHurricane'] = [
	s['nw'],
	'Hurricane AA fires armour-piercing shells',
	s['AA1'],
	s['AA2'],
]
singlemsgs['RM-W-FF-Autocannon'] = [
	s['nw'],
	'Autocannon shoots small-calibre ammunition in short succession',
	s['tFF'],
	'Tank equivalent for machine gun',
]
singlemsgs['RM-W-FF-Machinegun'] = [
	s['nw'],
	'Machine gun shoots small-calibre ammunition in short succession',
	s['tFF'],
	'Cyborg equivalent for Autocannon',
]
singlemsgs['RM-W-HOT-AAStormbringer'] = [
	s['nw'],
	'Stormbringer AA fires laser beams',
	s['AA1'],
	s['AA2'],
]
singlemsgs['RM-W-HOT-BombThermite'] = [
	s['nw'],
	'Thermite bombs set large areas on fire',
	s['tHOT1'],
	s['tHOT2'],
]
singlemsgs['RM-W-HOT-Flamethrower'] = [
	s['nw'],
	'Flamethrowers set small areas on fire',
	s['tHOT1'],
	s['tHOT2'],
]
singlemsgs['RM-W-HOT-HowitzerIncendiary'] = [
	s['nw'],
	'Incendiary howitzer fires explosive shells setting small areas on fire',
	s['tHOT1'],
	s['tART2'],
]
singlemsgs['RM-W-HOT-Laser'] = [
	s['nw'],
	'Laser fires laser beams setting the target on fire',
	s['tHOT1'],
	s['tHOT2'],
]
singlemsgs['RM-W-MIS-AAAvengerSAM'] = [
	s['nw'],
	'Avenger Surface-to-Air Missile (SAM) without homing',
	s['AA1'],
	s['ao'],
]
singlemsgs['RM-W-MIS-Lancer'] = [
	s['nw'],
	'Lancer multi-purpose missile',
	s['AT'],
	s['go'],
]
singlemsgs['RM-W-MIS-ScourgeMissile'] = [
	s['nw'],
	'Scourge Missile with long range',
	s['AT'],
	s['go'],
]
singlemsgs['RM-W-SF-AACyclone'] = [
	s['nw'],
	'Cyclone AA fires explosive rounds',
	s['AA1'],
	s['AA2'],
]
singlemsgs['RM-W-SF-BombHeavy'] = [
	s['nw'],
	'Heavy Bomb with anti-defense warhead',
	'Strong against defensive structures',
	'Slow rearming',
]
singlemsgs['RM-W-SF-Cannon'] = [
	s['nw'],
	'Cyborg Cannon firing anti-tank projectiles',
	s['AT'],
	'Weak against cyborgs',
]
singlemsgs['RM-W-SF-Railgun'] = [
	s['nw'],
	'Tank Railgun firing anti-tank projectiles',
	s['AT'],
	'Weak against cyborgs',
]
singlemsgs['RM-W-SPL-BombCluster'] = [
	s['nw'],
	'Cluster Bombs damage large areas',
	'Strong against cyborgs',
	'Weak against tanks',
]
singlemsgs['RM-W-SPL-GrenadeLauncher'] = [
	s['nw'],
	'Indirect non-artillery weapon with splash damage',
	'Strong against cyborgs',
	'No particular weakness',
]
# quasi-single messages
singlemsgs['RM-WU-AAAvengerSAM-SPE1'] = [
	s['su'],
	'Avenger Surface-to-Air Missile is now homing',
	'Missiles will follow the target',
	'',
]
singlemsgs['RM-WU-AACyclone-SPE1'] = [
	s['su'],
	'Cyclone shells fly faster',
	'Turret can fire vertically now (90°)',
	'',
]
singlemsgs['RM-WU-AACyclone-SPE2'] = [
	s['su'],
	'Cyclone explosions affect larger area',
	'Splash radius increased from {} to {}'.format(
		weapons['FK-SF-AACyclone2']['radius'],
		weapons['FK-SF-AACyclone3']['radius']
	),
	'',
]
singlemsgs['RM-WU-AAHurricane-SPE1'] = [
	s['su'],
	'Hurricane shells fly faster',
	'Turret can fire vertically now (90°)',
	'',
]
singlemsgs['RM-WU-AAHurricane-SPE2'] = [
	s['su'],
	'Hurricane salvo size increased',
	'Shots per salvo increased from {} to {}'.format(
		weapons['FK-FF-AAHurricane2']['numRounds'],
		weapons['FK-FF-AAHurricane3']['numRounds']
	),
	'',
]
singlemsgs['RM-WU-AAStormbringer-SPE1'] = [
	s['su'],
	'Stormbringer shots travel faster (yes, we can do even that)',
	'Range increased by {}, fire pause decreased from {} to {}'.format(
		weapons['FK-HOT-AAStormbringer2']['longRange']-weapons['FK-HOT-AAStormbringer']['longRange'],
		weapons['FK-HOT-AAStormbringer']['firePause'],
		weapons['FK-HOT-AAStormbringer2']['firePause']
	),
	'Turret can fire almost vertically now (85°)',
]
singlemsgs['RM-WU-Autocannon-SPE1'] = [
	s['su'],
	'Autocannon salvo size increased',
	'Shots per salvo increased from {} to {}'.format(
		weapons['FK-FF-Autocannon-Tank']['numRounds'],
		weapons['FK-FF-Autocannon-Tank2']['numRounds']
	),
	'',
]
singlemsgs['RM-WU-Autocannon-SPE2'] = [
	s['su'],
	'Autocannon salvo size increased',
	'Shots per salvo increased from {} to {}'.format(
		weapons['FK-FF-Autocannon-Tank2']['numRounds'],
		weapons['FK-FF-Autocannon-Tank3']['numRounds']
	),
	'Tanks only: Barrel can be lowered further ({} ↗ {})'.format(
		-weapons['FK-FF-Autocannon-Tank2']['minElevation'],
		-weapons['FK-FF-Autocannon-Tank3']['minElevation']
	),
]
singlemsgs['RM-WU-BombCluster-SPE1'] = [
	s['su'],
	'Cluster bomb explosions affect larger area',
	'Splash radius increased from {} to {}'.format(
		weapons['FK-SPL-BombCluster']['radius'],
		weapons['FK-SPL-BombCluster2']['radius']
	),
	'',
]
singlemsgs['RM-WU-BombCluster-SPE2'] = [
	s['su'],
	'Cluster bomb salvo size increased',
	'Bombs per salvo increased from {} to {}'.format(
		weapons['FK-SPL-BombCluster2']['numRounds'],
		weapons['FK-SPL-BombCluster3']['numRounds']
	),
	'',
]
singlemsgs['RM-WU-BombHeavy-SPE1'] = [
	s['su'],
	'Heavy bomb mass decreased',
	'Mass decreased from {} to {}'.format(
		weapons['FK-SF-BombHeavy']['weight'],
		weapons['FK-SF-BombHeavy2']['weight']
	),
	'',
]
singlemsgs['RM-WU-BombHeavy-SPE2'] = [
	s['su'],
	'Heavy bomb mass decreased',
	'Mass decreased from {} to {}'.format(
		weapons['FK-SF-BombHeavy']['weight'],
		weapons['FK-SF-BombHeavy2']['weight']
	),
	'',
]
singlemsgs['RM-WU-BombThermite-SPE1'] = [
	s['su'],
	'Thermite bomb burning affects larger area',
	'Incendiary radius increased from {} to {}'.format(
		weapons['FK-HOT-BombThermite']['periodicalDamageRadius'],
		weapons['FK-HOT-BombThermite2']['periodicalDamageRadius']
	),
	'',
]
singlemsgs['RM-WU-BombThermite-SPE2'] = [
	s['su'],
	'Thermite bomb mass decreased',
	'Mass decreased from {} to {}'.format(
		weapons['FK-HOT-BombThermite2']['weight'],
		weapons['FK-HOT-BombThermite3']['weight']
	),
	'',
]
singlemsgs['RM-WU-Cannon-Cyb-SPE1'] = [
	s['su'],
	'Cyborg cannons usable while moving',
	'Cannons may be fired while moving at 50% reduced accuracy',
	'',
]
singlemsgs['RM-WU-Cannon-Cyb-SPE2'] = [
	s['su'],
	'Cyborg cannons usable while moving',
	'Cannons may be fired while moving at full accuracy',
	'',
]
singlemsgs['RM-WU-Cannon-Struc-SPE1'] = [
	s['su'],
	'Structure cannon damage and splash radius increased',
	'Base damage increased from {} to {}'.format(
		weapons['FK-SF-Cannon-Structure']['damage'],
		weapons['FK-SF-Cannon-Structure2']['damage']
	),
	'Splash radius increased from {} to {}'.format(
		weapons['FK-SF-Cannon-Structure']['radius'],
		weapons['FK-SF-Cannon-Structure2']['radius']
	),
]
singlemsgs['RM-WU-Cannon-Struc-SPE2'] = [
	s['su'],
	'Structure cannon range increased',
	'Range increased from {} to {}'.format(
		weapons['FK-SF-Cannon-Structure2']['longRange'],
		weapons['FK-SF-Cannon-Structure3']['longRange']
	),
	'',
]
singlemsgs['RM-WU-Flamethrower-SPE1'] = [
	s['su'],
	'Flamethrower burning affects larger area',
	'Incendiary radius increased from {} to {}'.format(
		weapons['FK-HOT-Flamethrower']['periodicalDamageRadius'],
		weapons['FK-HOT-Flamethrower2']['periodicalDamageRadius']
	),
	'',
]
singlemsgs['RM-WU-Flamethrower-SPE2'] = [
	s['su'],
	'Flamethrower flames burn longer',
	'Incendiary effect duration increased from {} to {}'.format(
		weapons['FK-HOT-Flamethrower2']['periodicalDamageTime'],
		weapons['FK-HOT-Flamethrower3']['periodicalDamageTime']
	),
	'',
]
singlemsgs['RM-WU-GrenadeLauncher-SPE1'] = [
	s['su'],
	'Grenade launcher explosions affect larger area',
	'Cyborgs only: Splash radius increased from {} to {}'.format(
		weapons['FK-SPL-GrenadeLauncher-Cyborg']['radius'],
		weapons['FK-SPL-GrenadeLauncher-Cyborg2']['radius']
	),
	'Tanks/structure only: Splash radius increased from {} to {}'.format(
		weapons['FK-SPL-GrenadeLauncher-TankStructure']['radius'],
		weapons['FK-SPL-GrenadeLauncher-TankStructure2']['radius']
	),
]
singlemsgs['RM-WU-GrenadeLauncher-SPE2'] = [
	s['su'],
	'Grenade launcher explosions affect larger area',
	'Cyborgs only: Splash radius increased from {} to {}'.format(
		weapons['FK-SPL-GrenadeLauncher-Cyborg2']['radius'],
		weapons['FK-SPL-GrenadeLauncher-Cyborg3']['radius']
	),
	'Tanks/structure only: Splash radius increased from {} to {}'.format(
		weapons['FK-SPL-GrenadeLauncher-TankStructure2']['radius'],
		weapons['FK-SPL-GrenadeLauncher-TankStructure3']['radius']
	),
]
singlemsgs['RM-WU-HowitzerIncendiary-SPE1'] = [
	s['su'],
	'Incendiary howitzer range increased',
	'Range increased from {} to {}'.format(
		weapons['FK-HOT-HowitzerIncendiary']['longRange'],
		weapons['FK-HOT-HowitzerIncendiary2']['longRange']
	),
	'',
]
singlemsgs['RM-WU-HowitzerIncendiary-SPE2'] = [
	s['su'],
	'Incendiary howitzer burning affects larger area',
	'Incendiary radius increased from {} to {}'.format(
		weapons['FK-HOT-HowitzerIncendiary2']['periodicalDamageRadius'],
		weapons['FK-HOT-HowitzerIncendiary3']['periodicalDamageRadius']
	),
	'',
]
singlemsgs['RM-WU-Howitzer-SPE1'] = [
	s['su'],
	'Howitzer range increased',
	'Range increased from {} to {}'.format(
		weapons['FK-ART-Howitzer']['longRange'],
		weapons['FK-ART-Howitzer2']['longRange']
	),
	'',
]
singlemsgs['RM-WU-Howitzer-SPE2'] = [
	s['su'],
	'Howitzer range increased',
	'Range increased from {} to {}'.format(
		weapons['FK-ART-Howitzer2']['longRange'],
		weapons['FK-ART-Howitzer3']['longRange']
	),
	'',
]
singlemsgs['RM-WU-Lancer-SPE1'] = [
	s['su'],
	'Lancer rockets usable against ground and aerial targets',
	'',
	'',
]
singlemsgs['RM-WU-Laser-SPE1'] = [
	s['su'],
	'Laser beams penetrate targets',
	'One shot may hit several targets in a row',
	'',
]
singlemsgs['RM-WU-Machinegun-SPE1'] = [
	s['su'],
	'Machine gun bullets fired at higher velocity',
	'Cyborgs only: Flight speed increased from {} to {}'.format(
		weapons['FK-FF-Machinegun-Cyborg']['flightSpeed'],
		weapons['FK-FF-Machinegun-Cyborg2']['flightSpeed']
	),
	'Structures only: Flight speed increased from {} to {}'.format(
		weapons['FK-FF-Machinegun-Structure']['flightSpeed'],
		weapons['FK-FF-Machinegun-Structure2']['flightSpeed']
	),
]
singlemsgs['RM-WU-Machinegun-SPE2'] = [
	s['su'],
	'Machine gun barrel can be raised/lowered further',
	'Cyborgs only: Barrel can be raised/lowered further ({} ↗ {}/{} ↗ {})'.format(
		weapons['FK-FF-Machinegun-Cyborg2']['maxElevation'],
		weapons['FK-FF-Machinegun-Cyborg3']['maxElevation'],
		-weapons['FK-FF-Machinegun-Cyborg2']['minElevation'],
		-weapons['FK-FF-Machinegun-Cyborg3']['minElevation']
	),
	'Structures only: Barrel can be raised/lowered further ({} ↗ {}/{} ↗ {})'.format(
		weapons['FK-FF-Machinegun-Structure2']['maxElevation'],
		weapons['FK-FF-Machinegun-Structure3']['maxElevation'],
		-weapons['FK-FF-Machinegun-Structure2']['minElevation'],
		-weapons['FK-FF-Machinegun-Structure3']['minElevation']
	),
]
singlemsgs['RM-WU-Railgun-SPE1'] = [
	s['su'],
	'Railgun projectiles penetrate targets',
	'One shot may hit several targets in a row',
	'',
]
singlemsgs['RM-WU-RocketBattery-SPE1'] = [
	s['su'],
	'Rocket Battery range increased',
	'Range increased from {} to {}'.format(
		weapons['FK-ART-RocketBattery']['longRange'],
		weapons['FK-ART-RocketBattery2']['longRange']
	),
	'',
]
singlemsgs['RM-WU-RocketBattery-SPE2'] = [
	s['su'],
	'Rocket Battery is now homing',
	'Rockets will follow the target',
	'',
]
singlemsgs['RM-WU-ScourgeMissile-SPE1'] = [
	s['su'],
	'Scourge Missile is now homing',
	'Missiles will follow the target',
	'',
]


# Define all the things o\ (successions only)
# To save keystrokes, grouped by upgrade type
# Upgrade types: ACC, Armours, BodyPoints, DMG, Engine, KineticArmour, NRG, RAU, Res, ROF, RpU, ThermalArmour
successionmsgs = {}

# Internal name to display name converter
displaynames = {}
displaynames['AAAvengerSAM'] = 'Avenger SAM'
displaynames['AACyclone'] = 'Cyclone AA'
displaynames['AAHurricane'] = 'Hurricane AA'
displaynames['AAStormbringer'] = 'Stormbringer AA'
displaynames['Autocannon'] = 'Autocannon'
displaynames['BombCluster'] = 'Cluster bomb'
displaynames['BombHeavy'] = 'Heavy bomb'
displaynames['BombThermite'] = 'Thermite bomb'
displaynames['Cannon'] = 'Cannon'
displaynames['Flamethrower'] = 'Flamethrower'
displaynames['GrenadeLauncher'] = 'Grenade Launcher'
displaynames['Howitzer'] = 'Howitzer'
displaynames['HowitzerIncendiary'] = 'Incendiary Howitzer'
displaynames['Lancer'] = 'Lancer'
displaynames['Laser'] = 'Laser'
displaynames['Machinegun'] = 'Machinegun'
displaynames['Railgun'] = 'Railgun'
displaynames['RocketBattery'] = 'Rocket Battery'
displaynames['ScourgeMissile'] = 'Scourge Missile'

# Internal name to weapon entry converter
weaponnames = {}
weaponnames['AAAvengerSAM'] = 'FK-MIS-AAAvengerSAM'
weaponnames['AACyclone'] = 'FK-SF-AACyclone'
weaponnames['AAHurricane'] = 'FK-FF-AAHurricane'
weaponnames['AAStormbringer'] = 'FK-HOT-AAStormbringer'
# FK-FF-Autocannon-Tank vs. FK-FF-Autocannon-VTOL
weaponnames['Autocannon'] = 'FK-FF-Autocannon-Tank'
weaponnames['BombCluster'] = 'FK-SPL-BombCluster'
weaponnames['BombHeavy'] = 'FK-SF-BombHeavy'
weaponnames['BombThermite'] = 'FK-HOT-BombThermite'
# FK-SF-Cannon-Cyborg vs. FK-SF-Cannon-Structure vs. FK-SF-Cannon-Structure
weaponnames['Cannon'] = 'FK-SF-Cannon-Cyborg'
weaponnames['Flamethrower'] = 'FK-HOT-Flamethrower'
# FK-SPL-GrenadeLauncher-Cyborg vs. FK-SPL-GrenadeLauncher-TankStructure
weaponnames['GrenadeLauncher'] = 'FK-SPL-GrenadeLauncher-Cyborg'
weaponnames['Howitzer'] = 'FK-ART-Howitzer'
weaponnames['HowitzerIncendiary'] = 'FK-HOT-HowitzerIncendiary'
# FK-MIS-Lancer-Cyborg vs. FK-MIS-Lancer-VTOL
weaponnames['Lancer'] = 'FK-MIS-Lancer-Cyborg'
weaponnames['Laser'] = 'FK-HOT-Laser'
#ä FK-FF-Machinegun-Cyborg vs. FK-FF-Machinegun-Structure
weaponnames['Machinegun'] = 'FK-FF-Machinegun-Cyborg'
weaponnames['Railgun'] = 'FK-SF-Railgun'
weaponnames['RocketBattery'] = 'FK-ART-RocketBattery'
weaponnames['ScourgeMissile'] = 'FK-MIS-ScourgeMissile'

for succession in successions:
	successionparts = re.split('-', succession)
	if successionparts[-1] == 'ACC':
		for topic in successions[succession]:
			# Generate research message name
			# Starting at 1 to get rid of the "R" in "R-[...]"
			resmsgname = 'RM' + succession[1:] + topic
			# Generate weapon name
			weaponname = displaynames[successionparts[2]]
			# Get internal weapon name
			internalweaponname = weaponnames[successionparts[2]]
			# Generate Upgrade information
			newvalue = -1
			oldvalue = int(weapons[internalweaponname]['longHit'])
			# Cycle over upgrades for oldvalue
			for oldtopic in range(1, int(topic)):
				oldvalue = oldvalue * (1 + (research[succession + str(oldtopic)]['results'][0]['value'] / 100))
			newvalue = oldvalue * (1 + (research[succession + topic]['results'][0]['value'] / 100))
			upgradeinfo = 'Accuracy improved from {old:d} % to {new:d} %'.format(old = int(oldvalue), new = int(newvalue))
			successionmsgs[resmsgname] = [
				'{} accuracy improved'.format(weaponname),
				upgradeinfo,
			]
	print('{}: {}'.format(succession, successions[succession]))

for key in successionmsgs:
	print(key)

# Apply all the new messages
for key in resmsgs:
	if key in singlemsgs:
		resmsgs[key]['text'] = singlemsgs[key]
	if key in successionmsgs:
		resmsgs[key]['text'] = successionmsgs[key]

# Save JSON dump
with open('../jsondata/mp/messages/resmessagesall.json', 'w') as f:
	json.dump(resmsgs, fp=f, indent=4, sort_keys=True)


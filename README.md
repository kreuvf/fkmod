# Warzone 2100 FKmod

Warzone 2100 FKmod or just "FKmod" for short is a standalone version of Warzone 2100 (https://wz2100.net/) focussing on the multiplayer mode. In brief, expect the following:

* Technology tree: new and simple, no complex or unexpected interdependencies anymore
* Types: more pronounced rocks-paper-scissors system
* Numbers: try to present all important numbers to the player
* Realism: more realistic burn effect
* Fixes for bugs in Vanilla Warzone 2100 (not (yet) upstreamed)

The single player content remains untouched, but due to technical changes to e.g. how burn damage works, single player is affected as well. Due to the revamped tech-tree none of the Vanilla stock AIs worked anymore, so we replaced it with our very basic FK AI. The AI lets you learn this new game, but be aware that it is in no way competitive.

## Installation

Detailed instructions can be found in docs/Readme_en_GB.txt

## Project structure

Contents of the project are split in folders as follows:

* csv2json: Python 3 scripts to convert game data from old txt-format to the new json-format
* data: Game data in the old txt-format
* docs: Documentation of the project
* jsondata: Game data in the new json-format
* maps2fkmaps: Python 3 scripts to convert the default Warzone 2100 Project maps to FKmod
* patches: Changes to the source code of the Warzone 2100 Project
* resmsggen: Python 3 scripts to generate research messages
* specs: Early draft of proposed changes to the base game

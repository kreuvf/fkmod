# Warzone 2100 FKmod

Version: [[VERSION]]

Warzone 2100 FKmod or just "FKmod" for short is a standalone version of Warzone 2100 (https://wz2100.net/) focussing on the multiplayer mode. In brief, expect the following:
	* Technology tree: new and simple, no complex or unexpected interdependencies anymore
	* Types: more pronounced rocks-paper-scissors system
	* Numbers: try to present all important numbers to the player
	* Realism: more realistic burn effect
	* Fixes for bugs in Vanilla Warzone 2100 (not (yet) upstreamed)

The single player content remains untouched, but due to technical changes to e.g. how burn damage works, single player is affected as well. Due to the revamped tech-tree none of the Vanilla stock AIs worked anymore, so we replaced it with our very basic FK AI. The AI lets you learn this new game, but be aware that it is in no way competitive.


## Installation

This section will need some polishing before the first full release.

### Building From Source
Information taken from http://developer.wz2100.net/wiki/CompileGuideLinux?version=80

* Get Vanilla Warzone 2100 3.2.3 Sources
** 
* Get the dependencies
** sudo apt-get install --yes g++ build-essential autoconf libpng-dev libsdl2-dev libopenal-dev libphysfs-dev libvorbis-dev libtheora-dev libglew-dev zip unzip libcrypto++-dev libssl-dev libharfbuzz-dev libcryptsetup-dev libfribidi-dev libfreetype6-dev libfontconfig1-dev
* Build the game
** ./autogen.sh && ./configure && make
* Start the game
** ./src/warzone2100

### Debian-Based Linux Distributions
* ...

### Windows
* ...

### OS X
Unfortunately, this game is currently not supported on OS X. Since older versions of Vanilla Warzone 2100 used to be buildable on OS X and run from DMG files there do not appear to be fundamental obstacles and a developer with some skill and time should be able to get the game running on OS X as well.


## Gameplay

FKmod's multiplayer mode features an all-new technology tree using the existing models. We highly recommend to familiarize yourself with the tech-tree by trying to beat our basic FK AI. Nonetheless, we will introduce you to some of the distinguishing features of FKmod in this section.

### Weapon Angles
A direct weapon may only shoot at its target if the barrel can be lifted/lowered enough for a hit. Many weapons have gotten the ability to hit unusual targets to allow AA sites in valleys to fire at tanks moving at the top of a nearby cliff. On the other hand, a cannon might not be able to hit the target, because the barrel cannot be lowered enough. This feature was part of the original game, but probably has gotten lost somewhere along the way. We put it back!

### VTOL Altitude, VTOL Damage
With the reintroduction of weapon angles, VTOLs would be easy prey for almost any weapon. Therefore, we decided it is best for VTOLs to fly a bit higher to evade most attacks from non-AA weapons. Also, the triple damage resting VTOLs would receive has been removed. Oh, you did not know about that? That's exactly the reason we removed it: The game never told you about it, so we deemed this unfair.

### Weaknesses & Strengths More Pronounced
FKmod's all new technology tree uses more pronounced weaknesses and strengths of weapon types against target types. Overall, there are way less weapons of the same effectiveness than in the Vanilla version. When you encounter two weapons with the same effectiveness, you can be sure that the weapons still differ enough to distinguish them. Let's have a look at the two anti-tank weapons for tanks, Railgun and Scourge Missile: Railguns do way more damage, but lack in range and need quite some time for reloading. While Scourge Missiles have a high range, they cannot make full use of it without external sensors. That way, both weapons have their uses.

### Burn Damage
First off, a short explanation how burn damage works in Vanilla 3.2.x:

	* Units within the fire get damaged by the weapon's corresponding damage value.
	* After the main burn effect wears off or you leave the burning area, the unit will continue with a kind of "secondary burning". Damage and duration are hard-coded (15 damage per second for 10 seconds).

We found this to be a terrible design decision for several reasons:

	* This effect is not obvious to the player.
	* The effect is basically useless when units have bodypoints in the range of thousands and with thermal armour exceeding three digit numbers.
	* The effect cannot be changed by simple modding.
	* This effect is as unexpected as it is unrealistic.

So, we had to fix this. In FKmod, whenever a unit enters a burning area, it automatically catches fire and will continue to burn and accumulate damage for as long as the original fire burned, even when moved out of the fire! There is one caveat, though: The burn effect does stack, getting hit by multiple flamethrowers will each cause the full burn damage over time. Since changing this would have required to some more sophisticated internal changes, we decided to only do that if there are enough players enjoying FKmod. :)

### In-game Values
One of the gripes we have with the vanilla version is the lack of numbers. What effect does an upgrade to power generators have? By what amount is armour increased? You get the picture. Therefore, in FKmod, we try to give you more information:

	* The research messages in the intelligence screen are finally useful!
		* Detailed information on research effects.
		* Semi-autogenerated at build time.
	* There is one caveat, though: When you are researching artifacts from other players, the "natural" order of upgrades might become disturbed and the values will be off. Nonetheless, upgrades are in percentages, so the exact order does not matter.
	* There might be some less informative, but rather jocular messages in there.

### Speed
We drastically reduced construction and research speed. Combined with the less complex technology tree, you have more time to focus your resources on the "war" part of "Warzone 2100". In the vanilla version, especially on large maps, you could easily run into the problem that once your units arrive at your enemy they are terribly outdated.

### Structures Simplified
HQ? Gone. Command Relay? Gone. Modules? Gone. Oil derricks? Still there.

The HQ allowed you to have the mini-map and to design units, but that was more of a bother and lacked deeper strategic value. The Command Relay was only good for producing commanders. Also, you only needed to have had this structure once per game and you could still build more commanders and use the commander menu. All structures that had modules always have their maximum number of modules from the beginning in FKmod, so no more building of a structure and then directly upgrading it.

Be aware that oil derricks are associated with a cost now, so that rogue-building them everywhere on the map will most likely not pay off.

### Type Modifiers and Armour
You knew that most weapons are more damaging to some, less damaging to other targets, didn't you? Well, we have not changed that. But, we changed the way the damage gets calculated. In the vanilla version, the damage a unit receives is calculated like this (single kinetic damage):

	* Take current damage value of the weapon: 500.
	* Get the modifier for the target: 150%.
	* Consider modifier for damage: 500 * 150% = 750.
	* Get target kinetic armour: 200.
	* Reduce damage by armour: 750 - 200 = 550.
	* Reduce current bodypoints: ...

We found this to be quite counterintuitive: Armour should always be armour and reduce the damage accordingly. Only the damage that actually reaches the unit should get the modifier. In this case, it would look like this:

	* Take current damage value of the weapon: 500.
	* Get target kinetic armour: 200.
	* Reduce damage by armour: 500 - 200 = 300.
	* Get the modifier for the target: 150%.
	* Consider modifier for damage: 300 * 150% = 450.
	* Reduce current bodypoints: ...

As you can see, less damage for the unit. The effect gets more pronounced the closer the armour is to the damage. This means that increasing your armour can have a profound effect even when fighting against the wrong target.

Side note: In reality, different types of weapons really do tremendously different damage to different types of targets, but from a game balancing perspective that would likely kill most of the fun.

### Research Simplified
While the technology tree is all new, we tried to keep it simple despite its size. Some points in random order:

	* Armour Research: One research for all units and both types of armour
	* Bodypoints Research: Armour isn't everything! Sometimes your units (or structures!) just need to take more hits before dying.
	* Body Research: Four bodies, one of them the basic default, the others available after just one other research topic each
	* Weapon Research
		** Subtree with all upgrades available
		** Each weapon has at least 5 upgrades of every type (damage, rate of fire, accuracy)
		** Each weapon has one focus upgrade type with 7 upgrades
		** Up to two special upgrades per weapon
		*** Replacement of old weapons with new ones granting upgrades not achievable through normal research
		*** Weapon angles, homing, flight speed, range (weapon range, splash damage range, incendiary range), more shots per salvo, partial/full fire while moving, penetration
	* Removed production speed upgrades, kicked out half-tracks
	* No more weird (= non-obvious) inter-dependencies

Also, the effect of a certain research is generally 10%: 10% higher rate of fire than before, 10% higher damage than before, 10% lower chance to miss than before, ... you get the picture. This means that the research gets gradually better relative to the initial value, so that e.g. a weapon will do 200 (no upgrades), 220, 242, 266, 293, 322, 354 and 390 damage or +20, +22, +24, +27, +29, +32, +35 damage.

### Auto-Repair Always On
In the year 2100, if tank is still alive, if cyborg can survive, they may find ... auto-repair! :D

Yes, we did it, auto-repair is enabled by default. Why? Mostly for convenience. Repairing that 1 point of damage of your defense structure surely won't change the outcome should the enemy decide on a coordinated attack, but the structure will still give off smoke to signal its status. Now, you don't need to worry about pesky mini-damage anymore.

### New Default Map
Tired of starting every skirmish on the four player map Rush? Then FKmod offers you the two player map Roughness instead. There are several reasons for the switch:

	* When self-compiling the game, you have a simple indicator if you are actually running FKmod.
	* It takes some time to get to your enemy which harmonizes with FKmod's overall speed (see above).
	* Scattered resources combined with FKmod's oil derrick costs add some more depth to resource management.
	* It is a two player map; even without big data we assume that most games are 1 on 1.
	* The map is pointsymmetric.

## Maps Adapted to FKmod
All maps of the Vanilla 3.2.x line have been converted to use FKmod structures and units. This means that you can play all of the old maps and use them as native FKmod maps. The FKmod source code contains converter scripts, so that, theoretically, you could convert other maps and start them without getting errors and with structures and units intact.

### New Default AI
FKmod is built for all-human matches. However, we are also shipping it with FK AI, a very basic AI to allow for some offline training and getting used to the mod. All other AIs have been disabled/removed, because they are not compatible with the mod and would give errors anyway.


## Questions & Answers

### How to tell whether I have FKmod or other versions of Warzone 2100?
The following points are indicators that you are indeed using FKmod:

	* Default map: Roughness-T1
	* Default AI: FK AI
	* AIs to choose: none other than FK AI
	* Structure Limits are only available for eight structures:
		* Cyborg Factory
		* Power Generator
		* Rearming Pad
		* Repair Facility
		* Research Facility
		* Tank Factory
		* VTOL Factory
	* Intelligence Display contains actually useful information :X


### What does "FKmod" stand for?
The initials of the nicknames of the two principal authors are "F" for "Fingolfin" and "K" for "Kreuvf". Since we planned to make a mod, we put all our creativity in the name and "FKmod" was born.


### What is this "Vanilla Warzone 2100" you are referring to?
The more or less "official" or "mainstream" version of Warzone 2100 distributed by the team at wz2100.net.

See also: https://en.wikipedia.org/w/index.php?title=Vanilla_software&oldid=895110056


### Which version of Warzone 2100 do I need to play FKmod?
None. Although it is called "FKmod", technically, it is not a mod, but rather a different version of Warzone 2100. Therefore, it is incompatible with any other version of Warzone 2100 out there. Also, neither do FKmod savegames work with Vanilla Warzone 2100 nor do Vanilla Warzone 2100 savegames work with FKmod.


### What exactly is FKmod?
FKmod is a fork of Warzone 2100. Currently, it derives from Warzone 2100 3.2.3. FKmod is only compatible to itself, the lobby offered by wz2100.net does not work with FKmod. FKmod is purely meant for multiplayer games.


### Will there be updates?
Nothing is planned. The further development of this mod likely depends heavily on fan reactions. If attention wanes shortly after the initial release, FKmod still served its purpose; the journey is the reward. Whether there will be an updated version based on Vanilla Warzone 2100 3.3.x is up to the impact we make with this.

This game is open source and as long as you adhere to the license, you may change/update the game to your liking. The only thing we are kindly asking you is to use a sufficiently different name, so that your new version can be found via internet search engines and we are spared bug reports for your version(s) of the game ;D


## History

2010-12-10, 7b43dc70b630ce0a22048b99fb4d82e33c762dc7
FKmod started out as a mere mod to the open source 3D real-time strategy game Warzone 2100. The development started at the end of 2010 with an import of the data files of the Vanilla Warzone 2100.

2012-06-03, 8e7b6b94f519ca864989fdd669360fa382d7d3b9
First patch added to adapt the game to our desires.

2012-07-08, 34545d7a2f362208794b27409fc9191bb983218e
After little more than 1.5 years the first non-crashing version existed. This version was created after months of design discussions and planning.

In the meantime
Lots of testing, adapting of ideas to what the game allows, the decision to add more custom patches to the game effectively turning a mod that was supposed to run on top of Vanilla Warzone 2100 into a fork.

2019-12-06, 3c80f6ac3a42bce8f13a2db3c07feb2f795df2b4
First public release: 0.1.0-beta.


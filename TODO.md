# TODO for FKmod

## Requirements for Final Version
### Pre-Release Polishing
* Intelligence Screen
* Set up build infrastructure for Windows and deb packages
* Set up default AI
* Add end user readme
* Change spelling of "Machinegun" to "Machine Gun" everywhere (incl. camel case in identifiers)

## Nice to Have for Final Version
### Code
* Debug switch to turn off data checking
* EMP weapons should do some damage
* Flamer effects stack indefinitely
	* Move burn effect logic away from projectile to unit
	* Reorganize allocation of experience from damage
* Flamer incendiary damage can burn the same target multiple times, when penetrate is on
	* Penetrate = on impact, spawn new projectile
	* new projectile lands somewhere, sets fire to the area -> burn effect from new projectile
	* Solution: Add information on parent and child projectiles to every projectile; when adding new projectile's effect, add current projectile if and only if the parent projectile and no child projectile already affects the target
* VTOL Strike Tower Micro AI is stupid
	* sends VTOLs back, when the target is down, although other targets still exist
	* does not pick target with highest possible damage, e. g. not center points in groups, if splash damage is available
* Unit micro AI is stupid
	* Walls are not attacked at will
* VTOL Strike Tower menu to select target classes (aerial, ground, mobile)

### Miscellaneous
* Surveillance Tower: Sensor is floating on top of tower
* Propulsion changing: Changing the propulsion of an existing design does not change until weapon is changed afterwards
* Maybe use Super cyborg models for easier selection


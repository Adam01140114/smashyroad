# Getaway Blocks

A blocky police-chase game for the browser, built with three.js and inspired by Smashy Road: Wanted and Wanted 2. Open `index.html` in a browser, or serve the folder with any static server. Progress (cash, unlocked vehicles, missions) saves in your browser.

## How it plays

- **Driving:** the car drives itself. Hold left or right (A/D, arrow keys, or either half of the screen) to steer. Hold W for gas, and hold both sides (or S) to brake and reverse.
- **The world:** endless and random every run: city blocks, countryside, desert and snow, connected rivers, lakes and seas with bridges, jump ramps, gas stations and helipads.
- **Wanted levels:** 10 levels that escalate from police to SWAT, agents, army, tanks, an attack helicopter and a bomber, ending in an alien invasion. Cops park and chase you on foot, roadblocks appear, and landmines show up at high levels.
- **On foot:** get out with Space or E, steal any car, bike, boat or helicopter by touching it, and shoot back with Space. You have hearts and can swim.
- **Flying:** helicopters bring armed police gunships after you. Eject and you come down on a parachute.
- **Boats:** speedboats on the water, chased by police boats and gunboats.
- **Vehicles:** about 80 cars and bikes with their own speed, health and handling, including legendaries with special abilities.
- **Power-ups:** airdrops and roadside pickups give nitro, a shield, a cash magnet, spike strips, a shockwave, ghost mode, a gravity gun and more.
- **Progression:** collect cash, spin the prize machine for vehicles, characters and upgrades, and complete missions to unlock mystery vehicles.
- **How runs end:** arrested, out of hearts, or "debugged" for staying put too long.

## Controls

| Action | Keys |
| --- | --- |
| Steer | A / D or arrow keys (or tap either half of the screen) |
| Gas | W or Up |
| Brake / reverse | S, Down, or both sides |
| Get in / get out | E (Space also gets out) |
| Shoot on foot | Space or F |
| Gravity gun | G |
| Change camera | Right click or C |
| Pause | P or Esc |

## Source

The game is built from the parts in `src/`. After editing them, rebuild `index.html` with:

```
node src/build.js
```

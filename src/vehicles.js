/* ---------- Vehicle catalogue ---------- */
// s/h/d are speed, health and handling on a 10-point scale, the way the original wiki rates cars
const RAR = { common: { n: 'Common', c: '#9aa3b2', w: 62 }, rare: { n: 'Rare', c: '#3a8dde', w: 25 }, epic: { n: 'Epic', c: '#a05ce0', w: 10 }, legendary: { n: 'Legendary', c: '#ff9f1c', w: 3 }, mystery: { n: 'Mystery', c: '#e8473c', w: 0 } };
const CARS = [
  { id: 'pickup', n: 'Pickup', r: 'common', st: 'pickup', s: 6.9, h: 7, d: 6.1, col: '#ffd23f', acc: '#2b2d33' },
  { id: 'bluebie', n: 'Bluebie', r: 'common', st: 'hatch', s: 7.3, h: 5.3, d: 7.2, col: '#3a8dde', acc: '#f4f1ea' },
  { id: 'orange', n: 'Orange', r: 'common', st: 'sedan', s: 7.4, h: 4.8, d: 6.6, col: '#ff8c1a', acc: '#2b2d33' },
  { id: 'shades', n: 'Shades', r: 'common', st: 'suv', s: 7, h: 7.3, d: 5.8, col: '#2b2d33', acc: '#16181d', glass: '#0d0e12' },
  { id: 'mini', n: 'Little Mini', r: 'common', st: 'mini', s: 7.1, h: 6.4, d: 7.5, col: '#e8473c', acc: '#f4f1ea' },
  { id: 'hotrod', n: 'Hot Rod', r: 'common', st: 'hotrod', s: 8.2, h: 4.4, d: 6.4, col: '#d9483b', acc: '#ffd23f' },
  { id: 'bling', n: 'Bling', r: 'common', st: 'sedan', s: 8, h: 7.9, d: 8.9, col: '#f2c14e', acc: '#fff3b0' },
  { id: 'rally', n: 'Rallyman', r: 'common', st: 'hatch', s: 6.6, h: 4.5, d: 7.5, col: '#f4f1ea', acc: '#3a8dde', stripe: true },
  { id: 'pro', n: 'The Pro', r: 'common', st: 'sports', s: 8.8, h: 5, d: 5, col: '#5b5ff2', acc: '#f4f1ea', drift: 1.6 },
  { id: 'microbus', n: 'Microbus', r: 'common', st: 'van', s: 7.4, h: 7.1, d: 5.5, col: '#5ec2b7', acc: '#f4f1ea' },
  { id: 'family', n: 'Family Car', r: 'common', st: 'sedan', s: 4.5, h: 5.5, d: 6, col: '#9fb4c8', acc: '#5d6270' },
  { id: 'classy', n: 'Classy', r: 'common', st: 'classic', s: 3.1, h: 3.2, d: 5, col: '#2b2d33', acc: '#c9ccd3', grey: true },
  { id: 'robo', n: 'Robo 3000', r: 'common', st: 'robo', s: 5.1, h: 7.5, d: 6, col: '#b8c0cc', acc: '#3a8dde' },
  { id: 'hotdog', n: 'Hot Dog', r: 'common', st: 'hotdog', s: 4.6, h: 4.6, d: 6, col: '#ffd23f', acc: '#d9483b' },
  { id: 'tuktuk', n: 'Tuk Tuk', r: 'common', st: 'tuk', s: 5.3, h: 6.2, d: 7, col: '#2fa36b', acc: '#ffd23f' },
  { id: 'gt', n: 'GT', r: 'common', st: 'sports', s: 8.4, h: 5, d: 7, col: '#e8473c', acc: '#2b2d33', stripe: true },
  { id: 'bigwheel', n: 'Big Wheels', r: 'common', st: 'monster', s: 5, h: 5.5, d: 5, col: '#8bc34a', acc: '#2b2d33' },
  { id: 'pinkie', n: 'Pinkie', r: 'common', st: 'hatch', s: 7.3, h: 5.1, d: 7, col: '#ff7bac', acc: '#f4f1ea' },
  { id: 'sports', n: 'Sports Car', r: 'common', st: 'sports', s: 8, h: 4, d: 7.5, col: '#ffd23f', acc: '#2b2d33' },
  { id: 'quad', n: 'Quad', r: 'common', st: 'quad', s: 3.5, h: 3.5, d: 8, col: '#e8473c', acc: '#2b2d33' },
  { id: 'derby', n: 'Derby Car', r: 'common', st: 'muscle', s: 6.5, h: 5, d: 6, col: '#ff8c1a', acc: '#f4f1ea', stripe: true },
  { id: 'muscle', n: 'Muscle Car', r: 'common', st: 'muscle', s: 7, h: 6.5, d: 6, col: '#3a8dde', acc: '#f4f1ea', stripe: true },
  { id: 'oldpick', n: 'Classic Pickup', r: 'common', st: 'pickup', s: 4.5, h: 7, d: 5.5, col: '#5ec2b7', acc: '#f4f1ea' },
  { id: 'icecream', n: 'Ice Cream', r: 'common', st: 'icecream', s: 7.5, h: 7, d: 5.5, col: '#ffb3c7', acc: '#f4f1ea' },
  { id: 'ghost', n: 'Ghost', r: 'common', st: 'classic', s: 5, h: 7, d: 6, col: '#f4f7fb', acc: '#b8c0cc' },
  { id: 'redmuscle', n: 'Red Muscle', r: 'common', st: 'muscle', s: 8.1, h: 8, d: 6.5, col: '#c4302b', acc: '#2b2d33' },
  { id: 'stone', n: 'Stone Age', r: 'common', st: 'stone', s: 7.4, h: 6.8, d: 6, col: '#a9845a', acc: '#e9e4d8' },
  { id: 'kart', n: 'Go Kart', r: 'common', st: 'kart', s: 5.5, h: 4.9, d: 9, col: '#3fa34d', acc: '#ffd23f' },
  { id: 'cheapy', n: 'Cheapy', r: 'common', st: 'mini', s: 4.7, h: 5.5, d: 6.5, col: '#a8b0a2', acc: '#5d6270' },
  { id: 'rugged', n: 'Rugged', r: 'rare', st: 'suv', s: 8, h: 4.5, d: 6.5, col: '#8a6a45', acc: '#f2c14e' },
  { id: 'limo', n: 'Limousine', r: 'rare', st: 'limo', s: 6.5, h: 7, d: 4.5, col: '#16181d', acc: '#c9ccd3' },
  { id: 'camper', n: 'Camper', r: 'rare', st: 'camper', s: 4.5, h: 8.5, d: 4.5, col: '#f4f1ea', acc: '#ff8c1a' },
  { id: 'digger', n: 'Digger', r: 'rare', st: 'digger', s: 6, h: 8, d: 6, col: '#f2c14e', acc: '#2b2d33', plow: 1.2 },
  { id: 'garbage', n: 'Garbage Truck', r: 'rare', st: 'garbage', s: 5.5, h: 8.5, d: 5, col: '#3f7d4f', acc: '#f4f1ea', fastReverse: true },
  { id: 'skull', n: 'Skull Car', r: 'rare', st: 'hotrod', s: 8.2, h: 6.8, d: 6.5, col: '#16181d', acc: '#f4f1ea' },
  { id: 'racer', n: 'Racer', r: 'rare', st: 'sports', s: 8.9, h: 5, d: 7.5, col: '#f4f1ea', acc: '#e8473c', stripe: true },
  { id: 'armyjeep', n: 'Army Jeep', r: 'rare', st: 'jeep', s: 3.2, h: 9.7, d: 6, col: '#6b7a3f', acc: '#3e4a26' },
  { id: 'shifter', n: 'The Shifter', r: 'rare', st: 'wedge', s: 7.8, h: 6, d: 7, col: '#5ec2b7', acc: '#16181d', low: true },
  { id: 'avan', n: 'A-Van', r: 'rare', st: 'van', s: 6.5, h: 8, d: 5.5, col: '#2b2d33', acc: '#e8473c', stripe: true },
  { id: 'drag', n: 'Drag Racer', r: 'epic', st: 'drag', s: 9.6, h: 2.5, d: 3.5, col: '#ff4b9a', acc: '#ffd23f' },
  { id: 'hover', n: 'Hovercraft', r: 'epic', st: 'hover', s: 6.5, h: 3, d: 3, col: '#ff8c1a', acc: '#2b2d33', hover: true, drift: 3 },
  { id: '4x4', n: '4x4', r: 'epic', st: 'suv', s: 6, h: 9, d: 8, col: '#2b2d33', acc: '#ffd23f' },
  { id: 'ufo', n: 'Saucer', r: 'epic', st: 'ufo', s: 7, h: 5, d: 7, col: '#b8c0cc', acc: '#79e3a5' },
  { id: 'drdrift', n: 'Dr. Drift', r: 'epic', st: 'sports', s: 7.1, h: 7, d: 6, col: '#f4f1ea', acc: '#5b5ff2', drift: 3.2 },
  { id: 'stealth', n: 'Stealth Drag', r: 'epic', st: 'drag', s: 9.7, h: 3.6, d: 5, col: '#16181d', acc: '#5d6270', low: true },
  { id: 'rocket', n: 'Rocket Car', r: 'epic', st: 'rocketcar', s: 9.9, h: 3.3, d: 3.5, col: '#f4f1ea', acc: '#3a8dde', low: true },
  { id: 'tractor', n: 'Power Tractor', r: 'epic', st: 'tractor', s: 4, h: 9.5, d: 3.5, col: '#e8473c', acc: '#2b2d33', plow: 1.4 },
  { id: 'semi', n: 'Big Rig', r: 'epic', st: 'semi', s: 6.5, h: 9.3, d: 4, col: '#3a8dde', acc: '#c9ccd3' },
  { id: 'buggy', n: 'Dune Buggy', r: 'epic', st: 'buggy', s: 8, h: 6, d: 8, col: '#ff8c1a', acc: '#2b2d33' },
  { id: 'hotchili', n: 'Hot Chili', r: 'epic', st: 'sports', s: 8.6, h: 8.7, d: 7.5, col: '#e8473c', acc: '#f4f1ea' },
  { id: 'tankd', n: 'Tank Destroyer', r: 'legendary', st: 'tracked', s: 3, h: 10, d: 4, col: '#2fc6d6', acc: '#16181d', plow: 2, tag: 'Nothing can stop this' },
  { id: 'f1', n: 'Formula', r: 'legendary', st: 'f1', s: 10, h: 3.2, d: 5.7, col: '#e8473c', acc: '#f4f1ea', low: true, tag: 'Speed is key' },
  { id: 'money', n: 'Money Truck', r: 'legendary', st: 'armored', s: 4.5, h: 9.8, d: 5, col: '#5b6b4a', acc: '#f2c14e', cashX: 2, tag: 'Earn double cash' },
  { id: 'timemachine', n: 'Time Racer', r: 'legendary', st: 'delorean', s: 8.5, h: 6, d: 7, col: '#c9ccd3', acc: '#2b2d33', ability: 'time', tag: 'Go fast enough and time breaks' },
  { id: 'launcher', n: 'Rocket Truck', r: 'legendary', st: 'launcher', s: 6, h: 8.5, d: 5, col: '#6b7a3f', acc: '#2b2d33', ability: 'rockets', tag: 'Whoosh boom' },
  { id: 'beast', n: 'The Beast', r: 'legendary', st: 'hotrod', s: 10, h: 9.9, d: 7, col: '#16181d', acc: '#ff8c1a', plow: 1.3, flames: true, tag: 'Gives police nightmares' },
  { id: 'oiltruck', n: 'Oil Truck', r: 'legendary', st: 'tanker', s: 6, h: 8, d: 4.5, col: '#f4f1ea', acc: '#2b2d33', ability: 'oil', tag: 'Drops oil' },
  { id: 'doubledecker', n: 'Double Decker', r: 'legendary', st: 'dbus', s: 8.6, h: 9.5, d: 4, col: '#d9302c', acc: '#ffd23f', ability: 'decker', tag: 'Double lives' },
  { id: 'flipper', n: 'The Flipper', r: 'legendary', st: 'groomer', s: 4.4, h: 9.9, d: 5, col: '#e8473c', acc: '#f4f1ea', plow: 2.5, launcher: true, tag: 'Toinkkk' },
  // mystery: unlocked by missions
  { id: 'getaway', n: 'Getaway Racer', r: 'mystery', st: 'sports', s: 8, h: 8, d: 8, col: '#16181d', acc: '#ffd23f', stripe: true, how: 'Collect all seven GETAWAY letters' },
  { id: 'tank', n: 'Tank', r: 'mystery', st: 'tank', s: 3.5, h: 10, d: 4, col: '#6b7a3f', acc: '#3e4a26', ability: 'cannon', how: 'Keep That Tank: steal the tank from a military roadblock and destroy 10 enemies in 70 seconds' },
  { id: 'clown', n: 'Clown Car', r: 'mystery', st: 'mini', s: 4.5, h: 7, d: 6, col: '#ff4b9a', acc: '#ffd23f', ability: 'balloons', how: 'Reach wanted level 6' },
  { id: 'waterjet', n: 'WaterJet 3000', r: 'mystery', st: 'fire', s: 5, h: 7, d: 8, col: '#ffd23f', acc: '#e8473c', ability: 'water', how: 'Smash 150 things in one run' },
  { id: 'oiltrans', n: 'Oil Transporter', r: 'mystery', st: 'tanker', s: 6, h: 7, d: 5, col: '#2b2d33', acc: '#ff8c1a', ability: 'barrels', how: 'Living On The Edge: drive an oil tanker for 20 seconds without exploding' },
  { id: 'armory', n: 'Armory', r: 'mystery', st: 'jeep', s: 4.5, h: 9, d: 6, col: '#c9b48a', acc: '#6b5a3a', how: 'The Defuser: walk over 25 landmines as Boom Boy' },
  { id: 'rodeo', n: 'Rodeo Drift', r: 'mystery', st: 'muscle', s: 7.5, h: 6, d: 6, col: '#8a5a32', acc: '#f2c14e', drift: 3, how: 'Big Airtime: flip off a river ramp' },
  { id: 'policecar', n: 'Interceptor', r: 'mystery', st: 'sports', s: 9.4, h: 6, d: 3.5, col: '#16181d', acc: '#f4f1ea', lights: true, how: 'Destroy 30 police units in one run' }
];
const CAR = Object.fromEntries(CARS.map(c => [c.id, c]));
const COPS = {
  police: { n: 'Police car', st: 'police', s: 31, hp: 70, turn: 2.0, grip: 5, mass: 1, pts: 30, col: '#f4f1ea', acc: '#16181d', lights: true, officer: 'cop' },
  policesuv: { n: 'Police SUV', st: 'suv', s: 30, hp: 120, turn: 2.1, grip: 6, mass: 1.6, pts: 45, col: '#16181d', acc: '#f4f1ea', lights: true },
  swatsuv: { n: 'SWAT SUV', st: 'suv', s: 32, hp: 130, turn: 2.2, grip: 6, mass: 1.7, pts: 60, col: '#22252c', acc: '#3a3f4a', lights: true },
  swatvan: { n: 'SWAT van', st: 'swatvan', s: 27, hp: 240, turn: 1.8, grip: 6, mass: 2.4, pts: 80, col: '#22252c', acc: '#3a3f4a', unload: 'swat' },
  sri: { n: 'SRI car', st: 'sedan', s: 35, hp: 110, turn: 2.4, grip: 6.5, mass: 1.2, pts: 90, col: '#1c2a4a', acc: '#d9b24a', lights: true, officer: 'sri' },
  srivan: { n: 'SRI van', st: 'van', s: 28, hp: 220, turn: 1.9, grip: 6, mass: 2.2, pts: 100, col: '#1c2a4a', acc: '#d9b24a', unload: 'sri' },
  humvee: { n: 'Humvee', st: 'jeep', s: 34, hp: 280, turn: 2.2, grip: 6.5, mass: 2.4, pts: 100, col: '#c9b48a', acc: '#6b5a3a' },
  humveegun: { n: 'Gun Humvee', st: 'jeep', s: 32, hp: 300, turn: 2.1, grip: 6.5, mass: 2.4, pts: 120, col: '#c9b48a', acc: '#6b5a3a', gunner: true },
  tank: { n: 'Tank', st: 'tank', s: 20, hp: 1600, turn: 1.4, grip: 9, mass: 6, pts: 300, col: '#6b7a3f', acc: '#3e4a26', cannon: true }
};
const CIVS = [
  { st: 'sedan', col: '#9fb4c8' }, { st: 'hatch', col: '#e8766e' }, { st: 'sedan', col: '#f4f1ea' }, { st: 'hatch', col: '#7fc8f8' }, { st: 'van', col: '#f2a65a' },
  { st: 'pickup', col: '#5ec2b7' }, { st: 'taxi', col: '#ffd23f' }, { st: 'sedan', col: '#b8a9e8' }, { st: 'ambulance', col: '#f4f1ea' }, { st: 'schoolbus', col: '#ffc21a' },
  { st: 'tanker', col: '#f4f1ea', oil: true }, { st: 'box', col: '#f4f1ea' }
];

/* ---------- Models ---------- */
const geoCache = new Map();
let dims = st => ({ bus: [2.7, 9.6], dbus: [2.7, 9.6], schoolbus: [2.7, 9], semi: [2.6, 8.8], tanker: [2.6, 8.8], box: [2.5, 7], limo: [2.2, 7], camper: [2.5, 6.4], garbage: [2.6, 6.6], fire: [2.5, 6.8], swatvan: [2.5, 5.4], van: [2.3, 4.8], icecream: [2.3, 4.8], ambulance: [2.4, 5.2], tank: [3.2, 5.8], tracked: [3, 5.2], launcher: [2.6, 6.6], armored: [2.5, 5.2], groomer: [2.8, 5.2], tractor: [2.4, 4.4], digger: [2.6, 5.2], quad: [1.4, 2.4], kart: [1.5, 2.6], tuk: [1.6, 3], mini: [1.9, 3.4], f1: [2, 4.8], drag: [1.9, 5.2], rocketcar: [2, 5.6], ufo: [3.4, 3.4], hover: [2.6, 4.2], monster: [2.8, 4.6], jeep: [2.5, 4.8], suv: [2.4, 4.8], police: [2.2, 4.6] }[st] || [2.2, 4.4]);
function carGeo(st, col, acc, glass, level, extra){
  const key = [st, col, acc, glass, level, extra ? JSON.stringify(extra) : ''].join('|');
  if (geoCache.has(key)) return geoCache.get(key);
  const g = new GB(), [w, l] = dims(st), hw = w / 2, hl = l / 2;
  const G = glass || '#2a3a52', DARK = '#26282e', TIRE = '#2b2d33', HUB = '#c9ccd3';
  const wheels = (r, ww, front, back, y0) => { for (const sx of [-1, 1]) for (const z of [front, back]) { g.cb(sx * (hw + ww / 2 - .25), y0 || 0, z, ww, r * 2, r * 2, TIRE); g.cb(sx * (hw + ww - .2), (y0 || 0) + r * .6, z, .1, r * .8, r * .8, HUB); } };
  const lights = (zf, zb, y, sp) => { sp = sp || .7; g.cb(-hw + sp, y, hl - .05, .5, .35, .15, '#fff3b0'); g.cb(hw - sp, y, hl - .05, .5, .35, .15, '#fff3b0'); g.cb(-hw + sp, y, -hl + .05, .5, .35, .15, '#e8473c'); g.cb(hw - sp, y, -hl + .05, .5, .35, .15, '#e8473c'); };
  const cabin = (z0, z1, y0, h, inset) => { inset = inset || .2; g.box(-hw + inset, y0, z0, hw - inset, y0 + h, z1, col); g.box(-hw + inset - .03, y0 + .15, z0 + .3, hw - inset + .03, y0 + h - .15, z1 - .3, G); g.box(-hw + inset + .2, y0 + .15, z1 - .05, hw - inset - .2, y0 + h - .15, z1 + .03, G); g.box(-hw + inset + .2, y0 + .15, z0 - .03, hw - inset - .2, y0 + h - .15, z0 + .05, G); g.box(-hw + inset, y0 + h - .02, z0, hw - inset, y0 + h + .12, z1, col); };
  const lightbar = (y, z) => { g.cb(0, y, z || 0, 1.6, .15, .5, DARK); };
  switch (st) {
    case 'pickup': case 'oldpick':
      wheels(.55, .6, hl - 1, -hl + 1); g.box(-hw, .45, -hl, hw, 1.3, hl, col); cabin(-.2, 1.2, 1.3, 1.1); g.box(-hw, 1.3, -hl, -hw + .2, 1.8, -.3, col); g.box(hw - .2, 1.3, -hl, hw, 1.8, -.3, col); g.box(-hw, 1.3, -hl, hw, 1.8, -hl + .2, col); g.box(-hw + .2, 1.29, -hl + .2, hw - .2, 1.31, -.3, acc); g.box(-hw + .3, 1.31, 1.2, hw - .3, 1.36, hl - .2, acc); lights(0, 0, .9); break;
    case 'hatch': case 'mini': case 'cheapy':
      wheels(.45, .45, hl - .8, -hl + .8); g.box(-hw, .35, -hl, hw, 1.2, hl, col); cabin(-hl + .2, hl - 1.1, 1.2, 1); lights(0, 0, .8, .55); if (st === 'mini') g.box(-hw + .2, 2.21, -hl + .3, hw - .2, 2.3, hl - 1.2, acc); break;
    case 'sedan': case 'taxi':
      wheels(.48, .5, hl - .9, -hl + .9); g.box(-hw, .38, -hl, hw, 1.15, hl, col); cabin(-1.1, 1, 1.15, .95); lights(0, 0, .8); if (st === 'taxi') { g.cb(0, 2.2, 0, .9, .4, .5, '#2b2d33'); g.cb(0, 2.2, 0, .8, .35, .55, '#ffd23f'); } break;
    case 'classic': case 'stone':
      wheels(.5, .45, hl - .9, -hl + .9); g.box(-hw, .4, -hl, hw, 1.1, hl, col); g.box(-hw - .1, .4, hl - 1.3, hw + .1, 1, hl - .3, col); cabin(-1.2, .8, 1.1, 1.1); g.cb(0, 1.12, hl - .9, 1.2, .1, 1, acc); if (st === 'stone') { g.cb(0, 2.25, 0, w, .3, 2.4, '#e9e4d8'); for (const z of [-1, 1]) g.cb(0, 1.4, z, w - .4, .2, .3, '#7a5233'); } lights(0, 0, .8); break;
    case 'sports': case 'gt': case 'wedge':
      wheels(.45, .5, hl - .8, -hl + .8); g.box(-hw, .3, -hl, hw, .95, hl, col); g.box(-hw + .1, .95, -1.5, hw - .1, 1.15, hl - .6, col); cabin(-1.2, .6, 1.1, .65, .35); g.cb(0, 1.2, -hl + .35, w - .2, .12, .5, acc); g.cb(-hw + .4, .95, -hl + .35, .15, .3, .15, acc); g.cb(hw - .4, .95, -hl + .35, .15, .3, .15, acc); lights(0, 0, .7, .5); break;
    case 'muscle': case 'derby':
      wheels(.52, .55, hl - .9, -hl + .9); g.box(-hw, .38, -hl, hw, 1.2, hl, col); cabin(-1.3, .6, 1.2, .85); g.cb(0, 1.21, hl - .9, .9, .25, 1.2, '#7d8494'); lights(0, 0, .85); break;
    case 'hotrod': case 'skull':
      for (const sx of [-1, 1]) { g.cb(sx * (hw + .05), 0, hl - .8, .5, 1, 1, TIRE); g.cb(sx * (hw + .15), 0, -hl + .9, .7, 1.5, 1.5, TIRE); }
      g.box(-hw + .3, .4, -hl, hw - .3, 1.1, hl - .2, col); g.box(-hw + .5, 1.1, hl - 2, hw - .5, 1.6, hl - .4, '#c9ccd3'); for (let k = 0; k < 3; k++) g.cb((k - 1) * .5, 1.6, hl - 1.2, .3, .5, .3, '#7d8494'); cabin(-1.6, -.2, 1.1, .9, .4); lights(0, 0, .8, .7); break;
    case 'suv': case 'police': case 'jeep':
      wheels(.58, .55, hl - 1, -hl + 1); g.box(-hw, .5, -hl, hw, 1.45, hl, col); cabin(-hl + .3, hl - 1.3, 1.45, 1.05, .15);
      if (st === 'police') { g.box(-hw - .02, .9, -1, hw + .02, 1.4, 1, acc); }
      if (st === 'jeep') { g.cb(0, 2.5, -hl + 1, w - .4, .1, 1.6, acc); g.cb(0, .9, hl + .05, w - .2, .4, .3, '#3e4a26'); }
      lights(0, 0, 1); break;
    case 'van': case 'icecream': case 'ambulance': case 'swatvan':
      wheels(.5, .5, hl - .9, -hl + .9); g.box(-hw, .4, -hl, hw, 2.6, hl, col); g.box(-hw + .2, 1.6, hl - .02, hw - .2, 2.4, hl + .04, G); g.box(-hw - .03, 1.7, hl - 1.6, hw + .03, 2.4, hl - .4, G);
      if (st === 'icecream') { g.cb(0, 2.6, -.5, .8, .5, .8, '#f2c14e'); g.cb(0, 3.1, -.5, 1, 1, 1, '#ffb3c7'); g.box(-hw - .03, 1, -1.5, hw + .03, 1.6, .5, '#f4f1ea'); }
      if (st === 'ambulance') { g.box(-hw - .03, 1.2, -1.2, hw + .03, 1.6, 1.2, '#e8473c'); g.box(-.3, 2.61, -1.3, .3, 2.65, .1, '#e8473c'); g.box(-.9, 2.61, -.9, .9, 2.65, -.3, '#e8473c'); }
      if (st === 'swatvan') { g.box(-hw - .03, .9, -hl + .4, hw + .03, 1.3, hl - .4, acc); g.cb(0, 2.6, .5, 1.6, .15, .5, DARK); }
      if (acc && (st === 'van' || st === 'avan')) g.box(-hw - .02, 1, -hl + .3, hw + .02, 1.25, hl - .3, acc);
      lights(0, 0, .9); break;
    case 'bus': case 'schoolbus': case 'dbus': case 'camper': case 'limo':
      wheels(.6, .55, hl - 1.6, -hl + 1.6);
      if (st === 'limo') { g.box(-hw, .38, -hl, hw, 1.15, hl, col); cabin(-hl + 1, hl - 1.2, 1.15, .9); lights(0, 0, .8); break; }
      g.box(-hw, .5, -hl, hw, 3.2, hl, col); g.box(-hw - .03, 1.9, -hl + .4, hw + .03, 2.8, hl - .6, G); g.box(-hw + .2, 1.9, hl - .02, hw - .2, 2.9, hl + .04, G);
      if (st === 'dbus') { g.box(-hw, 3.2, -hl, hw, 5.6, hl, col); g.box(-hw - .03, 4.2, -hl + .4, hw + .03, 5.1, hl - .4, G); g.box(-hw, 5.6, -hl, hw, 5.75, hl, acc); }
      if (st === 'schoolbus') { g.box(-hw - .03, 1.2, -hl, hw + .03, 1.4, hl, '#2b2d33'); g.box(-hw, .5, hl, hw, 1.8, hl + 1.2, col); }
      if (st === 'camper') { g.box(-hw - .02, 1, -hl, hw + .02, 1.4, hl, acc); g.cb(0, 3.2, -1, 1.6, .5, 1.6, '#c9ccd3'); }
      lights(0, 0, 1); break;
    case 'semi': case 'tanker': case 'box': case 'garbage': case 'fire': case 'launcher':
      wheels(.6, .6, hl - 1.1, -hl + 1.2); if (l > 7) wheels(.6, .6, -hl + 2.5, -hl + 1.2);
      g.box(-hw, .5, hl - 2.4, hw, 2.6, hl, col); g.box(-hw + .2, 1.6, hl - .02, hw - .2, 2.4, hl + .04, G); g.box(-hw - .03, 1.7, hl - 1.6, hw + .03, 2.4, hl - .6, G);
      g.box(-hw + .1, .5, -hl, hw - .1, .9, hl - 2.4, DARK);
      if (st === 'tanker') { g.box(-hw + .1, .9, -hl + .2, hw - .1, 3, hl - 2.7, col); g.box(-hw + .05, 1.6, -hl + .2, hw - .05, 2.1, hl - 2.7, acc); }
      else if (st === 'box' || st === 'semi') g.box(-hw, .9, -hl + .1, hw, 3.6, hl - 2.6, st === 'semi' ? acc : col);
      else if (st === 'garbage') { g.box(-hw, .9, -hl + .1, hw, 3.2, hl - 2.6, col); g.box(-hw - .02, 1.4, -hl + .3, hw + .02, 1.7, hl - 2.8, acc); }
      else if (st === 'fire') { g.box(-hw, .9, -hl + .1, hw, 2.2, hl - 2.6, col); g.box(-.4, 2.2, -hl, .4, 2.5, hl - 2.4, '#c9ccd3'); g.cb(0, 2.5, -1, .6, .6, .6, acc); }
      else if (st === 'launcher') { g.box(-hw, .9, -hl + .1, hw, 1.4, hl - 2.6, col); g.box(-.9, 1.4, -hl + .5, .9, 2.4, hl - 3, acc); for (let k = 0; k < 3; k++) g.cb((k - 1) * .55, 2.4, -1, .4, .4, 3.4, '#e8e4d8'); }
      lights(0, 0, 1); break;
    case 'armored':
      wheels(.6, .6, hl - 1, -hl + 1); g.box(-hw, .5, -hl, hw, 2.6, hl, col); g.box(-hw + .3, 1.8, hl - .02, hw - .3, 2.3, hl + .04, G); g.box(-hw - .03, 1.2, -1, hw + .03, 1.6, 1, acc); g.cb(0, 2.6, -.5, 1.2, .3, 1.2, acc); lights(0, 0, 1); break;
    case 'tank': case 'tracked':
      for (const sx of [-1, 1]) { g.box(sx * hw - (sx > 0 ? .8 : 0), 0, -hl, sx * hw + (sx < 0 ? .8 : 0), 1.2, hl, TIRE); for (let k = 0; k < 5; k++) g.cb(sx * (hw - .4), .3, -hl + .7 + k * (l - 1.4) / 4, .85, .7, .7, '#55585f'); }
      g.box(-hw + .7, .6, -hl + .2, hw - .7, 1.7, hl - .2, col); g.box(-hw + .7, 1.2, hl - .5, hw - .7, 1.5, hl + .3, acc);
      if (st === 'tracked') { g.box(-hw + .9, 1.7, -1.8, hw - .9, 2.6, .8, col); g.box(-hw - .1, .3, hl + .1, hw + .1, 1.4, hl + .6, acc); }
      break;
    case 'monster': case 'bigwheel':
      for (const sx of [-1, 1]) for (const z of [hl - 1.1, -hl + 1.1]) { g.cb(sx * (hw + .2), 0, z, 1, 2.4, 2.4, TIRE); g.cb(sx * (hw + .72), .9, z, .1, .8, .8, HUB); }
      g.box(-hw + .2, 1.6, -hl, hw - .2, 2.4, hl, col); cabin(-1, 1, 2.4, 1); g.box(-.8, .9, -hl + .5, .8, 1.6, hl - .5, DARK); lights(0, 0, 2); break;
    case 'kart': case 'quad':
      for (const sx of [-1, 1]) for (const z of [hl - .5, -hl + .5]) g.cb(sx * (hw + .05), 0, z, .45, .8, .8, TIRE);
      g.box(-hw + .2, .25, -hl + .2, hw - .2, .65, hl - .1, col); g.cb(0, .65, -.3, .9, .5, .7, acc); g.cb(0, 1.15, -.3, .55, .55, .55, '#f2c9a0'); g.cb(0, 1.55, -.3, .6, .25, .6, col); break;
    case 'tuk':
      g.cb(0, 0, hl - .4, .4, .8, .8, TIRE); for (const sx of [-1, 1]) g.cb(sx * hw, 0, -hl + .6, .4, .8, .8, TIRE);
      g.box(-hw + .1, .4, -hl + .1, hw - .1, 1.3, hl - .2, col); g.box(-hw + .1, 2.2, -hl + .1, hw - .1, 2.4, hl - .3, acc); for (const sx of [-1, 1]) g.cb(sx * (hw - .2), 1.3, hl - .5, .15, .9, .15, DARK); break;
    case 'f1':
      for (const sx of [-1, 1]) { g.cb(sx * (hw - .1), 0, hl - .8, .6, .9, .9, TIRE); g.cb(sx * (hw - .05), 0, -hl + .9, .7, 1, 1, TIRE); }
      g.box(-.5, .25, -hl + .2, .5, .75, hl, col); g.box(-hw + .4, .25, -1.2, hw - .4, .8, .6, col); g.box(-hw + .1, .3, hl - .3, hw - .1, .4, hl + .1, acc); g.box(-hw + .3, 1, -hl, hw - .3, 1.2, -hl + .5, acc); g.cb(0, .8, -.6, .5, .5, .5, '#f2c9a0'); g.cb(0, 1.1, -.6, .55, .3, .6, acc); break;
    case 'drag': case 'rocketcar':
      for (const sx of [-1, 1]) { g.cb(sx * (hw - .1), 0, hl - .6, .35, .7, .7, TIRE); g.cb(sx * (hw + .05), 0, -hl + 1, .8, 1.4, 1.4, TIRE); }
      g.box(-.6, .3, -hl + .3, .6, .85, hl, col); g.box(-hw + .3, .3, -hl + .3, hw - .3, .9, -hl + 2.2, col); cabin(-hl + 1, -hl + 2.3, .9, .6, .45); g.box(-hw + .1, 1.6, -hl, hw - .1, 1.75, -hl + .6, acc);
      if (st === 'rocketcar') { g.box(-.4, .9, -hl - .5, .4, 2.6, -hl + .8, acc); g.cb(0, .5, -hl - .1, .7, .6, .3, '#ff8c1a'); }
      break;
    case 'hover':
      g.box(-hw, 0, -hl, hw, .8, hl, '#2b2d33'); g.box(-hw + .2, .8, -hl + .3, hw - .2, 1.4, hl - .3, col); cabin(-.4, 1.2, 1.4, .8, .5); g.box(-1, 1.4, -hl + .1, 1, 2.6, -hl + .5, acc); break;
    case 'ufo':
      g.box(-hw, .8, -hl, hw, 1.4, hl, col); g.box(-hw + .5, 1.4, -hl + .5, hw - .5, 1.9, hl - .5, col); g.box(-.7, 1.9, -.7, .7, 2.6, .7, '#79e3a5'); g.cb(0, .3, 0, 1.4, .5, 1.4, acc); break;
    case 'tractor':
      for (const sx of [-1, 1]) { g.cb(sx * (hw + .1), 0, -hl + 1, .8, 2.2, 2.2, TIRE); g.cb(sx * (hw - .1), 0, hl - .7, .5, 1.1, 1.1, TIRE); }
      g.box(-.7, .6, -hl + .5, .7, 1.6, hl - .2, col); cabin(-hl + .4, -hl + 1.8, 1.6, 1.3, .4); g.box(-hw - .3, .2, hl - .1, hw + .3, 1.2, hl + .5, acc); break;
    case 'digger': case 'groomer':
      wheels(.6, .6, hl - 1.1, -hl + 1.1); g.box(-hw + .2, .6, -hl, hw - .2, 1.8, hl - 1, col); cabin(-hl + .2, 0, 1.8, 1.2, .4);
      g.box(-hw - .4, .1, hl - .6, hw + .4, st === 'groomer' ? 1.8 : 1.2, hl + .3, st === 'groomer' ? '#f4f1ea' : '#7d8494'); break;
    case 'delorean':
      wheels(.45, .5, hl - .8, -hl + .8); g.box(-hw, .35, -hl, hw, 1.1, hl, col); cabin(-1, .7, 1.1, .75, .3); g.box(-hw + .2, .7, -hl - .1, hw - .2, 1.2, -hl + .4, '#7d8494'); for (const sx of [-1, 1]) g.cb(sx * .6, .5, -hl - .2, .4, .4, .3, '#ffd23f'); lights(0, 0, .75); break;
    case 'hotdog':
      wheels(.45, .45, hl - .8, -hl + .8); g.box(-hw + .1, .35, -hl, hw - .1, .9, hl, '#f2c14e'); g.box(-hw + .3, .9, -hl - .2, hw - .3, 1.8, hl + .2, '#c4542f'); g.box(-hw + .6, 1.8, -hl, hw - .6, 2, hl, '#ffd23f'); break;
    case 'robo':
      wheels(.5, .5, hl - .9, -hl + .9); g.box(-hw, .4, -hl, hw, 1.4, hl, col); g.cb(0, 1.4, 0, 1.4, 1.2, 1.4, acc); g.cb(-.35, 2.1, .71, .3, .3, .05, '#79e3a5'); g.cb(.35, 2.1, .71, .3, .3, .05, '#79e3a5'); g.cb(0, 2.6, 0, .15, .6, .15, DARK); break;
    case 'buggy':
      wheels(.65, .6, hl - .9, -hl + .9); g.box(-hw + .3, .6, -hl + .3, hw - .3, 1.1, hl - .3, col); for (const sx of [-1, 1]) { g.box(sx * (hw - .4) - .1, 1.1, -1, sx * (hw - .4) + .1, 2.3, -.8, DARK); g.box(sx * (hw - .4) - .1, 1.1, .8, sx * (hw - .4) + .1, 2.3, 1, DARK); } g.box(-hw + .4, 2.3, -1, hw - .4, 2.45, 1, DARK); break;
    default:
      wheels(.48, .5, hl - .9, -hl + .9); g.box(-hw, .38, -hl, hw, 1.15, hl, col); cabin(-1.1, 1, 1.15, .95); lights(0, 0, .8);
  }
  if (extra && extra.stripe) g.box(-.35, 0, -hl - .01, .35, 0, hl + .01, acc, { noSides: true }), g.box(-.35, 1.16, -hl + .3, .35, 1.2, hl - .3, acc);
  if (extra && extra.plow) g.box(-hw - .3, .15, hl, hw + .3, 1.2, hl + .5, '#c9ccd3');
  // upgrade levels add visible parts like the original's level II-IV looks
  if (level >= 1) g.box(-hw + .3, 1.1, -hl - .05, hw - .3, 1.4, -hl + .25, '#2b2d33');
  if (level >= 2) for (const sx of [-1, 1]) g.cb(sx * (hw - .4), 1.4, -hl + .2, .15, .45, .15, '#2b2d33'), g.cb(0, 1.85, -hl + .2, w - .4, .12, .5, acc || '#2b2d33');
  if (level >= 3) { g.box(-hw - .1, .2, hl - .1, hw + .1, .6, hl + .35, '#7d8494'); for (const sx of [-1, 1]) g.cb(sx * .5, .3, -hl - .15, .3, .3, .3, '#5d6270'); }
  const geo = g.geometry(); geoCache.set(key, geo); return geo;
}
function lightBarParts(grp, st){
  const [w, l] = dims(st); const y = st === 'swatvan' ? 2.78 : st === 'suv' || st === 'police' ? 2.62 : 2.25;
  const r = new THREE.Mesh(CUBE, new THREE.MeshBasicMaterial({ color: '#ff2b2b' })), b = new THREE.Mesh(CUBE, new THREE.MeshBasicMaterial({ color: '#2b6bff' }));
  r.scale.set(.75, .3, .45); b.scale.set(.75, .3, .45); r.position.set(-.4, y, st === 'swatvan' ? .5 : 0); b.position.set(.4, y, st === 'swatvan' ? .5 : 0);
  grp.add(r, b); return [r, b];
}
const TURRET_GEO = (() => { const g = new GB(); g.box(-1.1, 0, -1.3, 1.1, 1, 1.1, '#5d6b36'); g.box(-.22, .35, 1.1, .22, .75, 4.2, '#3e4a26'); return g.geometry(); })();

/* ---------- Vehicle objects ---------- */
const vehicles = [];
function statsFrom(def, level){
  const up = 1 + (level || 0) * .08;
  return { top: (15 + def.s * 2.15) * Math.min(up, 1.2), hp: (70 + def.h * 26) * up, turn: 1.9 + def.d * .16, grip: Math.max(1.2, (2.6 + def.d * .5) / (def.drift || 1)), mass: massOf(def.st), accel: 1.2 + def.d * .05 };
}
function massOf(st){ return { tank: 6, tracked: 5, bus: 2.6, dbus: 2.8, schoolbus: 2.5, semi: 2.8, tanker: 2.6, box: 2.2, garbage: 2.4, fire: 2.3, launcher: 2.4, armored: 2.4, groomer: 2.6, tractor: 2.2, digger: 2.3, camper: 2, limo: 1.6, swatvan: 2.4, van: 1.5, icecream: 1.5, ambulance: 1.6, suv: 1.6, jeep: 1.8, monster: 2, quad: .6, kart: .6, tuk: .7, mini: .85, f1: .8 }[st] || 1; }
function makeVehicle(opt){
  const st = opt.st, [w, l] = dims(st);
  const grp = new THREE.Group(), body = new THREE.Mesh(carGeo(st, opt.col, opt.acc, opt.glass, opt.level || 0, opt.extra), MAT);
  body.castShadow = true; grp.add(body);
  const v = Object.assign({ st, w, l, grp, body, x: 0, z: 0, y: 0, vy: 0, a: 0, vx: 0, vz: 0, roll: 0, rollV: 0, pitch: 0, flipped: false, alive: true, sink: 0,
    hp: 100, max: 100, top: 25, turn: 2.4, grip: 5, mass: 1, accel: 1.5, team: 'civ', driver: null, steer: 0, thr: 0, lastHit: 0, stuckT: 0, revT: 0, smokeT: 0, skidL: null, skidR: null, airT: 0, onRamp: false, kind: 'civ', lightsOn: false }, opt);
  if (opt.lights) v.bar = lightBarParts(grp, st);
  if (opt.turret) { v.turret = new THREE.Mesh(TURRET_GEO, MAT); v.turret.position.y = st === 'tank' ? 1.7 : 2.6; v.turret.castShadow = true; grp.add(v.turret); }
  scene.add(grp);
  vehicles.push(v);
  return v;
}
function removeVehicle(v){ v.alive = false; scene.remove(v.grp); const i = vehicles.indexOf(v); if (i >= 0) vehicles.splice(i, 1); }
const dirX = a => Math.sin(a), dirZ = a => Math.cos(a);

/* ---------- Vehicle physics ---------- */
const GRAV = 34;
function stepVehicle(v, dt){
  if (v.heli) { stepHeli(v, dt); return; }
  if (v.boat) { stepBoat(v, dt); return; }
  const dx = Math.sin(v.a), dz = Math.cos(v.a), rx = dz, rz = -dx;
  let fwd = v.vx * dx + v.vz * dz, side = v.vx * rx + v.vz * rz;
  const grounded = v.y <= .001 && v.vy <= 0;
  if (v.sink > 0) { v.sink += dt; v.y = -v.sink * 1.6; v.vx *= .9; v.vz *= .9; v.x += v.vx * dt; v.z += v.vz * dt; syncMesh(v); return; }
  if (grounded && !v.flipped) {
    const target = v.thr >= 0 ? v.thr * v.top * (v.boost || 1) : v.thr * v.top * (v.fastReverse ? .9 : .5);
    const k = v.accel * dt * (v.thr < 0 ? 1.6 : 1);
    fwd += clamp(target - fwd, -v.top * k * 1.8, v.top * k);
    side *= Math.exp(-v.grip * (v.oiled > 0 ? .08 : 1) * dt);
    const sf = clamp(Math.abs(fwd) / 6, 0, 1) * Math.sign(fwd || 1);
    v.a = wrapA(v.a + v.steer * v.turn * sf * dt * (v.oiled > 0 ? 1.8 : 1));
    if (Math.abs(side) > 6 && Math.abs(fwd) > 8) { v.skidding = true; } else v.skidding = false;
    if (v.moto) v.lean = lerp(v.lean || 0, -v.steer * clamp(Math.abs(fwd) / 16, 0, 1) * .5, 1 - Math.exp(-dt * 8));
  } else if (v.flipped) { fwd *= Math.exp(-3 * dt); side *= Math.exp(-3 * dt); v.skidding = false; }
  else { v.skidding = false; }
  if (v.oiled > 0) v.oiled -= dt;
  v.vx = dx * fwd + rx * side; v.vz = dz * fwd + rz * side;
  v.x += v.vx * dt; v.z += v.vz * dt;
  // vertical
  if (!grounded || v.vy > 0) {
    v.vy -= GRAV * dt; v.y += v.vy * dt; v.airT += dt;
    v.roll += v.rollV * dt; v.pitch += (v.pitchV || 0) * dt;
    if (v.y <= 0) {
      v.y = 0;
      const upright = Math.cos(v.roll) * Math.cos(v.pitch) > 0;
      const impact = -v.vy;
      v.vy = 0;
      if (!upright) { v.flipped = true; v.roll = Math.PI; v.pitch = 0; onFlipped(v); }
      else { v.roll = 0; v.pitch = 0; if (v.airT > .6 && v === player.car) onLanded(v, v.airT, Math.abs(v.flipSpin || 0)); }
      v.rollV = 0; v.pitchV = 0; v.airT = 0; v.flipSpin = 0;
      if (impact > 14) { dust(v.x, v.z, 8); sfx('thud', .5); }
    }
  }
  if (v.y <= .001 && !v.flipped && v.sink === 0 && waterAt(v.x, v.z) && !v.hoverOK) { v.sink = .01; onSink(v); }
  syncMesh(v);
}
function syncMesh(v){
  v.grp.position.set(v.x, v.y + (v.flipped ? v.h2 || 1.4 : 0), v.z);
  v.grp.rotation.set(v.pitch - (v.moto && v === player.car && input.gas && Math.hypot(v.vx, v.vz) < 14 ? .12 : 0), v.a, v.roll + (v.moto && !v.flipped ? v.lean || 0 : 0), 'YXZ');
  if (v.flipped) v.grp.rotation.z = Math.PI;
}
function dust(x, z, n){ for (let k = 0; k < n; k++) emit(litPool, _pp.set(x + rnd(1.5), .3, z + rnd(1.5)), _pv.set(rnd(3), 1 + Math.random() * 2, rnd(3)), '#d9d0c0', .9, 2, .8, 0, false); }
function launch(v, up, spin, pitchSpin){ v.vy = Math.max(v.vy, up); v.y = Math.max(v.y, .05); v.rollV = spin || 0; v.pitchV = pitchSpin || 0; v.flipSpin = Math.abs(spin || 0) + Math.abs(pitchSpin || 0); }
function corners(v){
  const dx = Math.sin(v.a), dz = Math.cos(v.a), off = Math.max(0, v.l / 2 - v.w / 2);
  return [[v.x + dx * off, v.z + dz * off], [v.x - dx * off, v.z - dz * off], [v.x, v.z]];
}
// static collisions: buildings, trees, rocks; props break
function collideStatic(v, dt){
  if (v.y > 3.2 || v.boat) return;
  const rad = v.w * .52;
  const pts = corners(v);
  for (let pi = 0; pi < pts.length; pi++) {
    let [px, pz] = pts[pi];
    forNearChunks(px, pz, C => {
      for (const b of C.boxes) {
        if (v.y > b.h) continue;
        const cx = clamp(px, b.x0, b.x1), cz = clamp(pz, b.z0, b.z1);
        let nx = px - cx, nz = pz - cz, d = Math.hypot(nx, nz);
        if (d >= rad) continue;
        if (d < 1e-4) { const l = px - b.x0, r = b.x1 - px, t = pz - b.z0, bt = b.z1 - pz, m = Math.min(l, r, t, bt); nx = m === l ? -1 : m === r ? 1 : 0; nz = m === t ? -1 : m === bt ? 1 : 0; d = 0; }
        else { nx /= d; nz /= d; }
        resolveHit(v, nx, nz, rad - d, null);
        px += nx * (rad - d); pz += nz * (rad - d);
      }
      for (const c of C.circles) {
        let nx = px - c.x, nz = pz - c.z; const d = Math.hypot(nx, nz), R = rad + c.r;
        if (d >= R || d < 1e-4) continue; nx /= d; nz /= d;
        resolveHit(v, nx, nz, R - d, null); px += nx * (R - d); pz += nz * (R - d);
      }
      if (C.propMesh) for (const p of C.props) {
        if (!p.alive) continue;
        const d2 = (px - p.x) ** 2 + (pz - p.z) ** 2;
        if (d2 < (rad + p.r) ** 2) smashProp(C, p, v);
      }
    });
  }
}
function resolveHit(v, nx, nz, pen, other){
  v.x += nx * pen; v.z += nz * pen;
  const vn = v.vx * nx + v.vz * nz;
  if (vn < 0) {
    const imp = -vn;
    v.vx -= (1.25) * vn * nx; v.vz -= (1.25) * vn * nz;
    if (imp > 7) {
      const dmg = (imp - 7) * 1.6;
      damageVehicle(v, dmg, null);
      if (v === player.car && imp > 12) { sfx('crash', clamp(imp / 30, .3, 1)); shake(imp / 40); }
      if (v === player.car && v.moto && imp > 14) bailRider(v, imp);
      if (imp > 14) debris(_pp.set(v.x + nx * -1, 1, v.z + nz * -1), ['#9aa0aa', v.col || '#888'], 3, 4, .5);
    }
  }
}
// car vs car
function collideVehicles(){
  const list = vehicles.slice(), n = list.length;
  for (let i = 0; i < n; i++) {
    const a = list[i]; if (!a.alive || a.sink || Math.abs(a.y) > 3) continue;
    for (let j = i + 1; j < n; j++) {
      const b = list[j]; if (!a.alive) break; if (!b.alive || b.sink || Math.abs(b.y - a.y) > 2.5 || !!a.boat !== !!b.boat) continue;
      if (Math.abs(a.x - b.x) > 12 || Math.abs(a.z - b.z) > 12) continue;
      const pa = corners(a), pb = corners(b), ra = a.w * .55, rb = b.w * .55;
      let best = null;
      for (const p of pa) for (const q of pb) { const dx = p[0] - q[0], dz = p[1] - q[1], d = Math.hypot(dx, dz); if (d < ra + rb && (!best || d < best.d)) best = { d, dx, dz }; }
      if (!best) continue;
      const d = Math.max(best.d, .001), nx = best.dx / d, nz = best.dz / d, pen = ra + rb - d;
      const ma = a.mass, mb = b.mass, tot = ma + mb;
      a.x += nx * pen * mb / tot; a.z += nz * pen * mb / tot; b.x -= nx * pen * ma / tot; b.z -= nz * pen * ma / tot;
      const rvx = a.vx - b.vx, rvz = a.vz - b.vz, vn = rvx * nx + rvz * nz;
      if (vn >= 0) continue;
      const e = .35, jimp = -(1 + e) * vn / (1 / ma + 1 / mb);
      a.vx += jimp / ma * nx; a.vz += jimp / ma * nz; b.vx -= jimp / mb * nx; b.vz -= jimp / mb * nz;
      const imp = -vn;
      onCarCrash(a, b, imp, nx, nz);
    }
  }
}
function vehicleSmoke(v, dt){
  if (!v.alive || v.sink) return;
  const k = v.hp / v.max;
  if (k > .75) return;
  v.smokeT -= dt; if (v.smokeT > 0) return; v.smokeT = k > .5 ? .09 : k > .25 ? .06 : .035;
  const fx = v.x + Math.sin(v.a) * v.l * .3, fz = v.z + Math.cos(v.a) * v.l * .3, y = v.y + 1.6;
  if (k > .5) smoke(_pp.set(fx, y, fz), '#ecebe6', .7);
  else if (k > .25) smoke(_pp.set(fx, y, fz), Math.random() < .5 ? '#3b3b44' : '#2a2a30', .85);
  else { smoke(_pp.set(fx, y, fz), '#1e1e22', 1.05, 3.2); fire(_pp.set(fx, y - .3, fz), .75); if (Math.random() < .5) fire(_pp.set(v.x - Math.sin(v.a) * v.l * .3, v.y + 1.2, v.z - Math.cos(v.a) * v.l * .3), .5); }
}
function updateLightBars(t){
  for (const v of vehicles) if (v.bar) { const on = Math.floor(t * 6) % 2 === 0; v.bar[0].material.color.set(on ? '#ff2b2b' : '#5a1010'); v.bar[1].material.color.set(on ? '#10205a' : '#2b6bff'); }
}

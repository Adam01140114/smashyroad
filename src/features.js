/* ---------- More vehicles ---------- */
const MORE_CARS = [
  { id: 'taxi', n: 'Taxi', r: 'common', st: 'taxi', s: 6.8, h: 6, d: 6.5, col: '#ffd23f', acc: '#2b2d33', tag: 'Grabs cash from farther away' },
  { id: 'schoolbus', n: 'School Bus', r: 'common', st: 'schoolbus', s: 5, h: 9, d: 3.8, col: '#ffc21a', acc: '#2b2d33', tag: 'Slow, wide and very hard to stop' },
  { id: 'boxtruck', n: 'Box Truck', r: 'common', st: 'box', s: 5.2, h: 8.5, d: 4, col: '#f4f1ea', acc: '#3a8dde' },
  { id: 'pizza', n: 'Pizza Van', r: 'common', st: 'van', s: 6.2, h: 6.5, d: 6, col: '#e8473c', acc: '#f4f1ea' },
  { id: 'golf', n: 'Golf Cart', r: 'common', st: 'kart', s: 3.5, h: 3.5, d: 9.5, col: '#f4f1ea', acc: '#4fbf5a', tag: 'Turns on a dime' },
  { id: 'jeep2', n: 'Trail Jeep', r: 'common', st: 'jeep', s: 6.4, h: 7.8, d: 7, col: '#2fa36b', acc: '#16181d' },
  { id: 'ambulance', n: 'Ambulance', r: 'rare', st: 'ambulance', s: 7, h: 8, d: 5.5, col: '#f4f1ea', acc: '#e8473c', ability: 'heal', lights: true, tag: 'Repairs itself as it drives' },
  { id: 'firetruck', n: 'Fire Truck', r: 'rare', st: 'fire', s: 5.8, h: 9.2, d: 4.5, col: '#d9302c', acc: '#c9ccd3', lights: true, tag: 'A wall of steel' },
  { id: 'hearse', n: 'Hearse', r: 'rare', st: 'limo', s: 6.6, h: 7.5, d: 5, col: '#16181d', acc: '#5d6270' },
  { id: 'lowrider', n: 'Lowrider', r: 'rare', st: 'classic', s: 6.5, h: 6.5, d: 6.5, col: '#a05ce0', acc: '#ffd23f', drift: 1.8, tag: 'Floats through corners' },
  { id: 'nighthawk', n: 'Night Hawk', r: 'rare', st: 'muscle', s: 8.4, h: 7, d: 5.5, col: '#22252c', acc: '#ff8c1a', stripe: true },
  { id: 'cabrio', n: 'Cabriolet', r: 'rare', st: 'sports', s: 7.8, h: 5, d: 7.8, col: '#5ec2b7', acc: '#f4f1ea' },
  { id: 'crusher', n: 'Crusher', r: 'epic', st: 'monster', s: 6.5, h: 9.6, d: 5, col: '#ff8c1a', acc: '#16181d', plow: 1.6, tag: 'Rolls right over cops' },
  { id: 'viper', n: 'Viper', r: 'epic', st: 'sports', s: 9.3, h: 5.5, d: 8.4, col: '#d9302c', acc: '#16181d', stripe: true, tag: 'Fast and planted' },
  { id: 'rallyx', n: 'Rally X', r: 'epic', st: 'hatch', s: 8.6, h: 6.5, d: 9.2, col: '#3a8dde', acc: '#ffd23f', stripe: true, drift: 2, tag: 'Built to slide sideways' }
];
{ const at = CARS.findIndex(c => c.r === 'mystery'); CARS.splice(at, 0, ...MORE_CARS); for (const c of MORE_CARS) CAR[c.id] = c; }
const ROAD_POOL = CARS.filter(c => c.r !== 'mystery' && c.st !== 'ufo' && c.st !== 'hover');
function rollRoadCar(){
  const t = Math.random() * 100, rar = t < 1.2 ? 'legendary' : t < 8 ? 'epic' : t < 30 ? 'rare' : 'common';
  return pick(Math.random, ROAD_POOL.filter(c => c.r === rar));
}
// any car in the catalogue, ready to drive, with its own stats and handling
function carFromDef(id, x, z, a, level){
  const d = CAR[id], lvl = level || 0, st = statsFrom(d, lvl);
  const v = makeVehicle({ st: d.st, col: d.col, acc: d.acc, glass: d.glass, level: lvl, extra: { stripe: d.stripe, plow: d.plow && d.st !== 'digger' && d.st !== 'groomer' && d.st !== 'tracked' && d.st !== 'tractor' ? 1 : 0 }, lights: d.lights, turret: d.ability === 'cannon', x, z, a });
  Object.assign(v, { hp: st.hp, max: st.hp, top: st.top, fullTop: st.top, turn: st.turn, grip: st.grip, mass: st.mass, accel: st.accel, def: d, plow: d.plow || (d.low ? 1 : 0), low: d.low, hoverOK: !!d.hover, ability: d.ability, fastReverse: d.fastReverse, col: d.col, isTank: d.ability === 'cannon', team: 'civ', driver: null, kind: 'parked' });
  if (d.st === 'tracked') v.mass = 5;
  return v;
}

/* ---------- Damage looks ---------- */
const DMG_MAT = new THREE.MeshLambertMaterial({ vertexColors: true, color: '#5a5550' });
function vehicleDamageLook(v, dt){
  if (!v.alive || v.sink || v.heli) return;
  const k = v.hp / v.max;
  const wrecked = k < .25;
  if (wrecked !== !!v.wreckLook) {
    v.wreckLook = wrecked; v.body.material = wrecked ? DMG_MAT : MAT;
    v.body.rotation.z = wrecked ? (Math.random() < .5 ? -.07 : .07) : 0; v.body.rotation.x = wrecked ? .04 : 0; v.body.position.y = wrecked ? -.12 : 0;
  }
  if (wrecked && Math.random() < dt * 6) emit(glowPool, _pp.set(v.x + rnd(v.w * .4), v.y + 1, v.z + rnd(v.l * .3)), _pv.set(rnd(4), 3 + Math.random() * 3, rnd(4)), '#ffd23f', .2, .05, .35, 16, false);
}

/* ---------- Power-ups ---------- */
const POWER = {
  repair: { n: 'Repair kit', c: '#4fbf5a', icon: 'FIX', car: true },
  heart: { n: 'Medkit', c: '#ff4b3e', icon: '+1', foot: true },
  cash: { n: 'Cash bag', c: '#4fbf5a', icon: '$$' },
  nitro: { n: 'Nitro', c: '#2f80ed', icon: 'NOS', car: true },
  magnet: { n: 'Cash magnet', c: '#ff8c1a', icon: 'MAG' },
  spikes: { n: 'Spike strips', c: '#7d8494', icon: 'SPK', car: true },
  shield: { n: 'Shield', c: '#7fdcff', icon: 'SHD' },
  shock: { n: 'Shockwave', c: '#ffd23f', icon: 'BOOM' },
  ghost: { n: 'Ghost mode', c: '#b8a9e8', icon: 'GHO' }
};
const POWER_BY_RAR = { common: ['repair', 'heart', 'cash'], rare: ['nitro', 'magnet', 'spikes', 'speed', 'run'], epic: ['shield', 'shock', 'ghost', 'bumper', 'gloves'], legendary: ['gravity', 'jetpack', 'shield'] };
const badgeTex = new Map();
function powerBadge(kind){
  if (badgeTex.has(kind)) return badgeTex.get(kind);
  const P = POWER[kind], c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
  g.fillStyle = '#1d1f2b'; g.beginPath(); g.roundRect ? g.roundRect(6, 6, 116, 116, 26) : g.rect(6, 6, 116, 116); g.fill();
  g.fillStyle = P.c; g.beginPath(); g.roundRect ? g.roundRect(14, 14, 100, 100, 20) : g.rect(14, 14, 100, 100); g.fill();
  g.fillStyle = '#fffdf7'; g.font = `${P.icon.length > 3 ? 36 : 46}px "Lilita One", Impact, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(P.icon, 64, 68);
  const t = new THREE.CanvasTexture(c); badgeTex.set(kind, t); return t;
}
const pickups = [];
function spawnPickup(kind, x, z){
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: powerBadge(kind) })); sp.scale.set(2.6, 2.6, 1); sp.position.set(x, 2.2, z);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.6, .18, 6, 24), new THREE.MeshBasicMaterial({ color: POWER[kind].c })); ring.rotation.x = Math.PI / 2; ring.position.set(x, .25, z);
  scene.add(sp, ring);
  const o = { kind, x, z, sp, ring }; pickups.push(o); return o;
}
function clearPickups(){ for (const o of pickups) { scene.remove(o.sp, o.ring); o.ring.geometry.dispose(); } pickups.length = 0; }
function applyPower(kind){
  const car = player.car, P = POWER[kind];
  sfx('pickup');
  switch (kind) {
    case 'repair': if (car) { car.hp = Math.min(car.max, car.hp + car.max * .5); floatText('REPAIRED', P.c); } else { player.hearts = Math.min(player.maxH, player.hearts + 1); floatText('+1 HEART', '#ff4b3e'); } return;
    case 'heart': player.maxH = Math.max(player.maxH, player.hearts + 1); player.hearts = Math.min(player.maxH, player.hearts + 1); floatText('+1 HEART', '#ff4b3e'); return;
    case 'cash': { const v = 10 * R.level; R.cash += v; save.cash += v; save.stats.cashTotal += v; sfx('cash'); floatText('+$' + v, '#4fbf5a'); return; }
    case 'nitro': player.nitroT = 8; floatText('NITRO!', P.c); return;
    case 'magnet': player.magnetT = 20; floatText('CASH MAGNET', P.c); return;
    case 'spikes': player.spikeT = 15; floatText('SPIKE STRIPS', P.c); return;
    case 'shield': player.shieldT = 10; floatText('SHIELD', P.c); return;
    case 'ghost': player.ghostT = 10; floatText('GHOST MODE', P.c); for (const v of vehicles) if (v.team === 'cop') v.wander = null; return;
    case 'shock': shockwave(); floatText('SHOCKWAVE', P.c); return;
  }
}
function shockwave(){
  const o = currentPos(); if (!o) return;
  flashAt(_pp.set(o.x, 1, o.z), 40); shake(.8); sfx('boom', .8);
  for (let k = 0; k < 40; k++) { const a = k / 40 * Math.PI * 2; emit(glowPool, _pp.set(o.x, 1, o.z), _pv.set(Math.cos(a) * 30, 2, Math.sin(a) * 30), '#ffd23f', .8, .2, .6, 0, false); }
  for (const v of vehicles.slice()) { if (v === player.car || v.team !== 'cop' || !v.alive) continue; const d = Math.hypot(v.x - o.x, v.z - o.z); if (d > 30) continue; const ang = Math.atan2(v.x - o.x, v.z - o.z), k = 1 - d / 30; v.vx += Math.sin(ang) * 40 * k; v.vz += Math.cos(ang) * 40 * k; launch(v, 8 + 8 * k, (Math.random() - .5) * 10, 0); damageVehicle(v, 50 * k, 'player'); }
  for (const p of people) if (p.team === 'cop' && Math.hypot(p.x - o.x, p.z - o.z) < 30) { const ang = Math.atan2(p.x - o.x, p.z - o.z); knockPerson(p, Math.sin(ang) * 16, Math.cos(ang) * 16, 9); }
}
const SPIKE_GEO = (() => { const g = new GB(); g.box(-2.6, 0, -.5, 2.6, .12, .5, '#2b2d33'); for (let k = -2; k <= 2; k++) g.cb(k, .12, 0, .25, .3, .25, '#c9ccd3'); return g.geometry(); })();
const spikes = [];
function updatePowers(dt){
  const o = currentPos();
  player.nitroT = Math.max(0, (player.nitroT || 0) - dt); player.magnetT = Math.max(0, (player.magnetT || 0) - dt);
  player.spikeT = Math.max(0, (player.spikeT || 0) - dt); player.shieldT = Math.max(0, (player.shieldT || 0) - dt); player.ghostT = Math.max(0, (player.ghostT || 0) - dt);
  // roadside pickups
  for (let i = pickups.length - 1; i >= 0; i--) {
    const pk = pickups[i]; pk.sp.position.y = 2.2 + Math.sin(R.time * 3 + i) * .3; pk.ring.rotation.z += dt * 2;
    if (!o) continue;
    const d = Math.hypot(pk.x - o.x, pk.z - o.z);
    if (d < (player.car ? player.car.w * .5 + 2 : 2) && (o.y || 0) < 4) { applyPower(pk.kind); scene.remove(pk.sp, pk.ring); pk.ring.geometry.dispose(); pickups.splice(i, 1); }
    else if (d > 170) { scene.remove(pk.sp, pk.ring); pk.ring.geometry.dispose(); pickups.splice(i, 1); }
  }
  // nitro flames
  const car = player.car;
  if (car && player.nitroT > 0 && !car.heli) for (const s of [-.5, .5]) emit(glowPool, _pp.set(car.x - Math.sin(car.a) * car.l * .55 + Math.cos(car.a) * s, .6, car.z - Math.cos(car.a) * car.l * .55 - Math.sin(car.a) * s), _pv.set(-Math.sin(car.a) * 8 + rnd(1), 1, -Math.cos(car.a) * 8 + rnd(1)), pick(Math.random, ['#7fdcff', '#2f80ed', '#ffffff']), .6, .1, .25, 0, false);
  // spike strips behind the car
  if (car && player.spikeT > 0 && !car.heli) { player.spikeCD = (player.spikeCD || 0) - dt; if (player.spikeCD <= 0) { player.spikeCD = .7; const m = new THREE.Mesh(SPIKE_GEO, MAT); const x = car.x - Math.sin(car.a) * (car.l * .6 + 1.5), z = car.z - Math.cos(car.a) * (car.l * .6 + 1.5); m.position.set(x, .02, z); m.rotation.y = car.a + Math.PI / 2; scene.add(m); spikes.push({ m, x, z, t: 20 }); } }
  for (let i = spikes.length - 1; i >= 0; i--) {
    const s = spikes[i]; s.t -= dt; let hit = false;
    for (const v of vehicles) if (v.team === 'cop' && v.alive && v.y < 1 && Math.hypot(v.x - s.x, v.z - s.z) < 3) { v.top *= .55; v.oiled = 2; v.a += (Math.random() - .5); damageVehicle(v, 12, 'player'); sfx('break', .5); debris(_pp.set(v.x, .5, v.z), ['#2b2d33'], 6, 4, .3); hit = true; break; }
    if (hit || s.t <= 0) { scene.remove(s.m); spikes.splice(i, 1); }
  }
  // shield bubble
  if (!shieldMesh.parent) scene.add(shieldMesh);
  shieldMesh.visible = player.shieldT > 0 && !!o;
  if (shieldMesh.visible) { shieldMesh.position.set(o.x, (o.y || 0) + 1.2, o.z); const s = player.car ? Math.max(player.car.l, 4) * .7 : 1.8; shieldMesh.scale.setScalar(s * (1 + Math.sin(R.time * 10) * .03)); shieldMesh.material.opacity = player.shieldT < 2 && Math.floor(R.time * 8) % 2 ? .08 : .25; }
}
const shieldMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 2), new THREE.MeshBasicMaterial({ color: '#7fdcff', transparent: true, opacity: .25, depthWrite: false }));
function onChunkPowers(C){
  if (state !== 'play') return;
  for (const p of C.powers || []) if (Math.random() < .7) spawnPickup(pick(Math.random, ['repair', 'repair', 'heart', 'cash', 'cash', 'nitro', 'nitro', 'magnet', 'spikes', 'shield', 'shock', 'ghost']), p.x, p.z);
}

/* ---------- Helicopters you can steal ---------- */
const HELI_COLS = [['#f4f1ea', '#e8473c'], ['#2f80ed', '#f4f1ea'], ['#ffd23f', '#2b2d33'], ['#e8473c', '#f4f1ea'], ['#2b2d33', '#ff8c1a']];
const FLY_ALT = 28;
function heliBodyGeo(col, acc){
  const g = new GB();
  g.box(-1.3, .6, -2.2, 1.3, 2.9, 2.2, col); g.box(-1.15, 1.2, 2.1, 1.15, 2.7, 2.7, '#7fc8f8'); g.box(-1.32, 1.5, -1.2, 1.32, 2.2, 1.6, '#7fc8f8');
  g.box(-.35, 1.5, -7, .35, 2.2, -2.2, col); g.box(-.18, 1.8, -7.3, .18, 3.6, -6.6, acc); g.box(-1.2, 1.9, -7.1, 1.2, 2.1, -6.6, acc);
  g.box(-1.6, 0, -1.8, -1.35, .25, 1.8, '#2b2d33'); g.box(1.35, 0, -1.8, 1.6, .25, 1.8, '#2b2d33');
  for (const x of [-1.45, 1.45]) for (const z of [-1.2, 1.2]) g.box(x - .08, .2, z - .08, x + .08, .7, z + .08, '#2b2d33');
  g.box(-1.31, .9, -2.2, 1.31, 1.2, 2.2, acc); g.cb(0, 2.9, 0, .5, .45, .5, '#2b2d33');
  return g.geometry();
}
const HELI_ROTOR = new THREE.BoxGeometry(12, .12, .55), TAIL_ROTOR = new THREE.BoxGeometry(.1, 2.6, .3);
function makeHeli(x, z, a, cols){
  const v = makeVehicle({ st: 'heli', col: cols[0], acc: cols[1], x, z, a });
  v.body.geometry = heliBodyGeo(cols[0], cols[1]);
  const rot = new THREE.Mesh(HELI_ROTOR, new THREE.MeshLambertMaterial({ color: '#2b2d33' })); rot.position.y = 3.4; v.grp.add(rot);
  const rot2 = new THREE.Mesh(HELI_ROTOR, rot.material); rot2.position.y = 3.4; rot2.rotation.y = Math.PI / 2; v.grp.add(rot2);
  const tr = new THREE.Mesh(TAIL_ROTOR, rot.material); tr.position.set(.3, 2.6, -7); v.grp.add(tr);
  Object.assign(v, { heli: true, w: 3.2, l: 6.5, hp: 320, max: 320, top: 42, turn: 1.9, grip: 3, mass: 2.2, accel: 1, team: 'civ', driver: null, kind: 'parked', def: { n: 'Helicopter', st: 'heli' }, col: cols[0], rotors: [rot, rot2, tr], rotorSp: 0, gunCD: 0 });
  return v;
}
function stepHeli(v, dt){
  const me = v === player.car;
  const { steer, both } = me ? steerInput() : { steer: 0, both: false };
  if (me) {
    const target = both ? 0 : FLY_ALT;
    v.rotorSp = Math.min(40, v.rotorSp + dt * 25);
    if (v.rotorSp > 20) v.y += clamp(target - v.y, -9 * dt, 7 * dt);
    const lift = clamp(v.y / FLY_ALT, 0, 1);
    if (v.y > 2) v.a = wrapA(v.a + steer * v.turn * dt);
    const sp = both ? 0 : v.top * lift * (player.nitroT > 0 ? 1.4 : 1) * (input.gas ? 1.3 : .8);
    v.vx += (Math.sin(v.a) * sp - v.vx) * Math.min(1, dt * 1.5); v.vz += (Math.cos(v.a) * sp - v.vz) * Math.min(1, dt * 1.5);
    v.roll = lerp(v.roll, -steer * .35 * lift, Math.min(1, dt * 5)); v.pitch = lerp(v.pitch, .12 * lift * (both ? -1 : 1), Math.min(1, dt * 3));
    v.vy = 0;
    if (v.y < .05) { v.y = 0; v.vx *= .8; v.vz *= .8; }
    heliGun(v, dt);
  } else if (v.y > 0) {
    // abandoned in the air: it drops out of the sky
    v.vy -= GRAV * .6 * dt; v.y += v.vy * dt; v.rotorSp = Math.max(0, v.rotorSp - dt * 10); v.roll += dt * 1.5;
    if (v.y <= 0) { v.y = 0; destroyVehicle(v, 'crash'); return; }
  } else { v.rotorSp = Math.max(0, v.rotorSp - dt * 8); v.vx *= .9; v.vz *= .9; }
  v.x += v.vx * dt; v.z += v.vz * dt;
  v.rotors[0].rotation.y += v.rotorSp * dt; v.rotors[1].rotation.y += v.rotorSp * dt; v.rotors[2].rotation.x += v.rotorSp * 2 * dt;
  if (me && v.rotorSp > 10 && Math.random() < dt * 10) sfx('heli', .6);
  if (me && v.y < 6 && v.rotorSp > 20 && Math.random() < .4) emit(litPool, _pp.set(v.x + rnd(6), .3, v.z + rnd(6)), _pv.set(rnd(8), .5, rnd(8)), '#d9d0c0', .8, 2, .6, 0, false);
}
// your helicopter's chin gun shoots back at police helicopters
function heliGun(v, dt){
  v.gunCD -= dt; if (v.gunCD > 0 || v.y < 8) return;
  let best = null, bd = 55;
  for (const o of aircraft) if (o.kind === 'copheli' && !o.downed) { const d = Math.hypot(o.x - v.x, o.z - v.z); if (d < bd) { bd = d; best = o; } }
  if (!best) return;
  v.gunCD = .12; tracer(v.x, v.y + .8, v.z, best.x, best.y, best.z, '#ffe066');
  sfx('shot', .25);
  if (Math.random() < .55) { best.hp -= 7; sparksAt(best.x, best.y, best.z); if (best.hp <= 0) downCopHeli(best); }
}
function tracer(x0, y0, z0, x1, y1, z1, col){
  for (let k = 1; k <= 6; k++) { const t = k / 7; emit(glowPool, _pp.set(lerp(x0, x1, t), lerp(y0, y1, t), lerp(z0, z1, t)), _pv.set(0, 0, 0), col, .22, .05, .08, 0, false); }
}
function sparksAt(x, y, z){ for (let k = 0; k < 5; k++) emit(glowPool, _pp.set(x, y, z), _pv.set(rnd(6), rnd(6), rnd(6)), '#ffd23f', .3, .05, .3, 8, false); }
function downCopHeli(o){
  if (o.downed) return;
  o.downed = true; o.vy = 0; addScore(150); R.kills++; floatText('+150', '#ffd23f', o.x, o.z);
  boomFx(_pp.set(o.x, o.y, o.z), 1.4); sfx('boom', .8);
}
// armed police helicopters hunt you whenever you fly
function updateCopHelis(dt){
  const v = player.car, flying = v && v.heli && v.y > 6;
  const n = aircraft.filter(o => o.kind === 'copheli' && !o.downed).length;
  R.copHeliT = (R.copHeliT || 0) - dt;
  if (flying && n < Math.min(4, 1 + Math.floor(R.level / 3)) && R.copHeliT <= 0 && !R.over) { R.copHeliT = 4; const o = makeAir('copheli'); if (o) { o.y = v.y + 3; o.hp = 120; o.fireT = 2; toast('Police helicopter inbound'); } }
  for (let i = aircraft.length - 1; i >= 0; i--) {
    const o = aircraft[i]; if (o.kind !== 'copheli') continue;
    if (o.downed) { o.vy -= GRAV * .5 * dt; o.y += o.vy * dt; o.grp.rotation.z += dt * 4; o.grp.position.y = o.y; smoke(_pp.set(o.x, o.y, o.z), '#2a2a30', 1.2); if (o.y <= 0) { explode(o.x, o.z, 8, 1.6, 'player'); scene.remove(o.grp); aircraft.splice(i, 1); } continue; }
    const tgt = currentPos(); if (!tgt) continue;
    if (!flying) { o.leaveT = (o.leaveT || 0) + dt; if (o.leaveT > 8) { scene.remove(o.grp); aircraft.splice(i, 1); continue; } }
    else o.leaveT = 0;
    o.ang = (o.ang || 0) + dt * .7;
    const hx = tgt.x + Math.cos(o.ang + i) * 22, hz = tgt.z + Math.sin(o.ang + i) * 22, ty = (tgt.y || 0) + 3;
    const dd = Math.hypot(hx - o.x, hz - o.z), k = Math.min(1, 46 * dt / Math.max(dd, .01));
    o.x += (hx - o.x) * k; o.z += (hz - o.z) * k; o.y += (ty - o.y) * Math.min(1, dt * 1.5);
    o.grp.position.set(o.x, o.y, o.z); o.grp.rotation.y = Math.atan2(tgt.x - o.x, tgt.z - o.z);
    if (o.grp.userData.rotor) o.grp.userData.rotor.rotation.y += dt * 30;
    o.fireT -= dt;
    if (flying && o.fireT <= 0 && !R.over) {
      o.fireT = 1 + Math.random() * .3;
      tracer(o.x, o.y - .5, o.z, tgt.x, tgt.y + 1, tgt.z, '#ff5a3c'); sfx('shot', .2);
      if (Math.random() < .35) { damageVehicle(v, 4, 'cop'); sparksAt(tgt.x, tgt.y + 1, tgt.z); }
    }
  }
}

/* ---------- Parachute ---------- */
function chuteMesh(){
  const g = new GB(); g.box(-2.4, 4.2, -1.5, 2.4, 4.7, 1.5, '#ff4b3e'); g.box(-2.4, 4.7, -1.5, -.8, 4.8, 1.5, '#fffdf7'); g.box(.8, 4.7, -1.5, 2.4, 4.8, 1.5, '#fffdf7');
  for (const x of [-2.2, 2.2]) for (const z of [-1.3, 1.3]) g.box(x * .55 - .03, 1.9, z * .3 - .03, x * .55 + .03, 4.2, z * .3 + .03, '#e9e4d8');
  const m = new THREE.Mesh(g.geometry(), MAT); m.castShadow = true; return m;
}
function openChute(p){ p.chute = chuteMesh(); p.grp.add(p.chute); p.vy = 0; toast('Parachute!'); sfx('whoosh'); }
function updateChute(p, dt, steer){
  p.a = wrapA(p.a + steer * 1.8 * dt);
  p.vx = Math.sin(p.a) * 9; p.vz = Math.cos(p.a) * 9;
  p.x += p.vx * dt; p.z += p.vz * dt; p.y = Math.max(0, p.y - 5.5 * dt);
  p.chute.rotation.z = Math.sin(R.time * 2) * .08 - steer * .15;
  if (p.y <= 0) { p.grp.remove(p.chute); p.chute.geometry.dispose(); p.chute = null; player.invT = Math.max(player.invT, 1.5); }
}

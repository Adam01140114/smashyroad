/* ---------- Boats ---------- */
const BOAT_COLS = [['#f4f1ea', '#e8473c'], ['#ffd23f', '#2b2d33'], ['#5ec2b7', '#f4f1ea'], ['#ff8c1a', '#f4f1ea'], ['#2b2d33', '#ffd23f']];
const WATER_Y = -.95;
const boatGeoCache = new Map();
function boatGeo(col, acc, police){
  const key = col + acc + police; if (boatGeoCache.has(key)) return boatGeoCache.get(key);
  const g = new GB();
  // hull narrows toward the bow (+z)
  g.box(-1.25, 0, -2.8, 1.25, .9, 1.4, col);
  g.box(-1.0, 0, 1.4, 1.0, .9, 2.3, col); g.box(-.65, .1, 2.3, .65, .9, 3.0, col); g.box(-.3, .25, 3.0, .3, .9, 3.4, col);
  g.box(-1.27, .45, -2.8, 1.27, .65, 1.4, acc); g.box(-1.02, .45, 1.4, 1.02, .65, 2.3, acc);
  g.box(-1.05, .9, -2.6, 1.05, .95, 1.6, '#c9a46a');
  g.box(-1.0, .95, .4, 1.0, 1.7, .55, '#7fc8f8');
  g.box(-.9, .95, -1.2, -.2, 1.5, -.5, '#f4f1ea'); g.box(.2, .95, -1.2, .9, 1.5, -.5, '#f4f1ea');
  g.box(-.35, .4, -3.3, .35, 1.6, -2.8, '#2b2d33'); g.box(-.15, -.2, -3.2, .15, .4, -3.0, '#2b2d33');
  if (police) { g.box(-1.0, .95, -.3, 1.0, 2.1, .4, '#f4f1ea'); g.box(-1.28, .7, -2.6, 1.28, .85, 1.2, '#f4f1ea'); }
  const geo = g.geometry(); boatGeoCache.set(key, geo); return geo;
}
function makeBoat(x, z, a, cols){
  const v = makeVehicle({ st: 'boat', col: cols[0], acc: cols[1], x, z, a });
  v.body.geometry = boatGeo(cols[0], cols[1], false);
  Object.assign(v, { boat: true, w: 2.5, l: 6.4, y: WATER_Y, hp: 320, max: 320, top: 32, fullTop: 32, turn: 2.1, grip: 1.6, mass: 1.3, accel: 1.1, team: 'civ', driver: null, kind: 'parked', def: { n: 'Speedboat', st: 'boat', s: 7, h: 6, d: 5 }, col: cols[0] });
  return v;
}
function spawnCopBoat(armed, x, z){
  const tgt = currentPos();
  const v = spawnCop(armed ? 'humveegun' : 'police', x, z, tgt ? Math.atan2(tgt.x - x, tgt.z - z) : 0);
  v.body.geometry = boatGeo(armed ? '#1c2a4a' : '#2f5fb0', armed ? '#d9b24a' : '#f4f1ea', true);
  Object.assign(v, { boat: true, w: 2.5, l: 6.4, y: WATER_Y, hp: armed ? 260 : 180, max: armed ? 260 : 180, top: armed ? 33 : 31, turn: 1.9, grip: 1.7, mass: 1.4, accel: 1.3, kind: armed ? 'gunboat' : 'policeboat', def: { n: armed ? 'Gunboat' : 'Police boat', pts: armed ? 90 : 60 }, officer: null, unload: null, gunner: armed, cannon: false, spawnT: R.time });
  if (!armed && !v.bar) v.bar = lightBarParts(v.grp, 'boat');
  if (v.bar) for (const b of v.bar) b.position.y = 2.25;
  return v;
}
function stepBoat(v, dt){
  const dx = Math.sin(v.a), dz = Math.cos(v.a), rx = dz, rz = -dx;
  let fwd = v.vx * dx + v.vz * dz, side = v.vx * rx + v.vz * rz;
  const target = v.thr >= 0 ? v.thr * v.top * (v.boost || 1) : v.thr * v.top * .4;
  fwd += clamp(target - fwd, -v.top * v.accel * dt, v.top * v.accel * dt * .7);
  side *= Math.exp(-v.grip * dt);
  const sf = clamp(Math.abs(fwd) / 5, 0, 1) * Math.sign(fwd || 1);
  v.a = wrapA(v.a + v.steer * v.turn * sf * dt);
  v.vx = dx * fwd + rx * side; v.vz = dz * fwd + rz * side;
  const nx = v.x + v.vx * dt, nz = v.z + v.vz * dt;
  const bow = boatWaterAt(nx + dx * v.l * .45, nz + dz * v.l * .45) || fwd < 0, stern = boatWaterAt(nx - dx * v.l * .45, nz - dz * v.l * .45) || fwd > 0;
  if (boatWaterAt(nx, nz) && bow && stern) { v.x = nx; v.z = nz; }
  else {
    // ran aground: thump off the bank
    const sp = Math.hypot(v.vx, v.vz);
    if (sp > 12) { damageVehicle(v, (sp - 12) * 1.5, null); if (v === player.car) { sfx('thud', .6); shake(.25); } }
    v.vx *= -.25; v.vz *= -.25;
  }
  const t = R.time + v.x * .05;
  // duck under bridges so the hull never shows through the road deck
  const bt = (x, z) => bridgeTile(tileOf(x), tileOf(z));
  const under = bt(v.x, v.z) || bt(v.x + dx * v.l * .6, v.z + dz * v.l * .6) || bt(v.x - dx * v.l * .6, v.z - dz * v.l * .6);
  v.duck = lerp(v.duck || 0, under ? 1 : 0, Math.min(1, dt * 7));
  v.y = WATER_Y - v.duck * 2.2 + Math.sin(t * 2.2) * .07 * (1 - v.duck);
  v.roll = clamp(side * .025, -.25, .25) + Math.sin(t * 1.7) * .04;
  v.pitch = -clamp(fwd * .006, -.1, .18) + Math.sin(t * 2.6) * .025;
  // wake and spray
  const sp = Math.abs(fwd);
  if (sp > 4 && Math.random() < .8) {
    const bx = v.x - dx * v.l * .5, bz = v.z - dz * v.l * .5;
    emit(litPool, _pp.set(bx + rnd(.6), -.9, bz + rnd(.6)), _pv.set(rnd(1.5) - dx * 2, .6, rnd(1.5) - dz * 2), '#ffffff', .55 + sp * .015, 1.6, .9, 0, false);
    if (sp > 15 && Math.random() < .5) for (const s of [-1, 1]) emit(litPool, _pp.set(v.x + dx * v.l * .35 + rx * s * 1.2, -.7, v.z + dz * v.l * .35 + rz * s * 1.2), _pv.set(rx * s * 3, 2.5, rz * s * 3), '#dff3ff', .35, .1, .4, 12, false);
  }
}
function findWaterNear(x, z, minD, maxD, tries){
  for (let k = 0; k < (tries || 30); k++) {
    const a = Math.random() * Math.PI * 2, d = minD + Math.random() * (maxD - minD), px = x + Math.cos(a) * d, pz = z + Math.sin(a) * d;
    if (boatWaterAt(px, pz) && boatWaterAt(px + 4, pz) && boatWaterAt(px - 4, pz) && boatWaterAt(px, pz + 4) && boatWaterAt(px, pz - 4) && chunkAtXZ(px, pz)) return { x: px, z: pz };
  }
  return null;
}
// police boats come after you whenever you are out on the water
function updateBoats(dt){
  const v = player.car, onWater = v && v.boat;
  const swimming = player.foot && player.foot.swimming;
  if ((!onWater && !(swimming && R.level >= 5)) || R.over) return;
  const want = Math.min(5, 2 + Math.floor(R.level / 3));
  const have = vehicles.filter(c => c.boat && c.team === 'cop' && c.driver === 'ai').length;
  R.boatT = (R.boatT || 0) - dt;
  if (have < want && R.boatT <= 0) {
    const o = currentPos(), w = findWaterNear(o.x, o.z, 45, 80, 40);
    R.boatT = 2.5;
    if (w) { const armed = R.level >= 5 && Math.random() < .5; spawnCopBoat(armed, w.x, w.z); if (!R.boatToast) { R.boatToast = true; toast('Police boats on the water!'); } }
  }
}
function onChunkBoats(C){
  if (state !== 'play') return;
  for (const b of C.boats || []) if (Math.random() < .8) { const v = makeBoat(b.x, b.z, b.a, pick(Math.random, BOAT_COLS)); v.chunk = C; C.parkedV.push(v); }
}

/* ---------- Motorcycles ---------- */
const MOTO_ST = new Set(['moto', 'chopper', 'dirt', 'superbike', 'scooter']);
const BIKES = [
  { id: 'scooter', n: 'Scooter', r: 'common', st: 'scooter', s: 4.6, h: 2.6, d: 9.2, col: '#5ec2b7', acc: '#f4f1ea', tag: 'Slow, nimble, fearless' },
  { id: 'streetbike', n: 'Street Bike', r: 'common', st: 'moto', s: 8.2, h: 3, d: 8.6, col: '#e8473c', acc: '#2b2d33', tag: 'Quick off the line' },
  { id: 'dirtbike', n: 'Dirt Bike', r: 'common', st: 'dirt', s: 7.2, h: 3.6, d: 9.2, col: '#ff8c1a', acc: '#2b2d33', drift: 1.6, tag: 'Loose and tail-happy' },
  { id: 'chopper', n: 'Chopper', r: 'rare', st: 'chopper', s: 7.6, h: 4.6, d: 6, col: '#16181d', acc: '#c9ccd3', tag: 'Heavy, long and loud' },
  { id: 'copbike', n: 'Patrol Bike', r: 'rare', st: 'moto', s: 8.8, h: 3.6, d: 8.2, col: '#f4f1ea', acc: '#2f5fb0', tag: 'Stolen from the motor pool' },
  { id: 'superbike', n: 'Superbike', r: 'epic', st: 'superbike', s: 9.8, h: 2.7, d: 8.8, col: '#ffd23f', acc: '#16181d', tag: 'Fastest thing on two wheels' }
];
{ const at = CARS.findIndex(c => c.r === 'mystery'); CARS.splice(at, 0, ...BIKES); for (const c of BIKES) CAR[c.id] = c; ROAD_POOL.push(...BIKES); }
const _dims0 = dims;
dims = st => MOTO_ST.has(st) ? (st === 'chopper' ? [.95, 3.1] : [.9, 2.6]) : _dims0(st);
const _mass0 = massOf;
massOf = st => MOTO_ST.has(st) ? .5 : _mass0(st);
const _carGeo0 = carGeo;
carGeo = (st, col, acc, glass, level, extra) => {
  if (!MOTO_ST.has(st)) return _carGeo0(st, col, acc, glass, level, extra);
  const key = ['bike', st, col, acc, level].join('|');
  if (geoCache.has(key)) return geoCache.get(key);
  const g = new GB(), l = st === 'chopper' ? 3.1 : 2.6, hl = l / 2, TIRE = '#2b2d33', DARK = '#26282e', CHROME = '#c9ccd3';
  const wr = st === 'dirt' ? .5 : st === 'scooter' ? .32 : .44, fr = st === 'chopper' ? hl + .25 : hl - .4;
  g.cb(0, 0, fr, .22, wr * 2, wr * 2, TIRE); g.cb(0, 0, -hl + .45, st === 'chopper' ? .32 : .26, wr * 2.05, wr * 2.05, TIRE);
  g.cb(0, wr * .7, fr, .24, wr * .6, wr * .6, CHROME); g.cb(0, wr * .7, -hl + .45, .28, wr * .6, wr * .6, CHROME);
  const y0 = wr * 1.1;
  g.box(-.16, y0, -hl + .5, .16, y0 + .3, hl - .5, DARK);
  if (st === 'scooter') { g.box(-.3, y0, -hl + .3, .3, y0 + .55, .2, col); g.box(-.28, y0, .2, .28, y0 + .2, hl - .3, col); g.box(-.2, y0 + .2, hl - .55, .2, y0 + 1.1, hl - .35, col); g.box(-.24, y0 + .55, -.8, .24, y0 + .72, 0, '#2b2d33'); }
  else if (st === 'superbike') { g.box(-.3, y0 + .1, -.2, .3, y0 + .75, hl - .3, col); g.box(-.22, y0 + .75, hl - .7, .22, y0 + 1.0, hl - .35, '#7fc8f8'); g.box(-.24, y0 + .5, -hl + .3, .24, y0 + .72, -.2, '#2b2d33'); g.box(-.2, y0 + .72, -hl + .2, .2, y0 + .9, -hl + .7, col); }
  else if (st === 'chopper') { g.box(-.28, y0 + .3, .1, .28, y0 + .65, .9, col); g.box(-.24, y0 + .2, -1, .24, y0 + .4, .1, '#5a3a24'); g.box(-.05, y0, fr - .1, .05, y0 + 1.3, fr, CHROME); g.box(-.55, y0 + 1.25, fr - .45, .55, y0 + 1.33, fr - .35, CHROME); g.box(-.2, y0 + .4, -1.1, .2, y0 + 1.3, -.95, CHROME); }
  else { const tall = st === 'dirt' ? .25 : 0; g.box(-.27, y0 + .3 + tall, -.1, .27, y0 + .62 + tall, .65, col); g.box(-.23, y0 + .3 + tall, -.95, .23, y0 + .48 + tall, -.1, '#2b2d33'); g.box(-.2, y0 + .45 + tall, -hl + .15, .2, y0 + .55 + tall, -.7, col); g.box(-.24, y0 + .25, hl - .62, .24, y0 + .85 + tall, hl - .38, acc); }
  if (st !== 'chopper') { g.box(-.05, y0 - .2, fr - .08, .05, y0 + 1.05, fr + .02, CHROME); g.box(-.42, y0 + 1.0, fr - .35, .42, y0 + 1.07, fr - .25, DARK); }
  g.cb(0, y0 + .55, (st === 'chopper' ? fr : hl - .32) + .03, .2, .18, .06, '#fff3b0'); g.cb(0, y0 + .5, -hl + .12, .18, .12, .06, '#e8473c');
  g.box(.2, y0 - .1, -hl + .25, .3, y0 + .05, -.2, CHROME);
  const geo = g.geometry(); geoCache.set(key, geo); return geo;
};
function addRider(v, def){
  const m = new THREE.Mesh(personGeo(def), MAT); m.castShadow = true;
  m.position.set(0, .45, -.35); m.rotation.x = .28; m.scale.setScalar(.92);
  v.grp.add(m); v.rider = m; v.moto = true;
}
const _carFromDef0 = carFromDef;
carFromDef = (id, x, z, a, level) => {
  const v = _carFromDef0(id, x, z, a, level);
  if (MOTO_ST.has(v.st)) { addRider(v, pick(Math.random, PEDS)); v.rider.visible = false; v.grip *= 1.1; v.accel *= 1.35; }
  return v;
};
function bailRider(v, imp){
  if (player.car !== v || R.over || !v.moto) return;
  const vx = v.vx, vz = v.vz;
  exitCar();
  const p = player.foot; if (!p) return;
  player.invT = 0; p.x = v.x; p.z = v.z;
  knockPerson(p, vx * .55 + rnd(3), vz * .55 + rnd(3), 7 + imp * .15);
  v.vx *= .4; v.vz *= .4; launch(v, 3, (Math.random() < .5 ? 1 : -1) * 5, 0);
  toast('Thrown off the bike!');
}

/* ---------- Your sidearm (on foot) ---------- */
const GUN_GEO = (() => { const g = new GB(); g.box(-.07, -.82, -.05, .07, -.68, .45, '#26282e'); g.box(-.06, -.95, -.02, .06, -.8, .1, '#26282e'); return g.geometry(); })();
function playerGun(dt){
  const p = player.foot;
  player.gunCD = (player.gunCD || 0) - dt;
  if (p && !p.gun) { p.gun = new THREE.Mesh(GUN_GEO, MAT); p.rig.armR.add(p.gun); }
  if (!p || p.down > 0 || p.swimming || p.chute || !input.fire || player.gunCD > 0 || R.over) return;
  // aim assist: nearest cop or police vehicle, preferring whatever is in front of you
  let best = null, bs = 1e9;
  const fx = Math.sin(p.a), fz = Math.cos(p.a);
  const consider = (o, r) => { const dx = o.x - p.x, dz = o.z - p.z, d = Math.hypot(dx, dz); if (d > 34 || d < .5) return; const s = d - (dx * fx + dz * fz) / d * 10; if (s < bs) { bs = s; best = o; } };
  for (const q of people) if (q.team === 'cop' && q.alive && !q.dying && q.down <= 0) consider(q);
  for (const v of vehicles) if (v.team === 'cop' && v.alive && !v.sink) consider(v);
  let ang = p.a;
  if (best) { const t = Math.hypot(best.x - p.x, best.z - p.z) / 85; ang = Math.atan2(best.x + (best.vx || 0) * t - p.x, best.z + (best.vz || 0) * t - p.z); }
  ang += (Math.random() - .5) * .05;
  player.gunCD = .17;
  const b = throwProj('bullet', p.x + Math.sin(ang) * .9, p.z + Math.cos(ang) * .9, Math.sin(ang) * 85, Math.cos(ang) * 85, 'player');
  b.y = 1.25; b.dmg = 10;
  p.aim = .35; p.faceA = ang; p.faceT = .35;
  emit(glowPool, _pp.set(p.x + Math.sin(ang) * 1.1, 1.3, p.z + Math.cos(ang) * 1.1), _pv.set(0, 0, 0), '#fff3b0', .45, .1, .06, 0, false);
  sfx('shot', .55);
}

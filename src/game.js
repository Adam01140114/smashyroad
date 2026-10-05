/* ---------- Characters ---------- */
const CHARS = [
  { id: 'rookie', n: 'Rookie', r: 'common', hearts: 3, run: 17.1, swim: 5.8, stam: 25, shirt: '#3a8dde', pants: '#2b2d33', skin: '#f2c9a0', hat: null },
  { id: 'granny', n: 'Granny', r: 'common', hearts: 2, run: 13.3, swim: 5.1, stam: 20, shirt: '#b8a9e8', pants: '#5d6270', skin: '#f2d2b0', hat: '#e9e4d8' },
  { id: 'cowpoke', n: 'Cowpoke', r: 'common', hearts: 3, run: 18.1, swim: 5.8, stam: 25, shirt: '#c4542f', pants: '#3a5a8a', skin: '#e6b48a', hat: '#8a5a32' },
  { id: 'bigguy', n: 'Big Guy', r: 'rare', hearts: 5, run: 14.3, swim: 5.1, stam: 25, shirt: '#2fa36b', pants: '#2b2d33', skin: '#c99a6e', hat: null, big: true },
  { id: 'robokid', n: 'Robo Kid', r: 'rare', hearts: 3, run: 19, swim: 4.4, stam: 18, shirt: '#b8c0cc', pants: '#7d8494', skin: '#c9ccd3', hat: '#3a8dde' },
  { id: 'clown', n: 'Funnybones', r: 'epic', hearts: 5, run: 17.1, swim: 5.8, stam: 25, shirt: '#ff4b9a', pants: '#ffd23f', skin: '#f4f1ea', hat: '#e8473c' },
  { id: 'stunt', n: 'Stuntman', r: 'epic', hearts: 4, run: 20, swim: 6.5, stam: 30, shirt: '#f4f1ea', pants: '#e8473c', skin: '#e6b48a', hat: '#e8473c' },
  { id: 'speedy', n: 'Speedy Pete', r: 'legendary', hearts: 3, run: 26.6, swim: 7.3, stam: 30, shirt: '#ffd23f', pants: '#3a8dde', skin: '#f2c9a0', hat: null, tag: 'Fastest runner' },
  { id: 'boom', n: 'Boom Boy', r: 'legendary', hearts: 7, run: 17.1, swim: 5.8, stam: 25, shirt: '#e8473c', pants: '#2b2d33', skin: '#c99a6e', hat: '#2b2d33', mineProof: true, tag: 'Seven hearts, landmines can\'t hurt him' },
  { id: 'lucky', n: 'Lucky Lou', r: 'legendary', hearts: 4, run: 18.1, swim: 7.3, stam: 60, shirt: '#79e3a5', pants: '#f4f1ea', skin: '#f2c9a0', hat: '#ffd23f', lucky: true, tag: 'Airdrops every 10 seconds, rarer loot' },
  { id: 'fizz', n: 'Professor Fizz', r: 'legendary', hearts: 4, run: 17.1, swim: 5.8, stam: 25, shirt: '#f4f1ea', pants: '#5d6270', skin: '#f2d2b0', hat: '#9aa0aa', potions: true, tag: 'Throws exploding potions on foot' },
  { id: 'rocky', n: 'Rocky Roll', r: 'legendary', hearts: 4, run: 17.1, swim: 5.8, stam: 25, shirt: '#8a6a45', pants: '#5d6270', skin: '#c99a6e', hat: null, boulders: true, tag: 'Boulders roll out behind him on foot' },
  { id: 'diver', n: 'Diver Dee', r: 'mystery', hearts: 3, run: 18.1, swim: 16, stam: 999, shirt: '#2b2d33', pants: '#2b2d33', skin: '#f2c9a0', hat: '#ffd23f', how: 'Swim 1,000 m in total' },
  { id: 'alien', n: 'Visitor', r: 'mystery', hearts: 3, run: 22.8, swim: 8.7, stam: 999, shirt: '#5d6b36', pants: '#3e4a26', skin: '#79e3a5', hat: null, how: 'Reach the alien invasion (score 4,500)' }
];
const CHAR = Object.fromEntries(CHARS.map(c => [c.id, c]));

/* ---------- Save ---------- */
const SAVE = 'gb-save-v1';
const save = Object.assign({ cash: 0, best: 0, owned: { pickup: true }, upg: {}, car: 'pickup', chars: { rookie: true }, char: 'rookie', letters: [], missions: {}, goals: {}, stats: { totalScore: 0, kills: 0, swim: 0, cashTotal: 0, flips: 0, mines: 0, smashed: 0, runs: 0 }, hourly: 0, daily: 0, spun: false }, store.get(SAVE, {}));
save.stats = Object.assign({ totalScore: 0, kills: 0, swim: 0, cashTotal: 0, flips: 0, mines: 0, smashed: 0, runs: 0 }, save.stats || {});
function persist(){ store.set(SAVE, save); }
const upLevel = id => { const p = save.upg[id] || 0; return p >= 6 ? 3 : p >= 4 ? 2 : p >= 2 ? 1 : 0; };

/* ---------- Run state ---------- */
const WANT = [0, 70, 150, 280, 450, 725, 1200, 1900, 2800, 4500];
const PPS = [1, 2, 3, 5, 7, 10, 13, 17, 21, 50];
const LETTERS = 'GETAWAY'.split('');
const player = { car: null, foot: null, alive: true, hearts: 3, maxH: 3, char: CHAR.rookie, invT: 0, stamina: 25, swimDist: 0, copT: 0, armT: 0, armBy: null, deckUsed: false, boostSpd: 1, bumperT: 0, glovesT: 0, jetT: 0, gravShots: 0, fastRun: 1, timeT: 0 };
const R = { score: 0, scoreF: 0, level: 1, cash: 0, kills: 0, police: 0, smashed: 0, time: 0, over: false, slow: 1, collected: new Set(), dropT: 25, debugT: 0, anchor: { x: 0, z: 0 }, warnT: 0, bomberT: 15, apacheT: 8, ufoT: 0, mineT: 0, blockT: 12, heliT: 6, crashPtsT: 0, oilT: 0, tankMission: null, oilMission: 0, flipsRun: 0, greyByCar: false };
let state = 'menu';
const people = [], projs = [], aircraft = [], mines = [], puddles = [], drops = [], letterObjs = [], holes = [];

/* ---------- People ---------- */
const personGeoCache = new Map();
function personGeo(c){
  const key = [c.shirt, c.pants, c.skin, c.hat, c.big, c.helmet, c.mask].join('|');
  if (personGeoCache.has(key)) return personGeoCache.get(key);
  const g = new GB(), s = c.big ? 1.25 : 1;
  g.cb(-.22 * s, 0, 0, .3 * s, .75, .35, c.pants); g.cb(.22 * s, 0, 0, .3 * s, .75, .35, c.pants);
  g.cb(0, .75, 0, .8 * s, .85, .45 * s, c.shirt);
  g.cb(-.52 * s, .85, 0, .22, .7, .25, c.shirt); g.cb(.52 * s, .85, 0, .22, .7, .25, c.shirt);
  g.cb(0, 1.6, 0, .55, .55, .55, c.skin);
  g.cb(-.12, 1.78, .28, .08, .1, .02, '#16181d'); g.cb(.12, 1.78, .28, .08, .1, .02, '#16181d');
  if (c.hat) g.cb(0, 2.15, 0, .6, .18, .62, c.hat);
  if (c.helmet) g.cb(0, 2.0, 0, .64, .32, .64, c.helmet);
  if (c.mask) g.cb(0, 1.62, .28, .45, .25, .05, c.mask);
  const geo = g.geometry(); personGeoCache.set(key, geo); return geo;
}
const OFFICERS = {
  cop: { shirt: '#2f5fb0', pants: '#1c2a4a', skin: '#f2c9a0', hat: '#1c2a4a', run: 13, shoots: true, rate: 1.7, acc: .4, dmg: 3, hp: 1, footOnly: true },
  swat: { shirt: '#2b2d33', pants: '#22252c', skin: '#e6b48a', helmet: '#16181d', run: 14, shoots: true, rate: 1.4, acc: .55, dmg: 5, hp: 2 },
  sri: { shirt: '#1c2a4a', pants: '#16181d', skin: '#f2c9a0', hat: null, run: 18, shoots: true, rate: .55, acc: .75, dmg: 6, hp: 2 },
  soldier: { shirt: '#6b7a3f', pants: '#4a5530', skin: '#c99a6e', helmet: '#4a5530', run: 15.5, shoots: true, rate: .35, acc: .85, dmg: 8, hp: 3 },
  alien: { shirt: '#5d6b36', pants: '#3e4a26', skin: '#79e3a5', mask: '#2b2d33', run: 19, shoots: true, rate: .3, acc: .85, dmg: 9, hp: 3, plasma: true }
};
/* jointed blocky characters: legs and arms pivot at hips and shoulders so they can run, swim and tumble */
const rigCache = new Map();
function rigGeos(c){
  const key = [c.shirt, c.pants, c.skin, c.hat, c.big, c.helmet, c.mask].join('|');
  if (rigCache.has(key)) return rigCache.get(key);
  const s = c.big ? 1.25 : 1;
  const leg = new GB(); leg.box(-.15 * s, -.62, -.17, .15 * s, 0, .17, c.pants); leg.box(-.16 * s, -.75, -.2, .16 * s, -.62, .22, '#2b2d33');
  const torso = new GB(); torso.box(-.4 * s, 0, -.22 * s, .4 * s, .85, .22 * s, c.shirt); torso.box(-.4 * s, -.02, -.23 * s, .4 * s, .12, .23 * s, '#2b2d33');
  const head = new GB(); head.box(-.275, 0, -.275, .275, .55, .275, c.skin);
  head.box(-.17, .26, .275, -.07, .36, .29, '#16181d'); head.box(.07, .26, .275, .17, .36, .29, '#16181d');
  if (c.hat) { head.box(-.3, .5, -.31, .3, .68, .31, c.hat); head.box(-.3, .5, .2, .3, .56, .45, c.hat); }
  if (c.helmet) head.box(-.32, .38, -.32, .32, .7, .32, c.helmet);
  if (c.mask) head.box(-.22, .08, .275, .22, .3, .32, c.mask);
  const arm = new GB(); arm.box(-.11, -.55, -.12, .11, 0, .12, c.shirt); arm.box(-.1, -.7, -.11, .1, -.55, .11, c.skin);
  const out = { leg: leg.geometry(), torso: torso.geometry(), head: head.geometry(), arm: arm.geometry(), s };
  rigCache.set(key, out); return out;
}
function makeRig(def){
  const G = rigGeos(def), s = G.s, root = new THREE.Group();
  const mk = (geo, parent, x, y, z) => { const m = new THREE.Mesh(geo, MAT); m.castShadow = true; m.position.set(x, y, z); parent.add(m); return m; };
  const body = new THREE.Group(); root.add(body);
  const legL = mk(G.leg, body, -.2 * s, .75, 0), legR = mk(G.leg, body, .2 * s, .75, 0);
  const torso = new THREE.Group(); torso.position.y = .75; body.add(torso);
  mk(G.torso, torso, 0, 0, 0);
  const head = mk(G.head, torso, 0, .85, 0);
  const armL = mk(G.arm, torso, -.52 * s, .8, 0), armR = mk(G.arm, torso, .52 * s, .8, 0);
  return { root, body, legL, legR, torso, head, armL, armR, ph: Math.random() * 6 };
}
function makePerson(def, x, z, team){
  const rig = makeRig(def), grp = rig.root;
  scene.add(grp);
  const p = { def, team, x, z, y: 0, vy: 0, a: Math.random() * 6, vx: 0, vz: 0, grp, rig, alive: true, down: 0, roll: 0, hp: def.hp || 1, fireCD: 1 + Math.random(), walkT: Math.random() * 6, swimming: false, ko: 0, spd: 0, lx: x, lz: z, aim: 0, rollDir: 1 };
  people.push(p); return p;
}
function removePerson(p){ p.alive = false; scene.remove(p.grp); const i = people.indexOf(p); if (i >= 0) people.splice(i, 1); }
function knockPerson(p, vx, vz, up){
  if (p.down > 0) return;
  if (p === player.foot && (player.invT > 0 || player.shieldT > 0 || p.chute)) return;
  p.down = p === player.foot ? 1.1 : 2.2; p.vx = vx; p.vz = vz; p.vy = up; p.roll = 0; p.rollDir = Math.random() < .5 ? 1 : -1;
  if (p === player.foot) { hurtPlayer(1); player.invT = Math.max(player.invT, 1.1); }
  else if (p.team === 'cop') { p.hp--; if (p.hp <= 0) { addScore(10); removeLater(p); } }
}
function removeLater(p){ p.dying = true; }
const lerpTo = (obj, prop, target, k) => { obj[prop] += (target - obj[prop]) * k; };
const HIT_MAT = new THREE.MeshBasicMaterial({ color: '#ff3b30' });
function stepPerson(p, dt){
  if (p.down > 0) {
    p.down -= dt; p.vy -= GRAV * dt; p.y = Math.max(0, p.y + p.vy * dt);
    if (p.y === 0) { p.vx *= .85; p.vz *= .85; }
    p.x += p.vx * dt; p.z += p.vz * dt; p.roll = Math.min(Math.PI / 2, p.roll + dt * 9);
    if (p.down <= 0) {
      p.roll = 0;
      if (p.dying) { debris(_pp.set(p.x, .5, p.z), [p.def.shirt, p.def.skin], 5, 4, .35); removePerson(p); return; }
      if (p === player.foot) player.invT = Math.max(player.invT, 2.4);
    }
  }
  if (dt > 0) { const moved = Math.hypot(p.x - p.lx, p.z - p.lz) / dt; p.spd += (Math.min(moved, 40) - p.spd) * Math.min(1, dt * 12); }
  p.lx = p.x; p.lz = p.z;
  const water = waterAt(p.x, p.z);
  p.swimming = water && p.y <= .01 && p.down <= 0;
  animatePerson(p, dt);
  p.grp.position.set(p.x, p.y + p.bob, p.z);
  if (p.hitT > 0 || p.wasHit) {
    p.hitT = (p.hitT || 0) - dt; const on = p.hitT > 0;
    if (on !== p.wasHit) { p.wasHit = on; p.grp.traverse(o => { if (o.isMesh) o.material = on ? HIT_MAT : MAT; }); }
  }
  if (p.faceT > 0) p.faceT -= dt;
  p.grp.rotation.set(0, p.faceT > 0 ? p.faceA : p.a, 0);
  p.grp.visible = !(p === player.foot && ((player.invT > 0 && Math.floor(R.time * 12) % 2 === 0 && p.down <= 0) || (camMode === 2 && state === 'play')));
}
function animatePerson(p, dt){
  const g = p.rig, k = 1 - Math.exp(-dt * 14), sp = p.spd;
  let legL = 0, legR = 0, armL = 0, armR = 0, armLz = 0, armRz = 0, lean = 0, bodyX = 0, bodyZ = 0;
  p.bob = 0;
  if (p.down > 0) {
    // tumbling ragdoll: flat on the back with limbs flung out
    bodyX = -p.roll; bodyZ = p.roll * .25 * p.rollDir;
    armLz = -1.3; armRz = 1.3; legL = .5; legR = -.3; armL = -.6; armR = .4;
    p.bob = .25 * (p.roll / (Math.PI / 2));
  } else if (p.swimming) {
    // front crawl: body flat, arms windmill, legs flutter
    g.ph += dt * (3 + sp * .45);
    lean = 1.35; legL = 1.35 + Math.sin(g.ph * 2.2) * .35; legR = 1.35 - Math.sin(g.ph * 2.2) * .35;
    armL = g.ph % (Math.PI * 2); armR = (g.ph + Math.PI) % (Math.PI * 2);
    g.armL.rotation.x = armL; g.armR.rotation.x = armR;
    p.bob = -1.55 + Math.sin(g.ph * 2) * .06;
  } else if (p === player.foot && player.jetT > 0) {
    legL = .25; legR = .15; armLz = -.6; armRz = .6; lean = .25;
  } else if (sp > .8) {
    // running: stride and arm swing scale with speed
    g.ph += dt * (4 + sp * .55);
    const amp = clamp(.5 + sp * .045, .5, 1.25);
    legL = Math.sin(g.ph) * amp; legR = -Math.sin(g.ph) * amp;
    armL = -Math.sin(g.ph) * amp * .9; armR = Math.sin(g.ph) * amp * .9;
    lean = clamp(sp * .018, .05, .35);
    p.bob = Math.abs(Math.sin(g.ph)) * (.08 + sp * .006);
  } else {
    g.ph += dt * 2; lean = 0; armLz = -.06; armRz = .06;
    p.bob = Math.sin(g.ph) * .015;
  }
  if (p.aim > 0) { p.aim -= dt; armR = -1.5; armRz = 0; }
  if (p === player.foot && player.glovesT > 0 && p.down <= 0) { armL = -1.4; armR = -1.4; }
  lerpTo(g.legL.rotation, 'x', legL, k); lerpTo(g.legR.rotation, 'x', legR, k);
  if (!p.swimming) { lerpTo(g.armL.rotation, 'x', armL, k); lerpTo(g.armR.rotation, 'x', armR, k); }
  lerpTo(g.armL.rotation, 'z', armLz, k); lerpTo(g.armR.rotation, 'z', armRz, k);
  lerpTo(g.torso.rotation, 'x', lean, k);
  lerpTo(g.body.rotation, 'x', bodyX, p.down > 0 ? 1 : k); lerpTo(g.body.rotation, 'z', bodyZ, p.down > 0 ? 1 : k);
  g.body.position.y = 0;
}
// person vs static world (simple push out)
function collidePersonStatic(p){
  forNearChunks(p.x, p.z, C => {
    for (const b of C.boxes) { if (p.x > b.x0 - .4 && p.x < b.x1 + .4 && p.z > b.z0 - .4 && p.z < b.z1 + .4) { const l = p.x - b.x0 + .4, r = b.x1 + .4 - p.x, t = p.z - b.z0 + .4, bt = b.z1 + .4 - p.z, m = Math.min(l, r, t, bt); if (m === l) p.x -= l; else if (m === r) p.x += r; else if (m === t) p.z -= t; else p.z += bt; } }
    for (const c of C.circles) { const dx = p.x - c.x, dz = p.z - c.z, d = Math.hypot(dx, dz), R2 = c.r + .4; if (d < R2 && d > 1e-4) { p.x = c.x + dx / d * R2; p.z = c.z + dz / d * R2; } }
  });
}

/* ---------- Player control ---------- */
const input = { left: false, right: false };
function steerInput(){ const l = input.left, r = input.right; return { steer: (l ? 1 : 0) - (r ? 1 : 0), both: l && r }; }
function playerUpdate(dt){
  const { steer, both } = steerInput();
  player.invT = Math.max(0, player.invT - dt);
  if (player.car) {
    const v = player.car;
    // automatic reverse when pinned against something, like the original
    if (!both && Math.abs(v.vx * Math.sin(v.a) + v.vz * Math.cos(v.a)) < 1.2 && R.time > 1) { v.stuckT += dt; if (v.stuckT > .9) { v.revT = .9; v.stuckT = 0; } } else v.stuckT = 0;
    if (v.revT > 0) { v.revT -= dt; v.thr = -1; v.steer = -steer; }
    else { v.thr = both ? -1 : (input.gas ? 1 : .7); v.steer = both ? -steer : steer; }
    v.boost = player.boostSpd * (player.nitroT > 0 ? 1.45 : 1) * (input.gas && !both ? 1.12 : 1);
    abilities(v, dt);
    if (v.skidding) {
      const dx = Math.sin(v.a), dz = Math.cos(v.a), rx = dz, rz = -dx, bx = v.x - dx * v.l * .35, bz = v.z - dz * v.l * .35;
      const L = [bx - rx * v.w * .4, bz - rz * v.w * .4], Rr = [bx + rx * v.w * .4, bz + rz * v.w * .4];
      if (v.skidL) { skid(v.skidL[0], v.skidL[1], L[0], L[1], .22); skid(v.skidR[0], v.skidR[1], Rr[0], Rr[1], .22); }
      v.skidL = L; v.skidR = Rr;
    } else v.skidL = null;
  } else if (player.foot) {
    const p = player.foot, c = player.char;
    if (p.chute) { updateChute(p, dt, steer); return; }
    if (p.down <= 0) {
      p.a = wrapA(p.a + steer * 4.6 * dt);
      let sp = both ? 0 : (p.swimming ? c.swim : c.run * player.fastRun) * (input.gas ? 1.35 : 1);
      if (player.jetT > 0) { sp = 20; p.y = Math.max(p.y, Math.min(9, p.y + dt * 14)); p.vy = 0; }
      p.vx = Math.sin(p.a) * sp; p.vz = Math.cos(p.a) * sp;
      p.x += p.vx * dt; p.z += p.vz * dt; p.walkT += dt * sp * .5;
      if (player.jetT <= 0 && p.y > 0) { p.vy -= GRAV * dt; p.y = Math.max(0, p.y + p.vy * dt); }
      if (p.y < 1) collidePersonStatic(p);
      autoEnter(); if (!player.foot) return;
      if (p.swimming) { player.stamina -= dt; player.swimDist += sp * dt; save.stats.swim += sp * dt; if (player.stamina <= 0) endRun('DONE', 'You ran out of breath in the water.'); }
      else player.stamina = Math.min(c.stam, player.stamina + dt * 4);
      if (player.jetT > 0) { player.jetT -= dt; fire(_pp.set(p.x, p.y + .6, p.z), .4); }
      if (c.potions && R.time - (p.potT || 0) > 1.6) { p.potT = R.time; throwProj('potion', p.x, p.z, -p.vx * .3, -p.vz * .3, 'player'); }
      if (c.boulders && R.time - (p.bouT || 0) > 2.2) { p.bouT = R.time; throwProj('boulder', p.x - Math.sin(p.a) * 2, p.z - Math.cos(p.a) * 2, -Math.sin(p.a) * 14, -Math.cos(p.a) * 14, 'player'); }
    }
  }
}
function currentPos(){ return player.car ? player.car : player.foot; }
function playerSpeed(){ const o = currentPos(); return o ? Math.hypot(o.vx, o.vz) : 0; }
function hurtPlayer(n){
  if (player.invT > 0 || R.over || player.shieldT > 0) return;
  player.hearts -= n; player.invT = 1.2; shake(.8); sfx('punch'); sfx('crash', .5);
  hurtFx(1);
  const p = player.foot;
  if (p) {
    p.hitT = .35;
    for (let k = 0; k < 14; k++) emit(glowPool, _pp.set(p.x, p.y + 1.2, p.z), _pv.set(rnd(5), 2 + Math.random() * 5, rnd(5)), pick(Math.random, ['#ff2b2b', '#ff5a4d', '#c41e1e']), .28 + Math.random() * .2, .05, .5 + Math.random() * .3, 16, false);
    floatText('-' + n, '#ff4b3e', p.x, p.z);
  }
  if (player.hearts <= 0) endRun('DONE', 'You ran out of hearts.');
}
function exitCar(){
  const v = player.car; if (!v || R.over) return;
  const dx = Math.cos(v.a), dz = -Math.sin(v.a);
  let x = v.x - dx * (v.w / 2 + 1.2), z = v.z - dz * (v.w / 2 + 1.2);
  if (v.y > 2 && player.char.id === 'stunt') { R.stuntOK = true; }
  player.car = null; v.driver = null; v.thr = 0; v.steer = 0;
  if (v.rider) v.rider.visible = false;
  if (v.ability === 'oiltanker') R.oilMission = 0;
  player.foot = makePerson(player.char, x, z, 'player'); player.foot.a = v.a; player.foot.y = Math.max(0, v.y);
  player.invT = 2.5; player.exitT = R.time;
  if (v.y > 2.5) { player.foot.x = v.x; player.foot.z = v.z; player.foot.y = v.y - 1; openChute(player.foot); }
  sfx('ui');
}
function enterNearest(){
  const p = player.foot; if (!p || R.over) return;
  let best = null, bd = 5.2;
  for (const v of vehicles) { if (!v.alive || v.sink || v.flipped || !enterable(v)) continue; const d = Math.hypot(v.x - p.x, v.z - p.z) - v.w / 2; if (d < bd) { bd = d; best = v; } }
  if (!best) return false;
  return enterCar(best);
}
function touchingCar(p, v){
  for (const [cx, cz] of corners(v)) if (Math.hypot(cx - p.x, cz - p.z) < v.w * .5 + .75) return true;
  return false;
}
function autoEnter(){
  const p = player.foot; if (!p || R.over || p.down > 0 || p.chute || p.y > .5) return;
  if (R.time - (player.exitT || -9) < 1.2) return;
  for (const v of vehicles) {
    if (!v.alive || v.sink || v.flipped || !enterable(v) || Math.hypot(v.vx, v.vz) > 9) continue;
    if (p.swimming && !v.boat) continue;
    if (touchingCar(p, v)) { enterCar(v); return; }
  }
}
function enterCar(best){
  const p = player.foot; if (!p) return false;
  if (best.driver === 'civ') { const q = makePerson(pick(Math.random, PEDS), best.x + Math.cos(best.a) * 2, best.z - Math.sin(best.a) * 2, 'civ'); q.flee = 3; }
  removePerson(p); player.foot = null;
  takeCar(best);
  return true;
}
function enterable(v){ if (v === player.car) return false; if (v.team === 'cop') return v.driver == null; return true; }
function takeCar(v){
  player.car = v; v.driver = 'player'; v.team = 'player'; v.ai = null; v.kind = 'player';
  v.revT = 0; v.stuckT = 0;
  if (v.isTank) { v.ability = 'cannon'; if (!v.turret) { v.turret = new THREE.Mesh(TURRET_GEO, MAT); v.turret.position.y = 1.7; v.grp.add(v.turret); } }
  if (v.fullTop) v.top = v.fullTop;
  if (v.rider) { v.rider.geometry = personGeo(player.char); v.rider.visible = true; }
  if (v.heli) toast('Hold both sides to land. Get out to eject');
  if (v.oil) { R.oilMission = .001; toast('Drive this tanker for 20 seconds without blowing up'); }
  if (v.isTank && R.tankMission === null && !save.owned.tank) { R.tankMission = { t: 70, kills: 0 }; toast('Keep That Tank: destroy 10 enemies in 70 seconds'); }
  sfx('ui');
}
function nearEnterable(){
  const p = player.foot; if (!p) return null;
  for (const v of vehicles) { if (!v.alive || v.sink || v.flipped || !enterable(v)) continue; if (Math.hypot(v.x - p.x, v.z - p.z) - v.w / 2 < 5.2) return v; }
  return null;
}

/* ---------- Spawning: player and units ---------- */
function spawnPlayerCar(id, x, z, a){ const v = carFromDef(id, x, z, a, upLevel(id)); Object.assign(v, { team: 'player', driver: 'player', kind: 'player' }); return v; }
const PEDS = [
  { shirt: '#e8766e', pants: '#3a5a8a', skin: '#f2c9a0', hat: null }, { shirt: '#9ee09e', pants: '#5d6270', skin: '#c99a6e', hat: null }, { shirt: '#f9e07f', pants: '#2b2d33', skin: '#e6b48a', hat: '#3a8dde' },
  { shirt: '#b8a9e8', pants: '#5d6270', skin: '#8a5a3a', hat: null }, { shirt: '#f4f1ea', pants: '#3a5a8a', skin: '#f2d2b0', hat: null }, { shirt: '#ff7bac', pants: '#2b2d33', skin: '#c99a6e', hat: '#ffd23f' }
];
function spawnCop(type, x, z, a){
  const d = COPS[type];
  const v = makeVehicle({ st: d.st, col: d.col, acc: d.acc, lights: d.lights, turret: d.cannon, x, z, a });
  const lvl = R.level;
  Object.assign(v, { hp: d.hp, max: d.hp, top: d.s, turn: d.turn, grip: d.grip, mass: d.mass, accel: 1.7, team: 'cop', driver: 'ai', kind: type, def: d, ai: 'chase', jit: (Math.random() - .5) * 2, fireCD: 2 + Math.random() * 2, col: d.col, officer: d.officer, unload: d.unload, gunner: d.gunner, cannon: d.cannon, isTank: !!d.cannon });
  if (d.gunner) { const gunner = new THREE.Mesh(personGeo(OFFICERS.soldier), MAT); gunner.position.set(0, 1.6, -.8); gunner.scale.setScalar(.9); v.grp.add(gunner); }
  return v;
}
function spawnTraffic(){
  const pos = currentPos(); if (!pos) return;
  const r = findRoadNear(pos.x, pos.z, 55, 85, 12); if (!r) return;
  const col = roadCol(r.i, r.j), row = roadRow(r.i, r.j); if (col && row) return;
  const useDef = Math.random() < .78, civ = useDef ? null : pick(Math.random, CIVS);
  let a, x = r.x, z = r.z;
  if (col) { const i0 = r.i - mod(r.i, 2), cx = (i0 + 1) * TILE; const dirP = Math.random() < .5; a = dirP ? 0 : Math.PI; x = cx + (dirP ? 3 : -3); }
  else { const j0 = r.j - mod(r.j, 2), cz = (j0 + 1) * TILE; const dirP = Math.random() < .5; a = dirP ? Math.PI / 2 : -Math.PI / 2; z = cz + (dirP ? -3 : 3); }
  let v, s;
  if (useDef) {
    // a real car from the catalogue: steal it and it drives with its own speed and handling
    v = carFromDef(rollRoadCar().id, x, z, a);
    s = Math.min(27, v.fullTop * (.55 + Math.random() * .15));
    Object.assign(v, { top: s, team: 'civ', driver: 'civ', kind: 'civ', ai: 'traffic' });
  } else {
    v = makeVehicle({ st: civ.st, col: civ.col, acc: '#2b2d33', x, z, a });
    s = { semi: 18, tanker: 17, box: 18, schoolbus: 16 }[civ.st] || 21;
    Object.assign(v, { hp: 150 * massOf(civ.st), max: 150 * massOf(civ.st), top: s, fullTop: s * 1.35, turn: 2.1, grip: 7, mass: massOf(civ.st), accel: 1.2, team: 'civ', driver: 'civ', kind: 'civ', ai: 'traffic', col: civ.col, oil: !!civ.oil, def: { n: civ.oil ? 'Oil tanker' : 'Civilian car', st: civ.st, s: 5, h: 6, d: 5 } });
  }
  v.vx = Math.sin(a) * s * .7; v.vz = Math.cos(a) * s * .7;
}
function spawnPed(){
  const pos = currentPos(); if (!pos) return;
  for (let k = 0; k < 6; k++) {
    const a = Math.random() * Math.PI * 2, d = 35 + Math.random() * 30, x = pos.x + Math.cos(a) * d, z = pos.z + Math.sin(a) * d;
    const C = chunkAtXZ(x, z); if (!C || !C.side.length) continue;
    const s = pick(Math.random, C.side); const p = makePerson(pick(Math.random, PEDS), s.x + rnd(2), s.z + rnd(2), 'civ'); p.ped = true; return;
  }
}
function onChunkBuilt(C){
  C.cashM = [];
  for (const c of C.cash) {
    const key = Math.round(c.x) + ',' + Math.round(c.z); if (R.collected.has(key)) continue;
    const m = new THREE.Mesh(BILL_GEO, MAT); m.position.set(c.x, 1, c.z); m.castShadow = true; scene.add(m); C.cashM.push({ m, x: c.x, z: c.z, key });
  }
  C.parkedV = [];
  if (state === 'play') {
    for (const p of C.parked) {
      let v;
      if (p.police) { v = makeVehicle({ st: 'police', col: '#f4f1ea', acc: '#16181d', lights: true, x: p.x, z: p.z, a: p.a }); Object.assign(v, { hp: 180, max: 180, top: 31, fullTop: 31, turn: 2.2, grip: 6.5, mass: 1, accel: 1.6, team: 'none', driver: null, kind: 'parked', col: '#f4f1ea', def: { n: 'Police car', st: 'police', s: 7.5, h: 6, d: 5 } }); }
      else v = carFromDef(rollRoadCar().id, p.x, p.z, p.a);
      v.chunk = C; C.parkedV.push(v);
    }
    for (const h of C.helis || []) { const v = makeHeli(h.x, h.z, h.a, pick(Math.random, HELI_COLS)); v.chunk = C; C.parkedV.push(v); }
    onChunkBoats(C);
    onChunkPowers(C);
  }
}
function onChunkGone(C){
  for (const c of C.cashM || []) scene.remove(c.m);
  for (const v of C.parkedV || []) if (v.alive && v.driver == null && v !== player.car && v.kind === 'parked') removeVehicle(v);
}
const BILL_GEO = (() => { const g = new GB(); g.box(-1, -.08, -.55, 1, .08, .55, '#4fbf5a'); g.box(-.8, .08, -.4, .8, .1, .4, '#3a9a45'); g.box(-.18, .1, -.32, .18, .16, .32, '#16181d'); g.box(-.06, .1, -.42, .06, .16, .42, '#16181d'); return g.geometry(); })();

/* ---------- AI ---------- */
function feelerBlocked(x, z){ return waterAt(x, z) || solidAt(x, z, .6); }
function driveToward(v, tx, tz, dt, aggressive){
  const desired = Math.atan2(tx - v.x, tz - v.z);
  let diff = wrapA(desired - v.a);
  const look = 6 + Math.hypot(v.vx, v.vz) * .35;
  const blk = v.boat ? (x, z) => !boatWaterAt(x, z) : feelerBlocked;
  const f = blk(v.x + Math.sin(v.a) * look, v.z + Math.cos(v.a) * look);
  if (f) {
    const l = blk(v.x + Math.sin(v.a + .6) * look, v.z + Math.cos(v.a + .6) * look), r = blk(v.x + Math.sin(v.a - .6) * look, v.z + Math.cos(v.a - .6) * look);
    diff += !l && r ? 1.2 : !r && l ? -1.2 : (diff >= 0 ? 1.2 : -1.2);
  }
  v.steer = clamp(diff * 2.2, -1, 1);
  const fwd = v.vx * Math.sin(v.a) + v.vz * Math.cos(v.a);
  if (Math.abs(fwd) < 2 && R.time - (v.spawnT || 0) > 1.5) { v.stuckT += dt; if (v.stuckT > 1.1) { v.revT = 1 + Math.random() * .5; v.stuckT = 0; } } else v.stuckT = 0;
  if (v.revT > 0) { v.revT -= dt; v.thr = -1; v.steer = -Math.sign(diff || 1); }
  else v.thr = Math.abs(diff) > 2.2 && Math.hypot(tx - v.x, tz - v.z) < 14 ? .5 : 1;
}
function copAI(v, dt){
  const tgt = currentPos(); if (!tgt || v.flipped) { v.thr = 0; return; }
  if (v.ai === 'block') { v.thr = 0; v.steer = 0; if (Math.hypot(tgt.x - v.x, tgt.z - v.z) < 16 && v.driver === 'ai') v.ai = 'chase'; return; }
  if (v.ai === 'idle') { v.thr = 0; v.steer = 0; v.idleT -= dt; if (v.idleT <= 0) v.ai = 'chase'; return; }
  if (player.ghostT > 0) {
    if (!v.wander || Math.hypot(v.wander.x - v.x, v.wander.z - v.z) < 8) v.wander = { x: v.x + rnd(70), z: v.z + rnd(70) };
    driveToward(v, v.wander.x, v.wander.z, dt); v.thr *= .55; return;
  }
  const d = Math.hypot(tgt.x - v.x, tgt.z - v.z);
  const lead = Math.min(1.2, d / 30);
  const tx = tgt.x + tgt.vx * lead + Math.cos(v.a) * v.jit * 3, tz = tgt.z + tgt.vz * lead - Math.sin(v.a) * v.jit * 3;
  if (v.ai === 'parking') {
    // brake to a stop, then park and bail out
    v.thr = 0; v.steer = 0;
    if (Math.hypot(v.vx, v.vz) < 2.5 || R.time - v.parkT > 2.5) bailOut(v);
    return;
  }
  driveToward(v, tx, tz, dt, true);
  const crewCar = !v.cannon && !v.gunner && !v.boat;
  if (player.foot && crewCar && R.time - (v.spawnT || 0) > 1.5) {
    if (d < 24) { v.ai = 'parking'; v.parkT = R.time; v.thr = 0; return; }
    if (d < 40) v.thr = Math.min(v.thr, .7);
  }
  // in a car: an officer still steps out to arrest you when you are pinned
  if (!player.foot && v.officer && !v.unloaded && d < 11 && playerSpeed() < 4 && R.time - (v.spawnT || 0) > 2) {
    v.unloaded = true;
    const o = makePerson(OFFICERS[v.officer], v.x + Math.cos(v.a) * 2 + rnd(1), v.z - Math.sin(v.a) * 2 + rnd(1), 'cop'); o.officer = v.officer;
    v.ai = 'idle'; v.idleT = 5;
  }
  // weapons
  v.fireCD -= dt;
  if (v.cannon && d < 70 && v.fireCD <= 0 && !R.over) {
    v.fireCD = 3.2 + Math.random();
    const ang = Math.atan2(tgt.x + tgt.vx * .4 - v.x, tgt.z + tgt.vz * .4 - v.z);
    if (v.turret) v.turret.rotation.y = ang - v.a;
    throwProj('shell', v.x + Math.sin(ang) * 4, v.z + Math.cos(ang) * 4, Math.sin(ang) * 70, Math.cos(ang) * 70, 'cop');
    sfx('cannon', clamp(1 - d / 80, .2, 1));
  } else if (v.turret) v.turret.rotation.y = lerp(v.turret.rotation.y, wrapA(Math.atan2(tgt.x - v.x, tgt.z - v.z) - v.a), .1);
  if (v.gunner && d < 34 && v.fireCD <= 0 && !R.over) { v.fireCD = 1 + Math.random() * .3; shootAt(v.x, v.z, 2.2, tgt, .75, 4, 'bullet'); }
}
const CREW = { police: ['cop', 2], policesuv: ['cop', 2], swatsuv: ['swat', 2], swatvan: ['swat', 3], sri: ['sri', 2], srivan: ['sri', 3], humvee: ['soldier', 2] };
function bailOut(v){
  v.ai = 'parked'; v.driver = null; v.thr = 0; v.steer = 0;
  const crew = CREW[v.kind]; if (!crew) return;
  const onFoot = people.filter(q => q.team === 'cop').length;
  const n = Math.max(1, Math.min(crew[1], 14 - onFoot));
  const rx = Math.cos(v.a), rz = -Math.sin(v.a);
  for (let k = 0; k < n; k++) {
    const side = k % 2 ? 1 : -1, back = (Math.floor(k / 2) - .3) * 1.6;
    const o = makePerson(OFFICERS[crew[0]], v.x + rx * side * (v.w / 2 + .9) - Math.sin(v.a) * back, v.z + rz * side * (v.w / 2 + .9) - Math.cos(v.a) * back, 'cop');
    o.officer = crew[0]; o.a = v.a; o.fireCD = .6 + Math.random() * .8;
  }
  sfx('thud', .3);
}
function trafficAI(v, dt){
  if (v.ai === 'stopped' || v.flipped) { v.thr = 0; v.steer = 0; return; }
  const dx = Math.sin(v.a), dz = Math.cos(v.a), i = tileOf(v.x), j = tileOf(v.z);
  const alongZ = Math.abs(dz) > Math.abs(dx);
  // keep to the right lane
  let laneErr = 0;
  if (alongZ && roadCol(i, j)) { const i0 = i - mod(i, 2), cx = (i0 + 1) * TILE + (dz > 0 ? 3 : -3); laneErr = (v.x - cx) * (dz > 0 ? 1 : -1); }
  else if (!alongZ && roadRow(i, j)) { const j0 = j - mod(j, 2), cz = (j0 + 1) * TILE + (dx > 0 ? -3 : 3); laneErr = (v.z - cz) * (dx > 0 ? -1 : 1); }
  const want = Math.round(v.a / (Math.PI / 2)) * (Math.PI / 2);
  v.steer = clamp(wrapA(want - v.a) * 3 + laneErr * .35, -1, 1);
  // turn at junctions
  const jx = (i - mod(i, 2) + 1) * TILE, jz = (j - mod(j, 2) + 1) * TILE;
  if (roadCol(i, j) && roadRow(i, j)) {
    const key = (i - mod(i, 2)) + ',' + (j - mod(j, 2));
    if (v.lastJ !== key && Math.hypot(v.x - jx, v.z - jz) < 3.5) {
      v.lastJ = key; const opts = [0];
      for (const turn of [Math.PI / 2, -Math.PI / 2]) { const na = want + turn; if (roadAt(tileOf(jx + Math.sin(na) * 20), tileOf(jz + Math.cos(na) * 20))) opts.push(turn); }
      const t = pick(Math.random, opts); if (t) v.a = wrapA(want + t);
    }
  }
  const look = 9; const blocked = feelerBlocked(v.x + dx * look, v.z + dz * look);
  let near = false; for (const o of vehicles) { if (o === v) continue; const ox = o.x - v.x, oz = o.z - v.z; if (ox * dx + oz * dz > 0 && ox * dx + oz * dz < 9 && Math.abs(ox * dz - oz * dx) < 2.5) { near = true; break; } }
  v.thr = blocked || near ? 0 : 1;
  if (blocked && Math.hypot(v.vx, v.vz) < 1) { v.blockT = (v.blockT || 0) + dt; if (v.blockT > 3) v.ai = 'stopped'; }
}
function personAI(p, dt){
  if (p === player.foot || p.down > 0) return;
  const tgt = currentPos();
  if (p.team === 'civ') {
    let sp = 2.2;
    if (p.flee > 0) { p.flee -= dt; p.a = tgt ? Math.atan2(p.x - tgt.x, p.z - tgt.z) : p.a; sp = 7; }
    else { p.turnT = (p.turnT || 0) - dt; if (p.turnT <= 0) { p.turnT = 2 + Math.random() * 4; p.a = Math.round(Math.random() * 4) * Math.PI / 2; }
      if (tgt && Math.hypot(tgt.x - p.x, tgt.z - p.z) < 9 && playerSpeed() > 8) { p.flee = 1.2; } }
    const nx = p.x + Math.sin(p.a) * sp * dt, nz = p.z + Math.cos(p.a) * sp * dt;
    if (!solidAt(nx, nz, .3) && !waterAt(nx, nz) && (!p.ped || !roadAt(tileOf(nx), tileOf(nz)) || p.flee > 0)) { p.x = nx; p.z = nz; p.walkT += dt * sp * .5; } else p.turnT = 0;
    return;
  }
  if (!tgt || R.over) return;
  if (player.ghostT > 0 || (tgt.y || 0) > 6) return;
  const def = p.def, d = Math.hypot(tgt.x - p.x, tgt.z - p.z);
  if (p.ko > 0) { p.ko -= dt; return; }
  p.a = Math.atan2(tgt.x - p.x, tgt.z - p.z);
  const shootRange = def.shoots ? 22 : 0;
  const go = !(def.shoots && !(def.footOnly && !player.foot) && d < shootRange * .45);
  const sp = (p.swimming ? 5 : def.run);
  if (go && d > 1.2) { p.x += Math.sin(p.a) * sp * dt; p.z += Math.cos(p.a) * sp * dt; p.walkT += dt * sp * .5; collidePersonStatic(p); }
  if (def.shoots && !(def.footOnly && !player.foot)) { p.fireCD -= dt; if (d < shootRange && p.fireCD <= 0) { p.fireCD = Math.max(1, def.rate * (.7 + Math.random() * .6)); p.aim = .5; shootAt(p.x, p.z, 1.3, tgt, def.acc, def.dmg, def.plasma ? 'plasma' : 'bullet'); } }
  // arrests: reach the door or grab you on foot
  const reach = player.car ? player.car.w / 2 + 1.4 : 1.4;
  if (d < reach && (!player.car || playerSpeed() < 5)) { player.armT += dt * 2; player.armBy = p; }
}

/* ---------- Projectiles ---------- */
const PROJ_GEO = { bullet: new THREE.BoxGeometry(.25, .25, .9), plasma: new THREE.BoxGeometry(.5, .5, .5), shell: new THREE.BoxGeometry(.5, .5, 1.4), rocket: new THREE.BoxGeometry(.5, .5, 1.6), missile: new THREE.BoxGeometry(.5, .5, 1.6), bomb: new THREE.BoxGeometry(1, 1, 1.6), potion: new THREE.BoxGeometry(.6, .8, .6), boulder: new THREE.BoxGeometry(2, 2, 2), balloon: new THREE.BoxGeometry(1.2, 1.4, 1.2), barrel: new THREE.BoxGeometry(1.2, 1.6, 1.2) };
const PROJ_MAT = { bullet: new THREE.MeshBasicMaterial({ color: '#ffe066' }), plasma: new THREE.MeshBasicMaterial({ color: '#7dff6b' }), shell: new THREE.MeshBasicMaterial({ color: '#ffb347' }), rocket: new THREE.MeshLambertMaterial({ color: '#c9ccd3' }), missile: new THREE.MeshLambertMaterial({ color: '#e8473c' }), bomb: new THREE.MeshLambertMaterial({ color: '#2b2d33' }), potion: new THREE.MeshBasicMaterial({ color: '#b14bff' }), boulder: new THREE.MeshLambertMaterial({ color: '#8a7a6a' }), balloon: new THREE.MeshLambertMaterial({ color: '#ff4b9a' }), barrel: new THREE.MeshLambertMaterial({ color: '#d9483b' }) };
function throwProj(kind, x, z, vx, vz, team, opt){
  const m = new THREE.Mesh(PROJ_GEO[kind], PROJ_MAT[kind]); m.castShadow = kind !== 'bullet' && kind !== 'plasma';
  const y = kind === 'bomb' ? 22 : kind === 'boulder' ? 1 : kind === 'balloon' || kind === 'barrel' ? .8 : 1.6;
  m.position.set(x, y, z); scene.add(m);
  const p = Object.assign({ kind, x, z, y, vx, vz, vy: kind === 'potion' ? 6 : 0, team, m, life: kind === 'bullet' || kind === 'plasma' ? 1.2 : kind === 'balloon' || kind === 'barrel' ? 25 : kind === 'boulder' ? 4 : 6, target: null }, opt || {});
  projs.push(p); return p;
}
function shootAt(x, z, y, tgt, acc, dmg, kind){
  const t = Math.hypot(tgt.x - x, tgt.z - z) / 70;
  let a = Math.atan2(tgt.x + tgt.vx * t - x, tgt.z + tgt.vz * t - z) + (Math.random() - .5) * (1 - acc) * 1.2;
  const p = throwProj(kind, x, z, Math.sin(a) * 70, Math.cos(a) * 70, 'cop'); p.y = y; p.dmg = dmg;
  sfx('shot', clamp(1 - Math.hypot(tgt.x - x, tgt.z - z) / 50, .05, .4));
}
function updateProjs(dt){
  for (let i = projs.length - 1; i >= 0; i--) {
    const p = projs[i];
    p.life -= dt;
    if (p.kind === 'missile' || p.kind === 'rocket' || (p.kind === 'plasma' && p.homing)) {
      const t = p.target && (p.target.alive !== false) ? p.target : null;
      if (t) { const want = Math.atan2(t.x - p.x, t.z - p.z), cur = Math.atan2(p.vx, p.vz), sp = Math.hypot(p.vx, p.vz); const na = cur + clamp(wrapA(want - cur), -2.4 * dt, 2.4 * dt); p.vx = Math.sin(na) * sp; p.vz = Math.cos(na) * sp; if (p.kind === 'missile') p.y = Math.max(1.2, p.y - dt * 4); }
      smoke(_pp.set(p.x, p.y, p.z), '#c9ccd3', .35, .5);
    }
    if (p.kind === 'bomb') { p.vy -= GRAV * dt; }
    if (p.kind === 'potion') { p.vy -= GRAV * dt; }
    if (p.kind === 'boulder') { p.m.rotation.x += dt * 6; }
    p.x += p.vx * dt; p.z += p.vz * dt; p.y += p.vy * dt;
    p.m.position.set(p.x, p.y, p.z); p.m.rotation.y = Math.atan2(p.vx, p.vz);
    let hit = p.life <= 0 || p.y <= 0;
    // collisions
    if (!hit && p.y < 4) {
      if (solidAt(p.x, p.z, 0) && p.kind !== 'bomb') hit = true;
      for (const v of vehicles) {
        if (hit) break; if (!v.alive || v.sink) continue;
        const own = (p.team === 'cop' && v.team === 'cop') || (p.team === 'player' && v === player.car);
        if (own && p.kind !== 'shell') continue;
        if (own) continue;
        if (Math.hypot(v.x - p.x, v.z - p.z) < v.w * .7 + (p.kind === 'balloon' || p.kind === 'barrel' ? .8 : 0)) {
          if (p.kind === 'bullet' || p.kind === 'plasma') { damageVehicle(v, p.dmg || 4, p.team); sparks(p.x, p.y, p.z); removeProj(i); hit = null; break; }
          hit = true;
        }
      }
      if (hit === null) continue;
      if (!hit && player.foot && p.team === 'cop' && Math.hypot(player.foot.x - p.x, player.foot.z - p.z) < .9 && Math.abs(player.foot.y + 1 - p.y) < 1.6) { hurtPlayer(1); removeProj(i); continue; }
      if (!hit && p.team === 'player') {
        let shot = false;
        for (const q of people) if (q.team === 'cop' && !q.dying && Math.hypot(q.x - p.x, q.z - p.z) < 1.3) {
          if (p.kind === 'bullet') {
            q.hitT = .2; for (let k = 0; k < 5; k++) emit(glowPool, _pp.set(q.x, 1.2, q.z), _pv.set(rnd(4), 2 + Math.random() * 3, rnd(4)), '#ff3b30', .22, .05, .4, 14, false);
            if (q.down > 0) { q.hp--; if (q.hp <= 0) { addScore(10); q.dying = true; } } else knockPerson(q, p.vx * .08, p.vz * .08, 4);
            shot = true;
          } else hit = true;
          break;
        }
        if (shot) { removeProj(i); continue; }
      }
    }
    if (hit) {
      const big = { shell: [6, 1.3], rocket: [7, 1.5], missile: [6, 1.4], bomb: [8, 1.8], potion: [5, 1], boulder: [5, 1], balloon: [6, 1.2], barrel: [6, 1.3], plasma: [3.5, .8] }[p.kind];
      if (big && (p.life > 0 || p.kind === 'boulder' || p.kind === 'bomb')) explode(p.x, p.z, big[0], big[1], p.team);
      else if (big) explode(p.x, p.z, big[0], big[1], p.team);
      removeProj(i);
    }
  }
}
function removeProj(i){ scene.remove(projs[i].m); projs.splice(i, 1); }
function sparks(x, y, z){ for (let k = 0; k < 4; k++) emit(glowPool, _pp.set(x, y, z), _pv.set(rnd(6), Math.random() * 5, rnd(6)), '#ffe066', .25, .05, .25, 10, false); }

/* ---------- Explosions and damage ---------- */
const explodeQ = [];
function explode(x, z, rad, power, team){
  boomFx(_pp.set(x, 1, z), Math.min(2.2, power));
  sfx('boom', clamp(1.2 - dist2D(x, z) / 90, .15, 1)); shake(clamp(power * 6 / (dist2D(x, z) + 6), 0, 1));
  for (const v of vehicles.slice()) {
    if (!v.alive) continue; const d = Math.hypot(v.x - x, v.z - z); if (d > rad + v.w) continue;
    const k = 1 - clamp(d / (rad + v.w), 0, 1);
    if (v === player.car && player.bumperT > 0) continue;
    damageVehicle(v, 70 * power * k, team);
    if (v.alive && k > .25) { const ang = Math.atan2(v.x - x, v.z - z); v.vx += Math.sin(ang) * 14 * k; v.vz += Math.cos(ang) * 14 * k; launch(v, 8 + 9 * k * power / v.mass, (Math.random() < .55 * k ? (Math.random() < .5 ? 1 : -1) * (5 + 6 * k) : 0), 0); }
  }
  for (const q of people.slice()) { const d = Math.hypot(q.x - x, q.z - z); if (d < rad) { if (q === player.foot && player.char.mineProof && team === 'mine') continue; const ang = Math.atan2(q.x - x, q.z - z); knockPerson(q, Math.sin(ang) * 10, Math.cos(ang) * 10, 9); if (q.team === 'cop' && team === 'player') { q.hp = 0; q.dying = true; } } }
  forNearChunks(x, z, C => { if (!C.propMesh) return; for (const p of C.props) if (p.alive && Math.hypot(p.x - x, p.z - z) < rad) explodeQ.push([C, p]); });
}
const dist2D = (x, z) => { const o = currentPos(); return o ? Math.hypot(o.x - x, o.z - z) : 0; };
function damageVehicle(v, dmg, src){
  if (!v.alive || dmg <= 0) return;
  if (v === player.car && player.shieldT > 0) return;
  if (v === player.car && player.bumperT > 0) dmg *= .3;
  if (v === player.car) {
    // durable: one hit (or a pile-up of hits in the same instant) costs at most 10% of the vehicle's health
    if (R.time - (v.hitWin || -9) > .35) { v.hitWin = R.time; v.hitAcc = 0; }
    dmg = Math.min(dmg, Math.max(0, v.max * .1 - v.hitAcc));
    v.hitAcc += dmg;
    if (dmg <= 0) return;
  }
  v.hp -= dmg;
  if (v === player.car) { carHitFx(dmg); }
  if (v.hp <= 0) destroyVehicle(v, src);
}
function destroyVehicle(v, src){
  if (!v.alive) return;
  const big = v.mass;
  if (v.oil) { explode(v.x, v.z, 12, 2.4, 'mine'); }
  boomFx(_pp.set(v.x, 1, v.z), Math.min(2, .9 + big * .25));
  debris(_pp.set(v.x, 1, v.z), [v.col || '#888', '#2b2d33', '#5d6270'], 10 + Math.round(big * 4), 7, .7);
  sfx('boom', clamp(1.1 - dist2D(v.x, v.z) / 90, .15, 1));
  if (v === player.car) {
    if (v.def && v.ability === 'decker' && !player.deckUsed) { /* handled in arrest */ }
    const x = v.x, z = v.z, a = v.a, hy = v.y;
    removeVehicle(v); player.car = null;
    if (R.oilMission > 0) R.oilMission = 0;
    player.foot = makePerson(player.char, x + Math.cos(a) * 2, z - Math.sin(a) * 2, 'player'); player.foot.a = a;
    if (hy > 4) { player.foot.y = hy; openChute(player.foot); player.invT = 2.5; }
    else { knockPerson(player.foot, rnd(6), rnd(6), 10); player.invT = Math.max(player.invT, 2.5); }
    toast('WRECKED! Grab another ride');
    return;
  }
  if (v.team === 'cop') {
    addScore(v.def ? v.def.pts : 30); R.kills++; save.stats.kills++;
    if (v.kind === 'police' || v.kind === 'policesuv') R.police++;
    if (R.tankMission && R.tankMission.t > 0 && player.car && player.car.isTank) R.tankMission.kills++;
    if (Math.random() < .5) dropCash(v.x, v.z, 2);
  }
  removeVehicle(v);
}
function dropCash(x, z, n){
  for (let k = 0; k < n; k++) { const m = new THREE.Mesh(BILL_GEO, MAT); const c = { m, x: x + rnd(3), z: z + rnd(3), key: 'drop' + Math.random() }; m.position.set(c.x, 1, c.z); scene.add(m); looseCash.push(c); }
}
const looseCash = [];
function smashProp(C, p, v){
  breakProp(C, p);
  const cols = { bush: ['#4f9e3a', '#5fb447'], fence: ['#f4efe4'], lamp: ['#5d6270', '#fff2b0'], hydrant: ['#e8473c'], bin: ['#3f7d4f'], cone: ['#ff7b25', '#f4f1ea'], cactus: ['#4c9a52'], snowman: ['#ffffff', '#2b2d33'], hay: ['#e9c46a'], mailbox: ['#2f6fd8'], sapling: ['#5fb447', '#7a5233'], bench: ['#9a6a3f'], sign: ['#f2c14e', '#9aa0aa'], deadbush: ['#a9845a'], barrel: ['#d9483b'], pump: ['#e8473c', '#f4f1ea'] }[p.kind] || ['#888'];
  debris(_pp.set(p.x, .8, p.z), cols, 7, 5, .45);
  sfx('break', .6);
  if (v) { v.vx *= .93; v.vz *= .93; }
  if (v && v === player.car) { addScore(5); R.smashed++; save.stats.smashed++; }
  if (p.explosive) explode(p.x, p.z, p.kind === 'pump' ? 9 : 6, p.kind === 'pump' ? 1.8 : 1.2, 'mine');
  if (p.spray) R.sprays.push({ x: p.x, z: p.z, t: 4 });
}

/* ---------- Crashes, flips, landing, sinking ---------- */
function onCarCrash(a, b, imp, nx, nz){
  const pc = player.car;
  const hitDmg = (self, other) => Math.max(0, imp - 5) * 1.4 * (other.mass / self.mass);
  let da = hitDmg(a, b), db = hitDmg(b, a);
  // plows and low cars launch whatever they hit head-on
  for (const [me, them, sgn] of [[a, b, -1], [b, a, 1]]) {
    if (me !== pc || !them.alive) continue;
    const fdot = (Math.sin(me.a) * nx + Math.cos(me.a) * nz) * sgn;
    if (me.plow && fdot > .5 && imp > 6) { launch(them, 8 + imp * .35 * me.plow, (Math.random() < .5 ? 1 : -1) * (6 + Math.random() * 6), (Math.random() - .5) * 4); if (them === a) da += 25 * me.plow; else db += 25 * me.plow; }
    if (player.bumperT > 0 && imp > 3) { them.vx -= nx * 25 * sgn; them.vz -= nz * 25 * sgn; launch(them, 6, (Math.random() - .5) * 8, 0); }
  }
  if (pc === a || pc === b) {
    const other = pc === a ? b : a, mine = pc === a ? da : db;
    if (player.bumperT > 0) { if (pc === a) da *= .2; else db *= .2; }
    if (imp > 9) { sfx('crash', clamp(imp / 35, .25, 1)); shake(clamp(imp / 50, .1, .6)); }
    if (other.team === 'cop' && imp > 10 && R.time - R.crashPtsT > .6) { R.crashPtsT = R.time; addScore(15); }
    if (other.team === 'civ' && other.ai === 'traffic' && imp > 4) other.ai = 'stopped';
  } else {
    if (a.team === 'civ' && imp > 4) a.ai = 'stopped';
    if (b.team === 'civ' && imp > 4) b.ai = 'stopped';
  }
  if (imp > 8) debris(_pp.set((a.x + b.x) / 2, 1, (a.z + b.z) / 2), [a.col || '#888', b.col || '#888'], 3, 5, .45);
  damageVehicle(a, da, b.team); damageVehicle(b, db, a.team);
  if (pc && pc.moto && (pc === a || pc === b) && imp > 15) bailRider(pc, imp);
  if (a.oil && imp > 12 && a.alive) destroyVehicle(a); if (b.oil && imp > 12 && b.alive) destroyVehicle(b);
}
function onFlipped(v){ v.thr = 0; if (v.team === 'cop') { v.flipT = 0; } if (v === player.car) toast('Flipped!'); }
function onLanded(v, air, spin){
  if (air > 1) { addScore(Math.round(air * 20)); }
  if (spin > 4 && air > .9) { addScore(150); R.flipsRun++; save.stats.flips++; floatText('BIG AIR +150'); missionDone('rodeo'); }
}
function onSink(v){
  sfx('splash', clamp(1 - dist2D(v.x, v.z) / 60, .1, 1)); for (let k = 0; k < 14; k++) emit(litPool, _pp.set(v.x + rnd(1.5), .2, v.z + rnd(1.5)), _pv.set(rnd(4), 5 + Math.random() * 5, rnd(4)), '#dff3ff', .6, .2, .9, 18, false);
  if (v === player.car) {
    const x = v.x, z = v.z, a = v.a; player.car = null; v.driver = null;
    player.foot = makePerson(player.char, x, z, 'player'); player.foot.a = a;
    toast('Splash! Swim for it');
  } else if (v.team === 'cop') { addScore(v.def ? v.def.pts : 30); R.kills++; save.stats.kills++; if (v.kind === 'police' || v.kind === 'policesuv') R.police++; }
  setTimeout(() => { if (v.alive) removeVehicle(v); }, 2500);
}

/* ---------- Score, wanted level, end ---------- */
function addScore(n){ if (R.over) return; R.scoreF += n; }
function updateScore(dt){
  if (R.over) return;
  R.scoreF += PPS[R.level - 1] * dt;
  R.score = Math.floor(R.scoreF);
  let lvl = 1; for (let k = 0; k < WANT.length; k++) if (R.score >= WANT[k]) lvl = k + 1;
  if (lvl > R.level) { R.level = lvl; sfx('star'); sirenPulse(); if (lvl === 10) { toast('ALIEN INVASION'); missionDone('alien'); } if (lvl >= 6) missionDone('clown'); }
}
function endRun(kind, why){
  if (R.over) return;
  if (kind === 'ARRESTED' && player.car && player.car.ability === 'decker' && !player.deckUsed) { deckerBlast(); return; }
  if (kind === 'ARRESTED' && player.car && player.car.ability === 'rockets' && !player.rocketSave) { player.rocketSave = true; explode(player.car.x, player.car.z, 14, 1.4, 'player'); toast('Rocket save!'); player.armT = 0; player.copT = 0; return; }
  R.over = true; R.overKind = kind; R.overWhy = why; R.overT = 0;
  sfx('bust');
  gameOverFx(kind);
}
function deckerBlast(){
  const v = player.car; player.deckUsed = true;
  explode(v.x, v.z, 14, 1.2, 'player'); debris(_pp.set(v.x, 4, v.z), ['#d9302c'], 20, 9, .9);
  v.body.geometry = carGeo('bus', v.col, v.def.acc, null, upLevel(v.def.id));
  for (const c of vehicles) if (c.team === 'cop') { const d = Math.hypot(c.x - v.x, c.z - v.z); if (d < 20) { const ang = Math.atan2(c.x - v.x, c.z - v.z); c.vx += Math.sin(ang) * 30; c.vz += Math.cos(ang) * 30; launch(c, 10, 6, 0); } }
  player.armT = 0; player.copT = 0; toast('Top deck away!');
}

/* ---------- Vehicle abilities ---------- */
function abilities(v, dt){
  const ab = v.ability, tgt = nearestCop(v.x, v.z, 55);
  if (ab === 'heal') v.hp = Math.min(v.max, v.hp + v.max * .015 * dt);
  if (v.def && v.def.st === 'icecream') { R.jingleT = (R.jingleT || 0) - dt; if (R.jingleT <= 0) { R.jingleT = 6; sfx('jingle', .5); } }
  if (ab === 'rockets' && tgt) { v.abT = (v.abT || 3) - dt; if (v.abT <= 0) { v.abT = 4; const p = throwProj('rocket', v.x, v.z, Math.sin(v.a) * 40, Math.cos(v.a) * 40, 'player', { target: tgt }); p.y = 3; sfx('whoosh'); } }
  if (ab === 'cannon' && tgt) { v.abT = (v.abT || 2) - dt; const ang = Math.atan2(tgt.x - v.x, tgt.z - v.z); if (v.turret) v.turret.rotation.y = wrapA(ang - v.a); if (v.abT <= 0) { v.abT = 2; throwProj('shell', v.x + Math.sin(ang) * 4, v.z + Math.cos(ang) * 4, Math.sin(ang) * 70, Math.cos(ang) * 70, 'player'); sfx('cannon', .8); } }
  if ((ab === 'oil' || ab === 'water') && tgt) { v.abT = (v.abT || 1) - dt; if (v.abT <= 0) { v.abT = ab === 'oil' ? 1.2 : .8; const off = ab === 'oil' ? -v.l * .6 : v.l * .9; addPuddle(v.x + Math.sin(v.a) * off, v.z + Math.cos(v.a) * off, ab === 'oil' ? '#16181d' : '#7fc8f8'); } }
  if ((ab === 'barrels' || ab === 'balloons') && tgt) { v.abT = (v.abT || 1.5) - dt; if (v.abT <= 0) { v.abT = 1.8; throwProj(ab === 'barrels' ? 'barrel' : 'balloon', v.x - Math.sin(v.a) * (v.l * .6 + 1), v.z - Math.cos(v.a) * (v.l * .6 + 1), 0, 0, 'player'); } }
  if (ab === 'time') {
    const sp = Math.hypot(v.vx, v.vz);
    if (sp > v.top * .88) { player.timeT += dt; if (player.timeT > 1.5) for (const x of [-.7, .7]) fire(_pp.set(v.x - Math.sin(v.a) * 2.6 + Math.cos(v.a) * x, .3, v.z - Math.cos(v.a) * 2.6 - Math.sin(v.a) * x), .5); }
    else player.timeT = 0;
    if (player.timeT > 4) { player.timeT = 0; flashAt(_pp.set(v.x, 1, v.z), 30); sfx('whoosh'); R.timeGrey = !R.timeGrey; for (const c of vehicles) if (c.team === 'cop') { const d = Math.hypot(c.x - v.x, c.z - v.z); if (d < 22) { const ang = Math.atan2(c.x - v.x, c.z - v.z); c.vx += Math.sin(ang) * 30; c.vz += Math.cos(ang) * 30; launch(c, 9, 5, 0); damageVehicle(c, 40, 'player'); } } }
  }
  if (R.oilMission > 0) { R.oilMission += dt; if (R.oilMission >= 20) { R.oilMission = 0; missionDone('oiltrans'); } }
}
function nearestCop(x, z, max){ let best = null, bd = max; for (const v of vehicles) if (v.team === 'cop' && v.alive && !v.sink) { const d = Math.hypot(v.x - x, v.z - z); if (d < bd) { bd = d; best = v; } } return best; }
const PUD_GEO = new THREE.CircleGeometry(2.6, 10); PUD_GEO.rotateX(-Math.PI / 2);
function addPuddle(x, z, col){
  if (waterAt(x, z)) return;
  const m = new THREE.Mesh(PUD_GEO, new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: .85, depthWrite: false })); m.position.set(x, .06, z); scene.add(m);
  puddles.push({ m, x, z, t: 12 });
}

/* ---------- Air units, mines, airdrops, letters ---------- */
function heliGeo(col, big){
  const g = new GB(), s = big ? 1.6 : 1;
  g.box(-1.2 * s, 0, -2 * s, 1.2 * s, 2.2 * s, 2 * s, col); g.box(-1 * s, .6 * s, 1.9 * s, 1 * s, 1.8 * s, 2.3 * s, '#7fc8f8');
  g.box(-.3, .9 * s, -6 * s, .3, 1.5 * s, -2 * s, col); g.box(-.15, 1.2 * s, -6.2 * s, .15, 2.6 * s, -5.6 * s, col);
  g.box(-1.3 * s, -.6, -1.5 * s, -1.1 * s, -.4, 1.5 * s, '#2b2d33'); g.box(1.1 * s, -.6, -1.5 * s, 1.3 * s, -.4, 1.5 * s, '#2b2d33');
  return g.geometry();
}
const ROTOR = new THREE.BoxGeometry(11, .15, .6);
function makeAir(kind){
  const pos = currentPos(); if (!pos) return null;
  const cols = { copheli: '#1c2a4a', police: '#f4f1ea', swat: '#22252c', sri: '#1c2a4a', black: '#4a5530', apache: '#4a5530', supply: '#ff8c1a', bomber: '#7d8494', mother: '#9aa0aa', ufo: '#c9ccd3' };
  const grp = new THREE.Group();
  if (kind === 'bomber') { const g = new GB(); g.box(-2, 0, -8, 2, 3, 8, cols.bomber); g.box(-14, 1.5, -2, 14, 2.1, 2, cols.bomber); g.box(-5, 1.5, -8, 5, 2, -6, cols.bomber); g.box(-.3, 2, -8, .3, 5, -6, cols.bomber); grp.add(new THREE.Mesh(g.geometry(), MAT)); }
  else if (kind === 'mother' || kind === 'ufo') { const s = kind === 'mother' ? 6 : 1.4; const g = new GB(); g.box(-3 * s, 0, -3 * s, 3 * s, .8 * s, 3 * s, cols.ufo); g.box(-2 * s, .8 * s, -2 * s, 2 * s, 1.4 * s, 2 * s, '#9aa0aa'); g.box(-1 * s, 1.4 * s, -1 * s, 1 * s, 2 * s, 1 * s, '#79e3a5'); g.box(-1.5 * s, -.4 * s, -1.5 * s, 1.5 * s, 0, 1.5 * s, '#7dff6b'); grp.add(new THREE.Mesh(g.geometry(), kind === 'mother' ? MAT : MAT)); }
  else { const m = new THREE.Mesh(heliGeo(cols[kind] || '#888', kind === 'black' || kind === 'supply'), MAT); grp.add(m); const r = new THREE.Mesh(ROTOR, new THREE.MeshLambertMaterial({ color: '#2b2d33' })); r.position.y = (kind === 'black' || kind === 'supply' ? 3.6 : 2.4); grp.add(r); grp.userData.rotor = r; }
  grp.traverse(o => { if (o.isMesh) o.castShadow = true; });
  const a = Math.random() * Math.PI * 2, d = 90;
  if (kind !== 'mother' && kind !== 'bomber') grp.scale.setScalar(.7);
  const o = { kind, grp, x: pos.x + Math.cos(a) * d, z: pos.z + Math.sin(a) * d, y: kind === 'bomber' ? 24 : kind === 'mother' ? 30 : kind === 'ufo' ? 9 : 12, t: 0, phase: 'in', fireT: 3, ang: a };
  grp.position.set(o.x, o.y, o.z); scene.add(grp); aircraft.push(o); return o;
}
function updateAir(dt){
  const pos = currentPos();
  for (let i = aircraft.length - 1; i >= 0; i--) {
    const o = aircraft[i]; o.t += dt;
    if (o.grp.userData.rotor) { o.grp.userData.rotor.rotation.y += dt * 30; if (Math.random() < dt * 8) sfx('heli', clamp(1 - Math.hypot(o.x - (pos ? pos.x : 0), o.z - (pos ? pos.z : 0)) / 60, 0, .6)); }
    if (!pos) continue;
    const tx = pos.x, tz = pos.z, d = Math.hypot(tx - o.x, tz - o.z);
    let sp = 0, hx = tx, hz = tz;
    if (o.kind === 'police' || o.kind === 'apache') { hx = tx - 10; hz = tz + 10; sp = Math.min(40, d * 1.5); }
    else if (o.kind === 'swat' || o.kind === 'sri' || o.kind === 'black') {
      if (o.phase === 'in') { sp = 38; if (d < 8) { o.phase = 'drop'; o.t = 0; } }
      else if (o.phase === 'drop') { sp = 0; if (o.t > .5 && !o.dropped) { o.dropped = true; const type = o.kind === 'swat' ? 'swat' : o.kind === 'sri' ? 'sri' : 'soldier'; for (let k = 0; k < (o.kind === 'black' ? 4 : 3); k++) { const q = makePerson(OFFICERS[type], o.x + rnd(3), o.z + rnd(3), 'cop'); q.y = 8; q.vy = 0; q.down = .01; } } if (o.t > 2) { o.phase = 'out'; o.ang = Math.random() * 6; } }
      else { hx = o.x + Math.cos(o.ang) * 200; hz = o.z + Math.sin(o.ang) * 200; sp = 45; if (o.t > 6) { scene.remove(o.grp); aircraft.splice(i, 1); continue; } }
    } else if (o.kind === 'supply') {
      if (o.phase === 'in') { sp = 40; if (d < 22) { o.phase = 'drop'; o.t = 0; } }
      else if (o.phase === 'drop') { sp = 10; if (!o.dropped) { o.dropped = true; makeDrop(o.x, o.z, o.rarity); } if (o.t > 1) o.phase = 'out'; }
      else { hx = o.x + Math.cos(o.ang) * 200; hz = o.z + Math.sin(o.ang) * 200; sp = 45; if (o.t > 6) { scene.remove(o.grp); aircraft.splice(i, 1); continue; } }
    } else if (o.kind === 'bomber') {
      if (!o.dir) { o.dir = Math.atan2(tx - o.x, tz - o.z); }
      hx = o.x + Math.sin(o.dir) * 50; hz = o.z + Math.cos(o.dir) * 50; sp = 32;
      if (d < 30) { o.fireT -= dt; if (o.fireT <= 0) { o.fireT = .35; throwProj('bomb', o.x, o.z, Math.sin(o.dir) * 10, Math.cos(o.dir) * 10, 'cop'); } }
      if (o.t > 9) { scene.remove(o.grp); aircraft.splice(i, 1); continue; }
    } else if (o.kind === 'mother') {
      hx = tx + 20; hz = tz - 20; sp = Math.min(20, d); o.fireT -= dt;
      if (o.fireT <= 0 && R.level === 10) { o.fireT = 9; for (let k = 0; k < 3; k++) { const q = makePerson(OFFICERS.alien, o.x + rnd(4), o.z + rnd(4), 'cop'); q.y = 14; q.down = .01; } flashAt(_pp.set(o.x, 20, o.z), 20); }
      o.grp.rotation.y += dt * .3;
    } else if (o.kind === 'ufo') {
      o.ang += dt * .9; hx = tx + Math.cos(o.ang + i) * 16; hz = tz + Math.sin(o.ang + i) * 16; sp = 40;
      o.fireT -= dt; if (o.fireT <= 0 && !R.over) { o.fireT = 3 + Math.random() * 2; const p = throwProj('plasma', o.x, o.z, (tx - o.x) * .8, (tz - o.z) * .8, 'cop', { homing: true, target: pos, life: 3 }); p.y = 6; p.vy = -2; p.dmg = 15; }
      o.grp.rotation.y += dt * 3;
    }
    if (o.kind === 'apache') { o.fireT -= dt; if (o.fireT <= 0 && d < 50 && !R.over) { o.fireT = 7 + Math.random() * 3; const p = throwProj('missile', o.x, o.z, (tx - o.x) * .5, (tz - o.z) * .5, 'cop', { target: pos }); p.y = o.y - 1; p.vy = 0; sfx('whoosh'); } }
    const dd = Math.hypot(hx - o.x, hz - o.z);
    if (dd > .5) { const k = Math.min(1, sp * dt / dd); o.x += (hx - o.x) * k; o.z += (hz - o.z) * k; o.grp.rotation.y = lerp(o.grp.rotation.y, Math.atan2(hx - o.x, hz - o.z), .1); }
    o.grp.position.set(o.x, o.y + Math.sin(o.t * 2) * .4, o.z);
    if ((o.kind === 'police' || o.kind === 'apache' || o.kind === 'ufo' || o.kind === 'mother') && R.level < (o.kind === 'police' ? 2 : o.kind === 'apache' ? 8 : 10)) { scene.remove(o.grp); aircraft.splice(i, 1); }
  }
}
const CRATE_COL = { common: '#9aa3b2', rare: '#3a8dde', epic: '#a05ce0', legendary: '#ff9f1c' };
function makeDrop(x, z, rarity){
  const g = new GB(); g.box(-1, 0, -1, 1, 2, 1, '#a9845a'); g.box(-1.05, .8, -1.05, 1.05, 1.2, 1.05, CRATE_COL[rarity]);
  const m = new THREE.Mesh(g.geometry(), MAT); m.castShadow = true;
  const chute = new THREE.Mesh(new THREE.BoxGeometry(4, .3, 4), new THREE.MeshLambertMaterial({ color: CRATE_COL[rarity] })); chute.position.y = 6;
  const grp = new THREE.Group(); grp.add(m, chute); grp.position.set(x, 15, z); scene.add(grp);
  drops.push({ grp, chute, x, z, y: 15, rarity });
}
function updateDrops(dt){
  const pos = currentPos();
  R.dropT -= dt;
  if (R.dropT <= 0 && pos && !R.over) {
    R.dropT = player.char.lucky ? 10 : 30;
    const roll = Math.random() * 100 / (player.char.lucky ? 2.5 : 1);
    const rarity = roll < 4 ? 'legendary' : roll < 14 ? 'epic' : roll < 40 ? 'rare' : 'common';
    const o = makeAir('supply'); if (o) { o.rarity = rarity; floatText('!', CRATE_COL[rarity]); }
  }
  for (let i = drops.length - 1; i >= 0; i--) {
    const d = drops[i];
    if (d.y > 0) { d.y = Math.max(0, d.y - dt * 4); d.grp.position.y = d.y; if (d.y === 0) d.chute.visible = false; }
    if (pos && Math.hypot(pos.x - d.x, pos.z - d.z) < 3.5 && d.y < 3) { givePower(d.rarity); scene.remove(d.grp); drops.splice(i, 1); }
  }
}
function givePower(rarity){
  sfx('pickup');
  const car = !!player.car;
  const opts = POWER_BY_RAR[rarity].filter(k => (car ? !['heart', 'run', 'gloves', 'jetpack'].includes(k) : !['repair', 'nitro', 'spikes', 'speed', 'bumper'].includes(k)));
  const p = pick(Math.random, opts.length ? opts : ['cash']);
  if (POWER[p]) return applyPower(p);
  if (p === 'speed') { player.boostSpd = Math.min(1.5, player.boostSpd + .15); floatText('SPEED UP'); }
  if (p === 'run') { player.fastRun = 1.35; floatText('FAST FEET'); }
  if (p === 'bumper') { player.bumperT = 25; floatText('FORCE BUMPER'); }
  if (p === 'gloves') { player.glovesT = 25; floatText('BOXING GLOVES'); }
  if (p === 'jetpack') { player.jetT = 15; floatText('JETPACK'); }
  if (p === 'gravity') { player.gravShots += 3; floatText('GRAVITY GUN x3'); }
}
function fireGravity(){
  if (player.gravShots <= 0 || R.over) return;
  const o = currentPos(); if (!o) return;
  player.gravShots--;
  const a = player.car ? player.car.a : player.foot.a;
  const g = new GB(); g.box(-1, -1, -1, 1, 1, 1, '#16181d');
  const m = new THREE.Mesh(g.geometry(), new THREE.MeshBasicMaterial({ color: '#16181d' }));
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.2, .3, 6, 24), new THREE.MeshBasicMaterial({ color: '#b14bff' })); ring.rotation.x = Math.PI / 2; m.add(ring);
  m.position.set(o.x + Math.sin(a) * 14, 2, o.z + Math.cos(a) * 14); scene.add(m);
  holes.push({ m, x: m.position.x, z: m.position.z, t: 0 }); sfx('whoosh');
}
function updateHoles(dt){
  for (let i = holes.length - 1; i >= 0; i--) {
    const h = holes[i]; h.t += dt; h.m.rotation.y += dt * 8; h.m.scale.setScalar(1 + Math.sin(h.t * 10) * .1);
    for (const v of vehicles) if (v !== player.car && v.alive && v.team !== 'player') { const dx = h.x - v.x, dz = h.z - v.z, d = Math.hypot(dx, dz); if (d < 22) { v.vx += dx / d * 30 * dt; v.vz += dz / d * 30 * dt; } }
    for (const o of aircraft) if (o.kind === 'ufo' && Math.hypot(o.x - h.x, o.z - h.z) < 20) { o.x += (h.x - o.x) * dt * 2; o.z += (h.z - o.z) * dt * 2; }
    if (h.t > 2.4) {
      explode(h.x, h.z, 9, 1.6, 'player');
      for (let k = aircraft.length - 1; k >= 0; k--) { const o = aircraft[k]; if (o.kind === 'ufo' && Math.hypot(o.x - h.x, o.z - h.z) < 14) { boomFx(_pp.set(o.x, o.y, o.z), 1.2); scene.remove(o.grp); aircraft.splice(k, 1); addScore(100); save.missions.ufos = (save.missions.ufos || 0) + 1; } }
      scene.remove(h.m); holes.splice(i, 1);
    }
  }
}
const MINE_GEO = (() => { const g = new GB(); g.box(-.7, 0, -.7, .7, .3, .7, '#4a5530'); return g.geometry(); })();
function spawnMine(){
  const pos = currentPos(); if (!pos) return;
  const dir = player.car ? player.car.a : player.foot.a;
  const r = findRoadNear(pos.x + Math.sin(dir) * 45, pos.z + Math.cos(dir) * 45, 0, 30, 10); if (!r) return;
  const warp = R.level === 10;
  const m = new THREE.Mesh(MINE_GEO, warp ? new THREE.MeshBasicMaterial({ color: '#b14bff' }) : MAT); m.position.set(r.x + rnd(2), .02, r.z + rnd(2));
  const btn = new THREE.Mesh(CUBE, new THREE.MeshBasicMaterial({ color: '#ff2b2b' })); btn.scale.set(.3, .2, .3); btn.position.y = .35; m.add(btn);
  scene.add(m); mines.push({ m, btn, x: m.position.x, z: m.position.z, warp });
}
function updateMines(dt){
  for (let i = mines.length - 1; i >= 0; i--) {
    const mn = mines[i]; mn.btn.visible = Math.floor(R.time * 4) % 2 === 0;
    let trig = null;
    for (const v of vehicles) if (v.alive && v.y < 1 && Math.hypot(v.x - mn.x, v.z - mn.z) < v.w * .6 + .6) { trig = v; break; }
    if (!trig) for (const p of people) if (p.y < .5 && Math.hypot(p.x - mn.x, p.z - mn.z) < 1) { trig = p; break; }
    const pos = currentPos();
    if (pos && Math.hypot(pos.x - mn.x, pos.z - mn.z) > 160) trig = 'gone';
    if (!trig) continue;
    scene.remove(mn.m); mines.splice(i, 1);
    if (trig === 'gone') continue;
    if (trig === player.foot && player.char.mineProof) { save.stats.mines++; save.missions.mines = (save.missions.mines || 0) + 1; floatText('DEFUSED'); sfx('ui'); if (save.missions.mines >= 25) missionDone('armory'); continue; }
    if (mn.warp) { if (trig === player.car) { const a = Math.random() * 6; trig.vx = Math.sin(a) * 40; trig.vz = Math.cos(a) * 40; launch(trig, 22, 8, 3); flashAt(_pp.set(mn.x, 1, mn.z), 18); sfx('whoosh'); } continue; }
    explode(mn.x, mn.z, 7, 1.4, 'mine');
  }
}
function spawnLetters(){
  for (const o of letterObjs) scene.remove(o.grp); letterObjs.length = 0;
  LETTERS.forEach((L, k) => {
    if (save.letters.includes(k)) return;
    const a = Math.random() * Math.PI * 2, d = 260 + Math.random() * 700;
    const x = Math.round(Math.cos(a) * d / TILE) * TILE + 3, z = Math.round(Math.sin(a) * d / TILE) * TILE + 3;
    const grp = new THREE.Group(), ring = new THREE.Mesh(new THREE.TorusGeometry(3, .35, 6, 28), new THREE.MeshBasicMaterial({ color: '#e8473c' }));
    ring.rotation.x = Math.PI / 2; ring.position.y = .2; grp.add(ring);
    const tex = letterTex(L), sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex })); sp.scale.set(3.4, 3.4, 1); sp.position.y = 3; grp.add(sp);
    grp.position.set(x, 0, z); scene.add(grp);
    letterObjs.push({ grp, x, z, k, sp });
  });
}
function letterTex(L){ const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'); g.fillStyle = '#e8473c'; g.fillRect(4, 4, 56, 56); g.fillStyle = '#fff'; g.font = '900 46px "Lilita One", Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(L, 32, 36); return new THREE.CanvasTexture(c); }
function updateLetters(dt){
  const pos = currentPos(); if (!pos) return;
  for (let i = letterObjs.length - 1; i >= 0; i--) {
    const o = letterObjs[i]; o.sp.position.y = 3 + Math.sin(R.time * 3) * .4;
    if (waterAt(o.x, o.z) || solidAt(o.x, o.z, 0)) { o.x += 6; o.grp.position.x = o.x; }
    if (Math.hypot(pos.x - o.x, pos.z - o.z) < 4) {
      save.letters.push(o.k); scene.remove(o.grp); letterObjs.splice(i, 1); sfx('win'); floatText(`LETTER ${LETTERS[o.k]}  ${save.letters.length}/7`);
      if (save.letters.length >= 7) missionDone('getaway'); persist();
    }
  }
}

/* ---------- Spawning director ---------- */
const DIRECT = [
  { police: 3 }, { police: 3, policesuv: 1 }, { police: 1, swatsuv: 2, swatvan: 1 }, { swatsuv: 2, swatvan: 2 }, { sri: 3, swatvan: 1 },
  { sri: 2, srivan: 2 }, { humvee: 2, humveegun: 1, srivan: 1 }, { humvee: 2, humveegun: 1, tank: 1 }, { humvee: 2, tank: 3 }, { tank: 4 }
];
function director(dt){
  const pos = currentPos(); if (!pos || R.over) return;
  R.spawnT = (R.spawnT || 0) - dt;
  const want = DIRECT[R.level - 1], count = {};
  for (const v of vehicles) if (v.team === 'cop' && v.driver === 'ai' && v.ai !== 'block') count[v.kind] = (count[v.kind] || 0) + 1;
  if (R.spawnT <= 0) {
    for (const k in want) if ((count[k] || 0) < want[k]) { const r = findRoadNear(pos.x, pos.z, 58, 80, 20); if (r) { const v = spawnCop(k, r.x, r.z, Math.atan2(pos.x - r.x, pos.z - r.z)); v.spawnT = R.time; } R.spawnT = 1.6; break; }
  }
  // despawn far units
  for (const v of vehicles.slice()) {
    const d = Math.hypot(v.x - pos.x, v.z - pos.z);
    if (v !== player.car && (v.team === 'cop' || v.ai === 'traffic' || v.ai === 'stopped' || (v.driver == null && v.kind !== 'parked')) && d > 150) removeVehicle(v);
  }
  for (const p of people.slice()) if (p !== player.foot && Math.hypot(p.x - pos.x, p.z - pos.z) > 110) removePerson(p);
  // traffic and pedestrians
  const traffic = vehicles.filter(v => v.team === 'civ' && v.driver === 'civ').length;
  if (traffic < (R.level >= 10 ? 2 : 9) && Math.random() < dt * 2) spawnTraffic();
  if (people.filter(p => p.ped).length < 10 && Math.random() < dt * 3) spawnPed();
  // air support and set pieces by level
  const has = k => aircraft.some(o => o.kind === k);
  if (R.level >= 2 && R.level < 10 && !has('police')) makeAir('police');
  R.heliT -= dt;
  if (R.heliT <= 0) { R.heliT = 22; if (R.level >= 3 && R.level <= 5) makeAir('swat'); else if (R.level === 6) makeAir('sri'); else if (R.level >= 7 && R.level < 10) makeAir('black'); }
  if (R.level >= 8 && R.level < 10 && !has('apache')) makeAir('apache');
  if (R.level >= 9 && R.level < 10) { R.bomberT -= dt; if (R.bomberT <= 0) { R.bomberT = 20; makeAir('bomber'); } }
  if (R.level === 10) { if (!has('mother')) makeAir('mother'); if (aircraft.filter(o => o.kind === 'ufo').length < 4) { R.ufoT -= dt; if (R.ufoT <= 0) { R.ufoT = 2; makeAir('ufo'); } } }
  if (R.level >= 7) { R.mineT -= dt; if (R.mineT <= 0 && mines.length < 14) { R.mineT = 1.2; spawnMine(); } }
  else if (player.char.mineProof && !save.owned.armory) { R.mineT -= dt; if (R.mineT <= 0 && mines.length < 6 && R.level >= 3) { R.mineT = 4; spawnMine(); } }
  if (R.level >= 2 && R.level < 10) { R.blockT -= dt; if (R.blockT <= 0) { R.blockT = 18 + Math.random() * 10; roadblock(); } }
}
function roadblock(){
  const o = currentPos(); if (!o) return;
  const a = player.car ? player.car.a : o.a, ax = Math.sin(a), az = Math.cos(a);
  const r = findRoadNear(o.x + ax * 75, o.z + az * 75, 0, 18, 15); if (!r) return;
  const col = roadCol(r.i, r.j), row = roadRow(r.i, r.j); if (col && row) return;
  const lv = R.level, comp = lv <= 2 ? ['police', 'police', 'police'] : lv <= 4 ? ['swatsuv', 'swatvan', 'swatsuv'] : lv <= 6 ? ['sri', 'srivan', 'sri'] : ['humvee', 'tank', 'humvee'];
  const military = lv >= 7;
  for (let k = 0; k < 3; k++) {
    let x, z, ang;
    if (col) { const i0 = r.i - mod(r.i, 2); x = i0 * TILE + 2 + k * 4; z = r.z; ang = Math.PI / 2 + (k - 1) * .3; }
    else { const j0 = r.j - mod(r.j, 2); z = j0 * TILE + 2 + k * 4; x = r.x; ang = (k - 1) * .3; }
    const v = spawnCop(comp[k], x, z, ang); v.ai = 'block'; v.spawnT = R.time;
    if (military) { v.driver = null; v.ai = 'block'; v.parkedMil = true; }
  }
}

/* ---------- Main simulation step ---------- */
function simulate(dt){
  R.time += dt;
  playerUpdate(dt);
  playerGun(dt);
  for (const v of vehicles.slice()) {
    if (!v.alive) continue;
    if (v !== player.car) {
      if (v.team === 'cop' && v.driver === 'ai' && v.sink === 0) copAI(v, dt);
      else if (v.ai === 'traffic' || v.ai === 'stopped') trafficAI(v, dt);
      else if (v.driver == null) { v.thr = 0; v.steer = 0; }
    }
    for (const pd of puddles) if (v !== player.car && Math.hypot(v.x - pd.x, v.z - pd.z) < 2.8) { v.oiled = 1.2; v.a += (Math.random() - .5) * .3; }
    checkRamp(v);
    stepVehicle(v, dt);
    collideStatic(v, dt);
    vehicleSmoke(v, dt); vehicleDamageLook(v, dt);
    if (v.flipped && v !== player.car && v.team === 'cop') { v.flipT = (v.flipT || 0) + dt; if (v.flipT > 4) destroyVehicle(v); }
  }
  collideVehicles();
  for (const v of vehicles) syncMesh(v);
  // run-over people
  for (const p of people) {
    personAI(p, dt); stepPerson(p, dt);
    if (p.down > 0 || p.y > 1.5) continue;
    for (const v of vehicles) {
      if (v.sink || !v.alive || (v.boat && !p.swimming)) continue; const sp = Math.hypot(v.vx, v.vz); if (sp < 5) continue;
      if (p === player.foot && (v === player.car || player.invT > 0)) continue;
      if (Math.hypot(v.x - p.x, v.z - p.z) < v.w * .6 + .4) { const ang = Math.atan2(v.vx, v.vz); knockPerson(p, Math.sin(ang) * sp * .7, Math.cos(ang) * sp * .7, 6 + sp * .2); sfx('thud', .4); if (p.team === 'cop' && v === player.car) addScore(10); break; }
    }
    if (player.glovesT > 0 && player.foot && p.team === 'cop' && p !== player.foot && Math.hypot(player.foot.x - p.x, player.foot.z - p.z) < 1.8) { const ang = Math.atan2(p.x - player.foot.x, p.z - player.foot.z); knockPerson(p, Math.sin(ang) * 14, Math.cos(ang) * 14, 7); p.ko = 3; sfx('punch'); }
  }
  for (const [C, p] of explodeQ.splice(0)) if (p.alive) smashProp(C, p, null);
  updateProjs(dt); updateAir(dt); updateCopHelis(dt); updatePowers(dt); updateBoats(dt); updateDrops(dt); updateMines(dt); updateHoles(dt); updateLetters(dt);
  for (let i = puddles.length - 1; i >= 0; i--) { const pd = puddles[i]; pd.t -= dt; if (pd.t <= 0) { scene.remove(pd.m); pd.m.material.dispose(); puddles.splice(i, 1); } else if (pd.t < 2) pd.m.material.opacity = pd.t / 2 * .85; }
  for (const s of R.sprays) { s.t -= dt; if (s.t > 0 && Math.random() < .6) emit(litPool, _pp.set(s.x, .8, s.z), _pv.set(rnd(1.5), 9 + Math.random() * 3, rnd(1.5)), '#bfe6ff', .5, .2, 1, 22, false); }
  R.sprays = R.sprays.filter(s => s.t > 0);
  player.bumperT = Math.max(0, player.bumperT - dt); player.glovesT = Math.max(0, player.glovesT - dt);
  if (R.tankMission && R.tankMission.t > 0) { R.tankMission.t -= dt; if (R.tankMission.kills >= 10) { R.tankMission.t = 0; missionDone('tank'); } else if (R.tankMission.t <= 0) toast('Keep That Tank failed'); }
  collectCash();
  checkArrest(dt);
  checkDebug(dt);
  updateScore(dt);
  if (R.smashed >= 150) missionDone('waterjet'); if (R.police >= 30) missionDone('policecar'); if (save.stats.swim >= 1000) missionDone('diver');
  director(dt);
}
function collectCash(){
  const o = currentPos(); if (!o) return;
  const mag = player.magnetT > 0 ? 20 : player.car && player.car.def && player.car.def.st === 'taxi' ? 6 : 3.2;
  const val = (R.level >= 10 ? 20 : R.level >= 7 ? 10 : R.level >= 5 ? 5 : R.level >= 3 ? 2 : 1) * (player.car && player.car.def && player.car.def.cashX || R.cashX || 1);
  if (player.car && player.car.def && player.car.def.cashX) R.cashX = player.car.def.cashX;
  const take = (c) => { R.cash += val; save.cash += val; save.stats.cashTotal += val; sfx('cash', .6); floatText('+$' + val, '#4fbf5a', c.x, c.z); };
  forNearChunks(o.x, o.z, C => { for (let i = (C.cashM || []).length - 1; i >= 0; i--) { const c = C.cashM[i]; c.m.rotation.y += .05; if (Math.hypot(c.x - o.x, c.z - o.z) < mag) { scene.remove(c.m); C.cashM.splice(i, 1); R.collected.add(c.key); take(c); } } });
  for (let i = looseCash.length - 1; i >= 0; i--) { const c = looseCash[i]; c.m.rotation.y += .05; if (Math.hypot(c.x - o.x, c.z - o.z) < mag) { scene.remove(c.m); looseCash.splice(i, 1); take(c); } }
}
function checkArrest(dt){
  if (R.over) return;
  if (player.ghostT > 0 || (player.car && player.car.heli && player.car.y > 3) || (player.foot && player.foot.chute)) { player.copT = 0; player.armT = 0; return; }
  // a police vehicle pinning you while you are stopped, or flipped
  const v = player.car;
  if (v) {
    const slow = Math.hypot(v.vx, v.vz) < 2.2 || v.flipped;
    let touching = false;
    for (const c of vehicles) if (c.team === 'cop' && c.driver === 'ai' && c.alive && Math.hypot(c.x - v.x, c.z - v.z) < (c.w + v.w) * .5 + Math.max(c.l, v.l) * .45) { touching = true; break; }
    if (slow && touching) player.copT += dt; else player.copT = Math.max(0, player.copT - dt * 2);
    if (v.flipped) { v.flipWait = (v.flipWait || 0) + dt; if (v.flipWait > 3 && !touching) { v.flipped = false; v.roll = 0; v.flipWait = 0; v.y = 0; } }
  }
  if (player.copT > 2.2) endRun('ARRESTED', 'The cops boxed you in.');
  if (player.armT > 0) { player.armT -= dt; if (player.armT > 1.6) endRun('ARRESTED', 'An officer got to you.'); }
}
function checkDebug(dt){
  const o = currentPos(); if (!o || R.over) return;
  if (Math.hypot(o.x - R.anchor.x, o.z - R.anchor.z) > 14) { R.anchor.x = o.x; R.anchor.z = o.z; R.debugT = 0; return; }
  R.debugT += dt;
  if (R.debugT > 12) { if (R.debugT - dt <= 12) toast('Move it! A storm is brewing'); }
  if (R.debugT > 18) endRun('DEBUGGED', 'You stayed in one place for too long.');
}
function missionDone(id){
  const M = MISSIONS.find(m => m.id === id); if (!M || save.missions[id + '_done']) return;
  save.missions[id + '_done'] = true;
  if (M.car) save.owned[M.car] = true; if (M.char) save.chars[M.char] = true;
  persist(); sfx('win'); toast(`Mission complete: ${M.n}. Unlocked ${M.car ? CAR[M.car].n : CHAR[M.char].n}!`);
}
const MISSIONS = [
  { id: 'getaway', n: 'Collect the letters', d: 'Find all seven red-circled GETAWAY letters. They are scattered far from where you start each run.', car: 'getaway', prog: () => `${save.letters.length}/7` },
  { id: 'rodeo', n: 'Big Airtime', d: 'Hit a river ramp fast enough to flip in the air.', car: 'rodeo' },
  { id: 'clown', n: 'Most Wanted', d: 'Reach wanted level 6.', car: 'clown' },
  { id: 'waterjet', n: 'Wrecking Ball', d: 'Smash 150 things in one run.', car: 'waterjet' },
  { id: 'policecar', n: 'Cop Crusher', d: 'Destroy 30 police cars or SUVs in one run.', car: 'policecar' },
  { id: 'oiltrans', n: 'Living On The Edge', d: 'Steal an oil tanker from traffic and drive it for 20 seconds without exploding.', car: 'oiltrans' },
  { id: 'tank', n: 'Keep That Tank', d: 'At wanted level 7 or higher, steal the tank from a military roadblock and destroy 10 enemies within 70 seconds.', car: 'tank' },
  { id: 'armory', n: 'The Defuser', d: 'As Boom Boy, walk over 25 landmines.', car: 'armory', prog: () => `${save.missions.mines || 0}/25` },
  { id: 'alien', n: 'Alien Invasion', d: 'Reach a score of 4,500.', char: 'alien' },
  { id: 'diver', n: 'Swim Swim Swim', d: 'Swim 1,000 m in total.', char: 'diver', prog: () => `${Math.floor(save.stats.swim)}/1000 m` }
];

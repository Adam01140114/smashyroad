'use strict';
const $ = s => document.querySelector(s);
if (!window.THREE) { document.getElementById('app').innerHTML = '<p style="padding:24px;font:600 16px sans-serif">The 3D engine could not load. Check your connection and reload.</p>'; throw new Error('three'); }
const V3 = THREE.Vector3;
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;
const wrapA = a => { while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; return a; };
function mulberry32(a){ return function(){ a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function hash3(x, y, s){ let h = Math.imul((s | 0) + 0x632BE5AB, 0x9E3779B1); h ^= Math.imul(x | 0, 0x85EBCA77); h = Math.imul(h ^ (h >>> 15), 0x2C1B3C6D); h ^= Math.imul(y | 0, 0xC2B2AE3D); h = Math.imul(h ^ (h >>> 13), 0x297A2D39); h ^= h >>> 16; return h >>> 0; }
const h01 = (x, y, s) => hash3(x, y, s) / 4294967296;
const rngFor = (x, y, s) => mulberry32(hash3(x, y, s));
const pick = (r, a) => a[Math.floor(r() * a.length)];
function vnoise(x, y, s){
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  return lerp(lerp(h01(xi, yi, s), h01(xi + 1, yi, s), u), lerp(h01(xi, yi + 1, s), h01(xi + 1, yi + 1, s), u), v);
}
const isTouch = matchMedia('(pointer: coarse)').matches;
const store = {
  get(k, d){ try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};

/* ---------- Renderer ---------- */
let W = innerWidth, H = innerHeight, DPR = Math.min(window.devicePixelRatio || 1, 1.75);
let renderer;
try { renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' }); }
catch (e) { document.getElementById('app').innerHTML = '<p style="padding:24px;font:600 16px sans-serif">This browser could not start WebGL. Try another browser or turn on hardware acceleration.</p>'; throw e; }
renderer.setPixelRatio(DPR); renderer.setSize(W, H);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const SKY = new THREE.Color('#9fd8f0');
renderer.setClearColor(SKY);
$('#gl').appendChild(renderer.domElement);
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(SKY, 95, 165);
const camera = new THREE.PerspectiveCamera(36, W / H, 1, 400);
scene.add(new THREE.HemisphereLight(0xffffff, 0x8a98a8, .62));
const sun = new THREE.DirectionalLight(0xfff4e2, .78);
sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -60, right: 60, top: 60, bottom: -60, near: 1, far: 200 });
sun.shadow.bias = -.0006;
scene.add(sun, sun.target);
const SUN_OFF = new V3(-30, 60, 22);
const MAT = new THREE.MeshLambertMaterial({ vertexColors: true });
const MAT_FLAT = new THREE.MeshBasicMaterial({ vertexColors: true });

/* ---------- Voxel geometry builder ---------- */
const _col = new THREE.Color();
class GB {
  constructor(){ this.p = []; this.n = []; this.c = []; }
  get count(){ return this.p.length / 3; }
  quad(a, b, c, d, n, col){
    for (const v of [a, b, c, a, c, d]) { this.p.push(v[0], v[1], v[2]); this.n.push(n[0], n[1], n[2]); this.c.push(col.r, col.g, col.b); }
  }
  box(x0, y0, z0, x1, y1, z1, hex, o){
    o = o || {};
    const col = _col.set(hex);
    if (o.j) col.offsetHSL(0, 0, o.j);
    const C = { r: col.r, g: col.g, b: col.b };
    const S = { r: C.r * .86, g: C.g * .86, b: C.b * .86 };
    this.quad([x0, y1, z0], [x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [0, 1, 0], C);
    if (o.bottom) this.quad([x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [0, -1, 0], S);
    if (!o.noSides) {
      this.quad([x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1], [1, 0, 0], S);
      this.quad([x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0], [-1, 0, 0], S);
      this.quad([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1], C);
      this.quad([x0, y0, z0], [x0, y1, z0], [x1, y1, z0], [x1, y0, z0], [0, 0, -1], C);
    }
  }
  // centered box helper (cx, cy-bottom, cz, w, h, d)
  cb(cx, y, cz, w, h, d, hex, o){ this.box(cx - w / 2, y, cz - d / 2, cx + w / 2, y + h, cz + d / 2, hex, o); }
  flat(x0, z0, x1, z1, y, hex, j){ const c = _col.set(hex); if (j) c.offsetHSL(0, 0, j); const C = { r: c.r, g: c.g, b: c.b }; this.quad([x0, y, z0], [x0, y, z1], [x1, y, z1], [x1, y, z0], [0, 1, 0], C); }
  geometry(dynamic){
    const g = new THREE.BufferGeometry();
    const pa = new THREE.BufferAttribute(new Float32Array(this.p), 3); if (dynamic) pa.setUsage(THREE.DynamicDrawUsage);
    g.setAttribute('position', pa);
    g.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(this.n), 3));
    g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(this.c), 3));
    g.computeBoundingSphere();
    return g;
  }
}
function meshFrom(gb, shadows, dynamic){
  const m = new THREE.Mesh(gb.geometry(dynamic), MAT);
  m.castShadow = shadows !== false; m.receiveShadow = true;
  return m;
}

/* ---------- Particles: instanced voxel cubes ---------- */
const CUBE = new THREE.BoxGeometry(1, 1, 1);
function makePool(n, mat){
  const m = new THREE.InstancedMesh(CUBE, mat, n);
  m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  m.frustumCulled = false; m.count = n;
  const data = [];
  const zero = new THREE.Matrix4().makeScale(0, 0, 0);
  for (let i = 0; i < n; i++) { m.setMatrixAt(i, zero); m.setColorAt(i, new THREE.Color(1, 1, 1)); data.push({ life: 0, max: 1, p: new V3(), v: new V3(), s: 1, s1: 1, rot: new V3(), w: new V3(), g: 0, bounce: false }); }
  scene.add(m);
  return { m, data, next: 0 };
}
const litPool = makePool(700, new THREE.MeshLambertMaterial({ color: 0xffffff }));
const glowPool = makePool(500, new THREE.MeshBasicMaterial({ color: 0xffffff }));
litPool.m.castShadow = false;
const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _sv = new V3(), _c2 = new THREE.Color();
function emit(pool, p, v, col, s0, s1, life, grav, bounce){
  const d = pool.data[pool.next]; const idx = pool.next; pool.next = (pool.next + 1) % pool.data.length;
  d.life = life; d.max = life; d.p.copy(p); d.v.copy(v); d.s = s0; d.s1 = s1; d.g = grav || 0; d.bounce = !!bounce;
  d.rot.set(Math.random() * 6, Math.random() * 6, Math.random() * 6); d.w.set((Math.random() - .5) * 8, (Math.random() - .5) * 8, (Math.random() - .5) * 8);
  pool.m.setColorAt(idx, _c2.set(col)); pool.m.instanceColor.needsUpdate = true;
}
function updatePool(pool, dt){
  const m = pool.m;
  for (let i = 0; i < pool.data.length; i++) {
    const d = pool.data[i];
    if (d.life <= 0) continue;
    d.life -= dt;
    if (d.life <= 0) { _m4.makeScale(0, 0, 0); m.setMatrixAt(i, _m4); continue; }
    d.v.y -= d.g * dt;
    d.p.addScaledVector(d.v, dt);
    if (d.bounce && d.p.y < d.s * .5) { d.p.y = d.s * .5; d.v.y = Math.abs(d.v.y) * .35; d.v.x *= .7; d.v.z *= .7; d.w.multiplyScalar(.6); }
    d.rot.addScaledVector(d.w, dt);
    const k = 1 - d.life / d.max, s = lerp(d.s, d.s1, k);
    _q.setFromEuler(_e.set(d.rot.x, d.rot.y, d.rot.z));
    _m4.compose(d.p, _q, _sv.set(s, s, s)); m.setMatrixAt(i, _m4);
  }
  m.instanceMatrix.needsUpdate = true;
}
const _pv = new V3(), _pp = new V3();
function rnd(a){ return (Math.random() - .5) * 2 * a; }
function debris(p, col, n, speed, size){
  for (let i = 0; i < n; i++) emit(litPool, _pp.copy(p).add(_pv.set(rnd(1), Math.random(), rnd(1))), _pv.set(rnd(speed), speed * (.5 + Math.random()), rnd(speed)), Array.isArray(col) ? pick(Math.random, col) : col, size * (.6 + Math.random() * .7), size * .3, 1.6 + Math.random(), 22, true);
}
function smoke(p, col, size, rise){
  emit(litPool, _pp.copy(p).add(_pv.set(rnd(.4), 0, rnd(.4))), _pv.set(rnd(.6), rise || 2.5, rnd(.6)), col, size, size * 2.4, 1.1 + Math.random() * .6, 0, false);
}
function fire(p, size){ emit(glowPool, _pp.copy(p).add(_pv.set(rnd(.4), 0, rnd(.4))), _pv.set(rnd(.8), 3 + Math.random() * 2, rnd(.8)), pick(Math.random, ['#ffd23f', '#ff8c1a', '#ff5a1f']), size, size * .2, .45 + Math.random() * .3, 0, false); }
function boomFx(p, scale){
  scale = scale || 1;
  for (let i = 0; i < 26 * scale; i++) emit(glowPool, _pp.copy(p).add(_pv.set(rnd(1.5 * scale), Math.random() * 2, rnd(1.5 * scale))), _pv.set(rnd(9 * scale), 4 + Math.random() * 9 * scale, rnd(9 * scale)), pick(Math.random, ['#fff3b0', '#ffd23f', '#ff8c1a', '#ff4d1f']), (1 + Math.random() * 1.6) * scale, .2, .5 + Math.random() * .5, 6, false);
  for (let i = 0; i < 8 * scale; i++) emit(litPool, _pp.copy(p).add(_pv.set(rnd(2 * scale), 1 + Math.random() * 2, rnd(2 * scale))), _pv.set(rnd(3), 3 + Math.random() * 3, rnd(3)), pick(Math.random, ['#3b3b44', '#55555f', '#2a2a30']), (1.1 + Math.random()) * scale, 2.4 * scale, 1.1 + Math.random() * .6, -1, false);
  flashAt(p, 14 * scale);
}
const _fl = [];
{
  const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,240,190,1)'); gr.addColorStop(.35, 'rgba(255,170,60,.7)'); gr.addColorStop(1, 'rgba(255,120,30,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  for (let i = 0; i < 10; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); s.visible = false; scene.add(s); _fl.push({ s, t: 0, size: 1 }); }
}
let _fi = 0;
function flashAt(p, size){ const f = _fl[_fi++ % _fl.length]; f.s.position.copy(p).setY(p.y + 1.5); f.s.visible = true; f.t = 0; f.size = size; }
function updateFlashes(dt){ for (const f of _fl) { if (!f.s.visible) continue; f.t += dt; const k = f.t / .4; if (k >= 1) { f.s.visible = false; continue; } f.s.scale.setScalar(f.size * (.5 + k)); f.s.material.opacity = 1 - k; } }

/* ---------- Skid marks ---------- */
const SKID_N = 900;
const skidPos = new Float32Array(SKID_N * 18);
const skidGeo = new THREE.BufferGeometry(); skidGeo.setAttribute('position', new THREE.BufferAttribute(skidPos, 3));
const skidMesh = new THREE.Mesh(skidGeo, new THREE.MeshBasicMaterial({ color: 0x2a2a30, transparent: true, opacity: .32, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }));
skidMesh.frustumCulled = false; skidMesh.renderOrder = 1; scene.add(skidMesh);
let skidI = 0;
function skid(x0, z0, x1, z1, w){
  const dx = x1 - x0, dz = z1 - z0, l = Math.hypot(dx, dz); if (l < .05 || l > 4) return;
  const nx = -dz / l * w, nz = dx / l * w, y = .04, o = skidI * 18; skidI = (skidI + 1) % SKID_N;
  const v = [x0 + nx, y, z0 + nz, x0 - nx, y, z0 - nz, x1 - nx, y, z1 - nz, x0 + nx, y, z0 + nz, x1 - nx, y, z1 - nz, x1 + nx, y, z1 + nz];
  skidPos.set(v, o); skidGeo.attributes.position.needsUpdate = true;
}
function clearSkids(){ skidPos.fill(0); skidGeo.attributes.position.needsUpdate = true; }

/* ---------- Audio ---------- */
let au = null, muted = store.get('gb-muted', false);
function initAudio(){
  if (au) { if (au.ctx.state === 'suspended') au.ctx.resume(); return; }
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const master = ctx.createGain(); master.gain.value = muted ? 0 : .5; master.connect(ctx.destination);
    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const eng = ctx.createGain(); eng.gain.value = 0; eng.connect(master);
    const elp = ctx.createBiquadFilter(); elp.type = 'lowpass'; elp.frequency.value = 400; elp.connect(eng);
    const e1 = ctx.createOscillator(); e1.type = 'sawtooth'; e1.frequency.value = 60; e1.connect(elp);
    const e2 = ctx.createOscillator(); e2.type = 'square'; e2.frequency.value = 30; const e2g = ctx.createGain(); e2g.gain.value = .4; e2.connect(e2g); e2g.connect(elp);
    const sir = ctx.createGain(); sir.gain.value = 0; sir.connect(master);
    const so = ctx.createOscillator(); so.type = 'square'; so.frequency.value = 700;
    const slp = ctx.createBiquadFilter(); slp.type = 'lowpass'; slp.frequency.value = 1800; so.connect(slp); slp.connect(sir);
    const lfo = ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 2.2; const lg = ctx.createGain(); lg.gain.value = 260; lfo.connect(lg); lg.connect(so.frequency);
    e1.start(); e2.start(); so.start(); lfo.start();
    au = { ctx, master, buf, eng, elp, e1, e2, sir, so, lfo };
  } catch (e) { au = null; }
}
function setMuted(m){ muted = m; store.set('gb-muted', m); if (au) au.master.gain.setTargetAtTime(m ? 0 : .5, au.ctx.currentTime, .05); }
function sfx(kind, vol){
  if (!au || muted) return;
  const ctx = au.ctx, t = ctx.currentTime, v = vol == null ? 1 : vol;
  const out = (node, a, peak, dec, delay) => { const g = ctx.createGain(), s = t + (delay || 0); g.gain.setValueAtTime(0, s); g.gain.linearRampToValueAtTime(peak * v, s + a); g.gain.exponentialRampToValueAtTime(.0001, s + a + dec); node.connect(g); g.connect(au.master); };
  const osc = (type, f0, f1, dur, delay) => { const o = ctx.createOscillator(), s = t + (delay || 0); o.type = type; o.frequency.setValueAtTime(f0, s); o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), s + dur); o.start(s); o.stop(s + dur + .05); return o; };
  const noise = (dur, type, f, delay) => { const s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), st = t + (delay || 0); s.buffer = au.buf; fl.type = type; fl.frequency.value = f; s.connect(fl); s.start(st, Math.random()); s.stop(st + dur); return fl; };
  switch (kind) {
    case 'crash': out(noise(.35, 'lowpass', 900), .003, .7, .3); out(osc('square', 120, 50, .2), .003, .25, .2); break;
    case 'thud': out(noise(.2, 'lowpass', 500), .003, .4, .18); break;
    case 'break': out(noise(.15, 'bandpass', 1800), .002, .35, .12); out(osc('triangle', 600, 200, .1), .002, .12, .1); break;
    case 'boom': out(noise(1.4, 'lowpass', 700), .005, 1, 1.2); out(osc('sine', 120, 30, .8), .005, .6, .8); break;
    case 'cash': out(osc('square', 988, 988, .07), .002, .08, .07); out(osc('square', 1319, 1319, .14, .07), .002, .08, .14, .07); break;
    case 'splash': out(noise(.8, 'highpass', 900), .01, .5, .7); break;
    case 'shot': out(noise(.12, 'bandpass', 1400), .001, .35, .1); break;
    case 'cannon': out(noise(.6, 'lowpass', 500), .002, .9, .5); out(osc('sine', 90, 40, .4), .002, .5, .4); break;
    case 'whoosh': out(noise(.5, 'bandpass', 600), .05, .35, .4); break;
    case 'ui': out(osc('square', 660, 660, .05), .002, .06, .05); break;
    case 'win': [523, 659, 784, 1047, 1319].forEach((f, i) => out(osc('square', f, f, .12, i * .09), .003, .07, .16, i * .09)); break;
    case 'star': [880, 1175].forEach((f, i) => out(osc('square', f, f, .1, i * .1), .003, .07, .12, i * .1)); break;
    case 'bust': [392, 330, 262].forEach((f, i) => out(osc('square', f, f * .98, .22, i * .2), .003, .1, .25, i * .2)); break;
    case 'jingle': [784, 988, 784, 659, 784, 988, 1175].forEach((f, i) => out(osc('triangle', f, f, .14, i * .16), .003, .05, .16, i * .16)); break;
    case 'pickup': out(osc('sine', 600, 1400, .25), .005, .15, .25); break;
    case 'punch': out(noise(.1, 'lowpass', 1200), .001, .45, .08); break;
    case 'heli': out(noise(.08, 'lowpass', 300), .001, .2, .06); break;
  }
}
function updateLoopAudio(speedK, sirenK, playing){
  if (!au) return;
  const t = au.ctx.currentTime;
  au.e1.frequency.setTargetAtTime(55 + speedK * 90, t, .08); au.e2.frequency.setTargetAtTime(27 + speedK * 45, t, .08);
  au.elp.frequency.setTargetAtTime(300 + speedK * 900, t, .1);
  au.eng.gain.setTargetAtTime(playing ? .07 + speedK * .06 : 0, t, .15);
  au.sir.gain.setTargetAtTime(playing ? sirenK * .05 : 0, t, .2);
}

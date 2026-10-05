/* ---------- Small UI helpers ---------- */
function toast(t){ const d = document.createElement('div'); d.className = 'toast outline'; d.textContent = t; const b = $('#toasts'); b.appendChild(d); while (b.children.length > 4) b.firstChild.remove(); setTimeout(() => d.remove(), 2700); }
const floats = [];
function floatText(text, col, x, z){ const o = currentPos(); floats.push({ text, col: col || '#ffd23f', x: x != null ? x : o ? o.x : 0, z: z != null ? z : o ? o.z : 0, t: 0 }); }
let shakeA = 0;
function shake(a){ shakeA = Math.min(1.2, shakeA + a); }
let hurtA = 0;
function hurtFx(k){ hurtA = Math.min(1, hurtA + k); const hs = $('#hearts'); hs.classList.remove('hit'); void hs.offsetWidth; hs.classList.add('hit'); try { navigator.vibrate && navigator.vibrate(60); } catch (e) {} }
let carHitCD = 0;
function carHitFx(dmg){
  const b = $('#carhp');
  if (carHitCD <= 0 && dmg > 1.5) { carHitCD = .3; b.classList.remove('hit'); void b.offsetWidth; b.classList.add('hit'); }
  if (dmg > 10) hurtA = Math.min(.55, hurtA + dmg / 60);
  const v = player.car; if (v && dmg > 2) floatText('-' + Math.round(dmg / v.max * 100) + '%', '#ffb347', v.x, v.z);
}
function sirenPulse(){ const s = $('#sirens'); s.classList.remove('pulse'); void s.offsetWidth; s.classList.add('pulse'); }
function gameOverFx(kind){
  const b = $('#bigword'); b.textContent = kind; b.className = 'outline' + (kind === 'ARRESTED' ? ' red' : ''); b.hidden = false;
  $('#gl').classList.add('grey');
  try { navigator.vibrate && navigator.vibrate(120); } catch (e) {}
}

/* ---------- Ramps ---------- */
function checkRamp(v){
  if (v.heli || v.y > .05 || v.flipped || v.sink) return;
  const C = chunkAtXZ(v.x, v.z); if (!C || !C.ramps.length) return;
  for (const r of C.ramps) {
    if (v.x < r.x0 || v.x > r.x1 || v.z < r.z0 || v.z > r.z1) continue;
    const fx = (v.x - r.x0) / TILE, fz = (v.z - r.z0) / TILE;
    const prog = r.dx === 1 ? fx : r.dx === -1 ? 1 - fx : r.dz === 1 ? fz : 1 - fz;
    if (prog < .72) continue;
    const sp = v.vx * r.dx + v.vz * r.dz; if (sp < 8) continue;
    const up = 7 + sp * .33, air = 2 * up / GRAV;
    const flip = v === player.car && sp > 29 ? Math.PI * 2 / air : 0;
    launch(v, up, 0, flip); v.y = .1;
    if (v === player.car) sfx('whoosh');
    return;
  }
}

/* ---------- Camera ---------- */
const camOff = new V3(-21, 54, 21), camT = new V3(), camLead = new V3(), _cv = new V3(), camEye = new V3(), camLook = new V3();
let camMode = 0;
const CAM_NAMES = ['Overhead view', 'Chase view', 'First person'];
function cycleCam(){
  camMode = (camMode + 1) % 3; toast(CAM_NAMES[camMode]); sfx('ui');
  camera.near = camMode === 2 ? .08 : camMode === 1 ? .3 : 1; camera.fov = [36, 62, 74][camMode]; camera.updateProjectionMatrix();
  camEye.copy(camera.position); $('#bCam').textContent = camMode === 0 ? 'View' : camMode === 1 ? 'Chase' : '1st';
}
function eyeHeight(v){ const st = v.st; if (['bus', 'schoolbus', 'camper', 'semi', 'tanker', 'box', 'garbage', 'fire', 'launcher', 'armored', 'swatvan', 'van', 'icecream', 'ambulance'].includes(st)) return 2.9; if (st === 'dbus') return 5.2; if (['monster', 'bigwheel'].includes(st)) return 3.4; if (['kart', 'quad', 'f1', 'drag', 'rocketcar'].includes(st)) return 1.25; if (['tank', 'tracked'].includes(st)) return 2.7; return 1.85; }
function updateCam(dt){
  const o = currentPos() || { x: camT.x, z: camT.z, vx: 0, vz: 0 };
  if (camMode !== 0 && state !== 'menu' && currentPos()) {
    const car = player.car, a = car ? car.a : player.foot.a, dx = Math.sin(a), dz = Math.cos(a);
    camT.set(o.x, 0, o.z);
    if (camMode === 1) {
      const back = car ? 11 + car.l * .6 + Math.hypot(o.vx, o.vz) * .08 : 6.5, up = car ? 4.2 + car.w * .6 : 3.2;
      _cv.set(o.x - dx * back, (o.y || 0) + up, o.z - dz * back);
      camEye.lerp(_cv, 1 - Math.exp(-dt * 6));
      if (camEye.y < 1.5) camEye.y = 1.5;
      camera.position.copy(camEye);
      camLook.set(o.x + dx * 8, (o.y || 0) + 1.4, o.z + dz * 8);
    } else {
      const h = car ? eyeHeight(car) : (player.foot.swimming ? -.6 : 1.75);
      const fwd = car ? car.l * .08 : .25;
      camera.position.set(o.x + dx * fwd, (o.y || 0) + h, o.z + dz * fwd);
      camLook.set(o.x + dx * 30, (o.y || 0) + h - 2.2, o.z + dz * 30);
      if (car && car.flipped) camera.position.y = .6;
    }
    if (shakeA > 0) { camera.position.x += rnd(shakeA * .4); camera.position.y += rnd(shakeA * .4); shakeA = Math.max(0, shakeA - dt * 2.5); }
    camera.lookAt(camLook);
    sun.position.copy(camT).add(SUN_OFF); sun.target.position.copy(camT); sun.target.updateMatrixWorld();
    return;
  }
  camLead.lerp(_cv.set(o.vx * .4, 0, o.vz * .4), 1 - Math.exp(-dt * 2));
  const oy = (o.y || 0) > 3 ? o.y * .85 : 0;
  camT.lerp(_cv.set(o.x + camLead.x, oy, o.z + camLead.z), 1 - Math.exp(-dt * 9));
  const sp = Math.hypot(o.vx, o.vz), z = 1 + clamp(sp / 40, 0, 1) * .14 + (player.foot ? -.12 : 0) + clamp(oy / 25, 0, .35);
  camera.position.copy(camT).addScaledVector(camOff, z);
  if (shakeA > 0) { camera.position.x += rnd(shakeA * .9); camera.position.y += rnd(shakeA * .9); shakeA = Math.max(0, shakeA - dt * 2.5); }
  camera.lookAt(camT);
  sun.position.copy(camT).add(SUN_OFF); sun.target.position.copy(camT); sun.target.updateMatrixWorld();
}

/* ---------- HUD ---------- */
const hcv = $('#hudc'), hx = hcv.getContext('2d');
const _pr = new V3();
function toScreen(x, y, z){ _pr.set(x, y, z).project(camera); return { x: (_pr.x * .5 + .5) * W, y: (-_pr.y * .5 + .5) * H, on: _pr.z < 1 && Math.abs(_pr.x) < 1.1 && Math.abs(_pr.y) < 1.1 }; }
function arrowTo(x, z, col){
  const o = currentPos(); if (!o) return;
  const p = toScreen(o.x, 1, o.z), t = toScreen(x, 1, z);
  const ang = Math.atan2(t.y - p.y, t.x - p.x), r = 46;
  hx.save(); hx.translate(p.x + Math.cos(ang) * r, p.y + Math.sin(ang) * r); hx.rotate(ang);
  hx.fillStyle = col; hx.strokeStyle = '#1d1f2b'; hx.lineWidth = 3; hx.beginPath(); hx.moveTo(14, 0); hx.lineTo(-8, -11); hx.lineTo(-3, 0); hx.lineTo(-8, 11); hx.closePath(); hx.stroke(); hx.fill(); hx.restore();
}
function drawHudCanvas(dt){
  const dw = Math.round(W * DPR), dh = Math.round(H * DPR);
  if (hcv.width !== dw || hcv.height !== dh) { hcv.width = dw; hcv.height = dh; }
  hx.setTransform(DPR, 0, 0, DPR, 0, 0); hx.clearRect(0, 0, W, H);
  if (state !== 'play') return;
  const o = currentPos();
  // airdrops and letters get arrows
  for (const d of drops) { const s = toScreen(d.x, d.y + 2, d.z); if (!s.on) arrowTo(d.x, d.z, CRATE_COL[d.rarity]); else { hx.fillStyle = CRATE_COL[d.rarity]; hx.font = '28px "Lilita One", Impact, sans-serif'; hx.textAlign = 'center'; hx.strokeStyle = '#1d1f2b'; hx.lineWidth = 5; hx.strokeText('!', s.x, s.y - 30); hx.fillText('!', s.x, s.y - 30); } }
  for (const a of aircraft) if (a.kind === 'supply' && !a.dropped) arrowTo(a.x, a.z, CRATE_COL[a.rarity] || '#fff');
  if (o) for (const l of letterObjs) if (Math.hypot(l.x - o.x, l.z - o.z) < 200 && !toScreen(l.x, 1, l.z).on) arrowTo(l.x, l.z, '#e8473c');
  // storm cloud before DEBUGGED
  if (o && R.debugT > 12 && !R.over) {
    const s = toScreen(o.x, 6, o.z), k = (R.debugT - 12) / 6;
    hx.fillStyle = `rgba(40,42,52,${.6 + k * .3})`;
    for (let i = 0; i < 5; i++) { hx.beginPath(); hx.arc(s.x - 40 + i * 20, s.y - 60 + Math.sin(i * 2 + R.time * 3) * 4, 18 + (i % 2) * 6, 0, Math.PI * 2); hx.fill(); }
    if (Math.random() < .08) { hx.strokeStyle = '#ffd23f'; hx.lineWidth = 3; hx.beginPath(); hx.moveTo(s.x, s.y - 45); hx.lineTo(s.x - 8, s.y - 25); hx.lineTo(s.x + 4, s.y - 22); hx.lineTo(s.x - 4, s.y); hx.stroke(); }
    hx.font = '30px "Lilita One", Impact, sans-serif'; hx.textAlign = 'center'; hx.fillStyle = '#fffdf7'; hx.strokeStyle = '#1d1f2b'; hx.lineWidth = 6; hx.strokeText('MOVE!', s.x, s.y - 95); hx.fillText('MOVE!', s.x, s.y - 95);
  }
  // arrest warning
  if (o && (player.copT > .6 || player.armT > .5) && !R.over) {
    const s = toScreen(o.x, 3, o.z), k = Math.max(player.copT / 2.2, player.armT / 1.6);
    hx.strokeStyle = '#1d1f2b'; hx.lineWidth = 8; hx.beginPath(); hx.arc(s.x, s.y - 40, 20, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * k); hx.stroke();
    hx.strokeStyle = '#ff4b3e'; hx.lineWidth = 4; hx.stroke();
  }
  // floating text
  hx.textAlign = 'center';
  for (let i = floats.length - 1; i >= 0; i--) {
    const f = floats[i]; f.t += dt; if (f.t > 1.3) { floats.splice(i, 1); continue; }
    const s = toScreen(f.x, 3, f.z);
    hx.globalAlpha = 1 - Math.max(0, f.t - .8) / .5; hx.font = '24px "Lilita One", Impact, sans-serif';
    hx.strokeStyle = '#1d1f2b'; hx.lineWidth = 6; hx.strokeText(f.text, s.x, s.y - 30 - f.t * 40); hx.fillStyle = f.col; hx.fillText(f.text, s.x, s.y - 30 - f.t * 40); hx.globalAlpha = 1;
  }
}
const hc = {};
function setText(id, v){ if (hc[id] !== v) { hc[id] = v; $('#' + id).textContent = v; } }
function updateHudDom(){
  setText('score', R.score.toLocaleString('en-US'));
  setText('cashrun', '$' + R.cash);
  const lk = R.level + (R.level === 10 ? 'a' : '');
  if (hc.sir !== lk) { hc.sir = lk; $('#sirens').innerHTML = Array.from({ length: 10 }, (_, i) => `<div class="sir ${i < R.level ? 'on' : ''} ${R.level === 10 ? 'alien' : ''}"></div>`).join(''); }
  const foot = !!player.foot;
  const hk = player.hearts + '/' + player.maxH;
  if (hc.h !== hk) {
    const lost = hc.hn != null && player.hearts < hc.hn;
    hc.h = hk; hc.hn = player.hearts;
    $('#hearts').innerHTML = Array.from({ length: player.maxH }, (_, i) => `<div class="heart ${i < player.hearts ? '' : 'off'} ${lost && i === player.hearts ? 'pop' : ''}"></div>`).join('');
  }
  const car = player.car;
  $('#carhp').hidden = !car;
  if (car) {
    const f = clamp(car.hp / car.max, 0, 1), pct = Math.ceil(f * 100) + '%';
    setText('carhpV', pct); setText('carhpN', car.def ? car.def.n : 'Car');
    const bar = $('#carhpI'); bar.style.width = pct; bar.style.background = f > .55 ? 'var(--green)' : f > .25 ? 'var(--pop)' : 'var(--red)';
  }
  const swim = foot && player.foot.swimming;
  $('#stam').hidden = !swim; if (swim) $('#stamI').style.width = clamp(player.stamina / player.char.stam * 100, 0, 100) + '%';
  const pw = [];
  for (const [k, n] of [['nitroT', 'Nitro'], ['shieldT', 'Shield'], ['ghostT', 'Ghost'], ['magnetT', 'Magnet'], ['spikeT', 'Spikes']]) if (player[k] > 0) pw.push(`${n} ${Math.ceil(player[k])}`);
  if (player.bumperT > 0) pw.push(`Force bumper ${Math.ceil(player.bumperT)}`);
  if (player.glovesT > 0) pw.push(`Boxing gloves ${Math.ceil(player.glovesT)}`);
  if (player.jetT > 0) pw.push(`Jetpack ${Math.ceil(player.jetT)}`);
  if (R.tankMission && R.tankMission.t > 0) pw.push(`Tank kills ${R.tankMission.kills}/10 · ${Math.ceil(R.tankMission.t)}s`);
  if (R.oilMission > 0) pw.push(`Tanker ${Math.floor(R.oilMission)}/20s`);
  setText('powers', pw.join(' · '));
  const ex = player.car ? (player.car.heli && player.car.y > 2.5 ? 'Eject' : player.car.boat ? 'Jump out' : 'Get out') : nearEnterable() ? 'Get in' : '';
  if (hc.ex !== ex) { hc.ex = ex; $('#bExit').textContent = ex; $('#bExit').hidden = !ex; }
  $('#bShoot').hidden = !player.foot || player.foot.swimming;
  $('#bGas').hidden = !player.car || !isTouch;
  $('#bGrav').hidden = player.gravShots <= 0; setText('gravN', 'x' + player.gravShots);
  const grey = (player.car && player.car.def && player.car.def.grey) || R.timeGrey || R.over;
  $('#gl').classList.toggle('grey', !!grey);
}

/* ---------- Minimap ---------- */
const mini = $('#mini'), mx = mini.getContext('2d'), tileCol = new Map();
function tileColor(i, j){
  const k = i + ',' + j; let c = tileCol.get(k);
  if (c) return c;
  if (tileCol.size > 40000) tileCol.clear();
  if (waterTile(i, j)) c = '#3fa9e6'; else if (roadAt(i, j)) c = '#4b4e59'; else if (cityAt(i, j)) c = '#d8d2c4';
  else { const b = biomeAt(i, j); c = b === 'desert' ? '#f0d58a' : b === 'snow' ? '#f4f7fb' : '#7cc451'; }
  tileCol.set(k, c); return c;
}
let miniT = 0;
function drawMini(dt){
  miniT -= dt; if (miniT > 0) return; miniT = .15;
  const o = currentPos(); if (!o) return;
  const S = mini.clientWidth, dpr = DPR; if (mini.width !== Math.round(S * dpr)) { mini.width = mini.height = Math.round(S * dpr); }
  mx.setTransform(dpr, 0, 0, dpr, 0, 0); mx.clearRect(0, 0, S, S);
  mx.save(); mx.beginPath(); mx.arc(S / 2, S / 2, S / 2, 0, Math.PI * 2); mx.clip();
  mx.fillStyle = '#7cc451'; mx.fillRect(0, 0, S, S);
  mx.translate(S / 2, S / 2); mx.rotate(camMode === 0 ? -Math.PI / 4 : (player.car ? player.car.a : player.foot.a) + Math.PI);
  const px = 2.4, R0 = Math.ceil(S / px * .75), ci = tileOf(o.x), cj = tileOf(o.z), fx = (o.x / TILE - ci) * px, fz = (o.z / TILE - cj) * px;
  for (let j = -R0; j <= R0; j++) for (let i = -R0; i <= R0; i++) { mx.fillStyle = tileColor(ci + i, cj + j); mx.fillRect(i * px - fx, j * px - fz, px + .3, px + .3); }
  const dot = (x, z, col, r) => { mx.fillStyle = col; mx.beginPath(); mx.arc((x - o.x) / TILE * px, (z - o.z) / TILE * px, r, 0, Math.PI * 2); mx.fill(); };
  for (const v of vehicles) if (v.team === 'cop' && v.driver === 'ai') dot(v.x, v.z, '#ff2b2b', 3);
  for (const l of letterObjs) dot(l.x, l.z, '#e8473c', 3.5);
  for (const d of drops) dot(d.x, d.z, CRATE_COL[d.rarity], 3.5);
  mx.restore();
  mx.fillStyle = '#ffd23f'; mx.strokeStyle = '#1d1f2b'; mx.lineWidth = 2; mx.beginPath(); mx.arc(S / 2, S / 2, 4.5, 0, Math.PI * 2); mx.fill(); mx.stroke();
}

/* ---------- Thumbnails ---------- */
let thumbR = null, thumbS = null, thumbC = null;
const thumbs = new Map();
function thumb(key, geo, size, lookY){
  if (thumbs.has(key)) return thumbs.get(key);
  if (!thumbR) {
    try { thumbR = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true }); } catch (e) { return ''; }
    thumbR.setSize(200, 150); thumbR.setPixelRatio(1);
    thumbS = new THREE.Scene(); thumbS.add(new THREE.HemisphereLight(0xffffff, 0x8a98a8, .75)); const d = new THREE.DirectionalLight(0xffffff, .7); d.position.set(5, 8, 6); thumbS.add(d);
    thumbC = new THREE.PerspectiveCamera(30, 4 / 3, .1, 100);
  }
  const m = new THREE.Mesh(geo, MAT); thumbS.add(m);
  const s = size || 5;
  if (lookY != null) { thumbC.position.set(s * .9, lookY + s * .35, s * 1.25); thumbC.lookAt(0, lookY, 0); } else { thumbC.position.set(s * 1.25, s * .95, s * 1.45); thumbC.lookAt(0, s * .14, 0); }
  m.rotation.y = -.5;
  thumbR.render(thumbS, thumbC);
  const url = thumbR.domElement.toDataURL('image/png');
  thumbS.remove(m); thumbs.set(key, url); return url;
}
const carThumb = id => { const d = CAR[id], lvl = upLevel(id); return thumb('c' + id + lvl, carGeo(d.st, d.col, d.acc, d.glass, lvl, { stripe: d.stripe, plow: d.plow && !['digger', 'groomer', 'tracked', 'tractor'].includes(d.st) ? 1 : 0 }), Math.max(4.4, dims(d.st)[1]) * 1.05); };
const charThumb = id => thumb('p' + id, personGeo(CHAR[id]), CHAR[id].big ? 3.9 : 3.4, CHAR[id].big ? 1.25 : 1.15);

/* ---------- Menus ---------- */
function showOnly(id){ ['#menu', '#garage', '#prize', '#missions', '#results', '#paused'].forEach(s => $(s).hidden = s !== id); }
function refreshMenu(){
  setTextEl('#mCash', save.cash.toLocaleString('en-US'));
  setTextEl('#mCar', `${CAR[save.car].n} · ${CHAR[save.char].n}`);
  setTextEl('#mBest', `Best ${save.best.toLocaleString('en-US')}`);
  $('#mSound').textContent = muted ? 'Sound off' : 'Sound on';
  const g = giftState(); $('#mGift').disabled = !g.ready; $('#mGift').innerHTML = g.ready ? `Free gift <small>$${g.amount}</small>` : `Gift in ${g.wait}`;
  $('#mPrize').disabled = save.cash < 100;
}
function setTextEl(sel, t){ $(sel).textContent = t; }
function giftState(){
  const now = Date.now(), hr = 3600e3, day = 20 * 3600e3;
  if (now - (save.daily || 0) >= day) return { ready: true, amount: 100, kind: 'daily' };
  if (now - (save.hourly || 0) >= hr) return { ready: true, amount: 50, kind: 'hourly' };
  const left = hr - (now - save.hourly), m = Math.ceil(left / 60000);
  return { ready: false, wait: m > 59 ? '1h' : m + 'm' };
}
$('#mGift').addEventListener('click', () => { const g = giftState(); if (!g.ready) return; save[g.kind] = Date.now(); if (g.kind === 'daily') save.hourly = Date.now(); save.cash += g.amount; persist(); sfx('cash'); toast(`+$${g.amount} free gift`); refreshMenu(); });
$('#mSound').addEventListener('click', () => { initAudio(); setMuted(!muted); refreshMenu(); });
$('#mPlay').addEventListener('click', () => { initAudio(); startRun(); });
$('#mGarage').addEventListener('click', () => openGarage('cars'));
$('#mPrize').addEventListener('click', () => openPrize());
$('#mMissions').addEventListener('click', openMissions);

let gTab = 'cars', gSel = null;
function openGarage(tab){
  gTab = tab || gTab; gSel = gTab === 'cars' ? save.car : save.char;
  showOnly('#garage'); renderGarage();
}
function renderGarage(){
  setTextEl('#gCash', save.cash.toLocaleString('en-US'));
  document.querySelectorAll('#garage .tab').forEach(t => t.classList.toggle('on', t.dataset.t === gTab));
  const list = gTab === 'cars' ? CARS : CHARS, owned = gTab === 'cars' ? save.owned : save.chars, cur = gTab === 'cars' ? save.car : save.char;
  $('#gGrid').innerHTML = list.map(d => {
    const own = !!owned[d.id], lv = gTab === 'cars' && own ? ['', 'II', 'III', 'IV'][upLevel(d.id)] : '';
    return `<button class="gcard ${own ? '' : 'lock'} ${d.id === cur ? 'sel' : ''}" data-id="${d.id}"><span class="lv">${lv}</span><img alt="" src="${gTab === 'cars' ? carThumb(d.id) : charThumb(d.id)}"><b>${own ? d.n : '???'}</b><i style="background:${RAR[d.r].c}">${RAR[d.r].n}</i></button>`;
  }).join('');
  const d = (gTab === 'cars' ? CAR : CHAR)[gSel] || list[0], own = !!owned[d.id];
  let det = '';
  if (gTab === 'cars') {
    const pts = save.upg[d.id] || 0, lv = upLevel(d.id);
    det = `<img alt="" src="${carThumb(d.id)}" style="${own ? '' : 'filter:brightness(0) opacity(.55)'}"><div style="display:grid;gap:6px;min-width:0"><div style="font:400 24px var(--f-d)">${own ? d.n : '???'} <span style="font:800 11px var(--f-u);color:${RAR[d.r].c};text-transform:uppercase">${RAR[d.r].n}</span></div>
      ${d.tag && own ? `<div style="font:700 13px var(--f-u)">${d.tag}</div>` : ''}${!own && d.how ? `<div style="font:700 13px var(--f-u)">Unlock: ${d.how}</div>` : !own ? '<div style="font:700 13px var(--f-u)">Win it from the prize machine.</div>' : ''}
      ${['Speed', 'Health', 'Handling'].map((n, i) => `<div class="stat"><span>${n}</span><div class="tr"><i style="width:${[d.s, d.h, d.d][i] * 10}%"></i></div></div>`).join('')}
      ${own ? `<div style="font:800 12px var(--f-u)">Level ${['I', 'II', 'III', 'IV'][lv]} · upgrades ${pts}/6</div>` : ''}</div>`;
  } else {
    det = `<img alt="" src="${charThumb(d.id)}" style="${own ? '' : 'filter:brightness(0) opacity(.55)'}"><div style="display:grid;gap:6px;min-width:0"><div style="font:400 24px var(--f-d)">${own ? d.n : '???'} <span style="font:800 11px var(--f-u);color:${RAR[d.r].c};text-transform:uppercase">${RAR[d.r].n}</span></div>
      <div class="hearts" style="position:static">${Array.from({ length: d.hearts }, () => '<div class="heart"></div>').join('')}</div>
      <div style="font:700 13px var(--f-u)">${own ? (d.tag || 'Runs, swims and steals cars.') : d.how ? 'Unlock: ' + d.how : 'Win them from the prize machine.'}</div></div>`;
  }
  $('#gDetail').innerHTML = det;
}
$('#gGrid').addEventListener('click', e => {
  const b = e.target.closest('.gcard'); if (!b) return;
  gSel = b.dataset.id; sfx('ui');
  if (gTab === 'cars' && save.owned[gSel]) save.car = gSel;
  if (gTab === 'chars' && save.chars[gSel]) save.char = gSel;
  persist(); renderGarage(); if (state === 'menu') placeMenuCar();
});
document.querySelectorAll('#garage .tab').forEach(t => t.addEventListener('click', () => { gTab = t.dataset.t; gSel = gTab === 'cars' ? save.car : save.char; renderGarage(); }));
$('#gClose').addEventListener('click', () => { backToMenuOrResults(); });

let prizeWon = null, spinning = false;
function openPrize(){ showOnly('#prize'); prizeWon = null; $('#pUse').hidden = true; $('#reelStar').hidden = true; $('#reelImg').src = carThumb(save.car); $('#prizeText').textContent = `Spin for a random vehicle, character or upgrade. Doubles turn into upgrades. You have $${save.cash}.`; $('#pSpin').disabled = save.cash < 100; }
function rollPrize(){
  if (!save.spun) { save.spun = true; return { kind: 'char', id: 'robokid' }; }
  let t = Math.random() * 100, rar = 'common';
  for (const k of ['legendary', 'epic', 'rare', 'common']) { const w = { legendary: 3, epic: 10, rare: 25, common: 62 }[k]; if (t < w) { rar = k; break; } t -= w; }
  const pool = [...CARS.filter(c => c.r === rar).map(c => ({ kind: 'car', id: c.id })), ...CHARS.filter(c => c.r === rar).map(c => ({ kind: 'char', id: c.id }))];
  return pick(Math.random, pool);
}
function applyPrize(p){
  if (p.kind === 'car') { if (save.owned[p.id]) { save.upg[p.id] = Math.min(6, (save.upg[p.id] || 0) + 1); return `Duplicate ${CAR[p.id].n}: +1 upgrade (${save.upg[p.id]}/6)`; } save.owned[p.id] = true; return `New vehicle: ${CAR[p.id].n}!`; }
  if (save.chars[p.id]) { save.cash += 25; return `Duplicate ${CHAR[p.id].n}: +$25`; }
  save.chars[p.id] = true; return `New character: ${CHAR[p.id].n}!`;
}
$('#pSpin').addEventListener('click', () => {
  if (spinning || save.cash < 100) return;
  initAudio(); save.cash -= 100; spinning = true; $('#pSpin').disabled = true; $('#pUse').hidden = true; $('#reelStar').hidden = true;
  const prize = rollPrize(), star = Math.random() < .06, prize2 = star ? rollPrize() : null;
  const pool = CARS.filter(c => c.r !== 'mystery');
  let t = 0, step = 60;
  const tick = () => {
    t += step; step *= 1.09; sfx('ui', .5);
    $('#reelImg').src = carThumb(pick(Math.random, pool).id);
    if (t < 1700) setTimeout(tick, step);
    else {
      $('#reelImg').src = prize.kind === 'car' ? carThumb(prize.id) : charThumb(prize.id);
      let msg = applyPrize(prize);
      if (prize2) { msg += ' Star! Double prize: ' + applyPrize(prize2); $('#reelStar').hidden = false; }
      persist(); sfx('win'); spinning = false;
      $('#prizeText').textContent = msg + ` You have $${save.cash}.`;
      $('#pSpin').disabled = save.cash < 100;
      prizeWon = prize; $('#pUse').hidden = false; $('#pUse').textContent = prize.kind === 'car' ? 'Drive it' : 'Play as them';
    }
  };
  tick();
});
$('#pUse').addEventListener('click', () => { if (!prizeWon) return; if (prizeWon.kind === 'car') save.car = prizeWon.id; else save.char = prizeWon.id; persist(); backToMenuOrResults(); if (state === 'menu') placeMenuCar(); });
$('#pClose').addEventListener('click', backToMenuOrResults);
function backToMenuOrResults(){ if (state === 'over') { showOnly('#results'); refreshResults(); } else { showOnly('#menu'); refreshMenu(); } }

function openMissions(){
  showOnly('#missions');
  $('#mList').innerHTML = MISSIONS.map(m => {
    const done = !!save.missions[m.id + '_done'], rew = m.car ? CAR[m.car].n : CHAR[m.char].n;
    return `<div class="mitem ${done ? 'done' : ''}"><b>${m.n}</b><em>${done ? 'Done' : m.prog ? m.prog() : ''}</em><span>${m.d}</span><span style="text-align:right;font-weight:800">Unlocks ${rew}</span></div>`;
  }).join('');
}
$('#msClose').addEventListener('click', backToMenuOrResults);

function refreshResults(){
  setTextEl('#rCash', save.cash.toLocaleString('en-US'));
  $('#rPrize').disabled = save.cash < 100;
}
function showResults(){
  state = 'over';
  const newBest = R.score > save.best;
  if (newBest) save.best = R.score;
  save.stats.totalScore += R.score; save.stats.runs++;
  persist();
  $('#rTitle').textContent = R.overKind; $('#rWhy').textContent = R.overWhy;
  $('#rScore').textContent = R.score.toLocaleString('en-US');
  $('#rBestL').textContent = newBest ? 'New best!' : 'Best'; $('#rBest').textContent = save.best.toLocaleString('en-US');
  $('#rStats').textContent = `Wanted level ${R.level} · ${R.kills} cop${R.kills === 1 ? "" : "s"} wrecked · ${R.smashed} thing${R.smashed === 1 ? "" : "s"} smashed · $${R.cash} collected`;
  refreshResults(); showOnly('#results'); $('#hud').hidden = true;
}
$('#rAgain').addEventListener('click', () => startRun());
$('#rPrize').addEventListener('click', openPrize);
$('#rGarage').addEventListener('click', () => openGarage('cars'));
$('#rMenu').addEventListener('click', toMenu);
$('#bPause').addEventListener('click', pauseGame);
$('#paResume').addEventListener('click', resumeGame);
$('#paQuit').addEventListener('click', () => { $('#paused').hidden = true; state = 'play'; endRun('ARRESTED', 'You turned yourself in.'); R.overT = 2; });
$('#bExit').addEventListener('click', e => { e.stopPropagation(); if (player.car) exitCar(); else enterNearest(); });
$('#bGrav').addEventListener('click', e => { e.stopPropagation(); fireGravity(); });
function pauseGame(){ if (state !== 'play' || R.over) return; state = 'paused'; $('#paused').hidden = false; }
function resumeGame(){ if (state !== 'paused') return; state = 'play'; $('#paused').hidden = true; }

/* ---------- Runs ---------- */
function clearEntities(){
  for (const v of vehicles.slice()) removeVehicle(v);
  for (const p of people.slice()) removePerson(p);
  for (const p of projs) scene.remove(p.m); projs.length = 0;
  for (const a of aircraft) scene.remove(a.grp); aircraft.length = 0;
  for (const m of mines) scene.remove(m.m); mines.length = 0;
  for (const p of puddles) scene.remove(p.m); puddles.length = 0;
  for (const d of drops) scene.remove(d.grp); drops.length = 0;
  for (const h of holes) scene.remove(h.m); holes.length = 0;
  for (const c of looseCash) scene.remove(c.m); looseCash.length = 0;
  for (const l of letterObjs) scene.remove(l.grp); letterObjs.length = 0;
  clearSkids(); clearPickups();
  for (const s of spikes) scene.remove(s.m); spikes.length = 0; shieldMesh.visible = false;
}
function resetRunState(){
  Object.assign(R, { score: 0, scoreF: 0, level: 1, cash: 0, kills: 0, police: 0, smashed: 0, time: 0, over: false, slow: 1, collected: new Set(), dropT: 25, debugT: 0, anchor: { x: 0, z: 0 }, bomberT: 15, apacheT: 8, ufoT: 0, mineT: 0, blockT: 14, heliT: 8, crashPtsT: 0, tankMission: null, oilMission: 0, flipsRun: 0, timeGrey: false, sprays: [], cashX: 1, started: false, spawnT: 3, overT: 0, boatT: 0, boatToast: false, copHeliT: 0 });
  const c = CHAR[save.char] || CHAR.rookie;
  Object.assign(player, { car: null, foot: null, alive: true, hearts: c.hearts, maxH: c.hearts, char: c, invT: 0, stamina: c.stam, swimDist: 0, copT: 0, armT: 0, armBy: null, deckUsed: false, boostSpd: 1, bumperT: 0, glovesT: 0, jetT: 0, gravShots: 0, fastRun: 1, timeT: 0, rocketSave: false, nitroT: 0, magnetT: 0, spikeT: 0, shieldT: 0, ghostT: 0 });
}
function startRun(){
  state = 'play';
  showOnly(null); $('#hud').hidden = false; $('#bigword').hidden = true; $('#tapstart').hidden = false;
  $('#gl').classList.remove('grey');
  clearEntities(); clearWorld(); tileCol.clear();
  SEED = (Math.random() * 1e6) | 0;
  resetRunState();
  ensureChunks(9, 0, 2, 99);
  player.car = spawnPlayerCar(save.car, 9, 0, 0);
  const c1 = spawnCop('police', 3, 30, Math.PI), c2 = spawnCop('police', 9, -24, 0);
  c1.spawnT = c2.spawnT = 0;
  spawnLetters();
  camT.set(9, 0, 0); camLead.set(0, 0, 0);
  for (const k in hc) delete hc[k];
  save.stats.runs = save.stats.runs || 0;
}
function toMenu(){
  if (camMode !== 0) { camMode = 2; cycleCam(); }
  state = 'menu'; showOnly('#menu'); $('#hud').hidden = true; $('#bigword').hidden = true; $('#gl').classList.remove('grey');
  clearEntities(); clearWorld(); SEED = 7; resetRunState();
  ensureChunks(9, 0, 2, 99);
  placeMenuCar(); refreshMenu();
}
function placeMenuCar(){
  for (const v of vehicles.slice()) removeVehicle(v);
  player.car = spawnPlayerCar(save.car, 9, 0, .6);
  camT.set(9, 0, 0);
}

/* ---------- Input ---------- */
const pointers = new Map(); let spaceLock = false, keyL = false, keyR = false, keyB = false, keyW = false, keyF = false, btnGas = false, btnShoot = false;
function syncInput(){
  let l = keyL || keyB, r = keyR || keyB;
  for (const s of pointers.values()) { if (s === 'L') l = true; else r = true; }
  input.left = l; input.right = r; input.gas = keyW || btnGas; input.fire = keyF || btnShoot;
  if ((l || r || input.gas) && state === 'play' && !R.started) { R.started = true; $('#tapstart').hidden = true; initAudio(); }
}
$('#app').addEventListener('pointerdown', e => {
  if (state !== 'play' || e.button === 2 || e.target.closest('button') || e.target.closest('.overlay')) return;
  pointers.set(e.pointerId, e.clientX < W / 2 ? 'L' : 'R'); syncInput();
});
$('#app').addEventListener('pointermove', e => { if (pointers.has(e.pointerId)) { pointers.set(e.pointerId, e.clientX < W / 2 ? 'L' : 'R'); syncInput(); } });
const endP = e => { if (pointers.delete(e.pointerId)) syncInput(); };
$('#app').addEventListener('contextmenu', e => { e.preventDefault(); if (state === 'play') cycleCam(); });
$('#bCam').addEventListener('click', e => { e.stopPropagation(); cycleCam(); });
for (const [id, set] of [['#bGas', v => btnGas = v], ['#bShoot', v => btnShoot = v]]) {
  const el = $(id);
  el.addEventListener('pointerdown', e => { e.stopPropagation(); set(true); syncInput(); });
  for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) el.addEventListener(ev, () => { set(false); syncInput(); });
}
addEventListener('pointerup', endP); addEventListener('pointercancel', endP);
addEventListener('keydown', e => {
  const c = e.code;
  if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', 'Space'].includes(c) && state === 'play') e.preventDefault();
  if (c === 'KeyW' || c === 'ArrowUp') keyW = true;
  if (c === 'KeyF' || (c === 'Space' && !player.car && !spaceLock)) keyF = true;
  if (c === 'ArrowLeft' || c === 'KeyA') keyL = true;
  if (c === 'ArrowRight' || c === 'KeyD') keyR = true;
  if (c === 'ArrowDown' || c === 'KeyS') keyB = true;
  syncInput();
  if (e.repeat) return;
  if (c === 'Space' && state === 'play' && !R.over && player.car) { spaceLock = true; exitCar(); }
  if (c === 'KeyC' && state === 'play') cycleCam();
  if (c === 'KeyE' && state === 'play' && !R.over) { if (player.car) exitCar(); else enterNearest(); }
  if (c === 'KeyG' && state === 'play') fireGravity();
  if (c === 'Escape' || c === 'KeyP') { if (state === 'play') pauseGame(); else if (state === 'paused') resumeGame(); }
  if (c === 'Enter' && state === 'menu' && $('#garage').hidden && $('#prize').hidden && $('#missions').hidden) startRun();
});
addEventListener('keyup', e => { const c = e.code; if (c === 'ArrowLeft' || c === 'KeyA') keyL = false; if (c === 'ArrowRight' || c === 'KeyD') keyR = false; if (c === 'ArrowDown' || c === 'KeyS') keyB = false; if (c === 'KeyW' || c === 'ArrowUp') keyW = false; if (c === 'Space' || c === 'KeyF') keyF = false; if (c === 'Space') spaceLock = false; syncInput(); });
addEventListener('blur', () => { keyL = keyR = keyB = keyW = keyF = btnGas = btnShoot = false; pointers.clear(); syncInput(); pauseGame(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) pauseGame(); });
if (isTouch) document.body.classList.add('touch');
function onResize(){ W = innerWidth; H = innerHeight; renderer.setSize(W, H); camera.aspect = W / H; camera.updateProjectionMatrix(); }
addEventListener('resize', onResize);

/* ---------- Loop ---------- */
let last = performance.now(), hudT = 0, wallT = 0;
function frame(now){
  requestAnimationFrame(frame);
  const dt = Math.min(.05, (now - last) / 1000); last = now; wallT += dt;
  if (state === 'play' || state === 'over') {
    if (R.over) { R.overT += dt; R.slow = lerp(R.slow, .22, 1 - Math.exp(-dt * 4)); if (R.overT > 2.3 && state === 'play') showResults(); }
    const sdt = dt * R.slow;
    if (R.started || R.over) simulate(sdt);
    else { for (const v of vehicles) syncMesh(v); for (const p of people) stepPerson(p, 0); }
    updatePool(litPool, sdt); updatePool(glowPool, sdt); updateFlashes(sdt);
  } else if (state === 'menu') {
    if (player.car) { player.car.a += dt * .3; syncMesh(player.car); }
    updatePool(litPool, dt); updatePool(glowPool, dt); updateFlashes(dt);
  }
  updateLightBars(wallT);
  for (const C of chunks.values()) for (const c of C.cashM || []) c.m.rotation.y += dt * 2;
  for (const c of looseCash) c.m.rotation.y += dt * 2;
  ensureChunks(camT.x, camT.z, 2, state === 'play' ? 2 : 6);
  updateCam(dt);
  renderer.render(scene, camera);
  drawHudCanvas(dt);
  hurtA = Math.max(0, hurtA - dt * 2.2); carHitCD -= dt; const hu = $('#hurt'); const ho = (state === 'play' ? hurtA : 0).toFixed(2); if (hu.dataset.o !== ho) { hu.dataset.o = ho; hu.style.opacity = ho; }
  if (state === 'play') { drawMini(dt); if ((hudT -= dt) <= 0) { hudT = .1; updateHudDom(); } }
  const o = currentPos(), sp = o ? Math.hypot(o.vx, o.vz) : 0;
  let near = 999; if (state === 'play') for (const v of vehicles) if (v.team === 'cop' && v.bar && v.driver === 'ai') near = Math.min(near, Math.hypot(v.x - (o ? o.x : 0), v.z - (o ? o.z : 0)));
  updateLoopAudio(player.car ? clamp(sp / 30, 0, 1) : 0, clamp(1 - near / 70, 0, 1), state === 'play' && !R.over && R.started && !!player.car);
}
toMenu();
requestAnimationFrame(frame);

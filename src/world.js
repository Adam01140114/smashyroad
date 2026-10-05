/* ---------- Procedural world ---------- */
const TILE = 6, CH = 10, CHW = TILE * CH;
let SEED = 1;
const mod = (a, n) => ((a % n) + n) % n;
const PAL = {
  grass: ['#7cc451', '#76bd4b', '#82ca57'], sand: ['#f0d58a', '#ecd083', '#f3da93'], snow: ['#f4f7fb', '#eef3f8', '#f8fafc'],
  road: '#4b4e59', road2: '#474a55', side: '#cdc9bf', side2: '#c6c2b8', lot: '#5a5d68', water: '#3fa9e6', water2: '#49b2ec', bank: '#8a6a45',
  line: '#f4f1e6', yellow: '#ffd23f', dirt: '#b8915c'
};
const BUILD_COLS = ['#f2a65a', '#e8766e', '#7fc8f8', '#f9e07f', '#b8a9e8', '#9ee09e', '#f4f1ea', '#ffb3c7', '#8fd3c9', '#e9c46a'];
const WIN = '#3b4a6b', WIN2 = '#5a7bb0';
function cityBlock(bi, bj){ return vnoise(bi * .23 + .5, bj * .23 + .5, SEED + 1) > .54; }
function cityAt(i, j){ return cityBlock(Math.floor(i / 10), Math.floor(j / 10)); }
function roadCol(i, j){ if (mod(i, 20) < 2) return true; if (mod(i, 10) < 2) { const bi = Math.floor(i / 10), bj = Math.floor(j / 10); return cityBlock(bi, bj) || cityBlock(bi - 1, bj); } return false; }
function roadRow(i, j){ if (mod(j, 20) < 2) return true; if (mod(j, 10) < 2) { const bi = Math.floor(i / 10), bj = Math.floor(j / 10); return cityBlock(bi, bj) || cityBlock(bi, bj - 1); } return false; }
const roadAt = (i, j) => roadCol(i, j) || roadRow(i, j);
function biomeAt(i, j){ const t = vnoise(i * .011, j * .011, SEED + 2) * .75 + vnoise(i * .045, j * .045, SEED + 3) * .25; return t > .6 ? 'desert' : t < .37 ? 'snow' : 'grass'; }
const nearStart = (i, j) => Math.abs(i) < 9 && Math.abs(j) < 14;
function riverAt(i, j){ if (nearStart(i, j)) return false; const n = vnoise(i * .012, j * .012, SEED + 5) * .78 + vnoise(i * .05, j * .05, SEED + 8) * .22; return Math.abs(n - .5) < .05; }
function roadNear(i, j, r){ for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) if (roadAt(i + x, j + y)) return true; return false; }
function lakeAt(i, j){ if (nearStart(i, j) || cityAt(i, j)) return false; return vnoise(i * .026, j * .026, SEED + 6) * .8 + vnoise(i * .09, j * .09, SEED + 9) * .2 > .66; }
function seaAt(i, j){ if (nearStart(i, j) || cityAt(i, j)) return false; return vnoise(i * .0055, j * .0055, SEED + 12) * .85 + vnoise(i * .04, j * .04, SEED + 13) * .15 > .66; }
function bodyAt(i, j){ return riverAt(i, j) || lakeAt(i, j) || seaAt(i, j); }
function gapAt(i, j){ const line = roadCol(i, j) ? 'c' + (i - mod(i, 2)) : 'r' + (j - mod(j, 2)); const k = roadCol(i, j) ? Math.floor(j / 14) : Math.floor(i / 14); return h01(line.length * 7 + (roadCol(i, j) ? i : j), k, SEED + 7) < .42; }
function waterTile(i, j){ if (!bodyAt(i, j)) return false; if (roadAt(i, j)) return riverAt(i, j) && !lakeAt(i, j) && !seaAt(i, j) && gapAt(i, j); return true; }
function bridgeTile(i, j){ return roadAt(i, j) && bodyAt(i, j) && !waterTile(i, j); }
const tileOf = v => Math.floor(v / TILE);
function waterAt(x, z){ return waterTile(tileOf(x), tileOf(z)); }
function boatWaterAt(x, z){ return bodyAt(tileOf(x), tileOf(z)); }

/* chunk storage */
const chunks = new Map();
const ck = (ci, cj) => ci + ',' + cj;
function chunkAtXZ(x, z){ return chunks.get(ck(Math.floor(x / CHW), Math.floor(z / CHW))); }

function buildChunk(ci, cj){
  const g = new GB(), pr = new GB();
  const C = { ci, cj, boxes: [], circles: [], props: [], ramps: [], cash: [], parked: [], side: [], letters: [], meshes: [], powers: [], helis: [], boats: [], grp: new THREE.Group() };
  const i0 = ci * CH, j0 = cj * CH, r = rngFor(ci, cj, SEED + 11);
  const city = cityBlock(ci, cj);
  const biome = biomeAt(i0 + 5, j0 + 5);
  const T = [];
  // ground
  for (let tj = 0; tj < CH; tj++) for (let ti = 0; ti < CH; ti++) {
    const i = i0 + ti, j = j0 + tj, x0 = i * TILE, z0 = j * TILE, x1 = x0 + TILE, z1 = z0 + TILE;
    const road = roadAt(i, j), water = waterTile(i, j), bridge = bridgeTile(i, j);
    let kind = 'ground';
    const jit = (h01(i, j, 3) - .5) * .05;
    if (water) {
      kind = 'water';
      g.flat(x0, z0, x1, z1, -1.1, h01(i, j, 4) > .5 ? PAL.water : PAL.water2);
      // boats moored along the shore, bow pointing out to open water
      if (!road && h01(i, j, 71) < .07) for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        if (!waterTile(i + dx, j + dz) && waterTile(i - dx, j - dz) && waterTile(i - 2 * dx, j - 2 * dz)) { C.boats.push({ x: x0 + 3 - dx * .8, z: z0 + 3 - dz * .8, a: Math.atan2(-dx, -dz) }); break; }
      }
      for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        if (waterTile(i + dx, j + dz)) continue;
        if (dx === 1) g.box(x1 - .01, -1.1, z0, x1, 0, z1, PAL.bank, { noSides: false });
        else if (dx === -1) g.box(x0, -1.1, z0, x0 + .01, 0, z1, PAL.bank);
        else if (dz === 1) g.box(x0, -1.1, z1 - .01, x1, 0, z1, PAL.bank);
        else g.box(x0, -1.1, z0, x1, 0, z0 + .01, PAL.bank);
      }
    } else if (road) {
      kind = 'road';
      if (bridge) {
        g.flat(x0, z0, x1, z1, -1.1, PAL.water);
        g.box(x0, -.5, z0, x1, 0, z1, '#8d8a85');
        g.flat(x0 + .01, z0 + .01, x1 - .01, z1 - .01, .01, PAL.road);
        const col = roadCol(i, j);
        if (col && !roadCol(i - 1, j)) g.box(x0, 0, z0, x0 + .4, .9, z1, '#e6e1d6');
        if (col && !roadCol(i + 1, j)) g.box(x1 - .4, 0, z0, x1, .9, z1, '#e6e1d6');
        if (!col && !roadRow(i, j - 1)) g.box(x0, 0, z0, x1, .9, z0 + .4, '#e6e1d6');
        if (!col && !roadRow(i, j + 1)) g.box(x0, 0, z1 - .4, x1, .9, z1, '#e6e1d6');
      } else g.flat(x0, z0, x1, z1, 0, h01(i, j, 4) > .5 ? PAL.road : PAL.road2);
      const vc = roadCol(i, j), hr = roadRow(i, j);
      if (vc && !hr && mod(i, 2) === 0 && mod(j, 2) === 0) g.flat(x1 - .15, z0 + 1, x1 + .15, z0 + 4.5, .03, PAL.yellow);
      if (hr && !vc && mod(j, 2) === 0 && mod(i, 2) === 0) g.flat(x0 + 1, z1 - .15, x0 + 4.5, z1 + .15, .03, PAL.yellow);
      // crosswalks next to city junctions
      if (city && vc && !hr && (roadRow(i, j - 1) || roadRow(i, j + 1)) && !bridge) for (let k = 0; k < 4; k++) g.flat(x0 + .4 + k * 1.4, roadRow(i, j - 1) ? z0 + .4 : z1 - 1.6, x0 + 1.1 + k * 1.4, roadRow(i, j - 1) ? z0 + 1.6 : z1 - .4, .03, PAL.line);
      // cash on the median and in junctions
      if (!bridge && !water) {
        if (vc && hr && mod(i, 2) === 1 && mod(j, 2) === 1 && h01(i, j, 21) < .55) C.cash.push({ x: x1 - 0, z: z1 - 0 });
        else if (vc && !hr && mod(i, 2) === 0 && h01(i, j, 22) < .045) C.cash.push({ x: x1, z: z0 + 3 });
        else if (hr && !vc && mod(j, 2) === 0 && h01(i, j, 22) < .045) C.cash.push({ x: x0 + 3, z: z1 });
        if (city && !hr && !vc) {}
      }
      if (!bridge && !water && !(vc && hr) && h01(i, j, 61) < .011) C.powers.push({ x: x0 + 3, z: z0 + 3 });
      // jump ramps before river gaps
      for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const ni = i + dx, nj = j + dz;
        if (!bridge && roadAt(ni, nj) && waterTile(ni, nj) && ((dx !== 0 && roadRow(i, j) && !roadCol(i, j)) || (dz !== 0 && roadCol(i, j) && !roadRow(i, j)))) {
          addRamp(g, C, x0, z0, dx, dz);
        }
      }
    } else if (city) {
      const side = roadNear(i, j, 1);
      kind = side ? 'side' : 'lot';
      g.flat(x0, z0, x1, z1, side ? .08 : .02, side ? (h01(i, j, 4) > .5 ? PAL.side : PAL.side2) : '#a9a59b', jit * .5);
      if (side) C.side.push({ x: x0 + 3, z: z0 + 3 });
    } else {
      let col = pick(() => h01(i, j, 5), PAL[biome === 'desert' ? 'sand' : biome]);
      const shore = bodyAt(i + 1, j) || bodyAt(i - 1, j) || bodyAt(i, j + 1) || bodyAt(i, j - 1);
      if (shore && biome === 'grass') col = PAL.sand[0];
      g.flat(x0, z0, x1, z1, 0, col, jit);
      kind = shore ? 'shore' : 'ground';
    }
    T.push({ i, j, ti, tj, kind, x0, z0 });
  }
  // contents
  if (city) buildCityBlock(g, pr, C, r, i0, j0, T);
  else buildCountry(g, pr, C, r, biome, T);
  // meshes
  const gm = meshFrom(g, true); gm.castShadow = true; C.grp.add(gm); C.ground = gm;
  if (pr.count) { const pm = meshFrom(pr, true, true); C.grp.add(pm); C.propMesh = pm; }
  scene.add(C.grp);
  chunks.set(ck(ci, cj), C);
  onChunkBuilt(C);
  return C;
}
function addRamp(g, C, x0, z0, dx, dz){
  // wedge rising toward the water edge, covering the half of the tile next to the gap
  const steps = 5;
  for (let s = 0; s < steps; s++) {
    const t0 = s / steps, t1 = (s + 1) / steps, h = (s + 1) * .32;
    let a0, a1;
    if (dx === 1) g.box(x0 + 3 + t0 * 3, 0, z0 + .3, x0 + 3 + t1 * 3, h, z0 + 5.7, s % 2 ? '#f2c14e' : '#e9e4d8');
    else if (dx === -1) g.box(x0 + 3 - t1 * 3, 0, z0 + .3, x0 + 3 - t0 * 3, h, z0 + 5.7, s % 2 ? '#f2c14e' : '#e9e4d8');
    else if (dz === 1) g.box(x0 + .3, 0, z0 + 3 + t0 * 3, x0 + 5.7, h, z0 + 3 + t1 * 3, s % 2 ? '#f2c14e' : '#e9e4d8');
    else g.box(x0 + .3, 0, z0 + 3 - t1 * 3, x0 + 5.7, h, z0 + 3 - t0 * 3, s % 2 ? '#f2c14e' : '#e9e4d8');
  }
  C.ramps.push({ x0, z0, x1: x0 + TILE, z1: z0 + TILE, dx, dz });
}

/* props: breakable, explosive */
function prop(pr, C, kind, x, z, rad, build, opts){
  const start = pr.count; build(pr); const count = pr.count - start;
  C.props.push(Object.assign({ kind, x, z, r: rad, start, count, alive: true }, opts || {}));
}
const P = {
  bush(pr, x, z, s){ pr.cb(x, 0, z, 1.8 * s, 1.3 * s, 1.8 * s, '#4f9e3a', { j: (Math.random() - .5) * .06 }); pr.cb(x + .3 * s, .9 * s, z - .2 * s, 1.1 * s, .8 * s, 1.1 * s, '#5fb447'); },
  fenceZ(pr, x, z, l){ for (let k = 0; k < 4; k++) pr.cb(x, 0, z - l / 2 + .2 + k * (l - .4) / 3, .25, 1.3, .25, '#f4efe4'); pr.cb(x, .45, z, .18, .2, l, '#f4efe4'); pr.cb(x, .95, z, .18, .2, l, '#f4efe4'); },
  fenceX(pr, x, z, l){ for (let k = 0; k < 4; k++) pr.cb(x - l / 2 + .2 + k * (l - .4) / 3, 0, z, .25, 1.3, .25, '#f4efe4'); pr.cb(x, .45, z, l, .2, .18, '#f4efe4'); pr.cb(x, .95, z, l, .2, .18, '#f4efe4'); },
  lamp(pr, x, z){ pr.cb(x, 0, z, .35, 5.2, .35, '#5d6270'); pr.cb(x, 5.2, z, 1.4, .35, .5, '#5d6270'); pr.cb(x + .5, 4.9, z, .6, .3, .4, '#fff2b0'); },
  hydrant(pr, x, z){ pr.cb(x, 0, z, .7, .9, .7, '#e8473c'); pr.cb(x, .9, z, .45, .3, .45, '#c93a30'); pr.cb(x, .5, z, 1, .25, .25, '#e8473c'); },
  bin(pr, x, z){ pr.cb(x, 0, z, .9, 1.2, .9, '#3f7d4f'); pr.cb(x, 1.2, z, 1, .15, 1, '#2f5e3b'); },
  cone(pr, x, z){ pr.cb(x, 0, z, .8, .2, .8, '#ff7b25'); pr.cb(x, .2, z, .5, .5, .5, '#ff7b25'); pr.cb(x, .7, z, .3, .3, .3, '#f4f1ea'); },
  cactus(pr, x, z, s){ pr.cb(x, 0, z, .9, 3.4 * s, .9, '#4c9a52'); pr.cb(x - .8, 1.4 * s, z, .7, .5, .6, '#4c9a52'); pr.cb(x - 1.1, 1.4 * s, z, .55, 1.4 * s, .55, '#4c9a52'); pr.cb(x + .75, 2 * s, z, .6, .45, .55, '#4c9a52'); pr.cb(x + 1.05, 2 * s, z, .5, 1 * s, .5, '#4c9a52'); },
  snowman(pr, x, z){ pr.cb(x, 0, z, 1.8, 1.6, 1.8, '#ffffff'); pr.cb(x, 1.6, z, 1.3, 1.2, 1.3, '#ffffff'); pr.cb(x, 2.8, z, .9, .9, .9, '#ffffff'); pr.cb(x, 3.1, z + .5, .2, .2, .5, '#ff8c1a'); pr.cb(x, 3.7, z, 1, .2, 1, '#2b2d33'); pr.cb(x, 3.9, z, .7, .6, .7, '#2b2d33'); },
  hay(pr, x, z){ pr.cb(x, 0, z, 2, 1.4, 1.4, '#e9c46a'); pr.cb(x, .55, z, 2.05, .2, 1.45, '#c9a34a'); },
  mailbox(pr, x, z){ pr.cb(x, 0, z, .25, 1.1, .25, '#7a5a3a'); pr.cb(x, 1.1, z, .6, .5, .9, '#2f6fd8'); },
  sapling(pr, x, z){ pr.cb(x, 0, z, .35, 1.4, .35, '#7a5233'); pr.cb(x, 1.3, z, 1.5, 1.5, 1.5, '#5fb447'); },
  bench(pr, x, z){ pr.cb(x, 0, z, 2.4, .5, .9, '#9a6a3f'); pr.cb(x, .5, z - .35, 2.4, .7, .2, '#9a6a3f'); },
  sign(pr, x, z){ pr.cb(x, 0, z, .25, 2.4, .25, '#9aa0aa'); pr.cb(x, 2.2, z, 1.4, 1, .15, '#f2c14e'); },
  deadbush(pr, x, z){ pr.cb(x, 0, z, 1.3, .9, 1.3, '#a9845a'); pr.cb(x + .2, .7, z, .7, .5, .7, '#8d6c47'); },
  barrel(pr, x, z){ pr.cb(x, 0, z, 1.2, 1.6, 1.2, '#d9483b'); pr.cb(x, .5, z, 1.25, .2, 1.25, '#f2c14e'); pr.cb(x, 1.6, z, .5, .15, .5, '#8a2f26'); },
  pump(pr, x, z){ pr.cb(x, 0, z, 1.2, .3, 2, '#8d939e'); pr.cb(x, .3, z, .9, 2.2, 1.2, '#e8473c'); pr.cb(x, 1.6, z, .95, .6, 1.25, '#f4f1ea'); pr.cb(x + .55, 1, z, .2, .9, .2, '#2b2d33'); }
};
function tree(g, C, x, z, s, biome){
  if (biome === 'snow') {
    g.cb(x, 0, z, .7, 1.4, .7, '#6b4a2e');
    g.cb(x, 1.2, z, 3.4 * s, 1.4, 3.4 * s, '#2f6b45'); g.cb(x, 2.5, z, 2.6 * s, 1.3, 2.6 * s, '#2f6b45'); g.cb(x, 3.7, z, 1.7 * s, 1.2, 1.7 * s, '#2f6b45');
    g.cb(x, 4.9, z, .9 * s, .8, .9 * s, '#f4f7fb'); g.cb(x, 2.6, z, 2.7 * s, .3, 2.7 * s, '#eef3f8');
  } else {
    g.cb(x, 0, z, .8, 2, .8, '#7a5233');
    g.cb(x, 1.8, z, 3.4 * s, 2.6 * s, 3.4 * s, pick(Math.random, ['#3f8f3a', '#4c9a3f', '#5aa846']));
    g.cb(x + .4, 3.6 * s, z - .3, 2.2 * s, 1.6 * s, 2.2 * s, '#62b24d');
  }
  C.circles.push({ x, z, r: 1.3 * s });
}
function rock(g, C, x, z, s, col){
  g.cb(x, 0, z, 3 * s, 1.6 * s, 2.6 * s, col || '#9a9a9e'); g.cb(x + .4 * s, 1.4 * s, z - .2 * s, 1.8 * s, 1 * s, 1.6 * s, col || '#a8a8ad');
  C.circles.push({ x, z, r: 1.6 * s });
}
function building(g, C, x0, z0, x1, z1, h, col, r){
  g.box(x0, 0, z0, x1, h, z1, col);
  const floors = Math.floor((h - 1.5) / 3.2);
  for (let f = 0; f < floors; f++) {
    const y = 1.6 + f * 3.2;
    for (let x = x0 + 1.6; x < x1 - 1.2; x += 2.6) { g.box(x, y, z1, x + 1.4, y + 1.6, z1 + .08, f === 0 && Math.abs(x - (x0 + x1) / 2) < 1.4 ? '#6b4a2e' : WIN); g.box(x, y, z0 - .08, x + 1.4, y + 1.6, z0, WIN); }
    for (let z = z0 + 1.6; z < z1 - 1.2; z += 2.6) { g.box(x1, y, z, x1 + .08, y + 1.6, z + 1.4, WIN); g.box(x0 - .08, y, z, x0, y + 1.6, z + 1.4, WIN); }
  }
  const pc = new THREE.Color(col).offsetHSL(0, 0, -.08).getStyle();
  g.box(x0 - .2, h, z0 - .2, x1 + .2, h + .5, z0 + .5, pc); g.box(x0 - .2, h, z1 - .5, x1 + .2, h + .5, z1 + .2, pc);
  g.box(x0 - .2, h, z0, x0 + .5, h + .5, z1, pc); g.box(x1 - .5, h, z0, x1 + .2, h + .5, z1, pc);
  if (r() < .6) g.cb((x0 + x1) / 2 + (r() - .5) * 4, h, (z0 + z1) / 2 + (r() - .5) * 4, 2.4, 1.4, 1.8, '#c9ccd3');
  if (r() < .3) { g.cb(x0 + 3, h, z0 + 3, 2.2, 2.6, 2.2, '#8a6a45'); g.cb(x0 + 3, h + 2.6, z0 + 3, 2.6, .5, 2.6, '#6b4a2e'); }
  C.boxes.push({ x0, z0, x1, z1, h });
}
function house(g, C, x, z, r, biome){
  const w = 7 + r() * 2, d = 6 + r() * 2, col = pick(r, ['#f4efe4', '#f2d0a4', '#cfe3f2', '#f6c9c9', '#d8e8c8']), roof = pick(r, ['#c4473d', '#6d4c41', '#45627a', '#7a3e48']);
  const x0 = x - w / 2, z0 = z - d / 2, x1 = x + w / 2, z1 = z + d / 2;
  g.box(x0, 0, z0, x1, 3.6, z1, col);
  for (let k = 0; k < 4; k++) g.box(x0 - .4 + k * .5, 3.6 + k * .55, z0 - .4, x1 + .4 - k * .5, 4.15 + k * .55, z1 + .4, roof);
  g.box(x - .7, 0, z1, x + .7, 2.3, z1 + .1, '#7a5233');
  g.box(x0 + 1, 1.4, z1, x0 + 2.4, 2.6, z1 + .1, WIN2); g.box(x1 - 2.4, 1.4, z1, x1 - 1, 2.6, z1 + .1, WIN2);
  g.cb(x1 - 1.5, 3.6, z0 + 1.5, .9, 3, .9, '#8a8f99');
  C.boxes.push({ x0, z0, x1, z1, h: 4 });
}

function buildCityBlock(g, pr, C, r, i0, j0, T){
  // lot interior from tile 3 to 8 (36 x 36 units)
  const lx0 = (i0 + 3) * TILE, lz0 = (j0 + 3) * TILE, lx1 = (i0 + 9) * TILE, lz1 = (j0 + 9) * TILE;
  const roll = r();
  if (roll < .12) {
    // park
    g.flat(lx0, lz0, lx1, lz1, .05, '#7cc451');
    g.box(lx0 + 14, 0, lz0 + 14, lx1 - 14, .8, lz1 - 14, '#bfbab0'); g.flat(lx0 + 15, lz0 + 15, lx1 - 15, lz1 - 15, .82, PAL.water2);
    C.boxes.push({ x0: lx0 + 14, z0: lz0 + 14, x1: lx1 - 14, z1: lz1 - 14, h: 1 });
    for (let k = 0; k < 7; k++) { const x = lx0 + 3 + r() * 30, z = lz0 + 3 + r() * 30; if (Math.abs(x - (lx0 + 18)) < 7 && Math.abs(z - (lz0 + 18)) < 7) continue; if (r() < .5) tree(g, C, x, z, .9 + r() * .3, 'grass'); else prop(pr, C, 'bush', x, z, 1.1, p => P.bush(p, x, z, 1)); }
    for (let k = 0; k < 3; k++) { const x = lx0 + 6 + k * 12, z = lz0 + 3; prop(pr, C, 'bench', x, z, 1.2, p => P.bench(p, x, z)); }
  } else if (roll < .26) {
    // parking lot
    g.flat(lx0, lz0, lx1, lz1, .05, PAL.lot);
    for (let k = 0; k < 7; k++) g.flat(lx0 + 2 + k * 5, lz0 + 2, lx0 + 2.2 + k * 5, lz0 + 9, .07, PAL.line);
    for (let k = 0; k < 7; k++) g.flat(lx0 + 2 + k * 5, lz1 - 9, lx0 + 2.2 + k * 5, lz1 - 2, .07, PAL.line);
    for (let k = 0; k < 6; k++) { if (r() < .55) C.parked.push({ x: lx0 + 4.6 + k * 5, z: lz0 + 5.5, a: 0 }); if (r() < .55) C.parked.push({ x: lx0 + 4.6 + k * 5, z: lz1 - 5.5, a: Math.PI }); }
    for (let k = 0; k < 4; k++) { const x = lx0 + 6 + r() * 24, z = lz0 + 16 + r() * 4; prop(pr, C, 'cone', x, z, .6, p => P.cone(p, x, z)); }
  } else if (roll < .34) {
    // gas station: explodes if you hit a pump
    g.flat(lx0, lz0, lx1, lz1, .05, '#6a6d78');
    building(g, C, lx0 + 2, lz0 + 2, lx0 + 14, lz0 + 12, 4.5, '#f4f1ea', r);
    g.box(lx0 + 16, 7, lz0 + 14, lx1 - 2, 7.8, lz1 - 6, '#e8473c'); g.box(lx0 + 16, 7.8, lz0 + 14, lx1 - 2, 8.1, lz1 - 6, '#f4f1ea');
    for (const [dx, dz] of [[0, 0], [0, 1], [1, 0], [1, 1]]) { const x = lx0 + 19 + dx * 12, z = lz0 + 17 + dz * 10; g.cb(x, 0, z, .5, 7, .5, '#d0ccc4'); }
    for (const [dx, dz] of [[0, 0], [1, 0], [0, 1], [1, 1]]) { const x = lx0 + 22 + dx * 6, z = lz0 + 19 + dz * 6; prop(pr, C, 'pump', x, z, 1.1, p => P.pump(p, x, z), { explosive: true }); }
    C.parked.push({ x: lx0 + 8, z: lz0 + 20, a: Math.PI / 2 });
  } else if (roll < .42) {
    // special services building
    const kind = pick(r, ['police', 'fire', 'hospital']);
    const col = kind === 'police' ? '#5b84c4' : kind === 'fire' ? '#d9483b' : '#f4f1ea';
    building(g, C, lx0 + 2, lz0 + 2, lx1 - 2, lz0 + 20, 9, col, r);
    if (kind === 'hospital') { g.box(lx0 + 15, 9.5, lz0 + 8, lx0 + 21, 9.7, lz0 + 14, '#e8473c'); g.box(lx0 + 17, 9.5, lz0 + 6, lx0 + 19, 9.7, lz0 + 16, '#e8473c'); }
    if (kind === 'police') { g.box(lx0 + 6, 9.5, lz0 + 8, lx0 + 9, 10.4, lz0 + 10, '#e8473c'); g.box(lx0 + 9, 9.5, lz0 + 8, lx0 + 12, 10.4, lz0 + 10, '#2f80ed'); }
    g.flat(lx0, lz0 + 20, lx1, lz1, .05, PAL.lot);
    for (let k = 0; k < (kind === 'hospital' ? 2 : 3); k++) if (r() < .7) C.parked.push({ x: lx0 + 8 + k * 9, z: lz0 + 28, a: Math.PI, police: kind === 'police' });
    if (kind === 'hospital') { g.flat(lx0 + 25, lz0 + 23, lx1 - 1, lz1 - 1, .07, '#ffd23f'); g.flat(lx0 + 26, lz0 + 24, lx1 - 2, lz1 - 2, .08, '#6e6b66'); C.helis.push({ x: lx0 + 30.5, z: lz0 + 29.5, a: 0 }); }
  } else {
    const h = () => 6 + Math.floor(r() * (r() < .2 ? 11 : 7));
    const layout = r();
    if (layout < .3) building(g, C, lx0 + 1, lz0 + 1, lx1 - 1, lz1 - 1, h() + 3, pick(r, BUILD_COLS), r);
    else if (layout < .6) { building(g, C, lx0 + 1, lz0 + 1, lx1 - 1, lz0 + 17, h(), pick(r, BUILD_COLS), r); building(g, C, lx0 + 1, lz0 + 19, lx1 - 1, lz1 - 1, h(), pick(r, BUILD_COLS), r); }
    else for (const [a, b] of [[0, 0], [1, 0], [0, 1], [1, 1]]) building(g, C, lx0 + 1 + a * 18, lz0 + 1 + b * 18, lx0 + 17 + a * 18, lz0 + 17 + b * 18, h(), pick(r, BUILD_COLS), r);
  }
  // street furniture on sidewalks
  for (const t of T) {
    if (t.kind !== 'side') continue;
    const cx = t.x0 + 3, cz = t.z0 + 3, hr = h01(t.i, t.j, 31);
    const corner = (t.ti === 2 || t.ti === 9) && (t.tj === 2 || t.tj === 9);
    if (corner) prop(pr, C, 'lamp', cx, cz, .5, p => P.lamp(p, cx, cz));
    else if (hr < .07) prop(pr, C, 'hydrant', cx, cz, .6, p => P.hydrant(p, cx, cz), { spray: true });
    else if (hr < .14) prop(pr, C, 'bin', cx, cz, .6, p => P.bin(p, cx, cz));
    else if (hr < .19) prop(pr, C, 'mailbox', cx, cz, .5, p => P.mailbox(p, cx, cz));
    else if (hr < .3) prop(pr, C, 'sapling', cx, cz, .8, p => P.sapling(p, cx, cz));
  }
}
function buildCountry(g, pr, C, r, biome, T){
  const poi = r();
  let poiBox = null;
  const ci = C.ci, cj = C.cj, i0 = ci * CH, j0 = cj * CH;
  const cx = (i0 + 5.5) * TILE, cz = (j0 + 5.5) * TILE;
  const blocked = (x, z) => poiBox && x > poiBox[0] - 3 && x < poiBox[2] + 3 && z > poiBox[1] - 3 && z < poiBox[3] + 3;
  const freeArea = (x0, z0, x1, z1) => { for (let i = tileOf(x0); i <= tileOf(x1); i++) for (let j = tileOf(z0); j <= tileOf(z1); j++) if (roadAt(i, j) || waterTile(i, j)) return false; return true; };
  if (biome === 'desert' && poi < .08 && freeArea(cx - 14, cz - 14, cx + 14, cz + 14)) {
    for (let k = 0; k < 7; k++) g.box(cx - 13 + k * 2, k * 2.4, cz - 13 + k * 2, cx + 13 - k * 2, (k + 1) * 2.4, cz + 13 - k * 2, k % 2 ? '#e2c27a' : '#d9b56a');
    C.boxes.push({ x0: cx - 13, z0: cz - 13, x1: cx + 13, z1: cz + 13, h: 17 }); poiBox = [cx - 13, cz - 13, cx + 13, cz + 13];
  } else if (biome !== 'desert' && poi < .1 && freeArea(cx - 14, cz - 12, cx + 14, cz + 12)) {
    // farm
    g.box(cx - 8, 0, cz - 6, cx + 2, 6, cz + 4, '#c4473d'); g.box(cx - 8.5, 6, cz - 6.5, cx + 2.5, 6.8, cz + 4.5, '#f4efe4'); g.box(cx - 7.5, 6.8, cz - 6, cx + 1.5, 8.2, cz + 4, '#8a3a33');
    g.box(cx - 4.5, 0, cz + 4, cx - 1.5, 4, cz + 4.1, '#f4efe4');
    C.boxes.push({ x0: cx - 8, z0: cz - 6, x1: cx + 2, z1: cz + 4, h: 8 });
    g.cb(cx + 7, 0, cz - 4, 3.2, 9, 3.2, '#b9c0c8'); g.cb(cx + 7, 9, cz - 4, 3.6, 1, 3.6, '#8a8f99'); C.circles.push({ x: cx + 7, z: cz - 4, r: 2 });
    for (let k = 0; k < 4; k++) { const x = cx + 4 + k * 2.4, z = cz + 6; prop(pr, C, 'hay', x, z, 1.1, p => P.hay(p, x, z)); }
    for (let k = 0; k < 6; k++) { const x = cx - 13 + k * 4, z = cz + 11; prop(pr, C, 'fence', x, z, 1.4, p => P.fenceX(p, x, z, 3.8)); }
    poiBox = [cx - 13, cz - 7, cx + 10, cz + 12];
  } else if (poi < .22 && poi >= .16 && freeArea(cx - 9, cz - 9, cx + 9, cz + 9)) {
    // helipad with a helicopter you can steal
    g.box(cx - 7, 0, cz - 7, cx + 7, .18, cz + 7, '#8d8a85'); g.flat(cx - 6.4, cz - 6.4, cx + 6.4, cz + 6.4, .2, '#6e6b66');
    g.flat(cx - 3, cz - 3.2, cx - 1.8, cz + 3.2, .22, '#ffd23f'); g.flat(cx + 1.8, cz - 3.2, cx + 3, cz + 3.2, .22, '#ffd23f'); g.flat(cx - 1.8, cz - .6, cx + 1.8, cz + .6, .22, '#ffd23f');
    C.helis.push({ x: cx, z: cz, a: r() * 6 }); poiBox = [cx - 8, cz - 8, cx + 8, cz + 8];
  } else if (poi < .16 && freeArea(cx - 12, cz - 10, cx + 12, cz + 10)) {
    house(g, C, cx - 6, cz - 2, r, biome); if (r() < .7) house(g, C, cx + 7, cz + 3, r, biome);
    const x = cx - 6, z = cz + 4; prop(pr, C, 'mailbox', x + 3, z + 1, .5, p => P.mailbox(p, x + 3, z + 1));
    if (r() < .6) C.parked.push({ x: cx + 1, z: cz - 6, a: Math.PI / 2 });
    poiBox = [cx - 12, cz - 7, cx + 12, cz + 8];
  }
  for (const t of T) {
    if (t.kind !== 'ground' && t.kind !== 'shore') continue;
    const hr = h01(t.i, t.j, 41), x = t.x0 + 1.2 + h01(t.i, t.j, 42) * 3.6, z = t.z0 + 1.2 + h01(t.i, t.j, 43) * 3.6;
    if (blocked(x, z)) continue;
    const nearRoad = roadNear(t.i, t.j, 1);
    if (nearRoad && biome === 'grass' && hr < .32) {
      if (roadCol(t.i + 1, t.j) || roadCol(t.i - 1, t.j)) { const fx = t.x0 + (roadCol(t.i + 1, t.j) ? 5.3 : .7), fz = t.z0 + 3; prop(pr, C, 'fence', fx, fz, 1.6, p => P.fenceZ(p, fx, fz, 5.6)); continue; }
      if (roadRow(t.i, t.j + 1) || roadRow(t.i, t.j - 1)) { const fz = t.z0 + (roadRow(t.i, t.j + 1) ? 5.3 : .7), fx = t.x0 + 3; prop(pr, C, 'fence', fx, fz, 1.6, p => P.fenceX(p, fx, fz, 5.6)); continue; }
    }
    if (nearRoad && hr < .05) { prop(pr, C, 'sign', x, z, .6, p => P.sign(p, x, z)); continue; }
    if (biome === 'grass') {
      if (hr < .13 && !nearRoad) tree(g, C, x, z, .85 + h01(t.i, t.j, 44) * .4, 'grass');
      else if (hr < .22) prop(pr, C, 'bush', x, z, 1.1, p => P.bush(p, x, z, .9 + h01(t.i, t.j, 45) * .4));
      else if (hr < .235 && !nearRoad) rock(g, C, x, z, .8 + h01(t.i, t.j, 46) * .5);
      else if (hr < .27) { const c = pick(Math.random, ['#ffd23f', '#ff7bac', '#ffffff', '#a98bff']); for (let k = 0; k < 3; k++) g.cb(x + (k - 1) * .7, 0, z + (k % 2) * .5, .35, .35, .35, c); }
    } else if (biome === 'desert') {
      if (hr < .07) prop(pr, C, 'cactus', x, z, .9, p => P.cactus(p, x, z, .9 + h01(t.i, t.j, 44) * .4));
      else if (hr < .12 && !nearRoad) rock(g, C, x, z, .8 + h01(t.i, t.j, 46) * .7, '#c98b5a');
      else if (hr < .17) prop(pr, C, 'deadbush', x, z, .9, p => P.deadbush(p, x, z));
      else if (hr < .175) prop(pr, C, 'barrel', x, z, .9, p => P.barrel(p, x, z), { explosive: true });
    } else {
      if (hr < .15 && !nearRoad) tree(g, C, x, z, .9 + h01(t.i, t.j, 44) * .4, 'snow');
      else if (hr < .18) prop(pr, C, 'snowman', x, z, 1.1, p => P.snowman(p, x, z));
      else if (hr < .2 && !nearRoad) rock(g, C, x, z, .8, '#b8bec8');
      else if (hr < .26) prop(pr, C, 'bush', x, z, 1, p => { P.bush(p, x, z, .9); p.cb(x, 1.3 * .9, z, 1.7, .25, 1.7, '#f4f7fb'); });
    }
  }
}
function disposeChunk(C){
  scene.remove(C.grp);
  C.grp.traverse(o => { if (o.geometry) o.geometry.dispose(); });
  chunks.delete(ck(C.ci, C.cj));
  onChunkGone(C);
}
function clearWorld(){ for (const C of [...chunks.values()]) disposeChunk(C); }
function ensureChunks(x, z, R, budget){
  const ci = Math.floor(x / CHW), cj = Math.floor(z / CHW);
  let built = 0;
  for (let d = 0; d <= R; d++) for (let j = cj - d; j <= cj + d; j++) for (let i = ci - d; i <= ci + d; i++) {
    if (Math.max(Math.abs(i - ci), Math.abs(j - cj)) !== d) continue;
    if (!chunks.has(ck(i, j))) { buildChunk(i, j); if (++built >= budget) return; }
  }
  for (const C of [...chunks.values()]) if (Math.max(Math.abs(C.ci - ci), Math.abs(C.cj - cj)) > R + 1) disposeChunk(C);
}
function breakProp(C, p){
  if (!p.alive) return;
  p.alive = false;
  const pos = C.propMesh.geometry.attributes.position, arr = pos.array;
  for (let k = p.start; k < p.start + p.count; k++) { arr[k * 3] = p.x; arr[k * 3 + 1] = -5; arr[k * 3 + 2] = p.z; }
  pos.needsUpdate = true;
}
// query helpers
function forNearChunks(x, z, fn){
  const ci = Math.floor(x / CHW), cj = Math.floor(z / CHW), fx = x / CHW - ci, fz = z / CHW - cj;
  const di = fx < .25 ? -1 : fx > .75 ? 1 : 0, dj = fz < .25 ? -1 : fz > .75 ? 1 : 0;
  const a = chunks.get(ck(ci, cj)); if (a) fn(a);
  if (di) { const b = chunks.get(ck(ci + di, cj)); if (b) fn(b); }
  if (dj) { const b = chunks.get(ck(ci, cj + dj)); if (b) fn(b); }
  if (di && dj) { const b = chunks.get(ck(ci + di, cj + dj)); if (b) fn(b); }
}
function solidAt(x, z, pad){
  let hit = false; pad = pad || 0;
  forNearChunks(x, z, C => {
    if (hit) return;
    for (const b of C.boxes) if (x > b.x0 - pad && x < b.x1 + pad && z > b.z0 - pad && z < b.z1 + pad) { hit = true; return; }
    for (const c of C.circles) if ((x - c.x) ** 2 + (z - c.z) ** 2 < (c.r + pad) ** 2) { hit = true; return; }
  });
  return hit;
}
function findRoadNear(x, z, minD, maxD, tries){
  for (let k = 0; k < (tries || 30); k++) {
    const a = Math.random() * Math.PI * 2, d = minD + Math.random() * (maxD - minD);
    const px = x + Math.cos(a) * d, pz = z + Math.sin(a) * d, i = tileOf(px), j = tileOf(pz);
    if (roadAt(i, j) && !waterTile(i, j) && chunkAtXZ(px, pz)) return { x: i * TILE + 3, z: j * TILE + 3, i, j };
  }
  return null;
}

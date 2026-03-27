const fs = require('fs');
const dir = 'C:/Users/rikfrankel/kop-lodge-platform/blueprints';

function ftIn(px) {
  const ft = Math.floor(px / 12);
  const inches = px % 12;
  return ft + "'-" + inches + '"';
}

// Shared SVG header/styles
function svgOpen(vbW, vbH, title) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vbW} ${vbH}" width="${vbW}" height="${vbH}" font-family="'Courier New', monospace">
  <defs>
    <style>
      .wall { stroke: #1a1a2e; stroke-width: 4; fill: none; stroke-linecap: square; }
      .wall-thin { stroke: #1a1a2e; stroke-width: 2; fill: none; }
      .dim-line { stroke: #555; stroke-width: 1; fill: none; }
      .dim-tick { stroke: #555; stroke-width: 1.5; }
      .dim-text { font-size: 11px; fill: #333; text-anchor: middle; font-weight: bold; }
      .leader { stroke: #555; stroke-width: 0.75; fill: none; stroke-dasharray: 3,2; marker-end: url(#arrow); }
      .leader-plain { stroke: #555; stroke-width: 0.75; fill: none; stroke-dasharray: 3,2; }
      .leader-tick { stroke: #555; stroke-width: 1.5; }
      .room-label { font-size: 26px; fill: #1a1a2e; text-anchor: middle; font-weight: bold; }
      .sub-label { font-size: 14px; fill: #555; text-anchor: middle; }
      .title { font-size: 22px; fill: #1a1a2e; text-anchor: middle; font-weight: bold; }
      .subtitle { font-size: 13px; fill: #555; text-anchor: middle; }
      .note { font-size: 11px; fill: #666; }
      .door { stroke: #1a1a2e; stroke-width: 1.5; fill: none; }
      .exit-label { font-size: 12px; fill: #c0392b; text-anchor: middle; font-weight: bold; letter-spacing: 1px; }
      .street { font-size: 15px; fill: #666; text-anchor: middle; font-style: italic; }
      .stair-fill { fill: #e0e2ea; }
      .hc-icon { fill: #1a1a2e; font-size: 24px; text-anchor: middle; }
      .compass { font-size: 11px; fill: #1a1a2e; text-anchor: middle; font-weight: bold; }
    </style>
    <marker id="arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#555"/></marker>
  </defs>
  <rect width="${vbW}" height="${vbH}" fill="#fefefe"/>
  <text x="${vbW/2}" y="32" class="title">${title}</text>
  <text x="${vbW - 16}" y="${vbH - 8}" class="note" text-anchor="end">Door icons not to scale.</text>
`;
}

// 4-direction compass rose (south at top, north at bottom — front of lodge faces south/12th Ave)
function compass(cx, cy) {
  const r = 22;
  return `  <g transform="translate(${cx},${cy})">
    <line x1="0" y1="${-r}" x2="0" y2="${r}" stroke="#1a1a2e" stroke-width="1"/>
    <line x1="${-r}" y1="0" x2="${r}" y2="0" stroke="#1a1a2e" stroke-width="1"/>
    <polygon points="0,${-r-4} -4,${-r+4} 4,${-r+4}" fill="#1a1a2e"/>
    <polygon points="0,${r+4} -4,${r-4} 4,${r-4}" fill="#1a1a2e"/>
    <polygon points="${-r-4},0 ${-r+4},-4 ${-r+4},4" fill="#1a1a2e"/>
    <polygon points="${r+4},0 ${r-4},-4 ${r-4},4" fill="#1a1a2e"/>
    <text x="0" y="${-r-8}" class="compass">S</text>
    <text x="0" y="${r+14}" class="compass">N</text>
    <text x="${-r-10}" y="4" class="compass">E</text>
    <text x="${r+10}" y="4" class="compass">W</text>
  </g>
`;
}

const TICK = 6; // perpendicular tick half-length

// Dimension collectors — lines render first, labels render last (on top)
let _dimLines = '';
let _dimLabels = '';
function dimFlush() { const l = _dimLines; const t = _dimLabels; _dimLines = ''; _dimLabels = ''; return l + t; }
function dimReset() { _dimLines = ''; _dimLabels = ''; }

function dimH(x1, x2, y, px, above, offset) {
  const base = above ? -35 : 35;
  const extra = (offset || 0) * (above ? -22 : 22);
  const dy = base + extra;
  const label = ftIn(px);
  const yd = y + dy;
  const extEnd = y + dy + (above ? -8 : 8);
  const mx = (x1 + x2) / 2;
  const span = x2 - x1;

  _dimLines += `  <line x1="${x1}" y1="${y}" x2="${x1}" y2="${extEnd}" class="dim-line"/>\n`;
  _dimLines += `  <line x1="${x2}" y1="${y}" x2="${x2}" y2="${extEnd}" class="dim-line"/>\n`;
  _dimLines += `  <line x1="${x1}" y1="${yd}" x2="${x2}" y2="${yd}" class="dim-line"/>\n`;
  _dimLines += `  <line x1="${x1}" y1="${yd-TICK}" x2="${x1}" y2="${yd+TICK}" class="dim-tick"/>\n`;
  _dimLines += `  <line x1="${x2}" y1="${yd-TICK}" x2="${x2}" y2="${yd+TICK}" class="dim-tick"/>\n`;

  if (span < 65) {
    const jogDir = above ? -1 : 1;
    const jogY = yd + jogDir * 18;
    const runX = x2 + 20;
    // Arrow points from label toward dim line
    _dimLines += `  <line x1="${runX}" y1="${jogY}" x2="${mx}" y2="${jogY}" class="leader-plain"/>\n`;
    _dimLines += `  <line x1="${mx}" y1="${jogY}" x2="${mx}" y2="${yd}" class="leader"/>\n`;
    _dimLines += `  <line x1="${mx-TICK}" y1="${yd}" x2="${mx+TICK}" y2="${yd}" class="leader-tick"/>\n`;
    _dimLabels += `  <rect x="${runX+2}" y="${jogY-8}" width="50" height="14" fill="#fefefe"/>\n`;
    _dimLabels += `  <text x="${runX+4}" y="${jogY+4}" class="dim-text" text-anchor="start">${label}</text>\n`;
  } else {
    const ty = above ? yd - 5 : yd + 13;
    _dimLabels += `  <rect x="${mx-30}" y="${ty-10}" width="60" height="14" fill="#fefefe"/>\n`;
    _dimLabels += `  <text x="${mx}" y="${ty}" class="dim-text">${label}</text>\n`;
  }
  return ''; // collected, not returned inline
}

function dimV(x, y1, y2, px, left, offset) {
  const base = left ? -35 : 35;
  const extra = (offset || 0) * (left ? -22 : 22);
  const dx = base + extra;
  const label = ftIn(px);
  const xd = x + dx;
  const extEnd = x + dx + (left ? -8 : 8);
  const my = (y1 + y2) / 2;
  const span = y2 - y1;

  _dimLines += `  <line x1="${x}" y1="${y1}" x2="${extEnd}" y2="${y1}" class="dim-line"/>\n`;
  _dimLines += `  <line x1="${x}" y1="${y2}" x2="${extEnd}" y2="${y2}" class="dim-line"/>\n`;
  _dimLines += `  <line x1="${xd}" y1="${y1}" x2="${xd}" y2="${y2}" class="dim-line"/>\n`;
  _dimLines += `  <line x1="${xd-TICK}" y1="${y1}" x2="${xd+TICK}" y2="${y1}" class="dim-tick"/>\n`;
  _dimLines += `  <line x1="${xd-TICK}" y1="${y2}" x2="${xd+TICK}" y2="${y2}" class="dim-tick"/>\n`;

  if (span < 65) {
    const jogDir = left ? -1 : 1;
    const jogX = xd + jogDir * 18;
    const runY = y1 - 20;
    // Arrow points from label toward dim line
    _dimLines += `  <line x1="${jogX}" y1="${runY}" x2="${jogX}" y2="${my}" class="leader-plain"/>\n`;
    _dimLines += `  <line x1="${jogX}" y1="${my}" x2="${xd}" y2="${my}" class="leader"/>\n`;
    _dimLines += `  <line x1="${xd}" y1="${my-TICK}" x2="${xd}" y2="${my+TICK}" class="leader-tick"/>\n`;
    _dimLabels += `  <rect x="${jogX-25}" y="${runY-14}" width="50" height="14" fill="#fefefe"/>\n`;
    _dimLabels += `  <text x="${jogX}" y="${runY-4}" class="dim-text">${label}</text>\n`;
  } else {
    const anchor = left ? 'end' : 'start';
    const tx = left ? xd - 8 : xd + 8;
    _dimLabels += `  <rect x="${tx + (left ? -52 : -2)}" y="${my-6}" width="54" height="14" fill="#fefefe"/>\n`;
    _dimLabels += `  <text x="${tx}" y="${my+4}" class="dim-text" text-anchor="${anchor}">${label}</text>\n`;
  }
  return ''; // collected, not returned inline
}

// Door arc (quarter circle). pivot=hinge point, dir=swing direction
function doorArc(px, py, len, dir) {
  const s = len;
  let d, lx, ly;
  switch(dir) {
    case 'right-down': // hinge at top, swings right and down
      return `  <line x1="${px}" y1="${py}" x2="${px+s}" y2="${py}" class="door"/>
  <path d="M${px+s},${py} A${s},${s} 0 0,1 ${px},${py+s}" class="door"/>`;
    case 'right-up': // hinge at bottom, swings right and up
      return `  <line x1="${px}" y1="${py}" x2="${px+s}" y2="${py}" class="door"/>
  <path d="M${px+s},${py} A${s},${s} 0 0,0 ${px},${py-s}" class="door"/>`;
    case 'left-down': // hinge at top, swings left and down
      return `  <line x1="${px}" y1="${py}" x2="${px-s}" y2="${py}" class="door"/>
  <path d="M${px-s},${py} A${s},${s} 0 0,0 ${px},${py+s}" class="door"/>`;
    case 'left-up': // hinge at bottom, swings left and up
      return `  <line x1="${px}" y1="${py}" x2="${px-s}" y2="${py}" class="door"/>
  <path d="M${px-s},${py} A${s},${s} 0 0,1 ${px},${py-s}" class="door"/>`;
    case 'down-right': // hinge at left, swings down and right
      return `  <line x1="${px}" y1="${py}" x2="${px}" y2="${py+s}" class="door"/>
  <path d="M${px},${py+s} A${s},${s} 0 0,0 ${px+s},${py}" class="door"/>`;
    case 'down-left': // hinge at right, swings down and left
      return `  <line x1="${px}" y1="${py}" x2="${px}" y2="${py+s}" class="door"/>
  <path d="M${px},${py+s} A${s},${s} 0 0,1 ${px-s},${py}" class="door"/>`;
    case 'up-right': // hinge at left, swings up and right
      return `  <line x1="${px}" y1="${py}" x2="${px}" y2="${py-s}" class="door"/>
  <path d="M${px},${py-s} A${s},${s} 0 0,1 ${px+s},${py}" class="door"/>`;
    case 'up-left': // hinge at right, swings up and left
      return `  <line x1="${px}" y1="${py}" x2="${px}" y2="${py-s}" class="door"/>
  <path d="M${px},${py-s} A${s},${s} 0 0,0 ${px-s},${py}" class="door"/>`;
  }
}

const M = 100; // margin
const TH = 60; // title height

// ============================================================
// 1. DINING HALL
// 558 x 401, door to kitchen on right wall
// ============================================================
(function() {
  const rW = 683, rH = 401;
  const sc = Math.min(900 / rW, 700 / rH);
  const W = rW * sc, H = rH * sc;
  const pw = W + M*2, ph = H + M*2 + TH;
  const ox = M, oy = M + TH;
  const s = sc; // scale factor

  let svg = svgOpen(pw, ph, 'Dining Hall');

  // L-shaped dining hall outline (kitchen notch upper-right)
  svg += `  <!-- Dining walls -->\n`;
  svg += `  <line x1="${ox}" y1="${oy}" x2="${ox + 500*s}" y2="${oy}" class="wall"/>\n`; // top left of door
  svg += `  <line x1="${ox + 536*s}" y1="${oy}" x2="${ox + 558*s}" y2="${oy}" class="wall"/>\n`; // top right of door
  svg += `  <line x1="${ox}" y1="${oy}" x2="${ox}" y2="${oy + 401*s}" class="wall"/>\n`; // left
  svg += `  <line x1="${ox}" y1="${oy + 401*s}" x2="${ox + 683*s}" y2="${oy + 401*s}" class="wall"/>\n`; // bottom
  // Right upper wall (door opening at y=20..56 to kitchen)
  svg += `  <line x1="${ox + 558*s}" y1="${oy}" x2="${ox + 558*s}" y2="${oy + 20*s}" class="wall"/>\n`;
  svg += `  <line x1="${ox + 558*s}" y1="${oy + 56*s}" x2="${ox + 558*s}" y2="${oy + 272*s}" class="wall"/>\n`;
  // Step and lower right (double door centered on right lower wall)
  svg += `  <line x1="${ox + 558*s}" y1="${oy + 272*s}" x2="${ox + 683*s}" y2="${oy + 272*s}" class="wall"/>\n`; // step
  const rlMid = (272 + 401) / 2; // center of lower right wall
  svg += `  <line x1="${ox + 683*s}" y1="${oy + 272*s}" x2="${ox + 683*s}" y2="${oy + (rlMid - 36)*s}" class="wall"/>\n`;
  svg += `  <line x1="${ox + 683*s}" y1="${oy + (rlMid + 36)*s}" x2="${ox + 683*s}" y2="${oy + 401*s}" class="wall"/>\n`;

  // Door 1: top wall (x=500..536), outswinging upward (south / exterior)
  svg += doorArc(ox + 500*s, oy, 36*s, 'right-up') + '\n';

  // Door 2: right upper wall (x=558, y=20..56), outswinging right into kitchen
  svg += doorArc(ox + 558*s, oy + 20*s, 36*s, 'down-right') + '\n';

  // Door 3: double outswinging door, center of lower right wall (x=683)
  svg += doorArc(ox + 683*s, oy + rlMid*s, 36*s, 'up-right') + '\n';
  svg += doorArc(ox + 683*s, oy + rlMid*s, 36*s, 'down-right') + '\n';

  // Room labels
  svg += `  <text x="${ox + 279*s}" y="${oy + 195*s}" class="room-label">Dining</text>\n`;
  svg += `  <text x="${ox + 620*s}" y="${oy + 136*s}" class="sub-label" font-style="italic">Kitchen</text>\n`;

  // Dimensions
  dimReset();
  dimH(ox, ox + 558*s, oy, 558, true);
  dimV(ox, oy, oy + 401*s, 401, true);
  dimV(ox + 558*s, oy, oy + 272*s, 272, false);
  dimH(ox + 558*s, ox + 683*s, oy + 272*s, 125, true);
  dimV(ox + 683*s, oy + 272*s, oy + 401*s, 129, false);
  dimH(ox, ox + 683*s, oy + 401*s, 683, false);
  svg += dimFlush();
  svg += compass(pw - 50, 45);

  svg += `</svg>`;
  fs.writeFileSync(dir + '/dining-hall.svg', svg);
  console.log('Wrote dining-hall.svg');
})();

// ============================================================
// 2. GRAND HALL (Grand Hall + Stage)
// Grand Hall: 404 x 486, Stage: 107 x 486
// Total: 511 x 486
// ============================================================
(function() {
  const rW = 511, rH = 486;
  const sc = Math.min(900 / rW, 700 / rH);
  const W = rW * sc, H = rH * sc;
  const pw = W + M*2, ph = H + M*2 + TH;
  const ox = M, oy = M + TH;
  const s = sc;

  let svg = svgOpen(pw, ph, 'Grand Hall');

  // Outer walls
  svg += `  <rect x="${ox}" y="${oy}" width="${511*s}" height="${486*s}" class="wall"/>\n`;
  // Divider wall Grand Hall / Stage
  svg += `  <line x1="${ox + 404*s}" y1="${oy}" x2="${ox + 404*s}" y2="${oy + 486*s}" class="wall"/>\n`;

  // Two inswinging doors on left wall, evenly spaced across Grand Hall height (486")
  const door1Y = oy + (486 / 3) * s;
  const door2Y = oy + (486 * 2 / 3) * s;
  svg += doorArc(ox, door1Y, 36*s, 'down-right') + '\n';
  svg += doorArc(ox, door2Y, 36*s, 'down-right') + '\n';

  // Room labels
  svg += `  <text x="${ox + 202*s}" y="${oy + 243*s}" class="room-label">Grand Hall</text>\n`;
  svg += `  <text x="${ox + 457*s}" y="${oy + 243*s}" class="room-label" font-size="16">Stage</text>\n`;

  // Dimensions
  dimReset();
  dimH(ox, ox + 404*s, oy, 404, true);
  dimH(ox + 404*s, ox + 511*s, oy, 107, true);
  dimV(ox, oy, oy + 486*s, 486, true);
  dimH(ox, ox + 511*s, oy + 486*s, 511, false);
  svg += dimFlush();
  svg += compass(pw - 50, 45);

  svg += `</svg>`;
  fs.writeFileSync(dir + '/grand-hall.svg', svg);
  console.log('Wrote grand-hall.svg');
})();

// ============================================================
// 3. LOBBY (8-sided shape, stair notch subtracted from upper-left)
// Scale from screenshot (310x254): 225/182 = 1.236 in/px
// Shape clockwise from top-left (in inches):
//   (0,0)→(22,0)→(22,26)→(44,26)→(44,80)→(345,80)→(345,225)→(0,225)→close
// Stair notch is a stepped "Utah" shape in the upper-left corner
// ============================================================
(function() {
  // 8-sided shape vertices (inches, origin at top-left)
  const pts = [
    [0, 0],      // 1: top-left
    [22, 0],     // 2: top of first step
    [22, 26],    // 3: first step corner
    [44, 26],    // 4: second step corner
    [44, 80],    // 5: bottom of stair notch
    [345, 80],   // 6: top-right
    [345, 225],  // 7: bottom-right
    [0, 225],    // 8: bottom-left
  ];

  const rW = 345, rH = 225;
  const sc = Math.min(900 / rW, 700 / rH);
  const pw = rW * sc + M * 2;
  const ph = rH * sc + M * 2 + TH + 20;
  const ox = M, oy = M + TH + 15;
  const s = sc;

  function px(x) { return ox + x * s; }
  function py(y) { return oy + y * s; }

  let svg = svgOpen(pw, ph, 'Lobby');

  // 8-sided outline
  const path = 'M' + pts.map(p => px(p[0]) + ',' + py(p[1])).join(' L') + ' Z';
  svg += `  <path d="${path}" class="wall"/>\n`;

  // "Stairs" label — right of 4'-6" dim, horizontally aligned with its midpoint
  // 4'-6" dim is at px(44)+35+22 (offset=1), spanning py(26) to py(80), midpoint py(53)
  const stLblX = px(120);
  const stLblY = py(53);
  svg += `  <text x="${stLblX}" y="${stLblY + 4}" class="sub-label" font-size="13" font-style="italic">Stairs</text>\n`;

  // Door at bottom (centered double door)
  const doorCX = px(rW / 2);
  const doorY = py(225);
  const leafR = 26 * s;
  svg += `  <path d="M${doorCX - leafR},${doorY} A${leafR},${leafR} 0 0,0 ${doorCX},${doorY + leafR}" class="door"/>\n`;
  svg += `  <path d="M${doorCX + leafR},${doorY} A${leafR},${leafR} 0 0,1 ${doorCX},${doorY + leafR}" class="door"/>\n`;

  // Room label (centered in main area)
  svg += `  <text x="${px(194)}" y="${py(155)}" class="room-label">Lobby</text>\n`;

  // Dimensions for all 8 sides
  dimReset();
  dimH(px(0), px(22), py(0), 22, true, 1);       // side 1: 1'-10"
  // side 2 (2'-2") drawn manually below
  dimH(px(22), px(44), py(26), 22, true, -0.4);     // side 3: 1'-10" (closer to wall)
  dimV(px(44), py(26), py(80), 54, false, 1);      // side 4: 4'-6"
  dimH(px(44), px(345), py(80), 301, true);        // side 5: 25'-1"
  dimV(px(345), py(80), py(225), 145, false);      // side 6: 12'-1"
  dimH(px(0), px(345), py(225), 345, false);       // side 7: 28'-9"
  dimV(px(0), py(0), py(225), 225, true);          // side 8: 18'-9"
  svg += dimFlush();

  // Side 2 (2'-2") — manual dim with leader aligned to side 1 label
  {
    const dimX = px(22) + 18; // dim line x (close to wall)
    const dY1 = py(0), dY2 = py(26);
    const dMy = (dY1 + dY2) / 2;
    // Extension lines + dim line + ticks
    svg += `  <line x1="${px(22)}" y1="${dY1}" x2="${dimX+8}" y2="${dY1}" class="dim-line"/>\n`;
    svg += `  <line x1="${px(22)}" y1="${dY2}" x2="${dimX+8}" y2="${dY2}" class="dim-line"/>\n`;
    svg += `  <line x1="${dimX}" y1="${dY1}" x2="${dimX}" y2="${dY2}" class="dim-line"/>\n`;
    svg += `  <line x1="${dimX-TICK}" y1="${dY1}" x2="${dimX+TICK}" y2="${dY1}" class="dim-tick"/>\n`;
    svg += `  <line x1="${dimX-TICK}" y1="${dY2}" x2="${dimX+TICK}" y2="${dY2}" class="dim-tick"/>\n`;
    // Leader: 2 segments — down then left to dim line, label above lower 1'-10"
    const lblX = px(33) + 24;
    // Midpoint between side 1 label (py(0)-71) and side 3 label (py(26)-44)
    const side1Y = py(0) - 71;
    const side3Y = py(26) - 44;
    const lblY = (side1Y + side3Y) / 2;
    svg += `  <line x1="${lblX}" y1="${lblY + 12}" x2="${lblX}" y2="${dMy}" class="leader-plain"/>\n`;
    svg += `  <line x1="${lblX}" y1="${dMy}" x2="${dimX}" y2="${dMy}" class="leader"/>\n`;
    svg += `  <line x1="${dimX}" y1="${dMy-TICK}" x2="${dimX}" y2="${dMy+TICK}" class="leader-tick"/>\n`;
    svg += `  <rect x="${lblX}" y="${lblY-2}" width="50" height="14" fill="#fefefe"/>\n`;
    svg += `  <text x="${lblX+2}" y="${lblY+9}" class="dim-text" text-anchor="start">2'-2"</text>\n`;
  }
  svg += compass(pw - 50, 45);

  svg += `</svg>`;
  fs.writeFileSync(dir + '/lobby.svg', svg);
  console.log('Wrote lobby.svg');
})();

// ============================================================
// 4. PARKING LOT (Building envelope + Lodge room inside)
// Building: 973 x 789
// Lodge: x=239..584, y=0..225 (345 x 225 inside building)
// Streets: Laurence Ave (left), 12th Ave (bottom)
// ============================================================
(function() {
  const rW = 973, rH = 789;
  const sc = Math.min(900 / rW, 700 / rH);
  const W = rW * sc, H = rH * sc;
  const pw = W + M*2 + 20, ph = H + M*2 + TH + 20;
  const ox = M + 20, oy = M + TH;
  const s = sc;

  let svg = svgOpen(pw, ph, 'Parking Lot');

  // Building envelope with Lodge as notch (shared top wall segments)
  const lodX = ox + 239*s, lodY = oy, lodW = 345*s, lodH = 225*s;
  // Top wall: left segment, gap for Lodge, right segment
  svg += `  <line x1="${ox}" y1="${oy}" x2="${lodX}" y2="${oy}" class="wall"/>\n`;
  svg += `  <line x1="${lodX + lodW}" y1="${oy}" x2="${ox + 973*s}" y2="${oy}" class="wall"/>\n`;
  // Left, bottom, right walls of building
  svg += `  <line x1="${ox}" y1="${oy}" x2="${ox}" y2="${oy + 789*s}" class="wall"/>\n`;
  svg += `  <line x1="${ox}" y1="${oy + 789*s}" x2="${ox + 973*s}" y2="${oy + 789*s}" class="wall"/>\n`;
  svg += `  <line x1="${ox + 973*s}" y1="${oy}" x2="${ox + 973*s}" y2="${oy + 789*s}" class="wall"/>\n`;
  // Lodge notch: left wall, bottom wall, right wall (sides drop down from top)
  svg += `  <line x1="${lodX}" y1="${oy}" x2="${lodX}" y2="${oy + lodH}" class="wall"/>\n`;
  svg += `  <line x1="${lodX}" y1="${oy + lodH}" x2="${lodX + lodW}" y2="${oy + lodH}" class="wall"/>\n`;
  svg += `  <line x1="${lodX + lodW}" y1="${oy}" x2="${lodX + lodW}" y2="${oy + lodH}" class="wall"/>\n`;

  // Door on Lodge bottom wall - double door centered
  const ldCX = lodX + lodW / 2;
  const ldY = lodY + lodH;
  const ldR = 26 * s;
  svg += `  <path d="M${ldCX - ldR},${ldY} A${ldR},${ldR} 0 0,0 ${ldCX},${ldY + ldR}" class="door"/>\n`;
  svg += `  <path d="M${ldCX + ldR},${ldY} A${ldR},${ldR} 0 0,1 ${ldCX},${ldY + ldR}" class="door"/>\n`;

  // Room labels
  svg += `  <text x="${lodX + lodW/2}" y="${lodY + lodH/2 + 6}" class="room-label" font-size="20">Lodge</text>\n`;
  svg += `  <text x="${ox + 486*s}" y="${oy + 520*s}" class="room-label">Parking Lot</text>\n`;

  // Street labels
  svg += `  <text x="${ox - 20}" y="${oy + 394*s}" class="street" transform="rotate(-90 ${ox - 20} ${oy + 394*s})">Laurence Ave</text>\n`;
  svg += `  <text x="${ox + 486*s}" y="${oy + 789*s + 22}" class="street">12th Ave</text>\n`;

  // Dimensions
  dimReset();
  dimH(ox, ox + 973*s, oy, 973, true);
  dimV(ox + 973*s, oy, oy + 789*s, 789, false);
  dimH(lodX, lodX + lodW, lodY + lodH, 345, false);
  dimV(lodX + lodW, lodY, lodY + lodH, 225, false);
  svg += dimFlush();
  svg += compass(pw - 50, 45);

  svg += `</svg>`;
  fs.writeFileSync(dir + '/parking-lot.svg', svg);
  console.log('Wrote parking-lot.svg');
})();

// ============================================================
// 5. UPSTAIRS HALLWAY (10-sided stepped shape)
// From screenshot analysis (scale ~0.61"/px):
//   Upper column: 197-269 x 0-224 (72" x 224")
//   Step left at y=224: left wall from 197 to 114
//   Middle: 114-269 x 224-299 (155" x 75")
//   Step right at y=299: right wall from 269 to 197
//   Lower: 114-197 x 299-422 (83" x 123")
//   Step left at y=422: left wall from 114 to 0
//   Landing: 0-197 x 422-495 (197" x 73")
// Doors swing OUTSIDE hallway bounds into adjacent rooms
// "Landing" labels only the bottom rectangle
// ============================================================
(function() {
  // 10-sided shape vertices (inches, origin at top-left of bounding box)
  const pts = [
    [197, 0],    // 1: top-left of upper column
    [269, 0],    // 2: top-right
    [269, 299],  // 3: right wall steps left
    [197, 299],  // 4: step wall
    [197, 495],  // 5: bottom-right (Landing right)
    [0, 495],    // 6: bottom-left
    [0, 422],    // 7: Landing left wall top
    [114, 422],  // 8: step wall
    [114, 224],  // 9: middle left wall top
    [197, 224],  // 10: step wall back to upper
  ];

  const rW = 269, rH = 495;
  // Extra width on right for door arcs that swing outside
  const arcExtra = 80;
  const sc = Math.min(900 / (rW + arcExtra), 700 / rH);
  const pw = (rW + arcExtra) * sc + M * 2;
  const ph = rH * sc + M * 2 + TH + 20;
  const ox = M, oy = M + TH + 10;
  const s = sc;

  function px(x) { return ox + x * s; }
  function py(y) { return oy + y * s; }

  let svg = svgOpen(pw, ph, 'Upstairs Hallway');

  // 10-sided outline
  const path = 'M' + pts.map(p => px(p[0]) + ',' + py(p[1])).join(' L') + ' Z';
  svg += `  <path d="${path}" class="wall"/>\n`;

  // Door at top (exit), swinging outward
  svg += `  <line x1="${px(210)}" y1="${py(0)}" x2="${px(210)}" y2="${py(-12)}" class="wall-thin"/>\n`;
  svg += `  <line x1="${px(248)}" y1="${py(0)}" x2="${px(248)}" y2="${py(-12)}" class="wall-thin"/>\n`;
  svg += doorArc(px(215), py(0), 36*s, 'right-up') + '\n';

  // ── Doors on RIGHT wall (x=269), swinging RIGHT (outside) ──
  svg += doorArc(px(269), py(46), 36*s, 'down-right') + '\n';
  svg += doorArc(px(269), py(98), 36*s, 'down-right') + '\n';
  svg += doorArc(px(269), py(187), 36*s, 'down-right') + '\n';

  // ── Door on step wall, swinging right (outside) ──
  svg += doorArc(px(197), py(340), 36*s, 'down-right') + '\n';

  // ── Doors on LEFT walls, swinging LEFT (outside) ──
  svg += doorArc(px(114), py(258), 36*s, 'up-left') + '\n';
  svg += doorArc(px(114), py(343), 36*s, 'down-left') + '\n';

  // Dashed line across the open segment above Landing (x=114..197 at y=422)
  svg += `  <line x1="${px(114)}" y1="${py(422)}" x2="${px(197)}" y2="${py(422)}" class="leader-plain"/>\n`;

  // ── Landing label (bottom rectangle only) ──
  svg += `  <text x="${px(98)}" y="${py(462)}" class="room-label" font-size="20">Landing</text>\n`;

  // Dimensions
  dimReset();
  dimH(px(197), px(269), py(0), 72, true);            // top width
  dimV(px(269), py(0), py(299), 299, false);           // right wall
  dimH(px(197), px(269), py(299), 72, false);          // step width right
  dimV(px(197), py(299), py(495), 196, false, 1);      // right lower + landing
  dimH(px(0), px(197), py(495), 197, false);           // Landing bottom
  dimV(px(0), py(422), py(495), 73, true);             // Landing left
  dimH(px(0), px(114), py(422), 114, true);            // step width
  dimV(px(114), py(224), py(422), 198, true, 1);       // left middle
  dimH(px(114), px(197), py(224), 83, true);           // step width upper
  dimV(px(197), py(0), py(224), 224, true);            // left upper
  svg += dimFlush();
  svg += compass(pw - 50, 45);

  svg += `</svg>`;
  fs.writeFileSync(dir + '/upstairs-hallway.svg', svg);
  console.log('Wrote upstairs-hallway.svg');
})();

console.log('Done! All 5 blueprints generated.');

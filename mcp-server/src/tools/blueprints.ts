import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// ─── Blueprint Definition Schema ──────────────────────────────────────────────
// A JSON-driven format for generating architectural SVG floor plans.
// All spatial values are in inches (1 px = 1 in).

export interface BlueprintDef {
  name: string;
  subtitle?: string;
  rooms: RoomDef[];
}

export interface RoomDef {
  label: string;
  /** Ordered polygon vertices [x, y] in inches, origin at top-left of bounding box */
  shape: [number, number][];
  /** Optional sub-label (e.g. room dimensions text) */
  sublabel?: string;
  /** Label position override [x, y] in inches; defaults to centroid */
  labelPos?: [number, number];
  /** Font size override for label */
  labelSize?: number;
  doors?: DoorDef[];
  annotations?: AnnotationDef[];
  dimensions?: DimDef[];
}

export interface DoorDef {
  /** Hinge point [x, y] in room coords (inches) */
  pos: [number, number];
  /** Door swing length in inches */
  length: number;
  /** Swing direction */
  dir:
    | "right-down"
    | "right-up"
    | "left-down"
    | "left-up"
    | "down-right"
    | "down-left"
    | "up-right"
    | "up-left";
  /** "single" (default) or "double" (mirrored pair) */
  type?: "single" | "double";
}

export interface AnnotationDef {
  text: string;
  /** Position [x, y] in room coords */
  pos: [number, number];
  /** Optional arrow target [x, y] */
  arrowTo?: [number, number];
  fontSize?: number;
  italic?: boolean;
  color?: string;
}

export interface DimDef {
  /** "h" (horizontal) or "v" (vertical) */
  axis: "h" | "v";
  /** Start coord on the measurement axis (inches) */
  from: number;
  /** End coord on the measurement axis (inches) */
  to: number;
  /** Position on the perpendicular axis where the wall is (inches) */
  wallAt: number;
  /** Which side of the wall: true = above/left, false = below/right */
  outside: boolean;
  /** Stacking offset index (0 = closest to wall) */
  offset?: number;
}

// ─── SVG Generation Engine ────────────────────────────────────────────────────

const MARGIN = 100;
const TITLE_H = 60;
const TICK_LEN = 6; // perpendicular tick mark half-length

function ftIn(inches: number): string {
  const ft = Math.floor(inches / 12);
  const rem = inches % 12;
  return `${ft}'-${rem}"`;
}

function centroid(pts: [number, number][]): [number, number] {
  const n = pts.length;
  const cx = pts.reduce((s, p) => s + p[0], 0) / n;
  const cy = pts.reduce((s, p) => s + p[1], 0) / n;
  return [cx, cy];
}

function bounds(pts: [number, number][]): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
} {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const [x, y] of pts) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  return { minX, minY, maxX, maxY };
}

export function generateBlueprintSVG(def: BlueprintDef): string {
  // Compute bounding box across all rooms
  const allPts: [number, number][] = def.rooms.flatMap((r) => r.shape);
  const bb = bounds(allPts);
  const rW = bb.maxX - bb.minX;
  const rH = bb.maxY - bb.minY;
  const sc = Math.min(900 / rW, 700 / rH);
  const pw = rW * sc + MARGIN * 2;
  const ph = rH * sc + MARGIN * 2 + TITLE_H + 20;
  const ox = MARGIN;
  const oy = MARGIN + TITLE_H + 10;

  function px(x: number) {
    return ox + (x - bb.minX) * sc;
  }
  function py(y: number) {
    return oy + (y - bb.minY) * sc;
  }

  const subtitle = def.subtitle || "1 px = 1 in";

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${pw} ${ph}" width="${pw}" height="${ph}" font-family="'Courier New', monospace">
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
      .anno { fill: #555; }
    </style>
    <marker id="arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#555"/></marker>
  </defs>
  <rect width="${pw}" height="${ph}" fill="#fefefe"/>
  <text x="${pw / 2}" y="32" class="title">${def.name}</text>
  <text x="${pw / 2}" y="50" class="subtitle">${subtitle} &#x2014; 1 px = 1 in</text>
`;

  for (const room of def.rooms) {
    // ── Shape outline ──
    const pathD =
      "M" +
      room.shape.map((p) => `${px(p[0])},${py(p[1])}`).join(" L") +
      " Z";
    svg += `  <path d="${pathD}" class="wall"/>\n`;

    // ── Room label ──
    const [lcx, lcy] = room.labelPos || centroid(room.shape);
    const lsz = room.labelSize || 26;
    svg += `  <text x="${px(lcx)}" y="${py(lcy) + 8}" class="room-label" font-size="${lsz}">${room.label}</text>\n`;
    if (room.sublabel) {
      svg += `  <text x="${px(lcx)}" y="${py(lcy) + 26}" class="sub-label">${room.sublabel}</text>\n`;
    }

    // ── Doors ──
    for (const door of room.doors || []) {
      if (door.type === "double") {
        svg += renderDoubleDoor(px(door.pos[0]), py(door.pos[1]), door.length * sc, door.dir);
      } else {
        svg += renderDoor(px(door.pos[0]), py(door.pos[1]), door.length * sc, door.dir);
      }
    }

    // ── Annotations ──
    for (const anno of room.annotations || []) {
      const ax = px(anno.pos[0]);
      const ay = py(anno.pos[1]);
      const fs = anno.fontSize || 13;
      const style = anno.italic ? ' font-style="italic"' : "";
      const fill = anno.color || "#555";
      svg += `  <text x="${ax}" y="${ay}" class="anno" font-size="${fs}" fill="${fill}" text-anchor="middle"${style}>${anno.text}</text>\n`;
      if (anno.arrowTo) {
        const tx = px(anno.arrowTo[0]);
        const ty = py(anno.arrowTo[1]);
        svg += `  <line x1="${ax}" y1="${ay + 4}" x2="${tx}" y2="${ty - 2}" class="dim-line"/>\n`;
        svg += `  <polygon points="${tx - 3},${ty - 5} ${tx + 3},${ty - 5} ${tx},${ty}" fill="#555"/>\n`;
      }
    }

    // ── Dimensions ──
    // RULES (learned from implementation):
    //  1. All dim lines/leaders render FIRST, then all bg rects + text render ON TOP
    //     (SVG z-order: later elements cover earlier ones)
    //  2. Dimension terminators are perpendicular ticks, NOT arrows
    //  3. Leader lines (dashed) use arrows pointing FROM label TOWARD the dim line
    //  4. Leader routes: first leg is plain dashed, second leg has arrow marker
    //  5. For narrow spans, leaders jog perpendicular then run to label — route the
    //     leader so it does NOT cross other dim lines or labels
    //  6. Use offset param to stack parallel dims without overlap (22px per level)
    //  7. Move dim bars closer to their wall when default 35px offset causes overlap
    //     with adjacent dimensions (use fractional negative offset, e.g. -0.4)
    let dimLines = "";
    let dimLabels = "";
    for (const dim of room.dimensions || []) {
      const result = renderDim(dim, px, py, sc);
      dimLines += result.lines;
      dimLabels += result.labels;
    }
    svg += dimLines + dimLabels;
  }

  svg += `</svg>`;
  return svg;
}

// ── Dimension rendering (perpendicular ticks, leader lines for narrow spans) ──
// Returns { lines, labels } for z-order separation

function renderDim(
  dim: DimDef,
  px: (x: number) => number,
  py: (y: number) => number,
  sc: number,
): { lines: string; labels: string } {
  const inches = Math.abs(dim.to - dim.from);
  const label = ftIn(inches);
  const baseOff = 35;
  const stackOff = (dim.offset || 0) * 22;
  const totalOff = baseOff + stackOff;

  let lines = "";
  let labels = "";

  if (dim.axis === "h") {
    const x1 = px(Math.min(dim.from, dim.to));
    const x2 = px(Math.max(dim.from, dim.to));
    const wy = py(dim.wallAt);
    const sign = dim.outside ? -1 : 1;
    const dy = wy + sign * totalOff;
    const extEnd = wy + sign * (totalOff + 8);
    const span = x2 - x1;
    const mx = (x1 + x2) / 2;

    // Extension lines + dim line + ticks
    lines += `  <line x1="${x1}" y1="${wy}" x2="${x1}" y2="${extEnd}" class="dim-line"/>\n`;
    lines += `  <line x1="${x2}" y1="${wy}" x2="${x2}" y2="${extEnd}" class="dim-line"/>\n`;
    lines += `  <line x1="${x1}" y1="${dy}" x2="${x2}" y2="${dy}" class="dim-line"/>\n`;
    lines += `  <line x1="${x1}" y1="${dy - TICK_LEN}" x2="${x1}" y2="${dy + TICK_LEN}" class="dim-tick"/>\n`;
    lines += `  <line x1="${x2}" y1="${dy - TICK_LEN}" x2="${x2}" y2="${dy + TICK_LEN}" class="dim-tick"/>\n`;

    if (span < 65) {
      // Leader: horizontal run from label, then vertical with arrow toward dim line
      const leaderDir = dim.outside ? -1 : 1;
      const ly = dy + leaderDir * 18;
      const lx = x2 + 20;
      lines += `  <line x1="${lx}" y1="${ly}" x2="${mx}" y2="${ly}" class="leader-plain"/>\n`;
      lines += `  <line x1="${mx}" y1="${ly}" x2="${mx}" y2="${dy}" class="leader"/>\n`;
      lines += `  <line x1="${mx - TICK_LEN}" y1="${dy}" x2="${mx + TICK_LEN}" y2="${dy}" class="leader-tick"/>\n`;
      labels += `  <rect x="${lx + 2}" y="${ly - 8}" width="50" height="14" fill="#fefefe"/>\n`;
      labels += `  <text x="${lx + 4}" y="${ly + 4}" class="dim-text" text-anchor="start">${label}</text>\n`;
    } else {
      const ty = dim.outside ? dy - 5 : dy + 13;
      labels += `  <rect x="${mx - 30}" y="${ty - 10}" width="60" height="14" fill="#fefefe"/>\n`;
      labels += `  <text x="${mx}" y="${ty}" class="dim-text">${label}</text>\n`;
    }
  } else {
    // vertical
    const y1 = py(Math.min(dim.from, dim.to));
    const y2 = py(Math.max(dim.from, dim.to));
    const wx = px(dim.wallAt);
    const sign = dim.outside ? -1 : 1;
    const dx = wx + sign * totalOff;
    const extEnd = wx + sign * (totalOff + 8);
    const span = y2 - y1;
    const my = (y1 + y2) / 2;

    // Extension lines + dim line + ticks
    lines += `  <line x1="${wx}" y1="${y1}" x2="${extEnd}" y2="${y1}" class="dim-line"/>\n`;
    lines += `  <line x1="${wx}" y1="${y2}" x2="${extEnd}" y2="${y2}" class="dim-line"/>\n`;
    lines += `  <line x1="${dx}" y1="${y1}" x2="${dx}" y2="${y2}" class="dim-line"/>\n`;
    lines += `  <line x1="${dx - TICK_LEN}" y1="${y1}" x2="${dx + TICK_LEN}" y2="${y1}" class="dim-tick"/>\n`;
    lines += `  <line x1="${dx - TICK_LEN}" y1="${y2}" x2="${dx + TICK_LEN}" y2="${y2}" class="dim-tick"/>\n`;

    if (span < 65) {
      // Leader: vertical run from label, then horizontal with arrow toward dim line
      const leaderDir = dim.outside ? -1 : 1;
      const lx = dx + leaderDir * 18;
      const ly = y1 - 20;
      lines += `  <line x1="${lx}" y1="${ly}" x2="${lx}" y2="${my}" class="leader-plain"/>\n`;
      lines += `  <line x1="${lx}" y1="${my}" x2="${dx}" y2="${my}" class="leader"/>\n`;
      lines += `  <line x1="${dx}" y1="${my - TICK_LEN}" x2="${dx}" y2="${my + TICK_LEN}" class="leader-tick"/>\n`;
      labels += `  <rect x="${lx - 25}" y="${ly - 14}" width="50" height="14" fill="#fefefe"/>\n`;
      labels += `  <text x="${lx}" y="${ly - 4}" class="dim-text">${label}</text>\n`;
    } else {
      const anchor = dim.outside ? "end" : "start";
      const tx = dim.outside ? dx - 8 : dx + 8;
      labels += `  <rect x="${tx + (dim.outside ? -52 : -2)}" y="${my - 6}" width="54" height="14" fill="#fefefe"/>\n`;
      labels += `  <text x="${tx}" y="${my + 4}" class="dim-text" text-anchor="${anchor}">${label}</text>\n`;
    }
  }

  return { lines, labels };
}

// ── Door rendering ──

function renderDoor(
  hx: number,
  hy: number,
  len: number,
  dir: string,
): string {
  const s = len;
  switch (dir) {
    case "right-down":
      return `  <line x1="${hx}" y1="${hy}" x2="${hx + s}" y2="${hy}" class="door"/>\n  <path d="M${hx + s},${hy} A${s},${s} 0 0,1 ${hx},${hy + s}" class="door"/>\n`;
    case "right-up":
      return `  <line x1="${hx}" y1="${hy}" x2="${hx + s}" y2="${hy}" class="door"/>\n  <path d="M${hx + s},${hy} A${s},${s} 0 0,0 ${hx},${hy - s}" class="door"/>\n`;
    case "left-down":
      return `  <line x1="${hx}" y1="${hy}" x2="${hx - s}" y2="${hy}" class="door"/>\n  <path d="M${hx - s},${hy} A${s},${s} 0 0,0 ${hx},${hy + s}" class="door"/>\n`;
    case "left-up":
      return `  <line x1="${hx}" y1="${hy}" x2="${hx - s}" y2="${hy}" class="door"/>\n  <path d="M${hx - s},${hy} A${s},${s} 0 0,1 ${hx},${hy - s}" class="door"/>\n`;
    case "down-right":
      return `  <line x1="${hx}" y1="${hy}" x2="${hx}" y2="${hy + s}" class="door"/>\n  <path d="M${hx},${hy + s} A${s},${s} 0 0,0 ${hx + s},${hy}" class="door"/>\n`;
    case "down-left":
      return `  <line x1="${hx}" y1="${hy}" x2="${hx}" y2="${hy + s}" class="door"/>\n  <path d="M${hx},${hy + s} A${s},${s} 0 0,1 ${hx - s},${hy}" class="door"/>\n`;
    case "up-right":
      return `  <line x1="${hx}" y1="${hy}" x2="${hx}" y2="${hy - s}" class="door"/>\n  <path d="M${hx},${hy - s} A${s},${s} 0 0,1 ${hx + s},${hy}" class="door"/>\n`;
    case "up-left":
      return `  <line x1="${hx}" y1="${hy}" x2="${hx}" y2="${hy - s}" class="door"/>\n  <path d="M${hx},${hy - s} A${s},${s} 0 0,0 ${hx - s},${hy}" class="door"/>\n`;
    default:
      return "";
  }
}

function renderDoubleDoor(
  cx: number,
  cy: number,
  leafLen: number,
  dir: string,
): string {
  // Double door rendered as two mirrored arcs from center point
  const r = leafLen;
  if (dir === "down-right" || dir === "down-left") {
    // Horizontal double door opening downward
    return `  <path d="M${cx - r},${cy} A${r},${r} 0 0,0 ${cx},${cy + r}" class="door"/>\n  <path d="M${cx + r},${cy} A${r},${r} 0 0,1 ${cx},${cy + r}" class="door"/>\n`;
  }
  if (dir === "up-right" || dir === "up-left") {
    return `  <path d="M${cx - r},${cy} A${r},${r} 0 0,1 ${cx},${cy - r}" class="door"/>\n  <path d="M${cx + r},${cy} A${r},${r} 0 0,0 ${cx},${cy - r}" class="door"/>\n`;
  }
  if (dir === "right-down" || dir === "right-up") {
    return `  <path d="M${cx},${cy - r} A${r},${r} 0 0,1 ${cx + r},${cy}" class="door"/>\n  <path d="M${cx},${cy + r} A${r},${r} 0 0,0 ${cx + r},${cy}" class="door"/>\n`;
  }
  return `  <path d="M${cx},${cy - r} A${r},${r} 0 0,0 ${cx - r},${cy}" class="door"/>\n  <path d="M${cx},${cy + r} A${r},${r} 0 0,1 ${cx - r},${cy}" class="door"/>\n`;
}

// ─── Wall Path Parser ─────────────────────────────────────────────────────────
// Converts a compact measurement+direction string into polygon vertices.
//
// Format: space-separated segments, each is feet_inches_direction
//   Direction: L (turn left), R (turn right), T (terminate / close shape)
//   First segment starts at bottom-right going UP.
//
// Shorthand shapes:
//   S_feet_inches         → square (e.g. S_5_0 = 5' square)
//   R_w_feet_w_in_h_feet_h_in → rectangle width x height (e.g. R_5_0_6_0 = 5'x6')
//
// Examples:
//   "5_0_R 5_0_R 5_0_R 5_0_T" → 5' square
//   "S_5_0" → 5' square
//   "R_5_0_6_0" → 5' wide x 6' tall rectangle
//   "5_6_L 5_6_T" → two 5'6" segments with a left turn

interface WallPathResult {
  vertices: [number, number][];
  perimeterInches: number;
  closed: boolean;
  segments: { from: [number, number]; to: [number, number]; lengthInches: number }[];
}

function parseWallPath(input: string): WallPathResult {
  const tokens = input.trim().split(/\s+/);

  // Check for shorthand shapes
  if (tokens.length === 1) {
    const parts = tokens[0].split("_");
    if (parts[0] === "S" && parts.length === 3) {
      // Square: S_feet_inches
      const side = parseInt(parts[1]) * 12 + parseInt(parts[2]);
      return parseWallPath(`${parts[1]}_${parts[2]}_R ${parts[1]}_${parts[2]}_R ${parts[1]}_${parts[2]}_R ${parts[1]}_${parts[2]}_T`);
    }
    if (parts[0] === "R" && parts.length === 5) {
      // Rectangle: R_wFt_wIn_hFt_hIn (width x height)
      const wFt = parts[1], wIn = parts[2], hFt = parts[3], hIn = parts[4];
      // Starting bottom-right going up: height, turn R, width, turn R, height, turn R, width, terminate
      return parseWallPath(`${hFt}_${hIn}_R ${wFt}_${wIn}_R ${hFt}_${hIn}_R ${wFt}_${wIn}_T`);
    }
  }

  // Direction vectors: 0=up, 1=left, 2=down, 3=right (clockwise from up)
  // Start going UP (direction index 0)
  const dx = [0, -1, 0, 1];
  const dy = [-1, 0, 1, 0];

  let dir = 0; // start going up
  let x = 0;
  let y = 0;
  const vertices: [number, number][] = [[x, y]]; // start at origin (bottom-right)
  const segments: WallPathResult["segments"] = [];
  let perimeter = 0;
  let closed = false;

  for (const token of tokens) {
    const parts = token.split("_");
    if (parts.length < 3) {
      throw new Error(`Invalid segment "${token}": expected feet_inches_direction (e.g. 5_6_L)`);
    }

    const feet = parseInt(parts[0]);
    const inches = parseInt(parts[1]);
    const turn = parts[2].toUpperCase();
    const length = feet * 12 + inches;

    if (isNaN(feet) || isNaN(inches)) {
      throw new Error(`Invalid measurement in "${token}": feet and inches must be numbers`);
    }

    const fromPt: [number, number] = [x, y];
    x += dx[dir] * length;
    y += dy[dir] * length;
    const toPt: [number, number] = [x, y];

    vertices.push([x, y]);
    segments.push({ from: fromPt, to: toPt, lengthInches: length });
    perimeter += length;

    if (turn === "T") {
      closed = true;
      break;
    } else if (turn === "L") {
      // Turn left: clockwise rotation of direction (up→right→down→left)
      // Wait — "left" from the walker's perspective going along the wall.
      // If walking up and turn left, you now face left (direction = left = index 1)
      dir = (dir + 1) % 4;
    } else if (turn === "R") {
      // Turn right from walker's perspective
      dir = (dir + 3) % 4;
    } else {
      throw new Error(`Invalid direction "${turn}" in "${token}": must be L, R, or T`);
    }
  }

  // Normalize: find bounding box and shift so all coords are positive
  let minX = Infinity, minY = Infinity;
  for (const [vx, vy] of vertices) {
    if (vx < minX) minX = vx;
    if (vy < minY) minY = vy;
  }
  const normalized: [number, number][] = vertices.map(([vx, vy]) => [vx - minX, vy - minY]);
  const normSegments = segments.map((s) => ({
    from: [s.from[0] - minX, s.from[1] - minY] as [number, number],
    to: [s.to[0] - minX, s.to[1] - minY] as [number, number],
    lengthInches: s.lengthInches,
  }));

  // Remove duplicate closing vertex if it matches the start
  if (closed && normalized.length > 1) {
    const first = normalized[0];
    const last = normalized[normalized.length - 1];
    if (Math.abs(first[0] - last[0]) < 0.5 && Math.abs(first[1] - last[1]) < 0.5) {
      normalized.pop();
    }
  }

  return {
    vertices: normalized,
    perimeterInches: perimeter,
    closed,
    segments: normSegments,
  };
}

// ─── MCP Tool Registration ────────────────────────────────────────────────────

export function registerBlueprintTools(server: McpServer) {
  server.tool(
    "blueprint_generate",
    "Generate an SVG floor plan from a blueprint definition (JSON). All spatial values in inches. Returns SVG markup.",
    {
      definition: z
        .string()
        .describe(
          "JSON string of a BlueprintDef: { name, subtitle?, rooms: [{ label, shape: [[x,y],...], doors?, annotations?, dimensions? }] }",
        ),
    },
    async ({ definition }) => {
      try {
        const def: BlueprintDef = JSON.parse(definition);
        const svg = generateBlueprintSVG(def);
        return {
          content: [{ type: "text", text: svg }],
        };
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        return {
          content: [
            { type: "text", text: `Error generating blueprint: ${msg}` },
          ],
        };
      }
    },
  );

  server.tool(
    "blueprint_schema",
    "Returns the JSON schema / documentation for the BlueprintDef format used by blueprint_generate",
    {},
    async () => {
      const schema = {
        BlueprintDef: {
          name: "string — blueprint title",
          subtitle: "string? — subtitle text",
          rooms: [
            {
              label: "string — room name",
              shape: "[[x,y], ...] — polygon vertices in inches",
              sublabel: "string? — secondary text below label",
              labelPos: "[x,y]? — label position override (inches)",
              labelSize: "number? — font size override",
              doors: [
                {
                  pos: "[x,y] — hinge point in inches",
                  length: "number — swing radius in inches",
                  dir: "string — swing direction (right-down|right-up|left-down|left-up|down-right|down-left|up-right|up-left)",
                  type: "'single'|'double' — default single",
                },
              ],
              annotations: [
                {
                  text: "string",
                  pos: "[x,y]",
                  arrowTo: "[x,y]? — draw arrow to this point",
                  fontSize: "number?",
                  italic: "boolean?",
                },
              ],
              dimensions: [
                {
                  axis: "'h'|'v' — horizontal or vertical",
                  from: "number — start coord on axis (inches)",
                  to: "number — end coord on axis (inches)",
                  wallAt:
                    "number — perpendicular coord where wall is (inches)",
                  outside:
                    "boolean — true = above/left of wall, false = below/right",
                  offset: "number? — stacking index (0 = closest to wall)",
                },
              ],
            },
          ],
        },
      };
      return {
        content: [{ type: "text", text: JSON.stringify(schema, null, 2) }],
      };
    },
  );

  server.tool(
    "blueprint_wall_path",
    `Parse a compact wall measurement string into polygon vertices (inches).
Format: space-separated segments as feet_inches_direction.
Direction: L (turn left), R (turn right), T (terminate/close).
First segment starts bottom-right going UP.
Shorthand: S_ft_in (square), R_wFt_wIn_hFt_hIn (rectangle, width x height).
Examples:
  "S_5_0" → 5' square
  "R_5_0_6_0" → 5'w x 6'h rectangle
  "5_6_L 5_6_T" → two 5'6" segments with left turn
  "5_0_R 5_0_R 5_0_R 5_0_T" → 5' square
Returns vertices array, perimeter, segment details.`,
    {
      path: z.string().describe("Wall path string (e.g. '5_0_R 5_0_R 5_0_R 5_0_T' or 'S_5_0')"),
      name: z.string().optional().describe("Optional room name for labeling"),
      generate_svg: z.boolean().optional().describe("If true, also returns an SVG blueprint of the shape"),
    },
    async ({ path: pathStr, name, generate_svg }) => {
      try {
        const result = parseWallPath(pathStr);
        const output: Record<string, unknown> = {
          vertices: result.vertices,
          perimeterInches: result.perimeterInches,
          perimeterFeet: Math.round(result.perimeterInches / 12 * 10) / 10,
          closed: result.closed,
          segmentCount: result.segments.length,
          segments: result.segments.map((s) => ({
            from: s.from,
            to: s.to,
            length: `${Math.floor(s.lengthInches / 12)}'-${s.lengthInches % 12}"`,
          })),
        };

        if (generate_svg && result.closed) {
          const roomName = name || "Room";
          const def: BlueprintDef = {
            name: roomName,
            rooms: [{
              label: roomName,
              shape: result.vertices,
              dimensions: buildAutoDimensions(result),
            }],
          };
          output.svg = generateBlueprintSVG(def);
        }

        return { content: [{ type: "text", text: JSON.stringify(output, null, 2) }] };
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        return { content: [{ type: "text", text: `Error parsing wall path: ${msg}` }] };
      }
    },
  );
}

// Auto-generate dimension definitions from wall path segments
function buildAutoDimensions(result: WallPathResult): DimDef[] {
  const dims: DimDef[] = [];
  const verts = result.vertices;

  for (const seg of result.segments) {
    const [x1, y1] = seg.from;
    const [x2, y2] = seg.to;
    const isHorizontal = Math.abs(y1 - y2) < 0.5;
    const isVertical = Math.abs(x1 - x2) < 0.5;

    if (isHorizontal && seg.lengthInches > 24) {
      // Find centroid to determine outside direction
      const cy = centroid(verts)[1];
      const outside = y1 < cy; // if wall is above center, dim goes above (outside=true)
      dims.push({
        axis: "h",
        from: Math.min(x1, x2),
        to: Math.max(x1, x2),
        wallAt: y1,
        outside,
      });
    } else if (isVertical && seg.lengthInches > 24) {
      const cx = centroid(verts)[0];
      const outside = x1 < cx; // if wall is left of center, dim goes left
      dims.push({
        axis: "v",
        from: Math.min(y1, y2),
        to: Math.max(y1, y2),
        wallAt: x1,
        outside,
      });
    }
  }

  return dims;
}

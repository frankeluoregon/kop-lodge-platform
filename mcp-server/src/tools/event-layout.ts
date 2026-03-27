import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// ─── Event Space Planning Standards ───────────────────────────────────────────
// Industry-standard dimensions and requirements for event layout optimization.
// All measurements in inches unless noted. Capacities in square feet per person.

export const EVENT_STANDARDS = {
  // Square feet per person by event type
  sqftPerPerson: {
    seatedDinner: 15,        // Formal seated dinner with service
    seatedBanquet: 12,       // Banquet-style rounds
    cocktailReception: 8,    // Standing cocktail, light furniture
    theaterStyle: 7,         // Rows of chairs, no tables
    classroomStyle: 18,      // Tables + chairs facing front
    tradeShow: 40,           // Vendor booths with aisles
    danceParty: 5,           // Open dance floor only
    mixedEvent: 12,          // Combined dining + mingling
  },

  // Table dimensions (inches)
  tables: {
    round60: { diameter: 60, seats: 8, sqft: 20 },   // 5' round (standard banquet)
    round72: { diameter: 72, seats: 10, sqft: 28 },   // 6' round
    rect6ft: { width: 30, length: 72, seats: 6, sqft: 15 }, // 6' rectangular
    rect8ft: { width: 30, length: 96, seats: 8, sqft: 20 }, // 8' rectangular
    cocktail30: { diameter: 30, seats: 0, sqft: 5 },  // 30" cocktail/highboy
    cocktail36: { diameter: 36, seats: 0, sqft: 7 },  // 36" cocktail
    halfRound: { width: 60, depth: 30, seats: 3, sqft: 13 }, // half-round/serpentine
  },

  // Chair dimensions (inches)
  chairs: {
    standard: { width: 18, depth: 18 },
    folding: { width: 17, depth: 16 },
    banquet: { width: 20, depth: 20 },
  },

  // Spacing requirements (inches)
  spacing: {
    chairBackToChairBack: 24,     // Min between backs of chairs at adjacent tables
    chairBackToWall: 36,          // Min from chair back to wall
    tableEdgeSpacing: 60,         // Center-to-edge clearance for round tables
    serviceAisle: 48,             // Min aisle for food service access
    mainAisle: 60,                // Main traffic aisle
    buffetQueueDepth: 48,         // Standing space in front of buffet
    buffetTableClearance: 72,     // Space behind buffet for servers
    barApproachDepth: 48,         // Standing space in front of bar
    barServiceDepth: 36,          // Space behind bar for bartender
  },

  // Dance floor (square feet)
  danceFloor: {
    sqftPerDancer: 4.5,           // 4.5 sq ft per expected dancer
    minSize: 144,                  // 12' x 12' minimum (144 sq ft)
    percentOfGuests: 0.33,         // Expect ~33% of guests dancing at any time
    // Common sizes: 12x12, 15x15, 18x18, 21x21
  },

  // Stage / performance area
  stage: {
    comedyMinWidth: 96,           // 8'x8' for standup comedy
    comedyMinDepth: 96,
    comedyWithSetWidth: 120,      // 10'x12' with set pieces
    comedyWithSetDepth: 144,
    bandSmallWidth: 144,          // 12'x16' for 4-piece
    bandSmallDepth: 192,
    bandFullWidth: 192,           // 16'x16' for 5-7 piece
    bandFullDepth: 192,
    bandLargeWidth: 240,          // 20'x20' for 8+
    bandLargeDepth: 240,
    djBoothWidth: 96,             // 8'x10' DJ area
    djBoothDepth: 120,
    soloWidth: 72,                // 6'x8' solo musician
    soloDepth: 96,
    speakerWidth: 72,             // 6'x8' speaker/podium
    speakerDepth: 96,
    audienceClearance: 48,        // 4' min from stage to first row
    audienceClearanceIdeal: 72,   // 6' ideal
    stageHeight8to16: true,       // 8-16" for <200 people
    stageHeight24to48: true,      // 24-48" for larger venues
  },

  // Vendor booths
  vendor: {
    standardWidth: 120,           // 10' wide standard booth
    standardDepth: 120,           // 10' deep (100 sq ft)
    halfBoothWidth: 60,           // 5' half booth
    craftFairWidth: 96,           // 8' craft fair booth
    craftFairDepth: 96,           // 8' deep (64 sq ft)
    foodVendorWidth: 120,         // 10' food vendor
    foodVendorDepth: 180,         // 15' deep (extra prep area)
    mainAisleWidth: 120,          // 10' main aisle min
    mainAisleIdeal: 144,          // 12' ideal main aisle
    secondaryAisleWidth: 96,      // 8' secondary aisle
    deadEndMax: 240,              // 20' max dead end
  },

  // Food service
  food: {
    buffetTableLength: 96,        // 8' buffet table
    buffetDepth: 30,              // Table depth
    buffetApproach: 48,           // Space for guests approaching
    buffetBehind: 48,             // Space for restocking
    totalBuffetWidth: 126,        // Total width needed (table + both sides)
    servingStationSpacing: 120,   // 10' between serving stations
    foodTruckWidth: 96,           // Standard window width
    cateringDropZone: 96,         // 8' staging area for catering
  },

  // Bar / beverage service
  bar: {
    barLength: 96,                // 8' standard bar section
    barDepth: 24,                 // Bar top depth
    bartenderSpace: 36,           // Behind-bar space
    approachSpace: 60,            // 5' in front of bar
    totalDepth: 120,              // Total depth needed
    guestsPerBartender: 75,       // Industry standard
    guestsPerBarSection: 100,     // One 8' section per 100 guests
    beerWineOnly: { barLength: 72, simpler: true },
  },

  // Kids area
  kids: {
    minArea: 400,                 // 400 sq ft minimum (sq ft)
    sqftPerChild: 35,             // 35 sq ft per child
    minBuffer: 48,                // 4' buffer from adult areas
    fenceHeight: 36,              // 3' partition/fence height
    supervision: 10,              // 1 adult per 10 children
  },

  // ADA / accessibility
  ada: {
    wheelchairAisleWidth: 44,     // 44" min clear width
    wheelchairTurnRadius: 60,     // 60" turning radius
    accessibleTableHeight: 34,    // 28-34" table height range
    accessibleTableKneeSpace: 27, // 27" knee clearance
    accessibleSeatingPercent: 5,  // 5% of seats accessible minimum
    rampSlope: 12,                // 1:12 max slope (1" rise per 12" run)
  },

  // Fire code (general — verify local codes)
  fireSafety: {
    exitAisleWidth: 44,           // Min 44" to exit
    maxTravelToExit: 2400,        // 200' max travel to exit (inches)
    sqftPerPersonStanding: 7,     // Occupancy calc: standing
    sqftPerPersonSeated: 15,      // Occupancy calc: seated
    exitWidthPerPerson: 0.2,      // 0.2" exit width per occupant
    minTwoExits: 50,              // Two exits required above 50 occupants
  },
  // Flow optimization
  flow: {
    circulationPercent: 25,       // 20-30% of area for circulation
    primaryPathWidth: 96,         // 8' primary path
    secondaryPathWidth: 60,       // 5' secondary path
    minNarrowPoint: 48,           // Never narrow below 4'
    naturalFlowDirection: 'clockwise', // Guests tend to flow right/clockwise
    barNearEntrance: true,
    foodAwayFromDanceFloor: true,
    kidsAtPeriphery: true,
    vendorsAlongPerimeter: true,
    anchorAttractionsAtCorners: true,
    maxWalkToRestroom: 2400,      // 200' max
    restroomsPer50Guests: 1,
    trashCansPer50Guests: 1,
    parkingSpotsPerGuest: 0.33,
    queueSqftPerPerson: 5,
  },

  // Theater row specifics
  theaterRows: {
    chairCenterToCenter: 22,      // inches
    rowFrontToBack: 33,           // inches
    maxSeatsPerRow2Aisles: 14,
    maxSeatsPerRow1Aisle: 7,
    centerAisleWidth: 48,         // inches
    sideAisleWidth: 36,
    lastRowToWall: 36,
  },
} as const;

// ─── Room Capacity Calculator ─────────────────────────────────────────────────

interface CapacityResult {
  roomName: string;
  totalSqft: number;
  usableSqft: number;
  capacities: Record<string, number>;
  recommendations: string[];
}

export function calculatePolygonArea(vertices: [number, number][]): number {
  // Shoelace formula, returns area in square inches
  let area = 0;
  const n = vertices.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += vertices[i][0] * vertices[j][1];
    area -= vertices[j][0] * vertices[i][1];
  }
  return Math.abs(area) / 2;
}

function calculateCapacity(
  roomName: string,
  vertices: [number, number][],
  hasStage: boolean = false,
  stageArea: number = 0,
): CapacityResult {
  const totalSqIn = calculatePolygonArea(vertices);
  const totalSqft = totalSqIn / 144;

  // Subtract 10% for walls, columns, obstructions, and circulation
  const usableSqft = (totalSqft - stageArea / 144) * 0.90;

  const stds = EVENT_STANDARDS.sqftPerPerson;
  const capacities: Record<string, number> = {};
  for (const [type, sqftPP] of Object.entries(stds)) {
    capacities[type] = Math.floor(usableSqft / sqftPP);
  }

  const recommendations: string[] = [];

  // Fire code max occupancy
  const maxStanding = Math.floor(totalSqft / EVENT_STANDARDS.fireSafety.sqftPerPersonStanding);
  recommendations.push(`Fire code max occupancy (standing): ${maxStanding}`);
  recommendations.push(`Fire code max occupancy (seated): ${Math.floor(totalSqft / EVENT_STANDARDS.fireSafety.sqftPerPersonSeated)}`);

  // Dance floor recommendation
  if (usableSqft > 500) {
    const dancers = Math.floor(capacities.seatedDinner * EVENT_STANDARDS.danceFloor.percentOfGuests);
    const danceFloorSqft = Math.max(
      dancers * EVENT_STANDARDS.danceFloor.sqftPerDancer,
      EVENT_STANDARDS.danceFloor.minSize,
    );
    const side = Math.ceil(Math.sqrt(danceFloorSqft) / 36) * 3; // round up to nearest 3'
    recommendations.push(`Recommended dance floor: ${side}'x${side}' (${side * side} sq ft) for ${capacities.seatedDinner} dinner guests`);
  }

  // Table recommendations
  const round60Count = Math.floor(usableSqft / (EVENT_STANDARDS.tables.round60.sqft + 25)); // 25 sqft for spacing
  recommendations.push(`Max 60" round tables (8 seats each): ${round60Count} = ${round60Count * 8} guests`);

  return { roomName, totalSqft: Math.round(totalSqft), usableSqft: Math.round(usableSqft), capacities, recommendations };
}

// ─── Layout Optimizer ─────────────────────────────────────────────────────────

export interface EventConfig {
  type: "dinner" | "cocktail" | "theater" | "tradeshow" | "mixed" | "performance";
  guestCount: number;
  hasDanceFloor: boolean;
  hasStage: boolean;
  stageType?: "comedy" | "band" | "dj";
  hasFoodService: boolean;
  foodType?: "buffet" | "plated" | "stations";
  hasBar: boolean;
  barType?: "full" | "beer_wine";
  hasVendors: boolean;
  vendorCount?: number;
  hasKidsArea: boolean;
  expectedChildren?: number;
}

interface LayoutPlan {
  event: EventConfig;
  room: CapacityResult;
  feasible: boolean;
  layout: {
    diningArea?: { sqft: number; tables: number; tableType: string; seats: number };
    danceFloor?: { width: number; depth: number; sqft: number };
    stage?: { width: number; depth: number; sqft: number; type: string };
    foodService?: { sqft: number; stations: number; type: string };
    bar?: { length: number; sqft: number; bartenders: number };
    vendors?: { count: number; boothSize: string; aisleWidth: number; sqft: number };
    kidsArea?: { sqft: number; capacity: number };
    circulation?: { sqft: number; percent: number };
  };
  warnings: string[];
  suggestions: string[];
}

export function planLayout(
  roomName: string,
  vertices: [number, number][],
  config: EventConfig,
): LayoutPlan {
  const room = calculateCapacity(roomName, vertices);
  const warnings: string[] = [];
  const suggestions: string[] = [];
  const layout: LayoutPlan["layout"] = {};

  let remainingSqft = room.usableSqft;

  // 1. Stage
  if (config.hasStage) {
    const s = EVENT_STANDARDS.stage;
    let stageW: number, stageD: number;
    switch (config.stageType) {
      case "band":
        stageW = s.bandFullWidth / 12; stageD = s.bandFullDepth / 12;
        break;
      case "dj":
        stageW = s.djBoothWidth / 12; stageD = s.djBoothDepth / 12;
        break;
      default: // comedy/speaker
        stageW = s.comedyMinWidth / 12; stageD = s.comedyMinDepth / 12;
    }
    const stageSqft = stageW * stageD + (s.audienceClearance / 12 * stageW);
    layout.stage = { width: stageW, depth: stageD, sqft: Math.round(stageSqft), type: config.stageType || "comedy" };
    remainingSqft -= stageSqft;
  }

  // 2. Dance floor
  if (config.hasDanceFloor) {
    const df = EVENT_STANDARDS.danceFloor;
    const dancers = Math.ceil(config.guestCount * df.percentOfGuests);
    const needed = Math.max(dancers * df.sqftPerDancer, df.minSize);
    const side = Math.ceil(Math.sqrt(needed) / 3) * 3; // round to 3' increments
    layout.danceFloor = { width: side, depth: side, sqft: side * side };
    remainingSqft -= side * side;
  }

  // 3. Food service
  if (config.hasFoodService) {
    const f = EVENT_STANDARDS.food;
    let foodSqft: number;
    let stations: number;
    switch (config.foodType) {
      case "buffet":
        stations = Math.ceil(config.guestCount / 75);
        foodSqft = stations * (f.buffetTableLength / 12) * (f.totalBuffetWidth / 12);
        break;
      case "stations":
        stations = Math.ceil(config.guestCount / 50);
        foodSqft = stations * 40; // ~40 sqft per station
        break;
      default: // plated
        stations = 0;
        foodSqft = (f.cateringDropZone / 12) * 8; // staging area only
    }
    layout.foodService = { sqft: Math.round(foodSqft), stations, type: config.foodType || "plated" };
    remainingSqft -= foodSqft;
  }

  // 4. Bar
  if (config.hasBar) {
    const b = EVENT_STANDARDS.bar;
    const sections = Math.ceil(config.guestCount / b.guestsPerBarSection);
    const barLen = config.barType === "beer_wine"
      ? b.beerWineOnly.barLength / 12 * sections
      : b.barLength / 12 * sections;
    const barSqft = barLen * (b.totalDepth / 12);
    layout.bar = {
      length: Math.round(barLen),
      sqft: Math.round(barSqft),
      bartenders: Math.ceil(config.guestCount / b.guestsPerBartender),
    };
    remainingSqft -= barSqft;
  }

  // 5. Vendors
  if (config.hasVendors && config.vendorCount) {
    const v = EVENT_STANDARDS.vendor;
    const boothSqft = (v.standardWidth / 12) * (v.standardDepth / 12);
    const aisleSqft = config.vendorCount * (v.mainAisleWidth / 12) * (v.standardDepth / 12) / 2;
    const totalVendorSqft = config.vendorCount * boothSqft + aisleSqft;
    layout.vendors = {
      count: config.vendorCount,
      boothSize: `${v.standardWidth / 12}'x${v.standardDepth / 12}'`,
      aisleWidth: v.mainAisleWidth / 12,
      sqft: Math.round(totalVendorSqft),
    };
    remainingSqft -= totalVendorSqft;
  }

  // 6. Kids area
  if (config.hasKidsArea) {
    const k = EVENT_STANDARDS.kids;
    const children = config.expectedChildren || Math.ceil(config.guestCount * 0.15);
    const kidsSqft = Math.max(children * k.sqftPerChild, k.minArea);
    layout.kidsArea = { sqft: Math.round(kidsSqft), capacity: children };
    remainingSqft -= kidsSqft;
  }

  // 7. Dining / seating with remaining space
  const circulationPercent = 0.15;
  const circulationSqft = remainingSqft * circulationPercent;
  layout.circulation = { sqft: Math.round(circulationSqft), percent: Math.round(circulationPercent * 100) };
  remainingSqft -= circulationSqft;

  if (config.type === "dinner" || config.type === "mixed") {
    const t = EVENT_STANDARDS.tables.round60;
    const sqftPerTable = t.sqft + 25; // table + spacing
    const tables = Math.floor(remainingSqft / sqftPerTable);
    const seats = tables * t.seats;
    layout.diningArea = { sqft: Math.round(remainingSqft), tables, tableType: '60" round', seats };

    if (seats < config.guestCount) {
      warnings.push(`Seating shortfall: ${seats} seats for ${config.guestCount} guests. Consider reducing other areas or using rectangular tables.`);
      // Suggest rect tables
      const rectSqftPerTable = EVENT_STANDARDS.tables.rect8ft.sqft + 20;
      const rectTables = Math.floor(remainingSqft / rectSqftPerTable);
      suggestions.push(`Alternative: ${rectTables} rectangular 8' tables = ${rectTables * 8} seats`);
    }
  } else if (config.type === "theater") {
    const seats = Math.floor(remainingSqft / EVENT_STANDARDS.sqftPerPerson.theaterStyle);
    layout.diningArea = { sqft: Math.round(remainingSqft), tables: 0, tableType: "chairs only", seats };
  } else if (config.type === "cocktail") {
    const cocktailTables = Math.floor(remainingSqft / 30); // ~30sqft per cocktail table area
    layout.diningArea = { sqft: Math.round(remainingSqft), tables: cocktailTables, tableType: '30" cocktail', seats: 0 };
  }

  // Feasibility check
  const feasible = remainingSqft > 0;
  if (!feasible) {
    warnings.push(`Layout exceeds available space by ${Math.abs(Math.round(remainingSqft))} sq ft. Reduce elements or choose a larger room.`);
  }

  // ADA check
  const adaSeats = Math.ceil((layout.diningArea?.seats || config.guestCount) * EVENT_STANDARDS.ada.accessibleSeatingPercent / 100);
  suggestions.push(`ADA: provide ${adaSeats} accessible seating positions with ${EVENT_STANDARDS.ada.wheelchairTurnRadius / 12}' turning radius`);

  // Fire safety
  if (config.guestCount > EVENT_STANDARDS.fireSafety.minTwoExits) {
    suggestions.push("Fire code: 2+ exits required for this guest count");
  }

  return { event: config, room, feasible, layout, warnings, suggestions };
}

// ─── SVG Layout Renderer ──────────────────────────────────────────────────────
// Generates a visual SVG showing room outline with layout elements placed inside.

function polyBounds(pts: [number, number][]): { minX: number; minY: number; maxX: number; maxY: number } {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [x, y] of pts) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  return { minX, minY, maxX, maxY };
}

function generateLayoutSVG(
  roomName: string,
  vertices: [number, number][],
  config: EventConfig,
  plan: LayoutPlan,
): string {
  const bb = polyBounds(vertices);
  const rW = bb.maxX - bb.minX;
  const rH = bb.maxY - bb.minY;
  const margin = 60;
  const titleH = 50;
  const sc = Math.min(800 / rW, 600 / rH);
  const pw = rW * sc + margin * 2;
  const ph = rH * sc + margin * 2 + titleH;
  const ox = margin;
  const oy = margin + titleH;

  function px(x: number) { return ox + (x - bb.minX) * sc; }
  function py(y: number) { return oy + (y - bb.minY) * sc; }
  function sw(w: number) { return w * sc; }

  // Convert sq ft to inches for placement (sqrt gives side length)
  function sqftToIn(sqft: number) { return Math.sqrt(sqft * 144); }

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${pw} ${ph}" width="${pw}" height="${ph}" font-family="'Courier New', monospace">
  <defs>
    <style>
      .wall { stroke: #1a1a2e; stroke-width: 3; fill: #fafafa; stroke-linecap: square; }
      .zone { stroke: #888; stroke-width: 1; stroke-dasharray: 4,2; rx: 4; }
      .zone-label { font-size: 10px; fill: #555; text-anchor: middle; font-weight: bold; }
      .table-circle { fill: #fff; stroke: #666; stroke-width: 1; }
      .seat { fill: #999; stroke: none; }
      .title { font-size: 18px; fill: #1a1a2e; text-anchor: middle; font-weight: bold; }
      .subtitle { font-size: 11px; fill: #555; text-anchor: middle; }
      .legend { font-size: 9px; fill: #666; }
    </style>
  </defs>
  <rect width="${pw}" height="${ph}" fill="#fefefe"/>
  <text x="${pw / 2}" y="20" class="title">${roomName} — Event Layout</text>
  <text x="${pw / 2}" y="36" class="subtitle">${config.guestCount} guests | ${config.type}${plan.feasible ? '' : ' | OVER CAPACITY'}</text>
`;

  // Room outline
  const pathD = "M" + vertices.map(p => `${px(p[0])},${py(p[1])}`).join(" L") + " Z";
  svg += `  <path d="${pathD}" class="wall"/>\n`;

  // Place elements using zone-based layout
  // Flow: stage at top, dance floor in front of stage, dining in middle, bar near bottom (entrance), food along side
  const cx = (bb.minX + bb.maxX) / 2;
  const cy = (bb.minY + bb.maxY) / 2;
  let cursorY = bb.minY + 12; // start placing from top

  // Stage
  if (plan.layout.stage) {
    const stW = plan.layout.stage.width * 12;
    const stD = plan.layout.stage.depth * 12;
    const sx = cx - stW / 2;
    svg += `  <rect x="${px(sx)}" y="${py(cursorY)}" width="${sw(stW)}" height="${sw(stD)}" class="zone" fill="#d4c5f9" opacity="0.6"/>\n`;
    svg += `  <text x="${px(cx)}" y="${py(cursorY + stD / 2) + 4}" class="zone-label">STAGE (${plan.layout.stage.type})</text>\n`;
    cursorY += stD + 48; // 4' audience clearance
  }

  // Dance floor
  if (plan.layout.danceFloor) {
    const dfW = plan.layout.danceFloor.width * 12;
    const dfD = plan.layout.danceFloor.depth * 12;
    const dx = cx - dfW / 2;
    svg += `  <rect x="${px(dx)}" y="${py(cursorY)}" width="${sw(dfW)}" height="${sw(dfD)}" class="zone" fill="#b3e5fc" opacity="0.5"/>\n`;
    svg += `  <text x="${px(cx)}" y="${py(cursorY + dfD / 2) + 4}" class="zone-label">DANCE FLOOR ${plan.layout.danceFloor.width}'x${plan.layout.danceFloor.depth}'</text>\n`;
    cursorY += dfD + 36;
  }

  // Dining tables
  if (plan.layout.diningArea && plan.layout.diningArea.tables > 0) {
    const tableR = 30; // 60" round = 30" radius
    const spacing = 132; // 11' center-to-center
    const availW = rW - 72; // 3' margin each side
    const cols = Math.max(1, Math.floor(availW / spacing));
    const rows = Math.ceil(plan.layout.diningArea.tables / cols);

    const startX = bb.minX + 36 + (availW - (cols - 1) * spacing) / 2;
    const startY = cursorY + tableR + 12;

    for (let i = 0; i < plan.layout.diningArea.tables; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const tx = startX + col * spacing;
      const ty = startY + row * spacing;
      if (ty + tableR > bb.maxY - 72) break; // don't overflow

      // Table circle
      svg += `  <circle cx="${px(tx)}" cy="${py(ty)}" r="${sw(tableR)}" class="table-circle"/>\n`;
      // Seat dots around table
      const seats = 8;
      const seatR = tableR + 18;
      for (let s = 0; s < seats; s++) {
        const angle = (s / seats) * Math.PI * 2;
        const sx2 = tx + Math.cos(angle) * seatR;
        const sy2 = ty + Math.sin(angle) * seatR;
        svg += `  <circle cx="${px(sx2)}" cy="${py(sy2)}" r="${sw(6)}" class="seat"/>\n`;
      }
    }
    cursorY = startY + rows * spacing;
  }

  // Bar (near bottom / entrance)
  if (plan.layout.bar) {
    const barLen = plan.layout.bar.length * 12;
    const barD = 24;
    const bx = bb.minX + 36;
    const by = bb.maxY - 72 - barD;
    svg += `  <rect x="${px(bx)}" y="${py(by)}" width="${sw(barLen)}" height="${sw(barD)}" class="zone" fill="#ffe0b2" opacity="0.7"/>\n`;
    svg += `  <text x="${px(bx + barLen / 2)}" y="${py(by + barD / 2) + 4}" class="zone-label">BAR</text>\n`;
  }

  // Food service (along right wall)
  if (plan.layout.foodService) {
    const fW = 96; // 8' wide
    const fD = sqftToIn(plan.layout.foodService.sqft);
    const clampedD = Math.min(fD, rH * 0.4);
    const fx = bb.maxX - fW - 24;
    const fy = cy - clampedD / 2;
    svg += `  <rect x="${px(fx)}" y="${py(fy)}" width="${sw(fW)}" height="${sw(clampedD)}" class="zone" fill="#c8e6c9" opacity="0.6"/>\n`;
    const fLabel = plan.layout.foodService.type === "buffet" ? "BUFFET" : "FOOD";
    svg += `  <text x="${px(fx + fW / 2)}" y="${py(fy + clampedD / 2) + 4}" class="zone-label">${fLabel}</text>\n`;
  }

  // Vendors (along left wall)
  if (plan.layout.vendors && plan.layout.vendors.count > 0) {
    const boothW = 96;
    const boothD = 96;
    const vx = bb.minX + 12;
    let vy = cy - (plan.layout.vendors.count * (boothD + 24)) / 2;
    for (let i = 0; i < plan.layout.vendors.count; i++) {
      svg += `  <rect x="${px(vx)}" y="${py(vy)}" width="${sw(boothW)}" height="${sw(boothD)}" class="zone" fill="#fff9c4" opacity="0.6"/>\n`;
      svg += `  <text x="${px(vx + boothW / 2)}" y="${py(vy + boothD / 2) + 4}" class="zone-label">V${i + 1}</text>\n`;
      vy += boothD + 24;
    }
  }

  // Kids area (bottom-right corner)
  if (plan.layout.kidsArea) {
    const kSide = sqftToIn(plan.layout.kidsArea.sqft);
    const clampedSide = Math.min(kSide, rW * 0.3, rH * 0.3);
    const kx = bb.maxX - clampedSide - 24;
    const ky = bb.maxY - clampedSide - 24;
    svg += `  <rect x="${px(kx)}" y="${py(ky)}" width="${sw(clampedSide)}" height="${sw(clampedSide)}" class="zone" fill="#f8bbd0" opacity="0.5"/>\n`;
    svg += `  <text x="${px(kx + clampedSide / 2)}" y="${py(ky + clampedSide / 2) + 4}" class="zone-label">KIDS AREA</text>\n`;
  }

  // Legend
  const ly = ph - 14;
  svg += `  <text x="10" y="${ly}" class="legend">`;
  const parts: string[] = [];
  if (plan.layout.diningArea) parts.push(`Tables: ${plan.layout.diningArea.tables} (${plan.layout.diningArea.seats} seats)`);
  if (plan.layout.danceFloor) parts.push(`Dance: ${plan.layout.danceFloor.sqft} sqft`);
  if (plan.layout.bar) parts.push(`Bar: ${plan.layout.bar.length}' (${plan.layout.bar.bartenders} bartenders)`);
  if (plan.layout.foodService) parts.push(`Food: ${plan.layout.foodService.type}`);
  svg += parts.join(' | ');
  svg += `</text>\n`;

  if (!plan.feasible) {
    svg += `  <text x="${pw / 2}" y="${ph - 4}" class="legend" text-anchor="middle" fill="#c0392b" font-weight="bold">WARNING: Layout exceeds available space</text>\n`;
  }

  svg += `</svg>`;
  return svg;
}

// ─── MCP Tool Registration ────────────────────────────────────────────────────

export function registerEventLayoutTools(server: McpServer) {
  server.tool(
    "event_room_capacity",
    "Calculate room capacities for different event types given a polygon shape (vertices in inches). Returns max guests for dinner, cocktail, theater, trade show, etc.",
    {
      room_name: z.string().describe("Name of the room"),
      vertices: z.string().describe("JSON array of [x,y] vertices in inches, e.g. '[[0,0],[404,0],[404,486],[0,486]]'"),
      stage_area_sqin: z.number().optional().describe("Stage area to subtract (square inches)"),
    },
    async ({ room_name, vertices, stage_area_sqin }) => {
      const verts: [number, number][] = JSON.parse(vertices);
      const result = calculateCapacity(room_name, verts, !!stage_area_sqin, stage_area_sqin || 0);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  );

  server.tool(
    "event_layout_plan",
    "Generate an optimized event layout plan for a room. Calculates space allocation for dining, dance floor, stage, food service, bar, vendors, and kids area.",
    {
      room_name: z.string(),
      vertices: z.string().describe("JSON array of [x,y] vertices in inches"),
      event_config: z.string().describe("JSON EventConfig: { type, guestCount, hasDanceFloor, hasStage, stageType?, hasFoodService, foodType?, hasBar, barType?, hasVendors, vendorCount?, hasKidsArea, expectedChildren? }"),
    },
    async ({ room_name, vertices, event_config }) => {
      const verts: [number, number][] = JSON.parse(vertices);
      const config: EventConfig = JSON.parse(event_config);
      const plan = planLayout(room_name, verts, config);
      return { content: [{ type: "text", text: JSON.stringify(plan, null, 2) }] };
    },
  );

  server.tool(
    "event_standards",
    "Returns the full event space planning standards reference (table sizes, spacing requirements, fire code, ADA, etc.)",
    {},
    async () => {
      return { content: [{ type: "text", text: JSON.stringify(EVENT_STANDARDS, null, 2) }] };
    },
  );

  // ── SVG Layout Visualization ──────────────────────────────────────────────

  server.tool(
    "event_layout_to_svg",
    "Generate a visual SVG showing a room polygon with event layout elements (tables, dance floor, stage, bar, food, vendors, kids area) placed inside. Uses planLayout for space allocation and places elements spatially.",
    {
      room_name: z.string(),
      vertices: z.string().describe("JSON array of [x,y] vertices in inches"),
      event_config: z.string().describe("JSON EventConfig: { type, guestCount, hasDanceFloor, hasStage, stageType?, hasFoodService, foodType?, hasBar, barType?, hasVendors, vendorCount?, hasKidsArea, expectedChildren? }"),
    },
    async ({ room_name, vertices, event_config }) => {
      try {
        const verts: [number, number][] = JSON.parse(vertices);
        const config: EventConfig = JSON.parse(event_config);
        const plan = planLayout(room_name, verts, config);
        const svg = generateLayoutSVG(room_name, verts, config, plan);
        return { content: [{ type: "text", text: svg }] };
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        return { content: [{ type: "text", text: `Error generating layout SVG: ${msg}` }] };
      }
    },
  );

  // Pre-configured Helmet Lodge rooms for quick capacity checks
  server.tool(
    "helmet33_room_capacities",
    "Quick capacity lookup for all Helmet Lodge No. 33 rooms across event types",
    {},
    async () => {
      const rooms = {
        "Dining Hall": { vertices: [[0,0],[558,0],[558,401],[0,401]] as [number,number][] },
        "Grand Hall": { vertices: [[0,0],[404,0],[404,486],[0,486]] as [number,number][], stageArea: 107 * 486 },
        "Grand Hall + Stage": { vertices: [[0,0],[511,0],[511,486],[0,486]] as [number,number][] },
        "Lobby": { vertices: [[0,0],[22,0],[22,26],[44,26],[44,80],[345,80],[345,225],[0,225]] as [number,number][] },
        "Parking Lot": { vertices: [[0,0],[973,0],[973,789],[0,789]] as [number,number][] },
      };

      const results: Record<string, CapacityResult> = {};
      for (const [name, cfg] of Object.entries(rooms)) {
        results[name] = calculateCapacity(name, cfg.vertices, false, (cfg as Record<string,unknown>).stageArea as number || 0);
      }

      return { content: [{ type: "text", text: JSON.stringify(results, null, 2) }] };
    },
  );
}

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { D1Client } from "../db/client.js";
import { getLodgeId } from "../db/client.js";
import { planLayout, EVENT_STANDARDS } from "./event-layout.js";
import type { EventConfig } from "./event-layout.js";

// ─── Event Planning Tools ────────────────────────────────────────────────────

async function ensureEventPlansTable(db: D1Client): Promise<void> {
  await db.run(`
    CREATE TABLE IF NOT EXISTS event_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lodge_id INTEGER NOT NULL,
      event_name TEXT NOT NULL,
      event_date TEXT NOT NULL,
      room_name TEXT NOT NULL,
      event_config TEXT NOT NULL,
      layout_result TEXT NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
}

export function registerEventPlanningTools(server: McpServer, db: D1Client) {
  // ── Tool 4: Event History (D1-backed) ───────────────────────────────────────

  server.tool(
    "event_plan_save",
    "Save an event layout plan to D1 for future reference",
    {
      lodge_slug: z.string().describe("Lodge slug, e.g. 'helmet-33'"),
      event_name: z.string().describe("Name of the event"),
      event_date: z.string().describe("ISO 8601 date, e.g. '2026-04-15'"),
      room_name: z.string().describe("Name of the room"),
      event_config: z.string().describe("JSON string of EventConfig"),
      layout_result: z.string().describe("JSON string of the layout plan result"),
      notes: z.string().optional().describe("Optional notes about the plan"),
    },
    async ({ lodge_slug, event_name, event_date, room_name, event_config, layout_result, notes }) => {
      await ensureEventPlansTable(db);
      const lodgeId = await getLodgeId(db, lodge_slug);
      const meta = await db.run(
        `INSERT INTO event_plans (lodge_id, event_name, event_date, room_name, event_config, layout_result, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [lodgeId, event_name, event_date, room_name, event_config, layout_result, notes ?? null],
      );
      return {
        content: [
          {
            type: "text" as const,
            text: `Event plan saved with ID ${meta.last_row_id}: "${event_name}" for lodge '${lodge_slug}'`,
          },
        ],
      };
    },
  );

  server.tool(
    "event_plan_list",
    "List saved event plans for a lodge",
    {
      lodge_slug: z.string().describe("Lodge slug, e.g. 'helmet-33'"),
      limit: z.number().optional().default(20).describe("Max number of plans to return"),
    },
    async ({ lodge_slug, limit }) => {
      await ensureEventPlansTable(db);
      const lodgeId = await getLodgeId(db, lodge_slug);
      const rows = await db.all(
        `SELECT id, event_name, event_date, room_name, notes, created_at
         FROM event_plans WHERE lodge_id = ? ORDER BY created_at DESC LIMIT ?`,
        [lodgeId, limit],
      );
      return {
        content: [{ type: "text" as const, text: JSON.stringify(rows, null, 2) }],
      };
    },
  );

  server.tool(
    "event_plan_get",
    "Get full details of a saved event plan including config and layout result",
    {
      lodge_slug: z.string().describe("Lodge slug, e.g. 'helmet-33'"),
      plan_id: z.number().describe("Event plan ID"),
    },
    async ({ lodge_slug, plan_id }) => {
      await ensureEventPlansTable(db);
      const lodgeId = await getLodgeId(db, lodge_slug);
      const row = await db.first(
        `SELECT * FROM event_plans WHERE id = ? AND lodge_id = ?`,
        [plan_id, lodgeId],
      );
      if (!row) {
        return {
          content: [{ type: "text" as const, text: `Event plan ${plan_id} not found for lodge '${lodge_slug}'` }],
        };
      }
      return {
        content: [{ type: "text" as const, text: JSON.stringify(row, null, 2) }],
      };
    },
  );

  server.tool(
    "event_plan_delete",
    "Delete a saved event plan",
    {
      lodge_slug: z.string().describe("Lodge slug, e.g. 'helmet-33'"),
      plan_id: z.number().describe("Event plan ID to delete"),
    },
    async ({ lodge_slug, plan_id }) => {
      await ensureEventPlansTable(db);
      const lodgeId = await getLodgeId(db, lodge_slug);
      await db.run(
        `DELETE FROM event_plans WHERE id = ? AND lodge_id = ?`,
        [plan_id, lodgeId],
      );
      return {
        content: [{ type: "text" as const, text: `Event plan ${plan_id} deleted.` }],
      };
    },
  );

  // ── Tool 5: Multi-Room Event Planning ───────────────────────────────────────

  server.tool(
    "event_multi_room_plan",
    "Plan an event across multiple rooms. For each room, generates a layout plan and returns combined results with total capacity, warnings, and flow suggestions.",
    {
      lodge_slug: z.string().describe("Lodge slug, e.g. 'helmet-33'"),
      rooms: z.string().describe(
        "JSON array of room objects: [{room_name, vertices (JSON [x,y][] in inches), event_config (EventConfig object)}]",
      ),
    },
    async ({ lodge_slug, rooms }) => {
      // Validate lodge exists
      await getLodgeId(db, lodge_slug);

      const roomList: { room_name: string; vertices: [number, number][]; event_config: EventConfig }[] =
        JSON.parse(rooms);

      const perRoomResults: Record<string, unknown>[] = [];
      let totalCapacity = 0;
      const combinedWarnings: string[] = [];
      const flowSuggestions: string[] = [];

      for (const room of roomList) {
        const plan = planLayout(room.room_name, room.vertices, room.event_config);
        perRoomResults.push({
          room_name: room.room_name,
          plan,
        });

        // Tally capacity
        if (plan.layout.diningArea) {
          totalCapacity += plan.layout.diningArea.seats;
        } else {
          totalCapacity += room.event_config.guestCount;
        }

        // Collect warnings with room name prefix
        for (const w of plan.warnings) {
          combinedWarnings.push(`[${room.room_name}] ${w}`);
        }
      }

      // Generate flow suggestions based on room event types
      const roomTypes = roomList.map((r) => ({
        name: r.room_name,
        type: r.event_config.type,
        hasBar: r.event_config.hasBar,
        hasFoodService: r.event_config.hasFoodService,
        hasDanceFloor: r.event_config.hasDanceFloor,
        hasStage: r.event_config.hasStage,
      }));

      const cocktailRoom = roomTypes.find((r) => r.type === "cocktail");
      const dinnerRoom = roomTypes.find((r) => r.type === "dinner" || r.type === "mixed");
      const performanceRoom = roomTypes.find((r) => r.type === "performance" || r.hasStage);

      if (cocktailRoom && dinnerRoom) {
        flowSuggestions.push(
          `Use ${cocktailRoom.name} for cocktail hour, ${dinnerRoom.name} for seated dinner`,
        );
      }
      if (performanceRoom && dinnerRoom && performanceRoom.name !== dinnerRoom.name) {
        flowSuggestions.push(
          `After dinner in ${dinnerRoom.name}, direct guests to ${performanceRoom.name} for entertainment`,
        );
      }

      // Bar placement suggestion
      const barRooms = roomTypes.filter((r) => r.hasBar);
      if (barRooms.length > 1) {
        flowSuggestions.push(
          `Multiple bars across rooms (${barRooms.map((r) => r.name).join(", ")}) will distribute guest flow and reduce wait times`,
        );
      } else if (barRooms.length === 1) {
        flowSuggestions.push(
          `Bar in ${barRooms[0].name} - consider placing near entrance per flow best practices`,
        );
      }

      // Guest flow path
      const guestFlowPath = roomList.map((r) => r.room_name);
      if (cocktailRoom) {
        // Put cocktail room first
        const idx = guestFlowPath.indexOf(cocktailRoom.name);
        if (idx > 0) {
          guestFlowPath.splice(idx, 1);
          guestFlowPath.unshift(cocktailRoom.name);
        }
      }

      const result = {
        perRoomPlans: perRoomResults,
        totalCapacity,
        combinedWarnings,
        flowSuggestions,
        guestFlowPath,
      };

      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  // ── Tool 7: Vendor Booth Auto-Assignment ────────────────────────────────────

  server.tool(
    "event_vendor_assign",
    "Auto-assign vendor positions in a room. Places food vendors along back walls, standard vendors along perimeter, craft vendors in remaining spots, honoring preferred positions where possible.",
    {
      room_name: z.string().describe("Name of the room"),
      vertices: z.string().describe("JSON array of [x,y] vertices in inches defining room polygon"),
      vendors: z.string().describe(
        'JSON array of vendor objects: [{name, type: "standard"|"food"|"craft", preferred_position?: "entrance"|"center"|"corner"|"perimeter"}]',
      ),
    },
    async ({ room_name, vertices, vendors }) => {
      const verts: [number, number][] = JSON.parse(vertices);
      const vendorList: {
        name: string;
        type: "standard" | "food" | "craft";
        preferred_position?: "entrance" | "center" | "corner" | "perimeter";
      }[] = JSON.parse(vendors);

      const v = EVENT_STANDARDS.vendor;
      const mainAisleWidth = v.mainAisleWidth; // inches

      // Calculate room bounds
      const xs = verts.map((p) => p[0]);
      const ys = verts.map((p) => p[1]);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      const roomWidth = maxX - minX;
      const roomHeight = maxY - minY;

      // Identify key positions
      const entrance: [number, number] = [minX + roomWidth / 2, maxY]; // bottom center
      const center: [number, number] = [minX + roomWidth / 2, minY + roomHeight / 2];
      const corners: [number, number][] = [
        [minX, minY],
        [maxX, minY],
        [minX, maxY],
        [maxX, maxY],
      ];
      const backWallY = minY; // top = back wall (farthest from entrance)

      // Booth sizes by vendor type (inches)
      const boothSizes: Record<string, { width: number; depth: number }> = {
        standard: { width: v.standardWidth, depth: v.standardDepth },
        food: { width: v.foodVendorWidth, depth: v.foodVendorDepth },
        craft: { width: v.craftFairWidth, depth: v.craftFairDepth },
      };

      // Separate vendors by type
      const foodVendors = vendorList.filter((vd) => vd.type === "food");
      const standardVendors = vendorList.filter((vd) => vd.type === "standard");
      const craftVendors = vendorList.filter((vd) => vd.type === "craft");

      // Track assigned positions
      const assignments: {
        vendor_name: string;
        position: [number, number];
        booth_size: string;
        facing_direction: string;
      }[] = [];
      const occupied: { x: number; y: number; w: number; h: number }[] = [];

      function hasConflict(x: number, y: number, w: number, h: number): boolean {
        for (const o of occupied) {
          // Check overlap with minimum aisle width between booths
          if (
            x < o.x + o.w + mainAisleWidth &&
            x + w + mainAisleWidth > o.x &&
            y < o.y + o.h + mainAisleWidth &&
            y + h + mainAisleWidth > o.y
          ) {
            return true;
          }
        }
        return false;
      }

      function placeVendor(
        vendor: (typeof vendorList)[0],
        preferredX: number,
        preferredY: number,
        facing: string,
      ): boolean {
        const size = boothSizes[vendor.type];
        let x = preferredX;
        let y = preferredY;

        // Try preferred position first, then search nearby
        for (let attempt = 0; attempt < 20; attempt++) {
          if (
            x >= minX &&
            x + size.width <= maxX &&
            y >= minY &&
            y + size.depth <= maxY &&
            !hasConflict(x, y, size.width, size.depth)
          ) {
            assignments.push({
              vendor_name: vendor.name,
              position: [Math.round(x), Math.round(y)],
              booth_size: `${size.width / 12}'x${size.depth / 12}'`,
              facing_direction: facing,
            });
            occupied.push({ x, y, w: size.width, h: size.depth });
            return true;
          }
          // Shift position to find open space
          x += size.width + mainAisleWidth;
          if (x + size.width > maxX) {
            x = minX;
            y += size.depth + mainAisleWidth;
          }
        }
        return false;
      }

      // 1. Place food vendors along back wall (away from center/entrance)
      let foodX = minX + mainAisleWidth;
      for (const vendor of foodVendors) {
        const size = boothSizes.food;
        if (vendor.preferred_position === "corner") {
          const corner = corners.shift();
          if (corner) {
            placeVendor(vendor, corner[0], corner[1], "inward");
            continue;
          }
        }
        placeVendor(vendor, foodX, backWallY + mainAisleWidth, "south");
        foodX += size.width + mainAisleWidth;
      }

      // 2. Place standard vendors along perimeter (left and right walls)
      let leftY = minY + mainAisleWidth;
      let rightY = minY + mainAisleWidth;
      for (const vendor of standardVendors) {
        const size = boothSizes.standard;
        if (vendor.preferred_position === "entrance") {
          placeVendor(vendor, entrance[0] - size.width / 2, maxY - size.depth - mainAisleWidth, "north");
        } else if (vendor.preferred_position === "center") {
          placeVendor(vendor, center[0] - size.width / 2, center[1] - size.depth / 2, "south");
        } else if (vendor.preferred_position === "corner") {
          const corner = corners.shift();
          if (corner) {
            placeVendor(vendor, corner[0], corner[1], "inward");
          } else {
            placeVendor(vendor, minX + mainAisleWidth, leftY, "east");
            leftY += size.depth + mainAisleWidth;
          }
        } else {
          // Alternate left and right walls
          if (leftY <= rightY) {
            placeVendor(vendor, minX + mainAisleWidth, leftY, "east");
            leftY += size.depth + mainAisleWidth;
          } else {
            placeVendor(vendor, maxX - size.width - mainAisleWidth, rightY, "west");
            rightY += size.depth + mainAisleWidth;
          }
        }
      }

      // 3. Place craft vendors in remaining spots
      for (const vendor of craftVendors) {
        const size = boothSizes.craft;
        if (vendor.preferred_position === "center") {
          placeVendor(vendor, center[0] - size.width / 2, center[1] - size.depth / 2, "south");
        } else if (vendor.preferred_position === "entrance") {
          placeVendor(vendor, entrance[0] - size.width / 2, maxY - size.depth - mainAisleWidth, "north");
        } else {
          // Fill remaining perimeter space
          if (leftY <= rightY) {
            placeVendor(vendor, minX + mainAisleWidth, leftY, "east");
            leftY += size.depth + mainAisleWidth;
          } else {
            placeVendor(vendor, maxX - size.width - mainAisleWidth, rightY, "west");
            rightY += size.depth + mainAisleWidth;
          }
        }
      }

      const unplaced = vendorList
        .filter((vd) => !assignments.find((a) => a.vendor_name === vd.name))
        .map((vd) => vd.name);

      const result = {
        room_name,
        room_bounds: {
          width_ft: Math.round(roomWidth / 12),
          height_ft: Math.round(roomHeight / 12),
        },
        assignments,
        unplaced: unplaced.length > 0 ? unplaced : undefined,
        warnings: unplaced.length > 0
          ? [`Could not place ${unplaced.length} vendor(s) due to space constraints: ${unplaced.join(", ")}`]
          : [],
        main_aisle_width_ft: mainAisleWidth / 12,
      };

      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );
}

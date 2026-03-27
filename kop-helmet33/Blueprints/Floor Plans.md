# Helmet Lodge No. 33 - Floor Plans

## Building Overview

The lodge is located at the corner of **Laurence Ave** (west) and **12th Ave** (south). The building has two levels connected by a stairwell.

## Rooms

### Dining Hall (Ground Floor, Upper Level)
- **Dining Room**: 46'-6" x 33'-5" (1,554 sq ft)
- **Kitchen**: L-shaped, 16'-3" x 22'-8" upper + 10'-5" x 10'-9" alcove (~430 sq ft)
- Connected by single interior door (swings into Kitchen)
- Kitchen has exterior exit door at top wall
- Total useable event space (Dining only): ~1,554 sq ft

### Grand Hall (Ground Floor, Upper Level)
- **Grand Hall**: 33'-8" x 40'-6" (1,364 sq ft)
- **Stage**: 8'-11" x 40'-6" (362 sq ft)
- Two inswinging doors on lower wall, evenly spaced
- Stage runs full depth along right wall
- Total useable event space (Hall + Stage): ~1,726 sq ft

### Lobby (Ground Floor, Lower Level)
- **8-sided shape** with stair notch in upper-left corner
- Main area: 28'-9" x 12'-1" (~348 sq ft useable)
- Extended left wall: 18'-9" total height
- Stair notch: two steps (1'-10" x 2'-2", 1'-10" x 4'-6")
- Double door at bottom wall (entry/exit)
- Total useable event space: ~1,400 sq ft (approx)

### Parking Lot / Building Envelope (Ground Floor)
- **Building**: 81'-1" x 65'-9" (5,332 sq ft total footprint)
- **Lodge room** recessed as notch: 28'-9" x 18'-9"
- Parking Lot: remaining open area (~4,800 sq ft)
- Double door from Lodge into Parking Lot
- Streets: Laurence Ave (west), 12th Ave (south)

### Upstairs Hallway (Upper Level)
- **10-sided stepped shape** connecting rooms
- Upper column: 72" wide x 224" deep
- Steps wider to left, then narrower, then Landing
- **Landing**: bottom rectangle, 197" x 73" (100 sq ft)
- 7 doors total (all swing outward into adjacent rooms)
- Exterior exit door at top

## Scale
All measurements derived from original bitmap sketch at **1 pixel = 1 inch**.
Door icons are representational and not to scale.

## Files
| File | Description |
|------|-------------|
| `kop-lodge-bps.png` | Original bitmap sketch (source of truth) |
| `kop-lodge-blueprint.svg` | Overview floor plan with all rooms |
| `dining-hall.svg` | Dining Hall + Kitchen detail |
| `grand-hall.svg` | Grand Hall + Stage detail |
| `lobby.svg` | Lobby (8-sided, stairs subtracted) |
| `parking-lot.svg` | Building envelope with Lodge notch |
| `upstairs-hallway.svg` | Upstairs Hallway (10-sided) |
| `gen-blueprints.js` | SVG generator script (Node.js) |
| `gen-pdf.js` | PDF generator (combines SVGs into PDF) |
| `KoP Helmet Lodge No. 33 Event Floor Plans.pdf` | Combined PDF |

## Generation

### From Bitmap Sketch
```bash
# Analyze bitmap, extract walls, generate SVGs
node gen-blueprints.js
```

### PDF
```bash
# Requires sharp + pdf-lib (npm install sharp pdf-lib)
node gen-pdf.js
```

### From Description (MCP)
Use the `blueprint_generate` MCP tool with a JSON BlueprintDef:
```json
{
  "name": "Room Name",
  "subtitle": "Building Name",
  "rooms": [{
    "label": "Room",
    "shape": [[x1,y1], [x2,y2], ...],
    "doors": [{ "pos": [x,y], "length": 36, "dir": "right-down" }],
    "dimensions": [{ "axis": "h", "from": 0, "to": 100, "wallAt": 0, "outside": true }]
  }]
}
```

Use `blueprint_schema` MCP tool for full format documentation.

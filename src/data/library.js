/* Sample library layout. x / y / w / h are % of the floor plan. Replace with your real library. */
export const FLOORS = [
  { id: "g", name: "Ground Floor", short: "Ground" },
  { id: "1", name: "First Floor", short: "Floor 1" },
  { id: "2", name: "Second Floor", short: "Floor 2" },
];

// type: quiet | silent | open | lab. pop = how busy this zone tends to be (0 to 1)
export const ZONES = [
  { id: "qh", code: "Q", floor: "g", name: "Quiet Reading Hall", type: "quiet", rows: 6, cols: 10, outlets: true, window: true, pop: 1, x: 2, y: 3, w: 62, h: 52 },
  { id: "oc", code: "C", floor: "g", name: "Open Study Commons", type: "open", rows: 4, cols: 9, outlets: true, window: false, pop: 0.8, x: 2, y: 59, w: 62, h: 38 },
  { id: "sz", code: "S", floor: "1", name: "Silent Zone", type: "silent", rows: 5, cols: 12, outlets: false, window: true, pop: 0.9, x: 2, y: 3, w: 62, h: 46 },
  { id: "cl", code: "L", floor: "1", name: "Computer Corner", type: "lab", rows: 3, cols: 8, outlets: true, window: false, pop: 0.7, x: 2, y: 53, w: 40, h: 44 },
  { id: "gt", code: "G", floor: "1", name: "Group Tables", type: "open", rows: 3, cols: 4, outlets: true, window: false, pop: 0.8, x: 45, y: 53, w: 19, h: 44 },
  { id: "rl", code: "R", floor: "2", name: "Rooftop Reading Lounge", type: "open", rows: 4, cols: 9, outlets: true, window: true, pop: 0.6, x: 2, y: 3, w: 62, h: 44 },
  { id: "qp", code: "P", floor: "2", name: "Quiet Pods", type: "quiet", rows: 2, cols: 6, outlets: true, window: false, pop: 0.7, x: 2, y: 51, w: 62, h: 46 },
];

export const ROOMS = [
  { id: "r1", floor: "g", name: "Room G1", cap: 4, features: ["Whiteboard"], x: 67, y: 3, w: 31, h: 28 },
  { id: "r2", floor: "g", name: "Room G2", cap: 6, features: ["Whiteboard", "Screen"], x: 67, y: 34, w: 31, h: 28 },
  { id: "r3", floor: "g", name: "Room G3", cap: 8, features: ["Screen", "Projector"], x: 67, y: 65, w: 31, h: 32 },
  { id: "r4", floor: "1", name: "Room 1A", cap: 4, features: ["Whiteboard"], x: 67, y: 3, w: 31, h: 28 },
  { id: "r5", floor: "1", name: "Room 1B", cap: 6, features: ["Screen"], x: 67, y: 34, w: 31, h: 28 },
  { id: "r6", floor: "1", name: "Seminar Room", cap: 10, features: ["Projector", "Whiteboard"], x: 67, y: 65, w: 31, h: 32 },
  { id: "r7", floor: "2", name: "Room 2A", cap: 4, features: ["Whiteboard"], x: 67, y: 3, w: 31, h: 44 },
  { id: "r8", floor: "2", name: "Room 2B", cap: 6, features: ["Screen", "Whiteboard"], x: 67, y: 51, w: 31, h: 46 },
];

export const OPEN_HOUR = 8, CLOSE_HOUR = 22, LAST_SLOT = 19;
export const SEAT = {}; // seat id -> details
ZONES.forEach((z) => {
  z.seatIds = [];
  for (let r = 0; r < z.rows; r++) for (let c = 0; c < z.cols; c++) {
    const id = `${z.id}-${r}-${c}`;
    SEAT[id] = { id, zone: z, row: r, col: c, code: `${z.code}-${String.fromCharCode(65 + r)}${c + 1}`, outlet: z.outlets && c % 2 === 0, window: z.window && r === 0 };
    z.seatIds.push(id);
  }
});
export const zoneById = (id) => ZONES.find((z) => z.id === id);
export const roomById = (id) => ROOMS.find((r) => r.id === id);

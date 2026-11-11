import { ZONES, ROOMS, SEAT, OPEN_HOUR, CLOSE_HOUR, LAST_SLOT } from "../data/library.js";

/* Simulated sensors, updated every second. To go live, replace tick() with a fetch of real
   seat and room data in the same shape (seats: id -> "free" | "taken" | "held"). */
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const curve = (h) => 0.2 + 0.62 * Math.exp(-(((h - 15) / 3.6) ** 2)); // busiest around 3 PM
const say = (s, text, extra = {}) => ({ ...s, ...extra, note: { id: Math.random(), text } });

export const isDemoTime = () => { const h = new Date().getHours(); return h < OPEN_HOUR || h >= CLOSE_HOUR; };
export const hourNow = () => { const d = new Date(), h = d.getHours() + d.getMinutes() / 60; return isDemoTime() ? 14.5 : h; };
export const fmtHour = (h) => `${h % 12 || 12} ${h < 12 || h === 24 ? "AM" : "PM"}`;

export function createInitial() {
  const base = curve(hourNow());
  const seats = {};
  ZONES.forEach((z) => z.seatIds.forEach((id) => { seats[id] = Math.random() < clamp(base * z.pop, 0.05, 0.95) ? "taken" : "free"; }));
  const hours = Array.from({ length: LAST_SLOT - OPEN_HOUR + 1 }, (_, i) => OPEN_HOUR + i);
  const rooms = Object.fromEntries(ROOMS.map((r) => [r.id, { booked: hours.filter(() => Math.random() < 0.35) }]));
  return { seats, rooms, my: { seat: null, until: 0, checkedIn: false, room: null }, rush: false, note: null };
}

export function tick(s) {
  const target = curve(hourNow()) + (s.rush ? 0.25 : 0);
  const seats = { ...s.seats }, mine = s.my.seat;
  ZONES.forEach((z) => {
    const tz = clamp(target * z.pop + (Math.random() - 0.5) * 0.06, 0.04, 0.98);
    const busy = z.seatIds.filter((id) => seats[id] !== "free").length / z.seatIds.length;
    if (Math.random() < 0.5) {
      const more = busy < tz;
      const pool = z.seatIds.filter((id) => id !== mine && (more ? seats[id] === "free" : seats[id] !== "free"));
      if (pool.length) seats[pool[Math.floor(Math.random() * pool.length)]] = more ? (Math.random() < 0.2 ? "held" : "taken") : "free";
    }
    z.seatIds.forEach((id) => { if (id !== mine && seats[id] === "held" && Math.random() < 0.08) seats[id] = Math.random() < 0.5 ? "taken" : "free"; });
  });
  let { my, note } = s;
  if (my.seat && !my.checkedIn && Date.now() > my.until) { seats[my.seat] = "free"; my = { ...my, seat: null, until: 0 }; note = { id: Math.random(), text: "Your seat hold expired and was released." }; }
  return { ...s, seats, my, note };
}

/* Actions */
export function hold(s, id) {
  if (s.seats[id] !== "free") return say(s, "That seat was just taken. Try another one.");
  const seats = { ...s.seats };
  if (s.my.seat) seats[s.my.seat] = "free";
  seats[id] = "held";
  return say(s, "Seat held for 15 minutes. Check in when you arrive.", { seats, my: { ...s.my, seat: id, until: Date.now() + 15 * 60e3, checkedIn: false } });
}
export const checkIn = (s) => (s.my.seat ? say(s, "Checked in. Happy studying!", { seats: { ...s.seats, [s.my.seat]: "taken" }, my: { ...s.my, checkedIn: true } }) : s);
export const leave = (s) => (s.my.seat ? say(s, "Seat released. Thanks for freeing it up!", { seats: { ...s.seats, [s.my.seat]: "free" }, my: { ...s.my, seat: null, until: 0, checkedIn: false } }) : s);
export function bookRoom(s, roomId, start, len) {
  if (s.my.room) return say(s, "You already have a room. Cancel it first.");
  const r = s.rooms[roomId], hours = Array.from({ length: len }, (_, i) => start + i);
  if (hours.some((h) => r.booked.includes(h) || h > LAST_SLOT)) return say(s, "Those hours are no longer all free.");
  return say(s, "Room booked!", { rooms: { ...s.rooms, [roomId]: { booked: [...r.booked, ...hours] } }, my: { ...s.my, room: { id: roomId, hours } } });
}
export function cancelRoom(s) {
  const m = s.my.room; if (!m) return s;
  return say(s, "Booking cancelled.", { rooms: { ...s.rooms, [m.id]: { booked: s.rooms[m.id].booked.filter((h) => !m.hours.includes(h)) } }, my: { ...s.my, room: null } });
}
export const toggleRush = (s) => say(s, s.rush ? "Back to normal traffic." : "Exam rush is on. Seats will fill up quickly.", { rush: !s.rush });

/* Read-only helpers */
export const zoneStats = (s, z) => ({ free: z.seatIds.filter((id) => s.seats[id] === "free").length, total: z.seatIds.length });
export function floorStats(s, floor) {
  return ZONES.filter((z) => z.floor === floor).reduce((a, z) => { const t = zoneStats(s, z); return { free: a.free + t.free, total: a.total + t.total }; }, { free: 0, total: 0 });
}
export function roomStatus(s, r) {
  const h = Math.floor(hourNow()), b = s.rooms[r.id].booked;
  let n = b.includes(h) ? h : h + 1;
  while (n <= LAST_SLOT && (b.includes(h) ? b.includes(n) : !b.includes(n))) n++;
  return { busy: b.includes(h), until: n > LAST_SLOT ? null : n };
}
export function nearestFree(s, id) {
  const a = SEAT[id];
  return a.zone.seatIds.filter((x) => s.seats[x] === "free").sort((x, y) => Math.hypot(SEAT[x].row - a.row, SEAT[x].col - a.col) - Math.hypot(SEAT[y].row - a.row, SEAT[y].col - a.col))[0] || null;
}

/* "Find me a spot" */
export function suggest(s, need, group = 4) {
  if (need === "group") {
    const list = ROOMS.filter((r) => r.cap >= group).map((r) => ({ room: r, st: roomStatus(s, r) }))
      .sort((a, b) => Number(a.st.busy) - Number(b.st.busy) || (a.st.busy ? (a.st.until ?? 99) - (b.st.until ?? 99) : a.room.cap - b.room.cap));
    return list[0] ? { kind: "room", ...list[0] } : null;
  }
  const ok = (id) => s.seats[id] === "free" && (need === "power" ? SEAT[id].outlet : need === "window" ? SEAT[id].window : true);
  const zs = ZONES.filter((z) => need !== "quiet" || z.type === "quiet" || z.type === "silent").map((z) => ({ z, ids: z.seatIds.filter(ok) })).filter((x) => x.ids.length).sort((a, b) => b.ids.length - a.ids.length);
  return zs[0] ? { kind: "seat", zone: zs[0].z, seatId: zs[0].ids[0], count: zs[0].ids.length } : null;
}

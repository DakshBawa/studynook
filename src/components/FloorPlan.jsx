import ZoneBlock from "./ZoneBlock.jsx";
import RoomBlock from "./RoomBlock.jsx";
import { FLOORS, ZONES, ROOMS } from "../data/library.js";
import { floorStats } from "../utils/sim.js";

const LEGEND = [["bg-seat", "Free"], ["bg-[#d8d2ea]", "Taken"], ["bg-[#ffd166]", "Held"], ["bg-me", "Yours"]];

export default function FloorPlan({ s, floor, filters, highlight, sel, onSeat, onRoom }) {
  const f = FLOORS.find((x) => x.id === floor), st = floorStats(s, floor);
  return (
    <section className="panel !p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div><h2 className="text-xl font-extrabold">{f.name}</h2><p className="text-sm text-plum/60">{st.free} of {st.total} seats free · tap a seat or a room</p></div>
        <ul className="flex gap-3 text-xs font-bold text-plum/70">{LEGEND.map(([c, l]) => <li key={l} className="flex items-center gap-1.5"><i className={`h-3 w-3 rounded ${c}`} />{l}</li>)}</ul>
      </div>
      <div className="overflow-x-auto rounded-[1.5rem]">
        <div className="plan relative min-w-[760px] rounded-[1.5rem] border border-plum/10" style={{ aspectRatio: "16 / 11" }}>
          {ZONES.filter((z) => z.floor === floor).map((z) => <ZoneBlock key={z.id} z={z} s={s} filters={filters} highlight={highlight} selected={sel?.type === "seat" ? sel.id : null} onSeat={onSeat} />)}
          {ROOMS.filter((r) => r.floor === floor).map((r) => <RoomBlock key={r.id} r={r} s={s} highlight={highlight} selected={sel?.type === "room" && sel.id === r.id} onSelect={onRoom} />)}
        </div>
      </div>
    </section>
  );
}

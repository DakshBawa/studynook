import { useState } from "react";
import { suggest, fmtHour } from "../utils/sim.js";

const NEEDS = [["quiet", "🤫 Quiet seat"], ["power", "🔌 Seat with power"], ["window", "🪟 Window seat"], ["group", "👥 Group room"]];

export default function Finder({ s, onGo }) {
  const [need, setNeed] = useState("quiet"), [n, setN] = useState(4);
  const r = suggest(s, need, n);
  return (
    <section className="panel">
      <h2 className="text-lg font-extrabold">Find me a spot</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {NEEDS.map(([k, l]) => <button key={k} onClick={() => setNeed(k)} aria-pressed={need === k} className={`rounded-full px-3 py-1.5 text-xs font-bold ${need === k ? "bg-plum text-white" : "bg-lilac"}`}>{l}</button>)}
      </div>
      {need === "group" && <label className="mt-3 block text-xs font-bold">How many people?<select className="mt-1 w-full rounded-xl bg-lilac px-3 py-2 text-sm" value={n} onChange={(e) => setN(+e.target.value)}>{[2, 3, 4, 5, 6, 8, 10].map((x) => <option key={x}>{x}</option>)}</select></label>}
      <div className="mt-4 rounded-2xl bg-lilac p-3.5">
        {!r ? <p className="text-sm font-semibold text-plum/70">Nothing matches right now. Try again in a few minutes.</p> : r.kind === "seat" ? (
          <>
            <p className="text-xs font-bold text-plum/60">Best match</p>
            <p className="font-extrabold">{r.zone.name}</p>
            <p className="text-sm text-plum/70">{r.count} matching seats free</p>
            <button className="btn mt-3 w-full" onClick={() => onGo({ type: "seat", id: r.seatId, floor: r.zone.floor, zone: r.zone.id })}>Show me</button>
          </>
        ) : (
          <>
            <p className="text-xs font-bold text-plum/60">Best match</p>
            <p className="font-extrabold">{r.room.name} · seats {r.room.cap}</p>
            <p className="text-sm text-plum/70">{r.st.busy ? `In use, free from ${r.st.until ? fmtHour(r.st.until) : "tomorrow"}` : "Free right now"}</p>
            <button className="btn mt-3 w-full" onClick={() => onGo({ type: "room", id: r.room.id, floor: r.room.floor, zone: r.room.id })}>Show me</button>
          </>
        )}
      </div>
    </section>
  );
}

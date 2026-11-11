import { SEAT } from "../data/library.js";
import { nearestFree } from "../utils/sim.js";

export default function SeatInfo({ id, s, hold, onPick }) {
  const m = SEAT[id], st = s.seats[id], mine = s.my.seat === id, alt = st !== "free" && !mine ? nearestFree(s, id) : null;
  const status = mine ? ["Yours", "bg-me text-white"] : st === "free" ? ["Free", "bg-emerald-100 text-emerald-700"] : st === "held" ? ["Held by someone", "bg-amber-100 text-amber-700"] : ["Taken", "bg-plum/10 text-plum/70"];
  return (
    <section className="panel">
      <div className="flex items-start justify-between"><div><p className="text-xs font-bold text-plum/50">{m.zone.name}</p><h2 className="font-mono text-2xl font-medium">{m.code}</h2></div><span className={`pill ${status[1]}`}>{status[0]}</span></div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {m.outlet && <span className="pill bg-lilac">🔌 Power</span>}{m.window && <span className="pill bg-lilac">🪟 Window</span>}<span className="pill bg-lilac capitalize">{m.zone.type} zone</span>
      </div>
      {st === "free" && <button className="btn mt-4 w-full" onClick={() => hold(id)}>Hold for 15 minutes</button>}
      {alt && <button className="btn-soft mt-4 w-full" onClick={() => onPick(alt)}>Show nearest free seat ({SEAT[alt].code})</button>}
      {mine && <p className="mt-3 text-sm text-plum/70">This is your seat. Manage it in “My bookings” below.</p>}
    </section>
  );
}

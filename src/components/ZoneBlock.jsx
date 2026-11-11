import { SEAT } from "../data/library.js";
import { zoneStats } from "../utils/sim.js";

const TYPE = { quiet: "Quiet", silent: "Silent", open: "Open", lab: "Computers" };

export default function ZoneBlock({ z, s, filters, highlight, selected, onSeat }) {
  const { free, total } = zoneStats(s, z);
  const mine = s.my.seat;
  const dimZone = filters.silent && z.type !== "silent";
  return (
    <section style={{ left: `${z.x}%`, top: `${z.y}%`, width: `${z.w}%`, height: `${z.h}%` }}
      className={`absolute flex flex-col rounded-3xl border-2 bg-white/80 p-2.5 transition-opacity ${highlight === z.id ? "zone-pulse border-me" : "border-plum/10"} ${dimZone ? "opacity-40" : ""}`}>
      <header className="mb-1.5 flex items-center justify-between gap-2 px-1">
        <h3 className="truncate text-xs font-extrabold">{z.name} <span className="ml-1 rounded-full bg-lilac px-1.5 py-0.5 text-[10px] font-bold text-plum/60">{TYPE[z.type]}</span></h3>
        <span className="shrink-0 font-mono text-[11px] font-medium"><b className={free === 0 ? "text-rose-500" : "text-emerald-600"}>{free}</b>/{total}</span>
      </header>
      <div className="grid min-h-0 flex-1 gap-1" style={{ gridTemplateColumns: `repeat(${z.cols}, 1fr)`, gridTemplateRows: `repeat(${z.rows}, 1fr)` }}>
        {z.seatIds.map((id) => {
          const st = s.seats[id], m = SEAT[id];
          const isMine = id === mine;
          const dim = (filters.power && !m.outlet) || (filters.window && !m.window);
          const color = isMine ? "bg-me" : st === "free" ? "bg-seat" : st === "held" ? "bg-[#ffd166]" : "bg-[#d8d2ea]";
          return (
            <button key={id} onClick={() => onSeat(id)} title={`${m.code} · ${isMine ? "yours" : st}${m.outlet ? " · power" : ""}${m.window ? " · window" : ""}`}
              aria-label={`Seat ${m.code}, ${isMine ? "yours" : st}`}
              className={`seat ${color} ${dim ? "opacity-20" : ""} ${selected === id ? "ring-2 ring-plum ring-offset-1" : ""} ${isMine ? "ring-2 ring-me/40 ring-offset-1" : ""}`} />
          );
        })}
      </div>
    </section>
  );
}

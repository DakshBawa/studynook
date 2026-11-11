import Donut from "./Donut.jsx";
import { FLOORS, ZONES } from "../data/library.js";
import { floorStats, fmtHour, hourNow, isDemoTime } from "../utils/sim.js";

const FILTERS = [["power", "🔌 Power outlet"], ["window", "🪟 Window seat"], ["silent", "🤫 Silent zones only"]];

export default function LeftRail({ s, floor, setFloor, filters, setFilters, rush }) {
  const all = FLOORS.map((f) => ({ f, ...floorStats(s, f.id) }));
  const total = all.reduce((a, x) => a + x.total, 0), free = all.reduce((a, x) => a + x.free, 0);
  const pct = Math.round(((total - free) / total) * 100);
  const quiet = [...all].sort((a, b) => b.free / b.total - a.free / a.total)[0];
  const h = Math.floor(hourNow());

  return (
    <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
      <div className="px-1">
        <h1 className="text-3xl font-extrabold tracking-tight">Nook<span className="text-peach">.</span></h1>
        <p className="text-sm text-plum/60">Find a seat before you walk over.</p>
      </div>
      <section className="panel">
        <div className="mb-3 flex items-center justify-between text-xs font-bold text-plum/60">
          <span className="flex items-center gap-1.5"><i className="live-dot h-2 w-2 rounded-full bg-emerald-500" />LIVE</span>
          <span>{isDemoTime() ? `Demo time · ${fmtHour(h)}` : `Now · ${fmtHour(h)}`}</span>
        </div>
        <Donut taken={total - free} total={total} />
        <p className="mt-3 text-center text-sm font-semibold">{free} seats free · {pct < 50 ? "Plenty of space" : pct < 80 ? "Getting busy" : "Very busy"}</p>
        <p className="mt-1 text-center text-xs text-plum/60">Quietest right now: <b>{quiet.f.short}</b></p>
      </section>

      <section className="panel !p-3">
        <p className="px-2 pb-2 pt-1 text-xs font-extrabold uppercase tracking-wide text-plum/50">Floors</p>
        {all.map(({ f, free: fr, total: t }) => (
          <button key={f.id} onClick={() => setFloor(f.id)} aria-pressed={floor === f.id} className={`mb-1 w-full rounded-2xl p-3 text-left ${floor === f.id ? "bg-plum text-white" : "hover:bg-lilac"}`}>
            <span className="flex justify-between text-sm font-bold"><span>{f.name}</span><span className="font-mono">{fr} free</span></span>
            <span className={`mt-2 block h-1.5 overflow-hidden rounded-full ${floor === f.id ? "bg-white/20" : "bg-plum/10"}`}><span className="block h-full rounded-full bg-seat transition-all duration-700" style={{ width: `${(fr / t) * 100}%` }} /></span>
          </button>
        ))}
      </section>

      <section className="panel !p-4">
        <p className="pb-2 text-xs font-extrabold uppercase tracking-wide text-plum/50">Highlight on map</p>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map(([k, l]) => (
            <button key={k} onClick={() => setFilters({ ...filters, [k]: !filters[k] })} aria-pressed={filters[k]} className={`rounded-full px-3 py-1.5 text-xs font-bold ${filters[k] ? "bg-me text-white" : "bg-lilac"}`}>{l}</button>
          ))}
        </div>
        <button onClick={rush} aria-pressed={s.rush} className={`mt-4 w-full rounded-2xl border-2 border-dashed px-3 py-2 text-xs font-bold ${s.rush ? "border-rose-400 bg-rose-50 text-rose-600" : "border-plum/20 text-plum/60"}`}>
          {s.rush ? "🔥 Exam rush on (tap to stop)" : "Demo: simulate an exam rush"}
        </button>
      </section>
    </aside>
  );
}

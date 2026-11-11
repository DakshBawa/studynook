import { fmtHour, roomStatus } from "../utils/sim.js";

export default function RoomBlock({ r, s, selected, highlight, onSelect }) {
  const st = roomStatus(s, r), mine = s.my.room?.id === r.id;
  return (
    <button onClick={() => onSelect(r.id)} style={{ left: `${r.x}%`, top: `${r.y}%`, width: `${r.w}%`, height: `${r.h}%` }}
      className={`absolute flex flex-col justify-between rounded-3xl border-2 p-3 text-left transition ${st.busy ? "border-rose-200 bg-rose-50" : "border-emerald-200 bg-emerald-50"} ${selected ? "ring-2 ring-plum" : ""} ${highlight === r.id ? "zone-pulse" : ""} hover:brightness-95`}>
      <span>
        <span className="flex items-center justify-between"><span className="text-sm font-extrabold">{r.name}</span><span className="font-mono text-[11px]">👥 {r.cap}</span></span>
        <span className="mt-1 block text-[11px] text-plum/60">{r.features.join(" · ")}</span>
      </span>
      <span>
        {mine && <span className="pill mb-1 bg-me text-white">Your booking</span>}
        <span className={`block text-xs font-extrabold ${st.busy ? "text-rose-600" : "text-emerald-700"}`}>{st.busy ? "In use" : "Free now"}</span>
        <span className="text-[11px] text-plum/60">{st.busy ? (st.until ? `Free from ${fmtHour(st.until)}` : "Busy till close") : st.until ? `Free until ${fmtHour(st.until)}` : "Free till close"}</span>
      </span>
    </button>
  );
}

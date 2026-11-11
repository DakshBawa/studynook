import { useState } from "react";
import { OPEN_HOUR, LAST_SLOT } from "../data/library.js";
import { fmtHour, hourNow, roomStatus } from "../utils/sim.js";

export default function RoomBooking({ room, s, book }) {
  const [start, setStart] = useState(null), [len, setLen] = useState(1);
  const now = Math.floor(hourNow()), b = s.rooms[room.id].booked, mine = s.my.room?.id === room.id ? s.my.room.hours : [];
  const hours = Array.from({ length: LAST_SLOT - OPEN_HOUR + 1 }, (_, i) => OPEN_HOUR + i);
  const range = start === null ? [] : Array.from({ length: len }, (_, i) => start + i);
  const conflict = range.some((h) => h > LAST_SLOT || b.includes(h));
  const st = roomStatus(s, room);

  return (
    <section className="panel">
      <div className="flex items-start justify-between"><div><p className="text-xs font-bold text-plum/50">Discussion room · seats {room.cap}</p><h2 className="text-2xl font-extrabold">{room.name}</h2></div><span className={`pill ${st.busy ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-700"}`}>{st.busy ? "In use" : "Free now"}</span></div>
      <p className="mt-1 text-xs text-plum/60">{room.features.join(" · ")}</p>
      <p className="mb-2 mt-4 text-xs font-extrabold uppercase tracking-wide text-plum/50">Today</p>
      <div className="grid grid-cols-4 gap-1.5">
        {hours.map((h) => {
          const past = h < now, taken = b.includes(h) && !mine.includes(h), isMine = mine.includes(h), picked = range.includes(h);
          return (
            <button key={h} disabled={past || taken || isMine} onClick={() => setStart(h)} aria-pressed={picked}
              className={`rounded-xl py-2 text-[11px] font-bold ${picked ? (conflict ? "bg-rose-400 text-white" : "bg-me text-white") : isMine ? "bg-me/20 text-me" : taken ? "bg-plum/10 text-plum/30 line-through" : past ? "bg-lilac text-plum/30" : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"}`}>{fmtHour(h)}</button>
          );
        })}
      </div>
      <div className="mt-4 flex items-center gap-2">
        <div className="flex rounded-xl bg-lilac p-1">{[1, 2].map((l) => <button key={l} onClick={() => setLen(l)} aria-pressed={len === l} className={`rounded-lg px-3 py-1.5 text-xs font-bold ${len === l ? "bg-white shadow" : ""}`}>{l} hr</button>)}</div>
        <button className="btn flex-1" disabled={start === null || conflict} onClick={() => { book(room.id, start, len); setStart(null); }}>{start === null ? "Pick a start time" : conflict ? "Not available" : `Book ${fmtHour(start)} to ${fmtHour(start + len)}`}</button>
      </div>
    </section>
  );
}

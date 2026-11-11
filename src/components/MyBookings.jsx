import { SEAT, roomById } from "../data/library.js";
import { fmtHour } from "../utils/sim.js";

export default function MyBookings({ s, checkIn, leave, cancelRoom }) {
  const { seat, until, checkedIn, room } = s.my;
  const left = Math.max(0, Math.round((until - Date.now()) / 1000));
  return (
    <section className="panel">
      <h2 className="text-lg font-extrabold">My bookings</h2>
      {!seat && !room && <p className="mt-2 text-sm text-plum/60">Nothing yet. Hold a seat or book a room from the map.</p>}
      {seat && (
        <div className="mt-3 rounded-2xl bg-me/10 p-3.5">
          <p className="text-xs font-bold text-me">{checkedIn ? "Checked in" : "Seat on hold"}</p>
          <p className="font-extrabold">{SEAT[seat].zone.name} · <span className="font-mono">{SEAT[seat].code}</span></p>
          {!checkedIn && <p className="text-sm text-plum/70">Arrive within <b className="font-mono">{String(Math.floor(left / 60)).padStart(2, "0")}:{String(left % 60).padStart(2, "0")}</b> or it's released.</p>}
          <div className="mt-3 flex gap-2">{!checkedIn && <button className="btn flex-1" onClick={checkIn}>I'm here</button>}<button className="btn-soft flex-1 !bg-white" onClick={leave}>{checkedIn ? "Leave seat" : "Release"}</button></div>
        </div>
      )}
      {room && (
        <div className="mt-3 rounded-2xl bg-me/10 p-3.5">
          <p className="text-xs font-bold text-me">Room booked</p>
          <p className="font-extrabold">{roomById(room.id).name}</p>
          <p className="text-sm text-plum/70">{fmtHour(room.hours[0])} to {fmtHour(room.hours[room.hours.length - 1] + 1)}</p>
          <button className="btn-soft mt-3 w-full !bg-white" onClick={cancelRoom}>Cancel booking</button>
        </div>
      )}
    </section>
  );
}

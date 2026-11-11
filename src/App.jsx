import { useEffect, useRef, useState } from "react";
import useLibrary from "./hooks/useLibrary.js";
import LeftRail from "./components/LeftRail.jsx";
import FloorPlan from "./components/FloorPlan.jsx";
import Finder from "./components/Finder.jsx";
import SeatInfo from "./components/SeatInfo.jsx";
import RoomBooking from "./components/RoomBooking.jsx";
import MyBookings from "./components/MyBookings.jsx";
import { SEAT, roomById } from "./data/library.js";

export default function App() {
  const { s, hold, checkIn, leave, book, cancelRoom, rush } = useLibrary();
  const [floor, setFloor] = useState("g");
  const [sel, setSel] = useState(null);
  const [filters, setFilters] = useState({ power: false, window: false, silent: false });
  const [highlight, setHighlight] = useState(null);
  const [toast, setToast] = useState("");
  const timer = useRef();

  useEffect(() => {
    if (!s.note) return;
    setToast(s.note.text);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 3200);
  }, [s.note]);

  const pickSeat = (id) => { setSel({ type: "seat", id }); setFloor(SEAT[id].zone.floor); };
  const pickRoom = (id) => { setSel({ type: "room", id }); setFloor(roomById(id).floor); };
  const go = ({ type, id, floor: f, zone }) => {
    setFloor(f); setSel({ type, id }); setHighlight(zone);
    setTimeout(() => setHighlight(null), 4000);
  };

  return (
    <div className="mx-auto max-w-[1500px] p-4 md:p-6">
      <div className="grid gap-6 lg:grid-cols-[260px_1fr_340px]">
        <LeftRail s={s} floor={floor} setFloor={(f) => { setFloor(f); setSel(null); }} filters={filters} setFilters={setFilters} rush={rush} />
        <main className="min-w-0"><FloorPlan s={s} floor={floor} filters={filters} highlight={highlight} sel={sel} onSeat={pickSeat} onRoom={pickRoom} /></main>
        <aside className="space-y-4 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:self-start lg:overflow-y-auto">
          <Finder s={s} onGo={go} />
          {sel?.type === "seat" && <SeatInfo key={sel.id} id={sel.id} s={s} hold={hold} onPick={pickSeat} />}
          {sel?.type === "room" && <RoomBooking key={sel.id} room={roomById(sel.id)} s={s} book={book} />}
          <MyBookings s={s} checkIn={checkIn} leave={leave} cancelRoom={cancelRoom} />
        </aside>
      </div>
      {toast && <div role="status" className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-plum px-5 py-3 text-sm font-bold text-white shadow-2xl">{toast}</div>}
    </div>
  );
}

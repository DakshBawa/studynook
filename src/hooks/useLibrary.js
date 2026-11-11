import { useEffect, useState } from "react";
import * as sim from "../utils/sim.js";

export default function useLibrary() {
  const [s, setS] = useState(sim.createInitial);
  useEffect(() => { const id = setInterval(() => setS(sim.tick), 1000); return () => clearInterval(id); }, []);
  const act = (fn) => (...a) => setS((x) => fn(x, ...a));
  return { s, hold: act(sim.hold), checkIn: act(sim.checkIn), leave: act(sim.leave), book: act(sim.bookRoom), cancelRoom: act(sim.cancelRoom), rush: act(sim.toggleRush) };
}

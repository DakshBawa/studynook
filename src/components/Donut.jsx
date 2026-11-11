export default function Donut({ taken, total }) {
  const pct = Math.round((taken / total) * 100), C = 2 * Math.PI * 42;
  const color = pct < 50 ? "#4cc9a0" : pct < 80 ? "#ffb347" : "#ff6b81";
  return (
    <div className="relative mx-auto h-36 w-36" role="img" aria-label={`Library is ${pct}% full`}>
      <svg viewBox="0 0 100 100" className="-rotate-90">
        <circle cx="50" cy="50" r="42" fill="none" stroke="#2b264014" strokeWidth="11" />
        <circle cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="11" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - pct / 100)} style={{ transition: "stroke-dashoffset .8s ease, stroke .8s" }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center"><div><p className="font-mono text-3xl font-medium leading-none">{pct}%</p><p className="mt-1 text-[11px] font-bold text-plum/60">full right now</p></div></div>
    </div>
  );
}

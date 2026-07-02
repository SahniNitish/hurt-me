import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export function ProgressRing({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const r = 36;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;

  return (
    <div className="relative flex h-24 w-24 items-center justify-center">
      <svg className="-rotate-90" width="96" height="96" aria-hidden>
        <circle cx="48" cy="48" r={r} fill="none" stroke="#1f1f1f" strokeWidth="8" />
        <circle
          cx="48"
          cy="48"
          r={r}
          fill="none"
          stroke="#e11d2e"
          strokeWidth="8"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute text-center">
        <p className="font-display text-xl font-bold">{pct}%</p>
        <p className="text-[10px] text-ash">
          {done}/{total} today
        </p>
      </div>
    </div>
  );
}

export function Collapsible({ title, count, children, defaultOpen = false }: {
  title: string;
  count: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="card">
      <button
        type="button"
        className="flex w-full min-h-12 items-center justify-between text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="font-display text-lg font-semibold uppercase tracking-wide">
          {title} <span className="text-ash">({count})</span>
        </span>
        {open ? <ChevronUp className="h-5 w-5 text-ash" /> : <ChevronDown className="h-5 w-5 text-ash" />}
      </button>
      {open ? <div className="mt-3 space-y-2 border-t border-steel pt-3">{children}</div> : null}
    </section>
  );
}

const priorityClass: Record<string, string> = {
  low: "border-l-4 border-l-ash",
  med: "border-l-4 border-l-ember",
  high: "border-l-4 border-l-blood",
};

export function priorityBadge(p: string) {
  const colors: Record<string, string> = {
    low: "bg-steel text-ash",
    med: "bg-ember/20 text-ember",
    high: "bg-blood/20 text-blood",
  };
  return (
    <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${colors[p] ?? colors.low}`}>
      {p}
    </span>
  );
}

export { priorityClass };
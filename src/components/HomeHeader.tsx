import { Flame } from "lucide-react";
import { useEffect, useState } from "react";
import { touchStreak } from "../db";

export function HomeHeader({ subtitle }: { subtitle?: string }) {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    void touchStreak().then(setStreak);
  }, []);

  return (
    <header className="border-b border-steel bg-void/95 px-4 pb-4 pt-[max(1rem,env(safe-area-inset-top))]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-blood">
            Hurt Me Season
          </p>
          <h1 className="font-display text-3xl font-bold uppercase leading-none tracking-tight text-white">
            No Excuses
          </h1>
          {subtitle ? <p className="mt-1 text-sm text-ash">{subtitle}</p> : null}
        </div>
        <div className="flex min-w-[4.5rem] flex-col items-center rounded-xl border border-blood/40 bg-blood/10 px-3 py-2">
          <Flame className="h-5 w-5 text-ember" aria-hidden />
          <span className="font-display text-2xl font-bold leading-none text-white">{streak}</span>
          <span className="text-[10px] uppercase tracking-wider text-ash">day streak</span>
        </div>
      </div>
    </header>
  );
}
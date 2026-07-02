import { Link } from "react-router-dom";
import { Dumbbell, ListTodo, Wallet } from "lucide-react";
import { HomeHeader } from "../components/HomeHeader";

const links = [
  { to: "/todo", label: "To-Do", desc: "Daily tasks & progress", icon: ListTodo, color: "text-blood" },
  { to: "/workouts", label: "Train", desc: "Programs & session checkoffs", icon: Dumbbell, color: "text-ember" },
  { to: "/budget", label: "Money", desc: "Income, spend, budget cap", icon: Wallet, color: "text-white" },
];

export function HomePage() {
  return (
    <div className="pb-28">
      <HomeHeader subtitle="Discipline dashboard. Phone-first. No excuses." />
      <div className="mx-auto max-w-lg space-y-4 px-4 py-6">
        <p className="text-sm leading-relaxed text-ash">
          Everything stays on this device in IndexedDB. Install as a PWA for offline access. YouTube loads only when you
          open a demo.
        </p>
        <div className="space-y-3">
          {links.map(({ to, label, desc, icon: Icon, color }) => (
            <Link
              key={to}
              to={to}
              className="card flex min-h-[4.5rem] items-center gap-4 active:scale-[0.99]"
            >
              <div className={`rounded-xl bg-steel p-3 ${color}`}>
                <Icon className="h-7 w-7" strokeWidth={2.25} />
              </div>
              <div>
                <p className="font-display text-xl font-semibold uppercase">{label}</p>
                <p className="text-sm text-ash">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
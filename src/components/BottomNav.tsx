import { NavLink } from "react-router-dom";
import { Dumbbell, Home, ListTodo, Wallet } from "lucide-react";

const tabs = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/todo", label: "To-Do", icon: ListTodo },
  { to: "/workouts", label: "Train", icon: Dumbbell },
  { to: "/budget", label: "Money", icon: Wallet },
];

export function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-steel bg-coal/95 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur"
      aria-label="Main"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-2">
        {tabs.map(({ to, label, icon: Icon, end }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex min-h-[3.25rem] flex-col items-center justify-center gap-0.5 rounded-lg px-2 text-xs font-medium transition-colors ${
                  isActive ? "text-blood" : "text-ash"
                }`
              }
            >
              <Icon className="h-6 w-6" strokeWidth={2.25} aria-hidden />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
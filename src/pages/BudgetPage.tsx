import { Pencil, Plus, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { deleteBudgetEntry, getSettings, listBudgetEntries, saveBudgetEntry, saveSettings } from "../db";
import type { BudgetCategory, BudgetEntry } from "../types";
import { BUDGET_CATEGORIES, monthKey, uid } from "../types";
import { confirmDelete, useAsync } from "../utils";
import { HomeHeader } from "../components/HomeHeader";

export function BudgetPage() {
  const { data: entries, reload } = useAsync(listBudgetEntries, []);
  const { data: settings, reload: reloadSettings } = useAsync(getSettings, []);
  const [viewMonth, setViewMonth] = useState(monthKey());
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<BudgetCategory>("Food");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");
  const [editing, setEditing] = useState<BudgetEntry | null>(null);
  const [capInput, setCapInput] = useState("");

  const monthEntries = useMemo(
    () => (entries ?? []).filter((e) => e.date.startsWith(viewMonth)),
    [entries, viewMonth],
  );

  const { income, expenses, balance, byCategory } = useMemo(() => {
    let income = 0;
    let expenses = 0;
    const byCategory: Record<string, number> = {};
    for (const e of monthEntries) {
      if (e.type === "income") income += e.amount;
      else {
        expenses += e.amount;
        byCategory[e.category] = (byCategory[e.category] ?? 0) + e.amount;
      }
    }
    return { income, expenses, balance: income - expenses, byCategory };
  }, [monthEntries]);

  const cap = settings?.monthlyBudgetCap ?? 2000;
  const spendPct = cap > 0 ? Math.min(100, Math.round((expenses / cap) * 100)) : 0;
  const capStatus =
    expenses > cap ? "over" : expenses >= cap * 0.85 ? "warn" : "ok";

  async function submit() {
    const n = parseFloat(amount);
    if (!Number.isFinite(n) || n <= 0) return;
    const entry: BudgetEntry = editing
      ? { ...editing, amount: n, category, type, date, note: note.trim() || undefined }
      : {
          id: uid(),
          amount: n,
          category,
          type,
          date,
          note: note.trim() || undefined,
        };
    await saveBudgetEntry(entry);
    setAmount("");
    setNote("");
    setEditing(null);
    await reload();
  }

  async function remove(e: BudgetEntry) {
    if (!confirmDelete(`$${e.amount} ${e.category}`)) return;
    await deleteBudgetEntry(e.id);
    await reload();
  }

  async function saveCap() {
    const n = parseFloat(capInput);
    if (!Number.isFinite(n) || n < 0) return;
    await saveSettings({ monthlyBudgetCap: n });
    setCapInput("");
    await reloadSettings();
  }

  const maxCat = Math.max(1, ...Object.values(byCategory).map((v) => Number(v)));

  return (
    <div className="pb-28">
      <HomeHeader subtitle="Know the numbers. No surprises." />
      <div className="mx-auto max-w-lg space-y-4 px-4 py-4">
        <div className="flex gap-2">
          <input
            type="month"
            className="input-field flex-1"
            value={viewMonth}
            onChange={(e) => setViewMonth(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="card">
            <p className="text-xs uppercase text-ash">Balance (month)</p>
            <p className={`font-display text-2xl font-bold ${balance >= 0 ? "text-white" : "text-blood"}`}>
              ${balance.toFixed(2)}
            </p>
          </div>
          <div className="card">
            <p className="text-xs uppercase text-ash">Spent</p>
            <p
              className={`font-display text-2xl font-bold ${
                capStatus === "over" ? "text-blood" : capStatus === "warn" ? "text-ember" : "text-white"
              }`}
            >
              ${expenses.toFixed(2)}
            </p>
            <p className="text-xs text-ash">of ${cap} cap</p>
          </div>
          <div className="card col-span-2 sm:col-span-1">
            <p className="text-xs uppercase text-ash">Income</p>
            <p className="font-display text-2xl font-bold text-ember">${income.toFixed(2)}</p>
          </div>
        </div>

        <div className="card">
          <div className="mb-2 flex justify-between text-xs text-ash">
            <span>Monthly budget</span>
            <span>{spendPct}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-steel">
            <div
              className={`h-full transition-all ${
                capStatus === "over" ? "bg-blood" : capStatus === "warn" ? "bg-ember" : "bg-blood/80"
              }`}
              style={{ width: `${Math.min(100, spendPct)}%` }}
            />
          </div>
          <div className="mt-3 flex gap-2">
            <input
              className="input-field flex-1"
              placeholder={`Cap (now $${cap})`}
              inputMode="decimal"
              value={capInput}
              onChange={(e) => setCapInput(e.target.value)}
            />
            <button type="button" className="btn-ghost px-4" onClick={() => void saveCap()}>
              Set
            </button>
          </div>
        </div>

        <div className="card">
          <p className="mb-3 font-display text-sm font-semibold uppercase tracking-wider">By category</p>
          <div className="space-y-2">
            {BUDGET_CATEGORIES.map((cat) => {
              const v = byCategory[cat] ?? 0;
              if (v === 0 && expenses > 0) return null;
              const w = Math.round((v / maxCat) * 100);
              return (
                <div key={cat}>
                  <div className="flex justify-between text-xs">
                    <span>{cat}</span>
                    <span>${v.toFixed(0)}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-steel">
                    <div className="h-2 rounded-full bg-blood/70" style={{ width: `${w}%` }} />
                  </div>
                </div>
              );
            })}
            {expenses === 0 ? <p className="text-sm text-ash">No expenses this month.</p> : null}
          </div>
        </div>

        <div className="card space-y-3">
          <h2 className="font-display text-lg font-semibold uppercase">{editing ? "Edit entry" : "Add entry"}</h2>
          <div className="flex gap-2">
            <button
              type="button"
              className={`flex-1 min-h-12 rounded-lg border ${type === "expense" ? "border-blood bg-blood/20" : "border-steel"}`}
              onClick={() => setType("expense")}
            >
              <TrendingDown className="mx-auto h-5 w-5" /> Expense
            </button>
            <button
              type="button"
              className={`flex-1 min-h-12 rounded-lg border ${type === "income" ? "border-ember bg-ember/20" : "border-steel"}`}
              onClick={() => setType("income")}
            >
              <TrendingUp className="mx-auto h-5 w-5" /> Income
            </button>
          </div>
          <input className="input-field" inputMode="decimal" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value as BudgetCategory)}>
            {BUDGET_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input type="date" className="input-field" value={date} onChange={(e) => setDate(e.target.value)} />
          <input className="input-field" placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
          <button type="button" className="btn-primary w-full" onClick={() => void submit()}>
            <Plus className="mr-1 inline h-4 w-4" />
            {editing ? "Save" : "Add"}
          </button>
        </div>

        <ul className="space-y-2">
          {monthEntries.map((e) => (
            <li key={e.id} className="card flex items-center gap-3">
              <div className="flex-1">
                <p className="font-medium">
                  {e.type === "income" ? "+" : "−"}${e.amount.toFixed(2)}{" "}
                  <span className="text-ash">· {e.category}</span>
                </p>
                <p className="text-xs text-ash">
                  {e.date}
                  {e.note ? ` — ${e.note}` : ""}
                </p>
              </div>
              <button
                type="button"
                className="p-2 text-ash"
                onClick={() => {
                  setEditing(e);
                  setAmount(String(e.amount));
                  setCategory(e.category);
                  setType(e.type);
                  setDate(e.date);
                  setNote(e.note ?? "");
                }}
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button type="button" className="p-2 text-blood" onClick={() => void remove(e)}>
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
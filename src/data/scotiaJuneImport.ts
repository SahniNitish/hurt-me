import type { BudgetCategory, BudgetEntry } from "../types";
import raw from "./scotia-june-2026.json";

export const SCOTIA_JUNE_IMPORT_TAG = "scotia-june-2026";

type RawRow = {
  date: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  note: string;
};

export function buildScotiaJuneEntries(): BudgetEntry[] {
  return (raw as RawRow[]).map((row, i) => ({
    id: `${SCOTIA_JUNE_IMPORT_TAG}-${row.date}-${i}`,
    amount: row.amount,
    category: row.category as BudgetCategory,
    type: row.type,
    date: row.date,
    note: row.note,
  }));
}
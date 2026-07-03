import type { BudgetCategory, BudgetEntry } from "../types";
import rawJune from "./scotia-june-2026.json";
import rawMay from "./scotia-may-2026.json";
import rawMobile from "./mobile-screens-jun2026.json";

export const SCOTIA_JUNE_IMPORT_TAG = "scotia-june-2026";
export const SCOTIA_MAY_IMPORT_TAG = "scotia-may-2026";

type RawRow = {
  date: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  note: string;
};

type MayRow = RawRow & { id: string };

export function buildScotiaJuneEntries(): BudgetEntry[] {
  return (rawJune as RawRow[]).map((row, i) => ({
    id: `${SCOTIA_JUNE_IMPORT_TAG}-${row.date}-${i}`,
    amount: row.amount,
    category: row.category as BudgetCategory,
    type: row.type,
    date: row.date,
    note: row.note,
  }));
}

export function buildScotiaMayEntries(): BudgetEntry[] {
  return (rawMay as MayRow[]).map((row) => ({
    id: row.id,
    amount: row.amount,
    category: row.category as BudgetCategory,
    type: row.type,
    date: row.date,
    note: row.note,
  }));
}

export const MOBILE_SCREEN_IMPORT_TAG = "mobile-stmt-2026";

export function buildMobileScreenEntries(): BudgetEntry[] {
  return (rawMobile as MayRow[]).map((row) => ({
    id: row.id,
    amount: row.amount,
    category: row.category as BudgetCategory,
    type: row.type,
    date: row.date,
    note: row.note,
  }));
}
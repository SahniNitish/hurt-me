export type Priority = "low" | "med" | "high";

export interface Task {
  id: string;
  title: string;
  dueDate?: string;
  priority: Priority;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface Exercise {
  id: string;
  name: string;
  setsReps: string;
  youtubeUrl?: string;
  altName?: string;
  altYoutubeUrl?: string;
}

export interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
  createdAt: string;
}

export interface SessionCheck {
  id: string;
  workoutId: string;
  exerciseId: string;
  checked: boolean;
}

export interface BudgetEntry {
  id: string;
  amount: number;
  category: BudgetCategory;
  type: "income" | "expense";
  date: string;
  note?: string;
}

export type BudgetCategory =
  | "Food"
  | "Rent"
  | "Gym"
  | "Transport"
  | "Subscriptions"
  | "Fun"
  | "Other";

export const BUDGET_CATEGORIES: BudgetCategory[] = [
  "Food",
  "Rent",
  "Gym",
  "Transport",
  "Subscriptions",
  "Fun",
  "Other",
];

export interface AppSettings {
  id: "settings";
  monthlyBudgetCap: number;
  streakDays: number;
  lastActiveDate: string;
  scotiaJune2026Imported?: boolean;
}

export function uid(): string {
  return crypto.randomUUID();
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function monthKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
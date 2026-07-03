import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { AppSettings, BudgetEntry, SessionCheck, Task, Workout } from "./types";
import { todayISO, uid } from "./types";
import {
  deleteBudgetEntryFromCloud,
  deleteTaskFromCloud,
  deleteWorkoutFromCloud,
  deleteSessionChecksForWorkoutFromCloud,
  pushBudgetEntryToCloud,
  pushSessionCheckToCloud,
  pushSettingsToCloud,
  pushTaskToCloud,
  pushWorkoutToCloud,
} from "./cloudSync";
import { buildScotiaJuneEntries, buildScotiaMayEntries, buildMobileScreenEntries, SCOTIA_JUNE_IMPORT_TAG, SCOTIA_MAY_IMPORT_TAG, MOBILE_SCREEN_IMPORT_TAG } from "./data/scotiaJuneImport";
import { build30DayPlanWorkouts, PLAN_30_ID } from "./data/plan30Days";

interface HurtMeDB extends DBSchema {
  tasks: { key: string; value: Task };
  workouts: { key: string; value: Workout };
  sessionChecks: { key: string; value: SessionCheck };
  budgetEntries: { key: string; value: BudgetEntry };
  settings: { key: string; value: AppSettings };
}

const DB_NAME = "hurt-me-db";
const DB_VERSION = 2;

function sessionCheckId(workoutId: string, exerciseId: string) {
  return `${workoutId}:${exerciseId}`;
}

let dbPromise: Promise<IDBPDatabase<HurtMeDB>> | null = null;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<HurtMeDB>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (!db.objectStoreNames.contains("tasks")) db.createObjectStore("tasks", { keyPath: "id" });
        if (!db.objectStoreNames.contains("workouts")) db.createObjectStore("workouts", { keyPath: "id" });
        if (oldVersion < 2 && db.objectStoreNames.contains("sessionChecks")) {
          db.deleteObjectStore("sessionChecks");
        }
        if (!db.objectStoreNames.contains("sessionChecks")) {
          db.createObjectStore("sessionChecks", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("budgetEntries")) {
          db.createObjectStore("budgetEntries", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("settings")) db.createObjectStore("settings", { keyPath: "id" });
      },
    }).then(async (db) => {
      return db;
    });
  }
  return dbPromise;
}

export async function ensureSeeded() {
  const db = await getDB();
  await seedIfNeeded(db);
  await importScotiaJune2026IfNeeded();
  await importScotiaMay2026IfNeeded();
  await importMobileScreens2026IfNeeded();
  await importPlan30DaysIfNeeded();
}

async function seedIfNeeded(db: IDBPDatabase<HurtMeDB>) {
  const count = await db.count("workouts");
  if (count > 0) return;

  const pushDay: Workout = {
    id: uid(),
    name: "Push Day",
    createdAt: new Date().toISOString(),
    exercises: [
      {
        id: uid(),
        name: "Bench Press",
        setsReps: "4 x 8-10",
        youtubeUrl: "https://www.youtube.com/watch?v=rT7DgCr-1pg",
        altName: "Dumbbell Bench Press",
        altYoutubeUrl: "https://www.youtube.com/watch?v=VmBVGCoG3gE",
      },
      {
        id: uid(),
        name: "Overhead Press",
        setsReps: "3 x 10-12",
        youtubeUrl: "https://www.youtube.com/watch?v=2yjwXTZQDDg",
        altName: "Arnold Press",
        altYoutubeUrl: "https://www.youtube.com/watch?v=6Z15_WdXmRk",
      },
      {
        id: uid(),
        name: "Tricep Pushdown",
        setsReps: "3 x 12-15",
        youtubeUrl: "https://www.youtube.com/watch?v=2-LAMcpzODU",
      },
    ],
  };
  await db.put("workouts", pushDay);

  const settings: AppSettings = {
    id: "settings",
    monthlyBudgetCap: 2000,
    streakDays: 1,
    lastActiveDate: todayISO(),
  };
  await db.put("settings", settings);
}

export async function touchStreak(): Promise<number> {
  const db = await getDB();
  const s = (await db.get("settings", "settings"))!;
  const today = todayISO();
  if (s.lastActiveDate === today) return s.streakDays;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const y = yesterday.toISOString().slice(0, 10);
  const next = s.lastActiveDate === y ? s.streakDays + 1 : 1;
  const updated = { ...s, streakDays: next, lastActiveDate: today };
  await db.put("settings", updated);
  void pushSettingsToCloud(updated);
  return next;
}

export async function getSettings(): Promise<AppSettings> {
  const db = await getDB();
  return (await db.get("settings", "settings"))!;
}

export async function saveSettings(partial: Partial<AppSettings>): Promise<AppSettings> {
  const db = await getDB();
  const cur = await getSettings();
  const next = { ...cur, ...partial };
  await db.put("settings", next);
  void pushSettingsToCloud(next);
  return next;
}

// Tasks
export async function listTasks(): Promise<Task[]> {
  const db = await getDB();
  return (await db.getAll("tasks")).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function saveTask(task: Task) {
  const db = await getDB();
  await db.put("tasks", task);
  void pushTaskToCloud(task);
}

export async function deleteTask(id: string) {
  const db = await getDB();
  await db.delete("tasks", id);
  void deleteTaskFromCloud(id);
}

// Workouts
export async function listWorkouts(): Promise<Workout[]> {
  const db = await getDB();
  return (await db.getAll("workouts")).sort((a, b) => a.name.localeCompare(b.name));
}

export async function saveWorkout(w: Workout) {
  const db = await getDB();
  await db.put("workouts", w);
  void pushWorkoutToCloud(w);
}

export async function deleteWorkout(id: string) {
  const db = await getDB();
  await db.delete("workouts", id);
  void deleteWorkoutFromCloud(id);
  const all = await db.getAll("sessionChecks");
  for (const c of all) {
    if (c.workoutId === id) await db.delete("sessionChecks", c.id);
  }
  void deleteSessionChecksForWorkoutFromCloud(id);
}

export async function getSessionChecks(workoutId: string): Promise<Record<string, boolean>> {
  const db = await getDB();
  const all = await db.getAll("sessionChecks");
  const map: Record<string, boolean> = {};
  for (const c of all) {
    if (c.workoutId === workoutId) map[c.exerciseId] = c.checked;
  }
  return map;
}

export async function setExerciseChecked(workoutId: string, exerciseId: string, checked: boolean) {
  const db = await getDB();
  const row = {
    id: sessionCheckId(workoutId, exerciseId),
    workoutId,
    exerciseId,
    checked,
  };
  await db.put("sessionChecks", row);
  void pushSessionCheckToCloud(row);
}

export async function resetWorkoutSession(workoutId: string) {
  const db = await getDB();
  const all = await db.getAll("sessionChecks");
  for (const c of all) {
    if (c.workoutId === workoutId) await db.delete("sessionChecks", c.id);
  }
  void deleteSessionChecksForWorkoutFromCloud(workoutId);
}

// Budget
export async function listBudgetEntries(): Promise<BudgetEntry[]> {
  const db = await getDB();
  return (await db.getAll("budgetEntries")).sort((a, b) => b.date.localeCompare(a.date));
}

export async function saveBudgetEntry(e: BudgetEntry) {
  const db = await getDB();
  await db.put("budgetEntries", e);
  void pushBudgetEntryToCloud(e);
}

export async function deleteBudgetEntry(id: string) {
  const db = await getDB();
  await db.delete("budgetEntries", id);
  void deleteBudgetEntryFromCloud(id);
}

/** Scotia statement May 18–Jun 17, 2026 — June rows only */
export async function importScotiaJune2026(): Promise<{ added: number; skipped: boolean }> {
  const settings = await getSettings();
  if (settings.scotiaJune2026Imported) return { added: 0, skipped: true };

  const existing = await listBudgetEntries();
  const have = new Set(existing.map((e) => e.id));
  const rows = buildScotiaJuneEntries();
  let added = 0;
  for (const row of rows) {
    if (have.has(row.id)) continue;
    await saveBudgetEntry(row);
    added++;
  }
  await saveSettings({ scotiaJune2026Imported: true });
  return { added, skipped: false };
}

async function importScotiaJune2026IfNeeded() {
  const settings = await getSettings();
  if (settings.scotiaJune2026Imported) return;
  const any = (await listBudgetEntries()).some((e) => e.id.startsWith(SCOTIA_JUNE_IMPORT_TAG));
  if (any) {
    await saveSettings({ scotiaJune2026Imported: true });
    return;
  }
  await importScotiaJune2026();
}

export async function importScotiaMay2026(): Promise<{ added: number; skipped: boolean }> {
  const settings = await getSettings();
  if (settings.scotiaMay2026Imported) return { added: 0, skipped: true };

  const existing = await listBudgetEntries();
  const have = new Set(existing.map((e) => e.id));
  const rows = buildScotiaMayEntries();
  let added = 0;
  for (const row of rows) {
    if (have.has(row.id)) continue;
    await saveBudgetEntry(row);
    added++;
  }
  await saveSettings({ scotiaMay2026Imported: true });
  return { added, skipped: false };
}

async function importScotiaMay2026IfNeeded() {
  const settings = await getSettings();
  if (settings.scotiaMay2026Imported) return;
  const any = (await listBudgetEntries()).some((e) => e.id.startsWith(SCOTIA_MAY_IMPORT_TAG));
  if (any) {
    await saveSettings({ scotiaMay2026Imported: true });
    return;
  }
  await importScotiaMay2026();
}

export async function importMobileScreens2026(): Promise<{ added: number; skipped: boolean }> {
  const settings = await getSettings();
  if (settings.mobileScreensJun2026Imported) return { added: 0, skipped: true };

  const existing = await listBudgetEntries();
  const have = new Set(existing.map((e) => e.id));
  const rows = buildMobileScreenEntries();
  let added = 0;
  for (const row of rows) {
    if (have.has(row.id)) continue;
    await saveBudgetEntry(row);
    added++;
  }
  await saveSettings({ mobileScreensJun2026Imported: true });
  return { added, skipped: false };
}

async function importMobileScreens2026IfNeeded() {
  const settings = await getSettings();
  if (settings.mobileScreensJun2026Imported) return;
  const any = (await listBudgetEntries()).some((e) => e.id.startsWith(MOBILE_SCREEN_IMPORT_TAG));
  if (any) {
    await saveSettings({ mobileScreensJun2026Imported: true });
    return;
  }
  await importMobileScreens2026();
}

export async function importPlan30Days(): Promise<{ added: number; skipped: boolean }> {
  const settings = await getSettings();
  if (settings.plan30DaysImported) return { added: 0, skipped: true };

  const existing = await listWorkouts();
  const have = new Set(existing.map((w) => w.id));
  const plan = build30DayPlanWorkouts();
  let added = 0;
  for (const w of plan) {
    if (have.has(w.id)) continue;
    await saveWorkout(w);
    added++;
  }
  await saveSettings({ plan30DaysImported: true });
  return { added, skipped: false };
}

async function importPlan30DaysIfNeeded() {
  const settings = await getSettings();
  if (settings.plan30DaysImported) return;
  const any = (await listWorkouts()).some((w) => w.programId === PLAN_30_ID);
  if (any) {
    await saveSettings({ plan30DaysImported: true });
    return;
  }
  await importPlan30Days();
}
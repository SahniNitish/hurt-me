import {
  GoogleAuthProvider,
  getRedirectResult,
  linkWithPopup,
  linkWithRedirect,
  onAuthStateChanged,
  signInAnonymously,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type User,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import type { AppSettings, BudgetEntry, SessionCheck, Task, Workout } from "./types";
import { getFirebaseAuth, getFirestoreDb, isFirebaseConfigured } from "./firebase";

const COLLECTIONS = ["tasks", "workouts", "sessionChecks", "budgetEntries"] as const;
type CollectionName = (typeof COLLECTIONS)[number];

let currentUser: User | null = null;
let authReady: Promise<User | null> | null = null;
let pulledOnce = false;
let followUpListener = false;

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export function getCloudUserId(): string | null {
  return currentUser?.uid ?? null;
}

export function getAuthUser(): User | null {
  return currentUser;
}

export function isGoogleSignedIn(): boolean {
  return Boolean(currentUser && !currentUser.isAnonymous);
}

function isMobileOrStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  const narrow = window.matchMedia("(max-width: 768px)").matches;
  return standalone || narrow;
}

export async function completeGoogleRedirectIfNeeded(): Promise<void> {
  if (!isFirebaseConfigured()) return;
  const auth = getFirebaseAuth();
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      currentUser = result.user;
      pulledOnce = false;
    }
  } catch (err) {
    console.warn("[hurt-me] Google redirect sign-in failed", err);
  }
}

function attachAuthFollowUpListener() {
  if (followUpListener || !isFirebaseConfigured()) return;
  followUpListener = true;
  const auth = getFirebaseAuth();
  onAuthStateChanged(auth, async (user) => {
    const prevUid = currentUser?.uid ?? null;
    currentUser = user;
    if (user?.uid && prevUid && user.uid !== prevUid) {
      pulledOnce = false;
      await pullCloudIntoIndexedDB();
      await pushAllLocalToCloud();
    }
    window.dispatchEvent(new CustomEvent("hurt-me-auth-changed", { detail: user }));
  });
}

export async function initCloudAuth(): Promise<User | null> {
  if (!isFirebaseConfigured()) return null;
  if (authReady) return authReady;

  authReady = (async () => {
    await completeGoogleRedirectIfNeeded();
    const auth = getFirebaseAuth();

    const user = await new Promise<User | null>((resolve) => {
      const unsub = onAuthStateChanged(auth, async (existing) => {
        if (existing) {
          currentUser = existing;
          unsub();
          resolve(existing);
          return;
        }
        try {
          const cred = await signInAnonymously(auth);
          currentUser = cred.user;
          unsub();
          resolve(cred.user);
        } catch (err) {
          console.warn(
            "[hurt-me] Firebase anonymous auth failed — enable Anonymous in Firebase Console → Authentication",
            err,
          );
          unsub();
          resolve(null);
        }
      });
    });

    attachAuthFollowUpListener();
    return user;
  })();

  return authReady;
}

export async function signInWithGoogle(): Promise<void> {
  if (!isFirebaseConfigured()) throw new Error("Firebase not configured");
  const auth = getFirebaseAuth();
  await initCloudAuth();
  const user = auth.currentUser;
  const redirect = isMobileOrStandalone();

  if (user?.isAnonymous) {
    if (redirect) await linkWithRedirect(user, googleProvider);
    else await linkWithPopup(user, googleProvider);
  } else if (redirect) {
    await signInWithRedirect(auth, googleProvider);
  } else {
    await signInWithPopup(auth, googleProvider);
  }

  if (!redirect && auth.currentUser) {
    currentUser = auth.currentUser;
    pulledOnce = false;
    await pullCloudIntoIndexedDB();
    await pushAllLocalToCloud();
  }
}

export async function signOutFromGoogle(): Promise<void> {
  if (!isFirebaseConfigured()) return;
  const auth = getFirebaseAuth();
  await signOut(auth);
  pulledOnce = false;
  try {
    const cred = await signInAnonymously(auth);
    currentUser = cred.user;
    await pushAllLocalToCloud();
  } catch (err) {
    console.warn("[hurt-me] Could not restore anonymous session after sign-out", err);
    currentUser = null;
  }
  window.dispatchEvent(new CustomEvent("hurt-me-auth-changed", { detail: currentUser }));
}

function userCollection(name: CollectionName) {
  const uid = getCloudUserId();
  if (!uid) throw new Error("No Firebase user");
  return collection(getFirestoreDb(), "users", uid, name);
}

function userDoc(name: CollectionName, id: string) {
  return doc(userCollection(name), id);
}

function settingsDoc() {
  const uid = getCloudUserId();
  if (!uid) throw new Error("No Firebase user");
  return doc(getFirestoreDb(), "users", uid, "meta", "settings");
}

async function cloudEnabled(): Promise<boolean> {
  if (!isFirebaseConfigured()) return false;
  const user = await initCloudAuth();
  return Boolean(user);
}

export async function pullCloudIntoIndexedDB(): Promise<void> {
  if (!isFirebaseConfigured() || pulledOnce) return;
  if (!(await cloudEnabled())) return;

  const { getDB } = await import("./db");
  const idb = await getDB();
  pulledOnce = true;

  const settingsSnap = await getDocs(collection(getFirestoreDb(), "users", getCloudUserId()!, "meta"));
  for (const d of settingsSnap.docs) {
    if (d.id === "settings") await idb.put("settings", d.data() as AppSettings);
  }

  for (const name of COLLECTIONS) {
    const snap = await getDocs(userCollection(name));
    for (const d of snap.docs) {
      if (name === "tasks") await idb.put("tasks", d.data() as Task);
      else if (name === "workouts") await idb.put("workouts", d.data() as Workout);
      else if (name === "sessionChecks") await idb.put("sessionChecks", d.data() as SessionCheck);
      else await idb.put("budgetEntries", d.data() as BudgetEntry);
    }
  }
}

export async function pushSettingsToCloud(settings: AppSettings): Promise<void> {
  if (!(await cloudEnabled())) return;
  await setDoc(settingsDoc(), settings, { merge: true });
}

export async function pushTaskToCloud(task: Task): Promise<void> {
  if (!(await cloudEnabled())) return;
  await setDoc(userDoc("tasks", task.id), task);
}

export async function deleteTaskFromCloud(id: string): Promise<void> {
  if (!(await cloudEnabled())) return;
  await deleteDoc(userDoc("tasks", id));
}

export async function pushWorkoutToCloud(workout: Workout): Promise<void> {
  if (!(await cloudEnabled())) return;
  await setDoc(userDoc("workouts", workout.id), workout);
}

export async function deleteWorkoutFromCloud(id: string): Promise<void> {
  if (!(await cloudEnabled())) return;
  await deleteDoc(userDoc("workouts", id));
}

export async function pushSessionCheckToCloud(check: SessionCheck): Promise<void> {
  if (!(await cloudEnabled())) return;
  await setDoc(userDoc("sessionChecks", check.id), check);
}

export async function deleteSessionChecksForWorkoutFromCloud(workoutId: string): Promise<void> {
  if (!(await cloudEnabled())) return;
  const snap = await getDocs(userCollection("sessionChecks"));
  const deletes = snap.docs.filter((d) => (d.data() as SessionCheck).workoutId === workoutId);
  await Promise.all(deletes.map((d) => deleteDoc(d.ref)));
}

export async function pushBudgetEntryToCloud(entry: BudgetEntry): Promise<void> {
  if (!(await cloudEnabled())) return;
  await setDoc(userDoc("budgetEntries", entry.id), entry);
}

export async function deleteBudgetEntryFromCloud(id: string): Promise<void> {
  if (!(await cloudEnabled())) return;
  await deleteDoc(userDoc("budgetEntries", id));
}

/** Push all local IndexedDB rows to Firestore (first-time migration). */
export async function pushAllLocalToCloud(): Promise<void> {
  if (!(await cloudEnabled())) return;
  const { getDB } = await import("./db");
  const idb = await getDB();
  const settings = await idb.get("settings", "settings");
  if (settings) await pushSettingsToCloud(settings);

  for (const name of COLLECTIONS) {
    const rows = await idb.getAll(name);
    await Promise.all(rows.map((row) => setDoc(userDoc(name, (row as { id: string }).id), row)));
  }
}

export type CloudSyncStatus = "local-only" | "cloud-anonymous" | "cloud-google" | "cloud-error";

export async function getCloudSyncStatus(): Promise<CloudSyncStatus> {
  if (!isFirebaseConfigured()) return "local-only";
  try {
    const user = await initCloudAuth();
    if (!user) return "cloud-error";
    return user.isAnonymous ? "cloud-anonymous" : "cloud-google";
  } catch {
    return "cloud-error";
  }
}
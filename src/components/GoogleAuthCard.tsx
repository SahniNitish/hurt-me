import { LogIn, LogOut } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { isFirebaseConfigured } from "../firebase";
import {
  getAuthUser,
  getCloudSyncStatus,
  initCloudAuth,
  isGoogleSignedIn,
  pullCloudIntoIndexedDB,
  pushAllLocalToCloud,
  signInWithGoogle,
  signOutFromGoogle,
  type CloudSyncStatus,
} from "../cloudSync";

export function GoogleAuthCard() {
  const [status, setStatus] = useState<CloudSyncStatus | "loading">("loading");
  const [email, setEmail] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const refresh = useCallback(async () => {
    if (!isFirebaseConfigured()) {
      setStatus("local-only");
      setEmail(null);
      return;
    }
    await initCloudAuth();
    setStatus(await getCloudSyncStatus());
    const u = getAuthUser();
    setEmail(u && !u.isAnonymous ? u.email ?? u.displayName ?? "Google account" : null);
  }, []);

  useEffect(() => {
    void refresh();
    const onAuth = () => void refresh();
    window.addEventListener("hurt-me-auth-changed", onAuth);
    return () => window.removeEventListener("hurt-me-auth-changed", onAuth);
  }, [refresh]);

  if (!isFirebaseConfigured()) {
    return (
      <div className="card text-sm text-ash">
        Cloud sync needs Firebase env vars on this deploy. Data still saves locally in IndexedDB.
      </div>
    );
  }

  async function onSignIn() {
    setBusy(true);
    setErr("");
    try {
      await signInWithGoogle();
      await pullCloudIntoIndexedDB();
      await pushAllLocalToCloud();
      await refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  async function onSignOut() {
    if (!confirm("Sign out of Google? This device keeps local data; cloud uses a fresh guest session until you sign in again.")) {
      return;
    }
    setBusy(true);
    setErr("");
    try {
      await signOutFromGoogle();
      await refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Sign-out failed");
    } finally {
      setBusy(false);
    }
  }

  const signedIn = isGoogleSignedIn();

  return (
    <div className="card space-y-3">
      <div>
        <p className="font-display text-sm font-semibold uppercase tracking-wide text-white">Account</p>
        <p className="mt-1 text-sm text-ash">
          {signedIn
            ? `Signed in as ${email}. Same Google account on phone + laptop = same cloud backup.`
            : "Sign in with Google to sync tasks, workouts, and budget across devices."}
        </p>
      </div>

      {status === "cloud-anonymous" && !signedIn ? (
        <p className="text-xs text-ember">Guest cloud session — link Google to keep this data on all devices.</p>
      ) : null}

      {signedIn ? (
        <button type="button" className="btn-ghost flex w-full items-center justify-center gap-2" disabled={busy} onClick={() => void onSignOut()}>
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      ) : (
        <button type="button" className="btn-primary flex w-full items-center justify-center gap-2" disabled={busy} onClick={() => void onSignIn()}>
          <LogIn className="h-4 w-4" />
          {busy ? "Opening Google…" : "Continue with Google"}
        </button>
      )}

      {err ? <p className="text-xs text-blood">{err}</p> : null}
    </div>
  );
}
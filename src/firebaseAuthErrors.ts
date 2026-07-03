/** User-facing help for Firebase Auth errors (esp. configuration-not-found). */

export function formatFirebaseAuthError(err: unknown): string {
  const code =
    err && typeof err === "object" && "code" in err && typeof (err as { code: string }).code === "string"
      ? (err as { code: string }).code
      : "";

  if (code === "auth/configuration-not-found") {
    return [
      "Firebase Authentication is not enabled for project hurt-me-app yet.",
      "Fix (2 min):",
      "1) Open Firebase Console → Authentication → click Get started if you see it.",
      "2) Sign-in method → enable Anonymous AND Google (support email required).",
      "3) Settings → Authorized domains → add hurt-me.vercel.app and hurt-me.onrender.com.",
      "4) Hard-refresh the app and try again.",
      "Console: https://console.firebase.google.com/project/hurt-me-app/authentication",
    ].join(" ");
  }

  if (code === "auth/operation-not-allowed") {
    return "That sign-in method is disabled in Firebase. Enable Google (and Anonymous) under Authentication → Sign-in method.";
  }

  if (code === "auth/unauthorized-domain") {
    return "This site URL is not authorized. Add it under Firebase → Authentication → Settings → Authorized domains.";
  }

  if (code === "auth/popup-blocked") {
    return "Popup blocked. Allow popups for this site or use the app on your phone (uses redirect).";
  }

  if (err instanceof Error) return err.message;
  return "Sign-in failed. Check Firebase Authentication is enabled in the console.";
}

export const FIREBASE_AUTH_CONSOLE_URL =
  "https://console.firebase.google.com/project/hurt-me-app/authentication/providers";
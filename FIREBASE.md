
## Firebase (cloud sync)

- **Project:** `hurt-me-app` (Firestore `nam5`, rules in `firestore.rules`)
- **CLI:** logged in as `nitishsahni884@gmail.com`
- **Local:** copy `.env.example` → `.env` and paste the **same** `firebaseConfig` from Firebase Console (all `VITE_FIREBASE_*` keys).

Your Console snippet maps like this:

| Console field | `.env` variable |
|---------------|-----------------|
| `apiKey` | `VITE_FIREBASE_API_KEY` |
| `authDomain` | `VITE_FIREBASE_AUTH_DOMAIN` |
| `projectId` | `VITE_FIREBASE_PROJECT_ID` |
| `storageBucket` | `VITE_FIREBASE_STORAGE_BUCKET` |
| `messagingSenderId` | `VITE_FIREBASE_MESSAGING_SENDER_ID` |
| `appId` | `VITE_FIREBASE_APP_ID` |

The app already calls `initializeApp()` in `src/firebase.ts` — you do **not** paste the snippet into `main.tsx`; only env vars matter at build time.

### Fix `auth/configuration-not-found`

This means **Authentication was never turned on** (or providers are all off) for `hurt-me-app` — not a bug in the app.

1. Open [Authentication](https://console.firebase.google.com/project/hurt-me-app/authentication) — if you see **Get started**, click it.
2. **Sign-in method** tab:
   - **Anonymous** → Enable
   - **Google** → Enable → pick a support email → Save
3. **Settings** → **Authorized domains** → ensure `localhost`, `hurt-me.vercel.app`, `hurt-me.onrender.com` are listed.
4. Wait ~1 minute, then hard-refresh Hurt Me and tap **Continue with Google** again.

If it still fails: [Google Cloud Console](https://console.cloud.google.com/apis/library/identitytoolkit.googleapis.com?project=hurt-me-app) → ensure **Identity Toolkit API** is **Enabled**.

### One-time in Firebase Console

1. [Enable billing](https://console.developers.google.com/billing/enable?project=hurt-me-app) on `hurt-me-app` (required for Firestore rules deploy on this project).
2. [Authentication](https://console.firebase.google.com/project/hurt-me-app/authentication/providers) → enable **Anonymous** and **Google** (add support email; add `hurt-me.vercel.app` and `hurt-me.onrender.com` under Authorized domains if needed).
3. Deploy rules: `firebase deploy --only firestore:rules`  
   **Note:** In `firebase.json` the database id must be `default` (not `(default)`).

### How data is stored

| Layer | Where |
|-------|--------|
| Offline / fast | Browser **IndexedDB** (`hurt-me-db`) |
| Cloud | **Firestore** `users/{anonymousUid}/tasks|workouts|...` |
| Same Google sign-in | Same Firestore data on phone, laptop, Vercel, Render |

Anonymous guest sessions sync to cloud per-browser until the user taps **Continue with Google** (links guest data to that Google account).

Writes go to IndexedDB first, then sync to Firestore in the background.

### Vercel

Production `VITE_FIREBASE_*` vars are set; **https://hurt-me.vercel.app** is deployed with Firebase baked in.

### Render

1. Generate import file: `./scripts/render-env-from-firebase.sh` → `render-env.upload` (gitignored).
2. Dashboard → **hurt-me** → **Environment** → **Add from .env** → upload that file → **Save, rebuild, and deploy**.

(`scripts/render-push-firebase-env.py` needs a valid Render API key; CLI token returned Unauthorized — dashboard import is the reliable path.)
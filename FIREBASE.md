
## Firebase (cloud sync)

- **Project:** `hurt-me-app` (Firestore `nam5`, rules in `firestore.rules`)
- **CLI:** logged in as `nitishsahni884@gmail.com`
- **Local:** copy `.env.example` → `.env` and fill from `firebase apps:sdkconfig WEB <appId> --project hurt-me-app`

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
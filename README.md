# Hurt Me

No-excuses personal discipline dashboard — mobile-first PWA with offline support and IndexedDB persistence. Single user, no login, no backend.

## Stack

- React + Vite + TypeScript
- Tailwind CSS
- IndexedDB via [idb](https://github.com/jakearchibald/idb)
- React Router (bottom tabs)
- lucide-react icons
- vite-plugin-pwa (installable, offline)

## Run locally

```bash
cd hurt-me
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). Use your phone on the same Wi‑Fi with `http://<your-pc-ip>:5173` to test mobile layout.

## Production build

```bash
npm run build
npm run preview
```

Deploy the `dist/` folder to any static host (Netlify, Cloudflare Pages, nginx, etc.). HTTPS is required for PWA install on most phones.

## Deploy (Vercel)

Config: `vercel.json` (Vite build + SPA rewrites for React Router).

```bash
cd hurt-me
npm install
npx vercel login          # once
npx vercel --prod         # production URL
```

Or connect the GitHub repo in [Vercel Dashboard](https://vercel.com/new) — framework **Vite**, root `hurt-me` if monorepo, build `npm run build`, output `dist`.

## Deploy (Render)

Config: `render.yaml` (static site + SPA rewrite).

1. Push this folder to a Git repo.
2. [Render Dashboard](https://dashboard.render.com/) → **New** → **Static Site** → connect repo.
3. **Build command:** `npm install && npm run build`
4. **Publish directory:** `dist`
5. Add a **Rewrite** rule: `/*` → `/index.html` (or use Blueprint from `render.yaml`).

PWA service worker works on both hosts over HTTPS.

## Install on your phone (PWA)

### Android (Chrome)

1. Open the app over **HTTPS** (or localhost during dev).
2. Menu (⋮) → **Install app** or **Add to Home screen**.
3. Confirm. Launch from the home screen icon — works offline after first load.

### iPhone (Safari)

1. Open the app in **Safari** (HTTPS).
2. Tap **Share** → **Add to Home Screen**.
3. Name it **Hurt Me** and add. Opens full-screen like a native app.

## Features

| Tab | What it does |
|-----|----------------|
| **Home** | Streak counter + shortcuts |
| **To-Do** | Tasks with priority, due dates, done section, daily progress ring |
| **Train** | Workout days, exercises (sets/reps, YouTube + alt), session checkoffs, reset |
| **Money** | Income/expenses, categories, monthly filter, budget cap warning, breakdown bars |

Data is stored in your browser **IndexedDB** (`hurt-me-db`). Clearing site data wipes it — export/backup is not built in yet.

## Design

Dark charcoal UI, blood-red accent, Oswald display headings, thumb-sized controls, bottom navigation.

---

*Hurt Me season. No excuses.*
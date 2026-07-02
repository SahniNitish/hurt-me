# Hurt Me — deploy checklist

## What’s ready

- `vercel.json` — Vite build + SPA fallback
- `render.yaml` — Render static site + rewrite
- `npm run build` → `dist/` (PWA included)

## Vercel (fastest)

From this folder:

```bash
cd ~/hurt-me
npx vercel login
npx vercel --prod
```

Copy the **Production** URL (e.g. `https://hurt-me-xxx.vercel.app`).

**Git import:** [vercel.com/new](https://vercel.com/new) → import repo → Root Directory = `hurt-me` if the repo is your whole home folder, or import a repo that only contains `hurt-me`.

| Setting | Value |
|---------|--------|
| Framework | Vite |
| Build | `npm run build` |
| Output | `dist` |

## Render

1. Push `hurt-me` to GitHub (see below).
2. [dashboard.render.com](https://dashboard.render.com/) → **New** → **Static Site**.
3. Connect the repo.
4. Build: `npm install && npm run build`
5. Publish: `dist`
6. **Redirects/Rewrites:** `/*` → `/index.html` (status 200)

Or **New Blueprint** → point at repo with `render.yaml` at root.

## Optional: own Git repo (recommended)

```bash
cd ~/hurt-me
git init
git add .
git commit -m "Hurt Me PWA"
gh repo create hurt-me --private --source=. --push
```

Then connect that repo on Vercel and Render.

## After deploy

- Open the HTTPS URL on your phone → **Add to Home Screen** (PWA).
- IndexedDB is per-origin — Vercel and Render are **different** URLs, so data won’t sync between them; pick one as your daily driver or use both as separate copies.

## Auth note

Deploy from this machine failed: `vercel login` required (invalid/missing token). Run the commands above on your PC once you’re logged in.
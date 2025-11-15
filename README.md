<div align="center">
   <h1>Hack Sphere / Code Fest — Frontend</h1>
</div>

This repository contains the frontend for the Hack Sphere (Code Fest) web application — a React + TypeScript single-page app built with Vite and Tailwind CSS. It provides the public site, authentication flows, team registration, contest pages (Round 1 and Round 2), and an admin dashboard wired to Supabase.

**This README** shows how to run, configure, and contribute to the project locally.

**Quick links**
- Project root: `hack-sphere/`
- Supabase schema: `supabase/schema.sql`
- Dev server: `npm run dev`
- Project docs: `QUICKSTART.md`, `SUPABASE_SETUP.md`, `INTEGRATION_COMPLETE.md`

**Tech stack**
- React + TypeScript
- Vite (dev + build)
- Tailwind CSS for styling
- Supabase (auth + storage + database)
- Optional: Gemini / external API keys (used by some integrations)

**Prerequisites**
- Node.js 16+ (LTS recommended)
- npm or yarn
- A Supabase project (for full functionality)

**Environment**
Copy `.env.local.example` (if present) to `.env.local` and set the required variables. Typical variables used by this project:

- `VITE_SUPABASE_URL` — your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — your Supabase anon/public key
- `GEMINI_API_KEY` — (optional) API key for Gemini integration if used

See `SUPABASE_SETUP.md` for detailed Supabase setup and `env.local` for any other values.

**Install & Run (local development)**
```bash
# Install dependencies
npm install

# Start dev server (Vite)
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`). If the dev server exits unexpectedly (exit code 130), try stopping other processes that may use the same port or run with `--force` in rare cases.

**Build & Preview**
```bash
# Build production bundle
npm run build

# Preview the production build locally
npm run preview
```

**Project structure (important files)**
- `index.html`, `index.tsx`, `App.tsx` — app entry
- `src/` or project root files (this repo uses a flat structure):
   - `pages/` — individual page components (Home, Registration, Admin pages, contest pages)
   - `components/` — shared UI components (Navbar, Footer, Section, ProtectedRoute, admin sidebar)
   - `contexts/` — React contexts (Auth, Contest, Theme)
   - `hooks/` — custom hooks (useAuth, useContest, useTheme)
   - `lib/` — helpers (e.g., `supabaseClient.ts`, `codeExecutor.ts`)
   - `assets/` — static images used by the site
   - `supabase/schema.sql` — DB schema used for server-side setup

**Styling & Theme**
The app uses Tailwind CSS utilities combined with small custom utilities defined in `index.css` (for gradient headings, glass surfaces, and theme helpers). To keep the look consistent, use the provided utility classes such as `admin-surface`, `admin-btn-gradient`, `reg-surface`, and `round2-surface`.

**Supabase Integration**
Follow `SUPABASE_SETUP.md` to create a Supabase project, run the SQL schema, and configure storage buckets. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local`.

**Testing & Linting**
This repository does not include automated tests by default. Add your preferred testing framework (Jest, Vitest) and a linter (ESLint) if needed.

**Deployment**
You can deploy the Vite build to any static hosting provider (Netlify, Vercel, GitHub Pages) or to a Node server that serves the static files. Make sure the environment variables (Supabase keys, API keys) are set in the target environment.

**Vercel deployment (serverless API)**
This project includes a catch-all serverless API handler at `api/[...server].js` which implements server-side endpoints (users CRUD and code execution). For Vercel deployments you must set the following Environment Variables in your Vercel project settings (these should NOT be prefixed with `VITE_` since they are server-side secrets):

- `SUPABASE_URL` — your Supabase project REST URL (e.g. `https://xyz.supabase.co`)
- `SUPABASE_SERVICE_KEY` — Supabase `service_role` key (secret; grants elevated privileges)

Client-side variables (used by the browser) should still use the `VITE_` prefix and be set separately in Vercel if needed:

- `VITE_SUPABASE_URL` — same as above but intended for the client
- `VITE_SUPABASE_ANON_KEY` — Supabase anon/public key for client SDK operations

Notes:
- Do NOT expose `SUPABASE_SERVICE_KEY` in client code or in files committed to the repo.
- The `api/[...server].js` handler uses global `fetch` and Node 18+ features — Vercel's runtime supports this out of the box.

Local testing:
- To test serverless functions locally, install the Vercel CLI and run `vercel dev` from the `hack-sphere/` folder. This runs your functions with environment variables from your local environment or `.env` files:

```bash
# Install Vercel CLI (recommend using npx or devDependency to avoid global permission issues)
npx vercel@latest login
npx vercel dev
```

- If you prefer not to use Vercel CLI, you can run the original Express server in `hacksphere-server/server.js` for local testing, but remember the deployed environment uses the serverless handler.

Security reminder:
- Add `SUPABASE_SERVICE_KEY` only to Vercel's Environment Variables (Production/Preview/Development settings) — never commit it to the repository.


**Common commands**
- `npm install` — install packages
- `npm run dev` — start development server
- `npm run build` — produce production build
- `npm run preview` — locally preview the production build

**Troubleshooting**
- Dev server exits with code 130: check port collisions, stop other running dev servers, and re-run `npm run dev`.
- Broken images in the carousel: ensure `assets/` filenames match imports (e.g. `sideimage5.jpg` vs `slideimage5.jpg`).

**Contributing**
1. Fork the repository and create a feature branch
2. Make changes and keep commits focused
3. Open a pull request with a clear description and screenshots if UI changes were made

**License**
Specify your preferred license here (MIT, Apache-2.0, etc.) or add `LICENSE` to the repo.

**Contact / Maintainers**
If you need help running the project locally or want design changes, open an issue or contact the maintainers listed in the repository.

---

If you'd like, I can:
- generate a short CONTRIBUTING.md and CODE_OF_CONDUCT
- add badges (build, license, deployments)
- produce a shorter README for a GitHub repo landing page

Tell me which of those you'd like next.

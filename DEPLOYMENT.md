# Deployment guide

## Web on Vercel

- **Project root:** `web`
- **Framework preset:** `Vite`
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Install command:** `npm install`
- **Required environment variables:**
  - `VITE_CLERK_PUBLISHABLE_KEY`
  - `VITE_API_URL=https://<your-render-backend-domain>`

### Notes

- `web/vercel.json` rewrites every route to `index.html` so client-side routes such as `/chat` keep working on refresh.
- `VITE_API_URL` should be the Render backend origin **without** `/api`; the app now normalizes the `/api` suffix automatically.

## Backend on Render

- **Blueprint file:** `render.yaml`
- **Dockerfile:** `backend/Dockerfile`
- **Health check path:** `/api/health`
- **Required environment variables:**
  - `PORT=3000`
  - `DATABASE_URL`
  - `CLERK_SECRET_KEY`
  - `FRONTEND_URL=https://<your-vercel-domain>`
  - `ALLOWED_ORIGINS=https://<your-vercel-domain>`

### Notes

- The backend Docker image runs `bun install --frozen-lockfile`, generates the Prisma client, and starts the server with `bun -r dotenv/config server.ts`.
- `ALLOWED_ORIGINS` can be a comma-separated list if you need to allow preview deployments in addition to production.

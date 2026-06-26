# fin — Random User Profiles

A full-stack app: fetch random user profiles, view details, save favourites, and manage your collection.

Two clearly separated parts — each with its own README:

| Folder | Role | Stack |
|--------|------|-------|
| ` . ` (this folder) | Client | Next.js 16 · React 19 · TypeScript · CSS Modules · Zustand |
| `server/` | Server | Node · Express · TypeScript · Supabase (Postgres) |

---

## Project structure

```
.                         ← client (Next.js frontend)
  src/
    app/
      page.tsx            ← Home (Screen 0)
      fetch/page.tsx      ← Random List (Screen 1)
      history/page.tsx    ← Saved Profiles (Screen 2)
      profile/[id]/page.tsx ← Profile Detail (Screen 3)
    components/           ← UserRow, UserList, FilterInput, Skeleton
    store/                ← Zustand store
    lib/                  ← randomuser.me client, API client
    types/                ← shared User interface
server/                   ← backend (Express + Supabase)
  src/
    index.ts
    supabase.ts
    routes/users.ts
```

---

## Prerequisites

- Node 20+
- A [Supabase](https://supabase.com) project (free tier is fine) — see `server/README.md` for the table schema

---

## Running locally

### 1. Start the server

```bash
cd server
cp .env.example .env   # fill in SUPABASE_URL and SUPABASE_ANON_KEY
npm install
npm run dev            # http://localhost:4000
```

### 2. Start the client

```bash
# from this directory
npm install
npm run dev            # http://localhost:3000
```

`NEXT_PUBLIC_API_URL` defaults to `http://localhost:4000` — no `.env.local` needed for local dev.

---

## Screens

| Route | Description |
|-------|-------------|
| `/` | Home — Fetch and History buttons |
| `/fetch` | Random list from randomuser.me. Filter by name / country. Click a row for details. |
| `/history` | Saved profiles from the backend. Same list UI. |
| `/profile/[id]?source=fetch\|history` | Detail view. Editable name. Save / Update / Delete / Back. Hebrew labels, LTR data. |

---

## Client scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Serve production build |

See [server/README.md](server/README.md) for server scripts and API reference.

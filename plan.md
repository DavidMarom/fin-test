# Implementation Plan

## What We're Building

A full-stack app: a React/Next.js frontend that fetches random user profiles and lets the user save/manage them via a Node+TypeScript backend.

---

## Architecture Decisions (to defend in DECISIONS.md)

### 1. Monorepo — two clearly-separated roots

```
fin-test/
├── src/          ← Next.js frontend (already exists)
├── server/       ← Express + TypeScript backend (new)
├── plan.md
└── README.md     ← top-level overview + how to run both
```

The spec says "Client and server clearly separated." A monorepo with two roots (each with its own `package.json`, `tsconfig.json`, `README.md`) satisfies that without requiring two repos. Keeps it simple for the reviewer.

### 2. Frontend state: Zustand

Why Zustand over TanStack Query / Context / Redux:
- The in-memory user list (Screen 1) needs to persist edits across navigation (name changes, before saving). TanStack Query doesn't own in-memory mutations well.
- Zustand is minimal, no boilerplate, TypeScript-native.
- One store holds: `fetchedUsers[]`, `savedUsers[]` (cached from backend), `activeSource` (fetch | history).
- Backend calls are plain `fetch()` inside store actions — no extra library needed at this scale.

### 3. Persistence: SQLite via `better-sqlite3`

Why not JSON file / in-memory:
- JSON file: concurrent writes corrupt it; requires full rewrite on every mutation.
- In-memory: data lost on restart.
- SQLite: single-file, no server process, synchronous API (clean code), proper transactions. Easy to inspect. `better-sqlite3` types are excellent.
- Tradeoff: doesn't scale to multiple server instances (acceptable for this spec).

### 4. Backend: Express + TypeScript (ts-node-dev for dev)

4 endpoints only:
```
GET    /api/users          → list all saved users
POST   /api/users          → save a user
PUT    /api/users/:id      → update a user (name only)
DELETE /api/users/:id      → delete a user
```

### 5. Filter: single debounced input (300ms), filters on name + country

One input, debounced at 300ms with `useRef`+`setTimeout` — no library needed. Filters both fields simultaneously. Documents cleanly in DECISIONS.md.

### 6. BiDi / RTL (Screen 3)

- Wrap `<main>` in Screen 3 with `dir="rtl"`.
- All Hebrew labels render naturally RTL.
- Data fields (email, phone, name `<input>`, street, numbers) get `dir="ltr"` + `text-align: left` via a CSS Module class.
- Buttons: keep in RTL flow (right-aligned). Natural for Hebrew speakers.
- No external i18n library — just HTML `dir` attributes and a CSS utility class `.ltr-field`.

### 7. Extension: Loading skeletons

Skeleton screens on Screen 1 (while fetching from randomuser.me) and Screen 2 (while fetching from backend). Chosen over error boundaries (also needed but simpler), optimistic updates (nice but less visible), and tests (valuable but takes longer). A skeleton is the single most noticeable UX polish in a list-heavy app.

---

## Screen Map

| Screen | Route | Data source |
|--------|-------|-------------|
| Home | `/` | — |
| Random List | `/fetch` | randomuser.me |
| Saved Profiles | `/history` | GET /api/users |
| Profile Detail | `/profile/[id]` | Zustand store |

Profile Detail knows its source via a `source` query param: `?source=fetch` or `?source=history`. This drives which buttons render (Save vs Delete).

---

## File Structure (Frontend additions)

```
src/
├── app/
│   ├── page.tsx                  ← Screen 0: Home
│   ├── fetch/
│   │   └── page.tsx              ← Screen 1: Random List
│   ├── history/
│   │   └── page.tsx              ← Screen 2: Saved Profiles
│   └── profile/
│       └── [id]/
│           └── page.tsx          ← Screen 3: Profile Detail
├── store/
│   └── useUserStore.ts           ← Zustand store
├── types/
│   └── user.ts                   ← shared User type
├── hooks/
│   ├── useDebounce.ts
│   └── useUsers.ts               ← fetch from randomuser.me
└── components/
    ├── UserList/                 ← shared list (Screen 1 + 2)
    ├── UserRow/                  ← single row in list
    ├── FilterInput/              ← debounced search
    └── Skeleton/                 ← loading skeleton
```

---

## File Structure (Backend)

```
server/
├── package.json
├── tsconfig.json
├── README.md
└── src/
    ├── index.ts          ← Express app entry
    ├── db.ts             ← SQLite setup + schema
    ├── routes/
    │   └── users.ts      ← all 4 endpoints
    └── types/
        └── user.ts       ← User interface
```

---

## Required Deliverables Checklist

- [ ] Working code (frontend + backend)
- [ ] `README.md` (top-level)
- [ ] `server/README.md`
- [ ] `DECISIONS.md` (3 decisions + RTL approach + corners cut + extension)
- [ ] `AI_USAGE.md`
- [ ] Extension implemented (loading skeletons)

---

## Build Order

1. **Backend first** — set up Express + SQLite + 4 endpoints. Test with curl.
2. **Zustand store + types** — define User type, wire randomuser.me mapping.
3. **Screen 0 (Home)** — two buttons, routing.
4. **Screen 1 (Random List)** — fetch, list, filter, skeleton.
5. **Screen 2 (Saved Profiles)** — same list component, different data source.
6. **Screen 3 (Profile Detail)** — detail view, RTL, 4 buttons, editable name.
7. **Deliverable docs** — DECISIONS.md, AI_USAGE.md, READMEs.
8. **Polish** — smoke test all flows end-to-end.

---

## Corners to Cut Deliberately (note in DECISIONS.md)

- No auth / no user sessions (spec allows this)
- No optimistic updates on Save/Delete (plain await + re-fetch)
- No pagination on the list (only 10 users from randomuser.me)
- No input validation on the backend beyond basic presence checks
- SQLite file stored in `server/data/users.db` — not configurable via env var (would be in prod)

---

## Key Type (shared shape)

```ts
interface User {
  id: string;            // login.uuid from randomuser.me, or generated for backend
  title: string;
  first: string;
  last: string;
  gender: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  state: string;
  street: string;        // "123 Main St"
  dob: string;           // ISO date string
  age: number;
  picture: string;       // large image URL
  thumbnail: string;     // small image URL
}
```

---

## Notes on This Next.js Version

Per AGENTS.md: this is Next.js 16 (breaking changes from training data). Must read `node_modules/next/dist/docs/` before writing any Next.js-specific code. App Router conventions may differ — check before assuming.

# DECISIONS.md

## Decision 1 — Zustand for state management

I chose Zustand over TanStack Query, Redux, and plain Context.

**Tradeoff:** TanStack Query is the natural fit for server state (caching, background refetch, deduplication), but the spec introduces a wrinkle: a user fetched from randomuser.me must retain name edits _in memory_ even after navigating away and back, before it's ever saved. TanStack Query doesn't manage that in-memory mutation well — you'd need a separate local override layer anyway. Zustand gives me one flat store that owns both "fetched users" and "saved users", with simple, typed actions for updates. Redux would achieve the same but with far more boilerplate for an app this size. Context with useReducer is fine but every consumer re-renders on any slice change. In production I'd add TanStack Query on top of Zustand for the backend calls to get caching and background sync for free.

---

## Decision 2 — Supabase (Postgres) over SQLite / JSON file

I chose Supabase over SQLite or a JSON file.

**Tradeoff:** SQLite is the right call for a self-contained local server — synchronous API, zero infra, easy to inspect. But it can't run on serverless platforms (Vercel functions have a read-only ephemeral filesystem), and it doesn't scale horizontally. A JSON file has the same problem plus concurrent-write corruption risk. Supabase gives me a managed Postgres instance with a well-typed JS client, works serverlessly, and deploys to Vercel without any infrastructure changes. The cost is an external dependency and two env vars (`SUPABASE_URL`, `SUPABASE_ANON_KEY`); the schema setup is a one-time SQL snippet. In a production system I'd use the Supabase service role key server-side and row-level security policies for auth — neither was needed here per spec.

---

## Decision 3 — Single debounced input for filter (300ms, name + country together)

I used one text input that filters across both name and country simultaneously, debounced at 300ms.

**Tradeoff:** Two inputs (one for name, one for country) give the user more precision but add visual noise and require coordinating two state values. A single input that matches either field covers 95% of real usage patterns in a 10-item list. The 300ms debounce avoids firing on every keystroke (which would re-filter a potentially larger list), while remaining fast enough to feel instant on a 10-item dataset. If this were a server-side search against thousands of records, I'd drop to 200ms and debounce the network call rather than the DOM filter.

---

## RTL / BiDi Approach (Screen 3)

Screen 3 wraps its `<main>` with `dir="rtl"`. All Hebrew labels (`מגדר`, `שם`, `גיל`, etc.) are defined in JSX and render naturally in the RTL flow. Data values that are inherently LTR — email, phone, street address, the editable name inputs — receive `dir="ltr"` as an inline HTML attribute on the element itself (not just a CSS rule), plus a global utility class `.ltr-field` (`text-align: left; unicode-bidi: embed`) defined in `globals.css`. The name `<input>` elements also carry `dir="ltr"` so the caret and cursor movement behave correctly for Latin text even inside the RTL form. Buttons are in the RTL flow (right-aligned), which is natural for Hebrew speakers. I did not use an i18n library — for a single mixed-direction screen, native HTML `dir` attributes are the correct tool and add zero bundle weight.

---

## Corners Cut

- **No authentication** — permitted by spec.
- **No pagination** — the list is always 10 items from randomuser.me; not needed at this scale.
- **No input validation on the backend beyond presence checks** — in production I'd add a schema validator (zod, joi) on every endpoint.
- **Supabase anon key is used server-side** — fine here since the API routes run on the server (not in the browser), but in production with public client-side access I'd enable row-level security policies.
- **No error boundary** — a React ErrorBoundary wrapper around the page tree would catch unexpected render errors cleanly.

---

## Extension — Loading Skeletons

I implemented animated shimmer skeletons on Screen 1 and Screen 2 (shown while data is in flight). I chose skeletons over other options because:

- **Over optimistic updates:** Optimistic updates require rollback logic; skeletons add polish with zero risk of state inconsistency.
- **Over error boundaries:** Also valuable, but error states are edge cases — skeletons improve every load, even the happy path.
- **Over tests:** Tests provide long-term confidence but aren't visible to a reviewer clicking through the app.

The shimmer animation is pure CSS (`@keyframes` + `background-position`). No JS or animation library. If I had another hour I'd add an `ErrorBoundary` component and a retry button for network failures.

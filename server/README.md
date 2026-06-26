# fin — Server

Node + TypeScript backend. Express + Supabase (Postgres).

## Prerequisites

- Node 20+
- A [Supabase](https://supabase.com) project (free tier is fine)

## Setup

### 1. Create the Supabase table

Run this in your Supabase project's SQL editor:

```sql
create table users (
  id        text primary key,
  title     text not null default '',
  first     text not null,
  last      text not null,
  gender    text not null default '',
  email     text not null default '',
  phone     text not null default '',
  country   text not null default '',
  city      text not null default '',
  state     text not null default '',
  street    text not null default '',
  dob       text not null default '',
  age       integer not null default 0,
  picture   text not null default '',
  thumbnail text not null default '',
  created_at timestamptz not null default now()
);
```

### 2. Environment variables

```bash
cp .env.example .env
# Fill in SUPABASE_URL and SUPABASE_ANON_KEY
```

Find your credentials at: Supabase dashboard → Project Settings → API.

## Install & Run

```bash
npm install
npm run dev      # ts-node-dev, auto-restarts on change
```

Production:

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SUPABASE_URL` | — | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | — | Your Supabase anon key |
| `PORT` | `4000` | Port to listen on |
| `CLIENT_URL` | `http://localhost:3000` | Frontend origin (for CORS) |

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/users` | List all saved users |
| POST | `/api/users` | Save a user |
| PUT | `/api/users/:id` | Update name fields |
| DELETE | `/api/users/:id` | Delete a user |
| GET | `/health` | Health check |

# מדריך פריסה (Deployment)

---

## כמה פרויקטים?

**שניים** — אי אפשר לפרוס שרת Express רגיל על Vercel (Vercel מריץ פונקציות serverless, לא תהליך Node מתמשך).

| חלק | פלטפורמה | חינמי? |
|-----|----------|--------|
| Client (Next.js) | [Vercel](https://vercel.com) | ✅ |
| Server (Express) | [Render](https://render.com) | ✅ |

---

## שלב 1 — Supabase (בסיס הנתונים)

1. היכנסו ל־[supabase.com](https://supabase.com) וצרו פרויקט חדש.
2. עברו ל־**SQL Editor** והריצו:

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

3. עברו ל־**Project Settings → API** והעתיקו:
   - `Project URL` → זהו `SUPABASE_URL`
   - `anon public` key → זהו `SUPABASE_ANON_KEY`

---

## שלב 2 — פריסת ה־Server על Render

1. דחפו את הקוד ל־GitHub (שני הפולדרים באותו ריפו זה בסדר).
2. היכנסו ל־[render.com](https://render.com) → **New → Web Service**.
3. חברו את הריפו ובחרו **Root Directory: `server`**.
4. הגדרות:
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. תחת **Environment Variables** הוסיפו:

   | מפתח | ערך |
   |------|-----|
   | `SUPABASE_URL` | ה־URL שהעתקתם מ־Supabase |
   | `SUPABASE_ANON_KEY` | ה־key שהעתקתם מ־Supabase |
   | `CLIENT_URL` | כתובת ה־Vercel שתקבלו בשלב הבא (אפשר להוסיף אחר כך) |

6. לחצו **Deploy**. בסוף תקבלו URL בסגנון `https://fin-server.onrender.com` — שמרו אותו.

---

## שלב 3 — פריסת ה־Client על Vercel

1. היכנסו ל־[vercel.com](https://vercel.com) → **Add New → Project**.
2. ייבאו את הריפו. Vercel יזהה את Next.js אוטומטית.
3. בהגדרות הפרויקט → **Environment Variables** הוסיפו:

   | מפתח | ערך |
   |------|-----|
   | `NEXT_PUBLIC_API_URL` | ה־URL של השרת מ־Render (למשל `https://fin-server.onrender.com`) |

4. לחצו **Deploy**. תקבלו URL בסגנון `https://fin.vercel.app`.

---

## שלב 4 — עדכון ה־Server ב־Render

חיזרו ל־Render ועדכנו את `CLIENT_URL` לכתובת ה־Vercel שקיבלתם:

```
CLIENT_URL = https://fin.vercel.app
```

זה נדרש כדי ש־CORS יאפשר לקליינט לדבר עם השרת.

---

## סיכום משתני הסביבה

### Server (Render)

| מפתח | מקור |
|------|------|
| `SUPABASE_URL` | Supabase → Project Settings → API |
| `SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `CLIENT_URL` | ה־URL של Vercel |
| `PORT` | לא נדרש — Render מגדיר אוטומטית |

### Client (Vercel)

| מפתח | מקור |
|------|------|
| `NEXT_PUBLIC_API_URL` | ה־URL של השרת ב־Render |

---

## ריצה מקומית (תזכורת)

```bash
# טרמינל 1 — שרת
cd server
cp .env.example .env      # מלאו SUPABASE_URL ו־SUPABASE_ANON_KEY
npm install
npm run dev               # http://localhost:4000

# טרמינל 2 — קליינט
npm install
npm run dev               # http://localhost:3000
```

`NEXT_PUBLIC_API_URL` לא נדרש מקומית — ברירת המחדל היא `http://localhost:4000`.

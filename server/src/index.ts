import "dotenv/config";
import express from "express";
import cors from "cors";
import usersRouter from "./routes/users";

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;
const CLIENT_URL = process.env.CLIENT_URL ?? "http://localhost:3000";

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  CLIENT_URL.replace(/\/$/, ""), // strip trailing slash if present
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (curl, Postman, server-to-server)
      if (!origin) return callback(null, true);
      // allow exact match or any vercel.app subdomain
      if (
        ALLOWED_ORIGINS.includes(origin) ||
        /^https:\/\/[^.]+\.vercel\.app$/.test(origin)
      ) {
        return callback(null, true);
      }
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
  })
);
app.use(express.json());

app.use("/api/users", usersRouter);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

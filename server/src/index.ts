import "dotenv/config";
import express from "express";
import cors from "cors";
import usersRouter from "./routes/users";

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;
const CLIENT_URL = process.env.CLIENT_URL ?? "http://localhost:3000";

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

app.use("/api/users", usersRouter);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

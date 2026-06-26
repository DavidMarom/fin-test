import { Router, Request, Response } from "express";
import { getSupabase } from "../supabase";
import type { User } from "../types/user";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const { data, error } = await getSupabase()
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json(data);
});

router.post("/", async (req: Request, res: Response) => {
  const user = req.body as User;

  if (!user.id || !user.first || !user.last) {
    res.status(400).json({ error: "id, first, and last are required" });
    return;
  }

  const { data, error } = await getSupabase()
    .from("users")
    .insert(user)
    .select()
    .single();

  if (error) {
    const status = error.code === "23505" ? 409 : 500;
    res.status(status).json({ error: error.message });
    return;
  }
  res.status(201).json(data);
});

router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, first, last } = req.body as Partial<User>;

  const patch: Record<string, string> = {};
  if (title !== undefined) patch.title = title;
  if (first !== undefined) patch.first = first;
  if (last !== undefined) patch.last = last;

  if (Object.keys(patch).length === 0) {
    res.status(400).json({ error: "Nothing to update" });
    return;
  }

  const { data, error } = await getSupabase()
    .from("users")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    const status = error.code === "PGRST116" ? 404 : 500;
    res.status(status).json({ error: error.message });
    return;
  }
  res.json(data);
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error } = await getSupabase().from("users").delete().eq("id", id);

  if (error) { res.status(500).json({ error: error.message }); return; }
  res.status(204).send();
});

export default router;

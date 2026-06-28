import supabase from "../lib/supabaseClient.js";
import localMock from "../lib/localMock.js";
import getAuthUserId, { AuthError } from "../lib/authHelper.js";

export default async function handler(req, res) {
  try {
    const user_id = await getAuthUserId(req);

    if (req.method === "GET") {
      if (process.env.USE_LOCAL_MOCK === "1") {
        const items = await localMock.getCollection("goals");
        const filtered = items.filter((g) => String(g.user_id) === String(user_id));
        return res.status(200).json(filtered.sort((a, b) => (a.target_date < b.target_date ? 1 : -1)));
      }

      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", user_id)
        .order("target_date", { ascending: false });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      const { title, target_amount, category, target_date, current_amount } = req.body || {};

      if (!title || !target_amount) {
        return res.status(400).json({ error: "title and target_amount are required" });
      }

      const newGoal = {
        goal_id: `GOAL${Date.now().toString().slice(-6)}`,
        user_id,
        title,
        target_amount: Number(target_amount),
        category: category || "General",
        target_date: target_date || null,
        current_amount: Number(current_amount || 0),
      };

      if (process.env.USE_LOCAL_MOCK === "1") {
        await localMock.insertInto("goals", newGoal);
        return res.status(201).json(newGoal);
      }

      const { data, error } = await supabase.from("goals").insert([newGoal]).select();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json(data?.[0] || data);
    }

    if (req.method === "PUT") {
      const { goal_id, title, target_amount, category, target_date, current_amount } = req.body || {};

      if (!goal_id) {
        return res.status(400).json({ error: "goal_id is required" });
      }

      const updates = {};
      if (title !== undefined) updates.title = title;
      if (target_amount !== undefined) updates.target_amount = Number(target_amount);
      if (category !== undefined) updates.category = category;
      if (target_date !== undefined) updates.target_date = target_date;
      if (current_amount !== undefined) updates.current_amount = Number(current_amount);

      const { data, error } = await supabase
        .from("goals")
        .update(updates)
        .eq("goal_id", goal_id)
        .eq("user_id", user_id)
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (!data) {
        return res.status(404).json({ error: "Goal not found" });
      }

      return res.status(200).json(data);
    }

    if (req.method === "DELETE") {
      const { id } = req.query || {};

      if (!id) {
        return res.status(400).json({ error: "id is required" });
      }

      const { error } = await supabase.from("goals").delete().eq("goal_id", id).eq("user_id", user_id);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ message: "Deleted" });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("[goals] Unhandled error:", err.message, err.stack);
    const status = err instanceof AuthError ? 401 : 500;
    return res.status(status).json({ error: err.message, stack: err.stack });
  }
}
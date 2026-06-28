import supabase from "../lib/supabaseClient.js";
import localMock from "../lib/localMock.js";
import getAuthUserId, { AuthError } from "../lib/authHelper.js";

export default async function handler(req, res) {
  try {
    console.log("[budgets] REQUEST BODY:", req.body);
    console.log("[budgets] REQUEST QUERY:", req.query);

    const user_id = await getAuthUserId(req);

    if (req.method === "GET") {
      if (process.env.USE_LOCAL_MOCK === "1") {
        const items = await localMock.getCollection("budgets");
        const filtered = items.filter((b) => String(b.user_id) === String(user_id));
        return res.status(200).json(filtered.sort((a, b) => (a.month < b.month ? 1 : -1)));
      }

      const { data, error } = await supabase
        .from("budgets")
        .select("*")
        .eq("user_id", user_id)
        .order("month", { ascending: false });

      if (error) {
        console.error("[budgets GET] Supabase error:", error.message);
        return res.status(500).json({ error: error.message, stack: error.stack });
      }

      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      const { category, budget_limit, month } = req.body || {};

      if (!category || !category.trim()) {
        return res.status(400).json({ error: "category is required" });
      }
      if (budget_limit === undefined || budget_limit === null || budget_limit === "") {
        return res.status(400).json({ error: "budget_limit is required" });
      }
      const numericLimit = Number(budget_limit);
      if (Number.isNaN(numericLimit) || numericLimit <= 0) {
        return res.status(400).json({ error: "budget_limit must be a positive number" });
      }
      if (!month) {
        return res.status(400).json({ error: "month is required" });
      }

      const newBudget = {
        budget_id: `BUD${Date.now().toString().slice(-6)}`,
        user_id,
        category: category.trim(),
        budget_limit: numericLimit,
        month,
      };

      console.log("[budgets POST] Inserting:", JSON.stringify(newBudget));

      if (process.env.USE_LOCAL_MOCK === "1") {
        const mockRecord = { budget_id: `BUD${Date.now().toString().slice(-6)}`, ...newBudget };
        await localMock.insertInto("budgets", mockRecord);
        return res.status(201).json(mockRecord);
      }

      console.log("[budgets POST] Attempting Supabase insert with:", JSON.stringify(newBudget));

      const { data, error } = await supabase
        .from("budgets")
        .insert([newBudget])
        .select();

      if (error) {
        console.error("[budgets POST] Supabase error:", JSON.stringify(error));
        return res.status(500).json({ error: error.message, stack: error.stack });
      }

      console.log("[budgets POST] Created:", JSON.stringify(data));
      return res.status(201).json(data?.[0] || data);
    }

    if (req.method === "PUT") {
      const { budget_id, category, budget_limit, month } = req.body || {};

      if (!budget_id) {
        return res.status(400).json({ error: "budget_id is required" });
      }

      console.log("[budgets PUT] Updating:", { budget_id, user_id, category, budget_limit, month });

      const { data, error } = await supabase
        .from("budgets")
        .update({
          category,
          budget_limit: budget_limit !== undefined ? Number(budget_limit) : undefined,
          month,
        })
        .eq("budget_id", budget_id)
        .eq("user_id", user_id)
        .select()
        .maybeSingle();

      if (error) {
        console.error("[budgets PUT] Supabase error:", error.message);
        return res.status(500).json({ error: error.message, stack: error.stack });
      }

      if (!data) {
        return res.status(404).json({ error: "Budget not found" });
      }

      return res.status(200).json(data);
    }

    if (req.method === "DELETE") {
      const { id } = req.query || {};

      if (!id) {
        return res.status(400).json({ error: "id is required" });
      }

      console.log("[budgets DELETE] Removing:", { id, user_id });

      const { error } = await supabase
        .from("budgets")
        .delete()
        .eq("budget_id", id)
        .eq("user_id", user_id);

      if (error) {
        console.error("[budgets DELETE] Supabase error:", error.message);
        return res.status(500).json({ error: error.message, stack: error.stack });
      }

      return res.status(200).json({ message: "Deleted" });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("[budgets] Unhandled error:", err.message, err.stack);
    const status = err instanceof AuthError ? 401 : 500;
    return res.status(status).json({ error: err.message, stack: err.stack });
  }
}

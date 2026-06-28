import supabase from "../lib/supabaseClient.js";
import localMock from "../lib/localMock.js";
import getAuthUserId, { AuthError } from "../lib/authHelper.js";

export default async function handler(req, res) {
  try {
    console.log("[transactions] REQUEST BODY:", req.body);
    console.log("[transactions] REQUEST QUERY:", req.query);

    const user_id = await getAuthUserId(req);
    const { type, limit } = req.query || {};

    if (req.method === "GET") {
      if (process.env.USE_LOCAL_MOCK === "1") {
        const items = await localMock.getCollection("transactions");
        let filtered = items.filter((t) => String(t.user_id) === String(user_id));
        if (type) {
          const t = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
          filtered = filtered.filter((t) => t.type === t);
        }
        filtered = filtered.sort((a, b) => (a.date < b.date ? 1 : -1));
        if (limit) {
          const parsed = Number(limit);
          if (!Number.isNaN(parsed) && parsed > 0) filtered = filtered.slice(0, parsed);
        }
        return res.status(200).json(filtered);
      }

      let query = supabase.from("transactions").select("*").eq("user_id", user_id).order("date", { ascending: false });
      if (type) {
        const t = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
        query = query.eq("type", t);
      }
      if (limit) {
        const parsed = Number(limit);
        if (!Number.isNaN(parsed) && parsed > 0) query = query.limit(parsed);
      }

      const { data, error } = await query;
      if (error) {
        console.error("[transactions GET] Supabase error:", error.message);
        return res.status(500).json({ error: error.message, stack: error.stack });
      }
      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      const { amount, category, description, type, date } = req.body || {};
      if (amount === undefined || amount === null || amount === "") {
        return res.status(400).json({ error: "amount is required" });
      }
      const numericAmount = Number(amount);
      if (Number.isNaN(numericAmount) || numericAmount <= 0) {
        return res.status(400).json({ error: "amount must be a positive number" });
      }
      if (!category || !category.trim()) {
        return res.status(400).json({ error: "category is required" });
      }
      const t = type ? type.charAt(0).toUpperCase() + type.slice(1).toLowerCase() : "";
      if (!t || (t !== "Expense" && t !== "Income")) {
        return res.status(400).json({ error: "type must be Expense or Income" });
      }

     const newTransaction = {
  transaction_id: crypto.randomUUID(),

  user_id,

  amount,

  category,

  description: description || "",

  date: date || new Date().toISOString(),

  type: type || "Income"
};

      console.log("[transactions POST] Inserting:", JSON.stringify(newTransaction));

      if (process.env.USE_LOCAL_MOCK === "1") {
        const mockRecord = { transaction_id: `TXN${Date.now().toString().slice(-6)}`, ...newTransaction, date: new Date().toISOString().split("T")[0] };
        await localMock.insertInto("transactions", mockRecord);
        return res.status(201).json(mockRecord);
      }

      const { data, error } = await supabase.from("transactions").insert([newTransaction]).select();
      if (error) {
        console.error("[transactions POST] Supabase error:", error.message);
        return res.status(500).json({ error: error.message, stack: error.stack });
      }
      console.log("[transactions POST] Created:", JSON.stringify(data));
      return res.status(201).json(data?.[0] || data);
    }

    if (req.method === "PUT") {
      const { transaction_id, amount, category, description, type, date } = req.body || {};

      if (!transaction_id) {
        return res.status(400).json({ error: "transaction_id is required" });
      }

      const updates = {};
      if (amount !== undefined) updates.amount = Number(amount);
      if (category !== undefined) updates.category = category;
      if (description !== undefined) updates.description = description;
      if (type !== undefined) updates.type = type;
      if (date !== undefined) updates.date = date;

      console.log("[transactions PUT] Updating:", JSON.stringify({ transaction_id, user_id, ...updates }));

      const { data, error } = await supabase
        .from("transactions")
        .update(updates)
        .eq("transaction_id", transaction_id)
        .eq("user_id", user_id)
        .select()
        .maybeSingle();

      if (error) {
        console.error("[transactions PUT] Supabase error:", error.message);
        return res.status(500).json({ error: error.message, stack: error.stack });
      }

      if (!data) {
        return res.status(404).json({ error: "Transaction not found" });
      }

      return res.status(200).json(data);
    }

    if (req.method === "DELETE") {
      const { id } = req.query || {};

      if (!id) {
        return res.status(400).json({ error: "id is required" });
      }

      console.log("[transactions DELETE] Removing:", { id, user_id });

      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("transaction_id", id)
        .eq("user_id", user_id);

      if (error) {
        console.error("[transactions DELETE] Supabase error:", error.message);
        return res.status(500).json({ error: error.message, stack: error.stack });
      }
      return res.status(200).json({ message: "Deleted" });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("[transactions] Unhandled error:", err.message, err.stack);
    const status = err instanceof AuthError ? 401 : 500;
    return res.status(status).json({ error: err.message, stack: err.stack });
  }
}
import supabase from "../lib/supabaseClient.js";
import localMock from "../lib/localMock.js";
import getAuthUserId, { AuthError } from "../lib/authHelper.js";

export default async function handler(req, res) {
  try {
    console.log("[expenses] REQUEST BODY:", req.body);
    console.log("[expenses] REQUEST QUERY:", req.query);

    const user_id = await getAuthUserId(req);

    if (req.method === "GET") {
      if (process.env.USE_LOCAL_MOCK === "1") {
        const items = await localMock.getCollection("transactions");
        let filtered = items.filter((t) => String(t.user_id) === String(user_id) && t.type === "Expense");
        filtered = filtered.sort((a, b) => (a.date < b.date ? 1 : -1));
        return res.status(200).json(filtered);
      }

      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user_id)
        .eq("type", "Expense")
        .order("date", { ascending: false });

      if (error) {
        console.error("[expenses GET] Supabase error:", error.message);
        return res.status(500).json({ error: error.message, stack: error.stack });
      }
      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      const { amount, category, description, date } = req.body || {};

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

    const newExpense = {
  transaction_id: crypto.randomUUID(),

  user_id,

  amount,

  category,

  description: description || "",

  date: date || new Date().toISOString(),

  type: "Expense"
};

      console.log("[expenses POST] Inserting:", JSON.stringify(newExpense));

      if (process.env.USE_LOCAL_MOCK === "1") {
        const mockRecord = { transaction_id: `TXN${Date.now().toString().slice(-6)}`, ...newExpense };
        await localMock.insertInto("transactions", mockRecord);
        return res.status(201).json(mockRecord);
      }

      const { data, error } = await supabase.from("transactions").insert([newExpense]).select();
      if (error) {
        console.error("[expenses POST] Supabase error:", error.message);
        return res.status(500).json({ error: error.message, stack: error.stack });
      }
      console.log("[expenses POST] Created:", JSON.stringify(data));
      return res.status(201).json(data?.[0] || data);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("[expenses] Unhandled error:", err.message, err.stack);
    const status = err instanceof AuthError ? 401 : 500;
    return res.status(status).json({ error: err.message, stack: err.stack });
  }
}

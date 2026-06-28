import supabase from "../../lib/supabaseClient.js";
import localMock from "../../lib/localMock.js";
import getAuthUserId, { AuthError } from "../../lib/authHelper.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const user_id = await getAuthUserId(req);
    const { report } = req.query || {};

    if (report === "true") {
    if (!user_id) {
      return res.status(400).json({ error: "user_id is required for report" });
    }

    try {
      if (process.env.USE_LOCAL_MOCK === "1") {
        const transactions = await localMock.queryCollection("transactions", { user_id });

        const income = (transactions || [])
          .filter((tx) => tx.type === "Income")
          .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
        const expenses = (transactions || [])
          .filter((tx) => tx.type === "Expense")
          .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
        const savings = income - expenses;

        const expenseByCategory = {};
        (transactions || [])
          .filter((tx) => tx.type === "Expense")
          .forEach((tx) => {
            const category = tx.category || "Other";
            expenseByCategory[category] = (expenseByCategory[category] || 0) + Number(tx.amount || 0);
          });

        const categories = Object.entries(expenseByCategory);
        const highestExpense = categories.sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

        const incomeByCategory = {};
        (transactions || [])
          .filter((tx) => tx.type === "Income")
          .forEach((tx) => {
            const category = tx.category || "Income";
            incomeByCategory[category] = (incomeByCategory[category] || 0) + Number(tx.amount || 0);
          });

        const topCategory = Object.entries(incomeByCategory)
          .sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

        return res.status(200).json({
          income,
          expenses,
          savings,
          topCategory,
          highestExpense,
        });
      }

      const { data: transactions, error: txError } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user_id);

      if (txError) {
        return res.status(500).json({ error: txError.message });
      }

      const income = (transactions || [])
        .filter((tx) => tx.type === "Income")
        .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
      const expenses = (transactions || [])
        .filter((tx) => tx.type === "Expense")
        .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
      const savings = income - expenses;

      const expenseByCategory = {};
      (transactions || [])
        .filter((tx) => tx.type === "Expense")
        .forEach((tx) => {
          const category = tx.category || "Other";
          expenseByCategory[category] = (expenseByCategory[category] || 0) + Number(tx.amount || 0);
        });

      const categories = Object.entries(expenseByCategory);
      const highestExpense = categories.sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

      const incomeByCategory = {};
      (transactions || [])
        .filter((tx) => tx.type === "Income")
        .forEach((tx) => {
          const category = tx.category || "Income";
          incomeByCategory[category] = (incomeByCategory[category] || 0) + Number(tx.amount || 0);
        });

      const topCategory = Object.entries(incomeByCategory)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

      return res.status(200).json({
        income,
        expenses,
        savings,
        topCategory,
        highestExpense,
      });
    } catch (err) {
      console.error("Report error:", err);
      return res.status(500).json({ error: err.message });
    }
  }

  try {
    if (process.env.USE_LOCAL_MOCK === "1") {
      const transactions = await localMock.queryCollection("transactions", { user_id });
      const budgets = await localMock.queryCollection("budgets", { user_id });

      const totalIncome = transactions
        .filter((row) => row.type === "Income")
        .reduce((sum, row) => sum + Number(row.amount || 0), 0);

      const totalExpenses = transactions
        .filter((row) => row.type === "Expense")
        .reduce((sum, row) => sum + Number(row.amount || 0), 0);

      const totalSaved = totalIncome - totalExpenses;
      const totalBudget = budgets.reduce((sum, b) => sum + Number(b.budget_limit || 0), 0);

      return res.status(200).json({
        totalIncome,
        totalExpenses,
        totalSaved,
        savingsGoal: totalBudget || 20000,
        savingsStreak: 12,
      });
    }

    let txQuery = supabase.from("transactions").select("amount,type");
    let budgetQuery = supabase.from("budgets").select("budget_limit");

    if (user_id) {
      txQuery = txQuery.eq("user_id", user_id);
      budgetQuery = budgetQuery.eq("user_id", user_id);
    }

    const [transactionsResponse, budgetsResponse] = await Promise.all([txQuery, budgetQuery]);

    if (transactionsResponse.error || budgetsResponse.error) {
      const errorMessage =
        transactionsResponse.error?.message || budgetsResponse.error?.message;
      console.error("Supabase query error:", transactionsResponse.error, budgetsResponse.error);
      return res.status(500).json({ error: errorMessage });
    }

    const transactions = transactionsResponse.data || [];
    const budgets = budgetsResponse.data || [];

    const totalIncome = transactions
      .filter((row) => (row.type && row.type.toLowerCase() === "income") || Number(row.amount) > 0)
      .reduce((sum, row) => sum + Number(row.amount || 0), 0);

    const totalExpenses = transactions
      .filter((row) => (row.type && row.type.toLowerCase() === "expense") || Number(row.amount) < 0)
      .reduce((sum, row) => sum + Math.abs(Number(row.amount || 0)), 0);

    const totalSaved = totalIncome - totalExpenses;
    const totalBudget = budgets
      .map((row) => Number(row.budget_limit) || 0)
      .reduce((sum, value) => sum + value, 0);

    return res.status(200).json({
      totalIncome,
      totalExpenses,
      totalSaved,
      savingsGoal: totalBudget || 20000,
      savingsStreak: 12,
    });
  } catch (err) {
    console.error("Unhandled error in dashboard/summary:", err && err.stack ? err.stack : err);
    const status = err instanceof AuthError ? 401 : 500;
    return res.status(status).json({ error: err.message || "A server error has occurred" });
  }
  } catch (err) {
    console.error("[dashboard/summary] Unhandled outer error:", err.message, err.stack);
    const status = err instanceof AuthError ? 401 : 500;
    return res.status(status).json({ error: err.message || "A server error has occurred" });
  }
}
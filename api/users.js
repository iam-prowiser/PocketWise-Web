import supabase from "../lib/supabaseClient.js";
import getAuthUserId, { AuthError } from "../lib/authHelper.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const user_id = await getAuthUserId(req);

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", user_id)
      .maybeSingle();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data || {});
  } catch (err) {
    console.error("[users] Unhandled error:", err.message, err.stack);
    const status = err instanceof AuthError ? 401 : 500;
    return res.status(status).json({ error: err.message, stack: err.stack });
  }
}

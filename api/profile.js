import supabase from "../lib/supabaseClient.js";
import getAuthUserId, { AuthError } from "../lib/authHelper.js";

export default async function handler(req, res) {
  try {
    console.log("[profile] REQUEST BODY:", req.body);

    const user_id = await getAuthUserId(req);

    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", user_id)
        .maybeSingle();

      if (error) {
        console.error("[profile GET] Supabase error:", error.message);
        return res.status(500).json({ error: error.message, stack: error.stack });
      }

      return res.status(200).json(data || {});
    }

    if (req.method === "PUT") {
      const {
        full_name,
        phone,
        college,
        course,
        year,
        city,
        profile_image,
      } = req.body || {};

      console.log("[profile PUT] Updating user:", user_id, JSON.stringify(req.body));

      const payload = { full_name, phone, college, course, year, city, profile_image };

      const { error: updateError } = await supabase
        .from("users")
        .update(payload)
        .eq("user_id", user_id);

      if (updateError && updateError.code !== "PGRST116") {
        console.error("[profile PUT] Supabase update error:", updateError.message);
        return res.status(500).json({ error: updateError.message, stack: updateError.stack });
      }

      const { data, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", user_id)
        .maybeSingle();

      if (data) {
        console.log("[profile PUT] Updated:", JSON.stringify(data));
        return res.status(200).json(data);
      }

      if (fetchError) {
        console.error("[profile PUT] Supabase fetch error:", fetchError.message);
        return res.status(500).json({ error: fetchError.message, stack: fetchError.stack });
      }

      const { data: insertData, error: insertError } = await supabase
        .from("users")
        .insert([{ user_id, ...payload }])
        .select();

      if (insertError) {
        console.error("[profile PUT] Supabase insert error:", insertError.message);
        return res.status(500).json({ error: insertError.message, stack: insertError.stack });
      }

      console.log("[profile PUT] Created:", JSON.stringify(insertData));
      return res.status(201).json(insertData?.[0] || insertData);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("[profile] Unhandled error:", err.message, err.stack);
    const status = err instanceof AuthError ? 401 : 500;
    return res.status(status).json({ error: err.message, stack: err.stack });
  }
}

import supabase from "../lib/supabaseClient.js";

export default async function handler(req, res) {
  const { action } = req.query || {};

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (action === "signup") {
    const {
      full_name,
      email,
      password,
      phone,
      college,
      course,
      year,
      city,
      profile_image,
    } = req.body || {};

    if (!email || !password || !full_name) {
      return res.status(400).json({ error: "full_name, email and password are required" });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const userId = data?.user?.id || data?.session?.user?.id;
    if (!userId) {
      return res.status(500).json({ error: "Signup succeeded but user id is missing." });
    }

    const { error: insertError } = await supabase.from("users").insert([
      {
        user_id: userId,
        full_name,
        email,
        phone,
        college,
        course,
        year,
        city,
        profile_image,
      },
    ]);

    if (insertError) {
      return res.status(500).json({ error: insertError.message });
    }

    return res.status(200).json(data);
  }

  if (action === "login") {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(data);
  }

  return res.status(400).json({ error: "Invalid action. Use ?action=signup or ?action=login" });
}
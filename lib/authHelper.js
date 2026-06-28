import supabase from "./supabaseClient.js";

export class AuthError extends Error {
  constructor(msg) {
    super(msg);
    this.name = "AuthError";
    this.status = 401;
  }
}

export default async function getAuthUserId(req) {
  const authHeader = req.headers.authorization;
  console.log("[authHelper] Authorization header present:", !!authHeader);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AuthError("Missing or invalid Authorization header");
  }
  const token = authHeader.slice(7);
  console.log("[authHelper] Token length:", token?.length);
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    console.error("[authHelper] getUser error:", error?.message);
    throw new AuthError(error?.message || "Invalid token");
  }
  console.log("[authHelper] Authenticated user:", data.user.id);
  return data.user.id;
}

import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL || "https://fypmzphrcqifcxsiqfnh.supabase.co";
// Prefer a server-side SERVICE_ROLE key for serverless functions. Falls back to anon key if not provided.
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5cG16cGhyY3FpZmN4c2lxZm5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyODA5MzYsImV4cCI6MjA5Nzg1NjkzNn0.QYR8SnxD3cG8HNcVGpPJsb2SdPJv9_R8212kW_3oS2g";

const key = serviceRole || anonKey;

if (!serviceRole) {
	// If running in local dev without a service role key, warn that inserts may be blocked by RLS.
	console.warn("lib/supabaseClient: SUPABASE_SERVICE_ROLE_KEY not set — using anon key. Row-level security may block write operations.");
}

const supabase = createClient(url, key);

export default supabase;

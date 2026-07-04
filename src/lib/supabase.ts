import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // Surfaced loudly on purpose — a silently-missing env var is the
  // single most common reason a deployed Vercel build shows a blank page.
  console.error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Check your .env (local) " +
      "or Vercel project environment variables (deployed)."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

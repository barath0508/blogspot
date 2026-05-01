import { createClient } from "@supabase/supabase-js";

let browserClient: any = null;
let adminClient: any = null;

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getSupabase() {
  if (browserClient) return browserClient;
  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseAnonKey = requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  browserClient = createClient(supabaseUrl, supabaseAnonKey);
  return browserClient as any;
}

export function getSupabaseAdmin() {
  if (adminClient) return adminClient;
  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseServiceRole = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  adminClient = createClient(supabaseUrl, supabaseServiceRole, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
  return adminClient as any;
}

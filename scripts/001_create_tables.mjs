import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const sql = `
-- Pi Users
CREATE TABLE IF NOT EXISTS public.pi_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pi_uid TEXT UNIQUE NOT NULL,
  pi_username TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  is_banned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Messages
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pi_uid TEXT NOT NULL,
  pi_username TEXT NOT NULL,
  content TEXT NOT NULL,
  reply_to UUID,
  reply_to_username TEXT,
  reply_to_content TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Payments
CREATE TABLE IF NOT EXISTS public.pi_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pi_payment_id TEXT UNIQUE,
  pi_uid TEXT NOT NULL,
  pi_username TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  memo TEXT,
  status TEXT DEFAULT 'pending',
  tx_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
`;

// Execute each statement separately
const statements = sql
  .split(";")
  .map((s) => s.trim())
  .filter((s) => s.length > 0 && !s.startsWith("--"));

for (const statement of statements) {
  console.log("Executing:", statement.substring(0, 60) + "...");
  const { error } = await supabase.rpc("exec_sql", { sql_text: statement });
  if (error) {
    // Try direct approach
    const { error: error2 } = await supabase.from("_").select().limit(0);
    console.log("Note: RPC not available, trying REST approach");
  }
}

// Try to create tables using REST API by inserting test data
// First check if tables exist
const { data: usersData, error: usersError } = await supabase
  .from("pi_users")
  .select("id")
  .limit(1);

if (usersError && usersError.code === "42P01") {
  console.log("Tables do not exist yet. Please run the SQL in Supabase SQL editor.");
  console.log("SQL to run:");
  console.log(sql);
} else {
  console.log("pi_users table exists:", !usersError);
}

const { data: msgData, error: msgError } = await supabase
  .from("messages")
  .select("id")
  .limit(1);
console.log("messages table exists:", !msgError);

const { data: payData, error: payError } = await supabase
  .from("pi_payments")
  .select("id")
  .limit(1);
console.log("pi_payments table exists:", !payError);

console.log("Done checking tables.");
